import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { DEFAULT_SESSION_USER, getSessionUserFromCookie, SESSION_COOKIE } from '@/lib/session'
import { withApiTelemetry } from '@/lib/telemetry'

export async function GET(request: NextRequest) {
	return withApiTelemetry(request, 'GET /api/session', async () => {
		const cookieHeader = request.headers.get('cookie') ?? ''
		const user = getSessionUserFromCookie(cookieHeader) ?? DEFAULT_SESSION_USER

		const response = NextResponse.json({ user })
		response.cookies.set(SESSION_COOKIE, JSON.stringify(user), {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
		})

		return response
	})
}
