import { DEFAULT_SESSION_USER } from '@/lib/session'

export type DncBusinessUnit = 'Pharmacy' | 'PCO' | 'HPC'
export type DncBusinessSegment = 'Traditional' | 'Retail' | 'Specialty' | 'HPC Care'
export type DncChannel = 'CALL' | 'TEXT'
export type DncIntent = 'MARKETING' | 'INFORMATIONAL' | 'ALL INTENTS'
export type DncStatus = 'Active' | 'Revoked' | 'Pending'
export type DncSelection<T extends string> = T | T[]

export interface DncRecord {
	phoneNumber: string
	businessEntity: string
	businessUnit: DncSelection<DncBusinessUnit>
	businessSegment: DncSelection<DncBusinessSegment>
	channel: DncSelection<DncChannel>
	intent: DncSelection<DncIntent>
	createdDate: string
	createdBy: string
	modifiedDate: string
	modifiedBy: string
	status: DncStatus
}

export const BUSINESS_ENTITY = 'Insurance'
export const BUSINESS_UNITS: DncBusinessUnit[] = ['Pharmacy', 'PCO', 'HPC']
export const BUSINESS_SEGMENTS: Record<DncBusinessUnit, DncBusinessSegment[]> = {
	Pharmacy: ['Traditional', 'Retail'],
	PCO: ['Specialty'],
	HPC: ['HPC Care'],
}
export const CHANNELS: DncChannel[] = ['CALL', 'TEXT']
export const INTENTS: DncIntent[] = ['MARKETING', 'INFORMATIONAL', 'ALL INTENTS']

