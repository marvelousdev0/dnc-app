import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createDncRecord, getDncRecordsPage } from '@/lib/dnc-data'
import { getMockSessionUser } from '@/lib/session'
import { withApiTelemetry } from '@/lib/telemetry'

export async function GET(request: NextRequest) {
	return withApiTelemetry(request, 'GET /api/dnc', async () => {
		const { searchParams } = new URL(request.url)
		const page = Number(searchParams.get('page') ?? '1')
		const pageSize = Number(searchParams.get('pageSize') ?? '10')
		const payload = getDncRecordsPage(page, pageSize)

		return NextResponse.json(payload)
	})
}

export async function POST(request: NextRequest) {
	return withApiTelemetry(request, 'POST /api/dnc', async () => {
		try {
			const sessionUser = getMockSessionUser(request)
			const body = await request.json()
			const record = createDncRecord({
				...body,
				createdBy: body.createdBy ?? sessionUser.id,
				modifiedBy: body.modifiedBy ?? sessionUser.id,
				createdDate: body.createdDate ?? new Date().toISOString(),
				modifiedDate: body.modifiedDate ?? new Date().toISOString(),
				status: body.status ?? 'Active',
			})

			return NextResponse.json(record, { status: 201 })
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to create DNC record.'
			return NextResponse.json({ error: message }, { status: 409 })
		}
	})
}
