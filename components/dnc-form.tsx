'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { tracedFetch } from '@/lib/client-trace'
import {
	BUSINESS_ENTITY,
	BUSINESS_SEGMENTS,
	BUSINESS_UNITS,
	CHANNELS,
	type DncBusinessUnit,
	type DncRecord,
	INTENTS,
} from '@/lib/dnc-data'
import type { SessionUser } from '@/lib/session'

interface DncFormProps {
	mode: 'create' | 'edit'
	record?: DncRecord | null
}

const defaultRecord: DncRecord = {
	phoneNumber: '',
	businessEntity: BUSINESS_ENTITY,
	businessUnit: 'Pharmacy',
	businessSegment: 'Traditional',
	channel: 'CALL',
	intent: 'MARKETING',
	createdDate: new Date().toISOString(),
	createdBy: '',
	modifiedDate: new Date().toISOString(),
	modifiedBy: '',
	status: 'Active',
}

export function DncForm({ mode, record }: DncFormProps) {
	const router = useRouter()
	const [sessionUser, setSessionUser] = useState<SessionUser>({ id: 'jdoe', name: 'Jane Doe' })

	useEffect(() => {
		const loadSession = async () => {
			const response = await tracedFetch('/api/session', { cache: 'no-store' })
			const payload = await response.json()
			if (payload.user) {
				setSessionUser(payload.user)
			}
		}

		loadSession()
	}, [])

	const initialValue = useMemo(
		() => ({
			...defaultRecord,
			...record,
			businessUnit: record?.businessUnit ?? 'Pharmacy',
			businessSegment: record?.businessSegment ?? 'Traditional',
			channel: record?.channel ?? 'CALL',
			intent: record?.intent ?? 'MARKETING',
			createdBy: record?.createdBy ?? '',
			modifiedBy: record?.modifiedBy ?? '',
		}),
		[record],
	)

	const [form, setForm] = useState(initialValue)
	const [error, setError] = useState('')
	const [message, setMessage] = useState('')

	const businessSegments = BUSINESS_SEGMENTS[form.businessUnit as DncBusinessUnit]

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')
		setMessage('')

		try {
			const url =
				mode === 'create' ? '/api/dnc' : `/api/dnc/${encodeURIComponent(form.phoneNumber)}`
			const response = await tracedFetch(url, {
				method: mode === 'create' ? 'POST' : 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...form,
					createdBy: mode === 'create' ? sessionUser.id : form.createdBy || sessionUser.id,
					modifiedBy: sessionUser.id,
					modifiedDate: new Date().toISOString(),
					status: form.status || 'Active',
				}),
			})

			const payload = await response.json()

			if (!response.ok) {
				throw new Error(payload.error || 'Unable to save record.')
			}

			setMessage(
				mode === 'create' ? 'DNC record created successfully.' : 'DNC record updated successfully.',
			)
			router.push('/internal-dnc')
			router.refresh()
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : 'Unable to save record.')
		}
	}

	const updateField = <K extends keyof DncRecord>(field: K, value: DncRecord[K]) => {
		setForm((current) => {
			const next = { ...current, [field]: value } as DncRecord
			if (field === 'businessUnit') {
				const segmentOptions = BUSINESS_SEGMENTS[value as DncBusinessUnit]
				if (!segmentOptions.includes(next.businessSegment)) {
					next.businessSegment = segmentOptions[0]
				}
			}
			return next
		})
	}

	return (
		<form className="panel form-panel" onSubmit={handleSubmit}>
			<div className="field-grid">
				<label className="field">
					<span>Phone Number</span>
					<input
						type="tel"
						value={form.phoneNumber}
						onChange={(event) => updateField('phoneNumber', event.target.value)}
						required
						disabled={mode === 'edit'}
					/>
				</label>

				<label className="field">
					<span>Business Entity</span>
					<input type="text" value={form.businessEntity} readOnly />
				</label>

				<label className="field">
					<span>Business Unit</span>
					<select
						value={form.businessUnit}
						onChange={(event) => updateField('businessUnit', event.target.value as DncBusinessUnit)}
					>
						{BUSINESS_UNITS.map((unit) => (
							<option key={unit} value={unit}>
								{unit}
							</option>
						))}
					</select>
				</label>

				<label className="field">
					<span>Business Segment</span>
					<select
						value={form.businessSegment}
						onChange={(event) =>
							updateField('businessSegment', event.target.value as DncRecord['businessSegment'])
						}
					>
						{businessSegments.map((segment) => (
							<option key={segment} value={segment}>
								{segment}
							</option>
						))}
					</select>
				</label>

				<label className="field">
					<span>Channel</span>
					<select
						value={form.channel}
						onChange={(event) => updateField('channel', event.target.value as DncRecord['channel'])}
					>
						{CHANNELS.map((channel) => (
							<option key={channel} value={channel}>
								{channel}
							</option>
						))}
					</select>
				</label>

				<label className="field">
					<span>Intent</span>
					<select
						value={form.intent}
						onChange={(event) => updateField('intent', event.target.value as DncRecord['intent'])}
					>
						{INTENTS.map((intent) => (
							<option key={intent} value={intent}>
								{intent}
							</option>
						))}
					</select>
				</label>

				<label className="field">
					<span>Status</span>
					<select
						value={form.status}
						onChange={(event) => updateField('status', event.target.value as DncRecord['status'])}
					>
						<option value="Active">Active</option>
						<option value="Pending">Pending</option>
						<option value="Revoked">Revoked</option>
					</select>
				</label>

				<label className="field">
					<span>Created Date</span>
					<input type="text" value={new Date(form.createdDate).toLocaleString()} readOnly />
				</label>

				<label className="field">
					<span>Created By</span>
					<input type="text" value={form.createdBy || sessionUser.id} readOnly />
				</label>

				<label className="field">
					<span>Modified Date</span>
					<input type="text" value={new Date(form.modifiedDate).toLocaleString()} readOnly />
				</label>

				<label className="field">
					<span>Modified By</span>
					<input type="text" value={form.modifiedBy || sessionUser.id} readOnly />
				</label>
			</div>

			{error ? <p className="form-message error">{error}</p> : null}
			{message ? <p className="form-message success">{message}</p> : null}

			<div className="button-row">
				<button type="submit" className="button primary">
					{mode === 'create' ? 'Create DNC Record' : 'Save Changes'}
				</button>
				<button
					type="button"
					className="button secondary"
					onClick={() => router.push('/internal-dnc')}
				>
					Cancel
				</button>
			</div>
		</form>
	)
}