export function formatTitleCaseLabel(value: string): string {
	return value
		.toLowerCase()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

export function asSelectionArray<T extends string>(
	value: DncSelection<T> | undefined,
	fallback: readonly T[],
): T[] {
	const values = Array.isArray(value) ? value : value ? [value] : []
	const sanitized = values.filter(Boolean)
	return sanitized.length > 0 ? sanitized : [...fallback]
}

const mockData: DncRecord[] = [
	{
		phoneNumber: '4155550101',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: ['Pharmacy', 'PCO'],
		businessSegment: ['Traditional', 'Specialty'],
		channel: ['CALL', 'TEXT'],
		intent: ['MARKETING', 'INFORMATIONAL'],
		createdDate: '2024-01-12T09:15:00.000Z',
		createdBy: 'mruiz',
		modifiedDate: '2024-04-18T11:25:00.000Z',
		modifiedBy: 'tlopez',
		status: 'Active',
	},
	{
		phoneNumber: '4155550110',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'HPC',
		businessSegment: 'HPC Care',
		channel: 'TEXT',
		intent: 'INFORMATIONAL',
		createdDate: '2024-02-06T12:00:00.000Z',
		createdBy: 'jporter',
		modifiedDate: '2024-06-09T08:55:00.000Z',
		modifiedBy: 'jporter',
		status: 'Active',
	},
	{
		phoneNumber: '4155550129',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'PCO',
		businessSegment: 'Specialty',
		channel: 'CALL',
		intent: 'ALL INTENTS',
		createdDate: '2023-11-28T16:40:00.000Z',
		createdBy: 'asimmons',
		modifiedDate: '2024-03-01T14:20:00.000Z',
		modifiedBy: 'kshaw',
		status: 'Revoked',
	},
	{
		phoneNumber: '4155550138',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'Pharmacy',
		businessSegment: ['Retail', 'Traditional'],
		channel: ['TEXT', 'CALL'],
		intent: 'MARKETING',
		createdDate: '2024-05-11T07:50:00.000Z',
		createdBy: 'cford',
		modifiedDate: '2024-05-11T07:50:00.000Z',
		modifiedBy: 'cford',
		status: 'Active',
	},
	{
		phoneNumber: '4155550145',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'PCO',
		businessSegment: 'Specialty',
		channel: 'TEXT',
		intent: 'INFORMATIONAL',
		createdDate: '2023-09-22T10:14:00.000Z',
		createdBy: 'adavis',
		modifiedDate: '2024-01-17T09:40:00.000Z',
		modifiedBy: 'adavis',
		status: 'Active',
	},
	{
		phoneNumber: '4155550154',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'HPC',
		businessSegment: 'HPC Care',
		channel: 'CALL',
		intent: 'MARKETING',
		createdDate: '2024-04-01T13:35:00.000Z',
		createdBy: 'rgreene',
		modifiedDate: '2024-04-12T15:58:00.000Z',
		modifiedBy: 'rgreene',
		status: 'Pending',
	},
	{
		phoneNumber: '4155550162',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'Pharmacy',
		businessSegment: 'Traditional',
		channel: 'TEXT',
		intent: 'ALL INTENTS',
		createdDate: '2023-12-15T18:20:00.000Z',
		createdBy: 'dnguyen',
		modifiedDate: '2024-02-21T10:14:00.000Z',
		modifiedBy: 'dnguyen',
		status: 'Active',
	},
	{
		phoneNumber: '4155550171',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: ['PCO', 'HPC'],
		businessSegment: ['Specialty', 'HPC Care'],
		channel: 'CALL',
		intent: ['MARKETING', 'ALL INTENTS'],
		createdDate: '2024-03-02T08:05:00.000Z',
		createdBy: 'slee',
		modifiedDate: '2024-03-02T08:05:00.000Z',
		modifiedBy: 'slee',
		status: 'Active',
	},
	{
		phoneNumber: '4155550180',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'HPC',
		businessSegment: 'HPC Care',
		channel: 'TEXT',
		intent: 'ALL INTENTS',
		createdDate: '2024-06-20T09:28:00.000Z',
		createdBy: 'mgarcia',
		modifiedDate: '2024-06-21T11:45:00.000Z',
		modifiedBy: 'mgarcia',
		status: 'Active',
	},
	{
		phoneNumber: '4155550199',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: ['Pharmacy', 'HPC'],
		businessSegment: ['Retail', 'HPC Care'],
		channel: ['CALL', 'TEXT'],
		intent: 'INFORMATIONAL',
		createdDate: '2024-01-19T06:42:00.000Z',
		createdBy: 'lpatel',
		modifiedDate: '2024-01-30T19:17:00.000Z',
		modifiedBy: 'lpatel',
		status: 'Active',
	},
	{
		phoneNumber: '4155550208',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'PCO',
		businessSegment: 'Specialty',
		channel: 'TEXT',
		intent: 'MARKETING',
		createdDate: '2024-02-18T10:12:00.000Z',
		createdBy: 'nramirez',
		modifiedDate: '2024-02-18T10:12:00.000Z',
		modifiedBy: 'nramirez',
		status: 'Active',
	},
	{
		phoneNumber: '4155550217',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'Pharmacy',
		businessSegment: 'Traditional',
		channel: 'CALL',
		intent: 'INFORMATIONAL',
		createdDate: '2024-05-08T08:18:00.000Z',
		createdBy: 'mreed',
		modifiedDate: '2024-07-06T12:32:00.000Z',
		modifiedBy: 'mreed',
		status: 'Pending',
	},
	{
		phoneNumber: '4155550226',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'HPC',
		businessSegment: 'HPC Care',
		channel: ['TEXT', 'CALL'],
		intent: ['MARKETING', 'INFORMATIONAL'],
		createdDate: '2023-10-31T07:09:00.000Z',
		createdBy: 'swhite',
		modifiedDate: '2024-04-16T18:30:00.000Z',
		modifiedBy: 'swhite',
		status: 'Revoked',
	},
	{
		phoneNumber: '4155550234',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'Pharmacy',
		businessSegment: 'Retail',
		channel: 'TEXT',
		intent: 'ALL INTENTS',
		createdDate: '2024-02-14T15:26:00.000Z',
		createdBy: 'awilson',
		modifiedDate: '2024-07-03T09:45:00.000Z',
		modifiedBy: 'awilson',
		status: 'Active',
	},
	{
		phoneNumber: '4155550243',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'PCO',
		businessSegment: 'Specialty',
		channel: 'CALL',
		intent: 'INFORMATIONAL',
		createdDate: '2023-07-18T11:09:00.000Z',
		createdBy: 'jmartin',
		modifiedDate: '2023-09-06T17:22:00.000Z',
		modifiedBy: 'jmartin',
		status: 'Active',
	},
	{
		phoneNumber: '4155550252',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'HPC',
		businessSegment: 'HPC Care',
		channel: 'CALL',
		intent: 'ALL INTENTS',
		createdDate: '2024-06-09T06:31:00.000Z',
		createdBy: 'pmyers',
		modifiedDate: '2024-06-09T06:31:00.000Z',
		modifiedBy: 'pmyers',
		status: 'Active',
	},
	{
		phoneNumber: '4155550261',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'Pharmacy',
		businessSegment: 'Traditional',
		channel: 'TEXT',
		intent: 'MARKETING',
		createdDate: '2024-04-30T09:10:00.000Z',
		createdBy: 'fkim',
		modifiedDate: '2024-06-18T13:18:00.000Z',
		modifiedBy: 'fkim',
		status: 'Active',
	},
	{
		phoneNumber: '4155550270',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: ['PCO', 'Pharmacy'],
		businessSegment: ['Specialty', 'Traditional'],
		channel: 'TEXT',
		intent: ['ALL INTENTS', 'MARKETING'],
		createdDate: '2024-02-11T14:21:00.000Z',
		createdBy: 'crogers',
		modifiedDate: '2024-03-14T08:17:00.000Z',
		modifiedBy: 'crogers',
		status: 'Revoked',
	},
	{
		phoneNumber: '4155550289',
		businessEntity: BUSINESS_ENTITY,
		businessUnit: 'HPC',
		businessSegment: 'HPC Care',
		channel: 'CALL',
		intent: 'INFORMATIONAL',
		createdDate: '2024-01-08T12:17:00.000Z',
		createdBy: 'hlee',
		modifiedDate: '2024-05-26T16:44:00.000Z',
		modifiedBy: 'hlee',
		status: 'Active',
	},
]

export function normalizePhone(phoneNumber: string) {
	return phoneNumber.trim().replace(/[^\d+]/g, '')
}

export function formatPhoneNumber(phoneNumber: string) {
	const cleaned = normalizePhone(phoneNumber).replace(/\D/g, '')
	if (cleaned.length === 10) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
	}
	return cleaned
}

