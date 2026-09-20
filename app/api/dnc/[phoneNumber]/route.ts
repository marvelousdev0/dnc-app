import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
	type DncStatus,
	getDncRecordByPhone,
	revokeDncRecord,
	setDncRecordStatus,
	updateDncRecord,
} from '@/lib/dnc-data'
import { getMockSessionUser } from '@/lib/session'
import { withApiTelemetry } from '@/lib/telemetry'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ phoneNumber: string }> },
) {
	return withApiTelemetry(request, 'GET /api/dnc/[phoneNumber]', async () => {
		const { phoneNumber } = await params
		const record = getDncRecordByPhone(phoneNumber)

		if (!record) {
			return NextResponse.json({ error: 'Record not found' }, { status: 404 })
		}

		return NextResponse.json(record)
	})
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ phoneNumber: string }> },
) {
	return withApiTelemetry(request, 'PUT /api/dnc/[phoneNumber]', async () => {
		try {
			const { phoneNumber } = await params
			const sessionUser = getMockSessionUser(request)
			const body = await request.json()
			const record = updateDncRecord(phoneNumber, {
				...body,
				modifiedBy: body.modifiedBy ?? sessionUser.id,
			})

			return NextResponse.json(record)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to update DNC record.'
			return NextResponse.json({ error: message }, { status: 404 })
		}
	})
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ phoneNumber: string }> },
) {
	return withApiTelemetry(request, 'PATCH /api/dnc/[phoneNumber]', async () => {
		try {
			const { phoneNumber } = await params
			const sessionUser = getMockSessionUser(request)
			const body = await request.json()
			const nextStatus = body.status as DncStatus | undefined

			const record =
				nextStatus && ['Active', 'Pending', 'Revoked'].includes(nextStatus)
					? setDncRecordStatus(phoneNumber, nextStatus, body.modifiedBy ?? sessionUser.id)
					: revokeDncRecord(phoneNumber, body.modifiedBy ?? sessionUser.id)
			return NextResponse.json(record)
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to update DNC record status.'
			return NextResponse.json({ error: message }, { status: 404 })
		}
	})
}
