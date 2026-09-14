import type { NextRequest, NextResponse } from 'next/server'

const TRACEPARENT_HEADER = 'traceparent'
const TRACE_ID_HEADER = 'x-trace-id'
const SESSION_ID_HEADER = 'x-session-id'

const TRACEPARENT_REGEX = /^([\da-f]{2})-([\da-f]{32})-([\da-f]{16})-([\da-f]{2})$/i
const TRACE_ID_REGEX = /^[\da-f]{32}$/i

type TelemetryContext = {
	route: string
	method: string
	path: string
	traceId: string
	spanId: string
	parentSpanId: string | null
	traceparent: string
	sessionId: string | null
	startedAtMs: number
}

type TelemetryLog = Record<string, string | number | boolean | null | undefined>

function toHex(bytes: Uint8Array) {
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function randomHex(byteLength: number) {
	const bytes = new Uint8Array(byteLength)
	crypto.getRandomValues(bytes)
	return toHex(bytes)
}

function normalizeTraceId(rawTraceId: string | null) {
	if (!rawTraceId) {
		return null
	}

	const normalized = rawTraceId.replace(/-/g, '').trim().toLowerCase()
	return TRACE_ID_REGEX.test(normalized) ? normalized : null
}

function parseTraceparent(value: string | null) {
	if (!value) {
		return null
	}

	const match = value.trim().match(TRACEPARENT_REGEX)
	if (!match) {
		return null
	}

	return {
		version: match[1].toLowerCase(),
		traceId: match[2].toLowerCase(),
		parentSpanId: match[3].toLowerCase(),
		traceFlags: match[4].toLowerCase(),
	}
}

function log(event: string, fields: TelemetryLog) {
	console.info(
		JSON.stringify({
			event,
			service: 'dnc-app',
			timestamp: new Date().toISOString(),
			...fields,
		}),
	)
}

function createTelemetryContext(request: NextRequest, route: string): TelemetryContext {
	const parsedTraceparent = parseTraceparent(request.headers.get(TRACEPARENT_HEADER))
	const traceId =
		parsedTraceparent?.traceId ??
		normalizeTraceId(request.headers.get(TRACE_ID_HEADER)) ??
		randomHex(16)
	const spanId = randomHex(8)
	const traceFlags = parsedTraceparent?.traceFlags ?? '01'

	return {
		route,
		method: request.method,
		path: request.nextUrl.pathname,
		traceId,
		spanId,
		parentSpanId: parsedTraceparent?.parentSpanId ?? null,
		traceparent: `00-${traceId}-${spanId}-${traceFlags}`,
		sessionId: request.headers.get(SESSION_ID_HEADER),
		startedAtMs: Date.now(),
	}
}

function annotateResponse(response: NextResponse, ctx: TelemetryContext) {
	response.headers.set(TRACEPARENT_HEADER, ctx.traceparent)
	response.headers.set(TRACE_ID_HEADER, ctx.traceId)
	if (ctx.sessionId) {
		response.headers.set(SESSION_ID_HEADER, ctx.sessionId)
	}
}

export async function withApiTelemetry(
	request: NextRequest,
	route: string,
	handler: (ctx: TelemetryContext) => Promise<NextResponse>,
) {
	const ctx = createTelemetryContext(request, route)

	log('api.request', {
		route: ctx.route,
		method: ctx.method,
		path: ctx.path,
		query: request.nextUrl.search,
		trace_id: ctx.traceId,
		span_id: ctx.spanId,
		parent_span_id: ctx.parentSpanId,
		session_id: ctx.sessionId,
	})

	try {
		const response = await handler(ctx)
		annotateResponse(response, ctx)

		log('api.response', {
			route: ctx.route,
			method: ctx.method,
			path: ctx.path,
			status_code: response.status,
			duration_ms: Date.now() - ctx.startedAtMs,
			trace_id: ctx.traceId,
			span_id: ctx.spanId,
			session_id: ctx.sessionId,
		})

		return response
	} catch (error) {
		log('api.error', {
			route: ctx.route,
			method: ctx.method,
			path: ctx.path,
			duration_ms: Date.now() - ctx.startedAtMs,
			trace_id: ctx.traceId,
			span_id: ctx.spanId,
			session_id: ctx.sessionId,
			error_message: error instanceof Error ? error.message : 'Unknown error',
		})

		throw error
	}
}
