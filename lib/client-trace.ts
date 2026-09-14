'use client'

const TRACEPARENT_HEADER = 'traceparent'
const TRACE_ID_HEADER = 'x-trace-id'
const SESSION_ID_HEADER = 'x-session-id'
const SESSION_STORAGE_KEY = 'dnc_session_id'

function toHex(bytes: Uint8Array) {
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function randomHex(byteLength: number) {
	const bytes = new Uint8Array(byteLength)
	crypto.getRandomValues(bytes)
	return toHex(bytes)
}

function getOrCreateSessionId() {
	try {
		const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
		if (existing) {
			return existing
		}

		const next = crypto.randomUUID()
		window.sessionStorage.setItem(SESSION_STORAGE_KEY, next)
		return next
	} catch {
		return crypto.randomUUID()
	}
}

function log(event: string, fields: Record<string, string | number | null | undefined>) {
	console.info(
		JSON.stringify({
			event,
			service: 'dnc-app-ui',
			timestamp: new Date().toISOString(),
			...fields,
		}),
	)
}

export async function tracedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
	const traceId = randomHex(16)
	const spanId = randomHex(8)
	const sessionId = getOrCreateSessionId()
	const traceparent = `00-${traceId}-${spanId}-01`

	const headers = new Headers(init.headers)
	headers.set(TRACEPARENT_HEADER, traceparent)
	headers.set(TRACE_ID_HEADER, traceId)
	headers.set(SESSION_ID_HEADER, sessionId)

	const url =
		typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
	const method = init.method ?? 'GET'
	const startedAtMs = Date.now()

	log('ui.request', {
		method,
		url,
		trace_id: traceId,
		span_id: spanId,
		session_id: sessionId,
	})

	const response = await fetch(input, {
		...init,
		headers,
	})

	log('ui.response', {
		method,
		url,
		status_code: response.status,
		duration_ms: Date.now() - startedAtMs,
		trace_id: traceId,
		span_id: spanId,
		session_id: sessionId,
	})

	return response
}