export function getDncRecordsPage(page = 1, pageSize = 10) {
	const safePage = Math.max(1, Number(page) || 1)
	const safePageSize = Math.max(1, Number(pageSize) || 10)
	const totalPages = Math.max(1, Math.ceil(mockData.length / safePageSize))
	const currentPage = Math.min(safePage, totalPages)
	const start = (currentPage - 1) * safePageSize
	const items = mockData.slice(start, start + safePageSize)

	return {
		items,
		totalItems: mockData.length,
		totalPages,
		currentPage,
		pageSize: safePageSize,
	}
}

export function getDncRecordByPhone(phoneNumber: string) {
	const normalized = normalizePhone(phoneNumber)
	return mockData.find((record) => normalizePhone(record.phoneNumber) === normalized) ?? null
}

export function createDncRecord(input: Partial<DncRecord>) {
	const phoneNumber = normalizePhone(input.phoneNumber ?? '')
	if (!phoneNumber) {
		throw new Error('Phone number is required.')
	}

	if (getDncRecordByPhone(phoneNumber)) {
		throw new Error('Duplicate DNC record found for this phone number.')
	}

	const timestamp = new Date().toISOString()
	const record: DncRecord = {
		phoneNumber,
		businessEntity: input.businessEntity ?? BUSINESS_ENTITY,
		businessUnit: asSelectionArray(input.businessUnit as DncSelection<DncBusinessUnit>, [
			'Pharmacy',
		]),
		businessSegment: asSelectionArray(input.businessSegment as DncSelection<DncBusinessSegment>, [
			'Traditional',
		]),
		channel: asSelectionArray(input.channel as DncSelection<DncChannel>, ['CALL']),
		intent: asSelectionArray(input.intent as DncSelection<DncIntent>, ['MARKETING']),
		createdDate: input.createdDate ?? timestamp,
		createdBy: input.createdBy ?? DEFAULT_SESSION_USER.id,
		modifiedDate: input.modifiedDate ?? timestamp,
		modifiedBy: input.modifiedBy ?? DEFAULT_SESSION_USER.id,
		status: (input.status as DncStatus) ?? 'Active',
	}

	mockData.unshift(record)
	return record
}

export function updateDncRecord(phoneNumber: string, updates: Partial<DncRecord>) {
	const normalizedPhone = normalizePhone(phoneNumber)
	const index = mockData.findIndex(
		(record) => normalizePhone(record.phoneNumber) === normalizedPhone,
	)

	if (index === -1) {
		throw new Error('DNC record not found.')
	}

	mockData[index] = {
		...mockData[index],
		...updates,
		phoneNumber: normalizedPhone,
		businessEntity: updates.businessEntity ?? mockData[index].businessEntity,
		businessUnit: asSelectionArray(
			updates.businessUnit as DncSelection<DncBusinessUnit>,
			asSelectionArray(mockData[index].businessUnit, ['Pharmacy']),
		),
		businessSegment: asSelectionArray(
			updates.businessSegment as DncSelection<DncBusinessSegment>,
			asSelectionArray(mockData[index].businessSegment, ['Traditional']),
		),
		channel: asSelectionArray(
			updates.channel as DncSelection<DncChannel>,
			asSelectionArray(mockData[index].channel, ['CALL']),
		),
		intent: asSelectionArray(
			updates.intent as DncSelection<DncIntent>,
			asSelectionArray(mockData[index].intent, ['MARKETING']),
		),
		status: (updates.status as DncStatus) ?? mockData[index].status,
		modifiedDate: new Date().toISOString(),
		modifiedBy: updates.modifiedBy ?? mockData[index].modifiedBy,
	}

	return mockData[index]
}

export function revokeDncRecord(phoneNumber: string, modifiedBy = 'system') {
	return updateDncRecord(phoneNumber, {
		status: 'Revoked',
		modifiedBy,
	})
}

export function setDncRecordStatus(phoneNumber: string, status: DncStatus, modifiedBy = 'system') {
	return updateDncRecord(phoneNumber, {
		status,
		modifiedBy,
	})
}
