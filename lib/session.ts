export const SESSION_COOKIE = 'dnc-session-user'

export type SessionUser = {
	id: string
	name: string
}

export const DEFAULT_SESSION_USER: SessionUser = {
	id: 'jdoe',
	name: 'Jane Doe',
}

export function getSessionUserFromCookie(cookieHeader?: string | null): SessionUser {
	if (!cookieHeader) {
		return DEFAULT_SESSION_USER
	}

	const match = cookieHeader
		.split(';')
		.map((cookie) => cookie.trim())
		.find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))

	if (!match) {
		return DEFAULT_SESSION_USER
	}

	try {
		const rawValue = decodeURIComponent(match.split('=')[1] ?? '')
		const parsed = JSON.parse(rawValue) as Partial<SessionUser>

		if (parsed.id && parsed.name) {
			return { id: parsed.id, name: parsed.name }
		}
	} catch {
		// Ignore malformed cookie values and fall back to default user.
	}

	return DEFAULT_SESSION_USER
}

export function getMockSessionUser(request?: {
	headers?: { get(name: string): string | null } | Headers
}) {
	const cookieHeader =
		request?.headers instanceof Headers
			? request.headers.get('cookie')
			: (request?.headers?.get?.('cookie') ?? null)

	return getSessionUserFromCookie(cookieHeader)
}
