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

	const labelClass = 'text-sm font-medium text-slate-300'

	return (
		<form className="panel reveal reveal-delay-2" onSubmit={handleSubmit}>
			<div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
				<p className="text-xs uppercase tracking-[0.22em] text-slate-300/75">Record profile</p>
				<p className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
					{mode === 'create' ? 'Create mode' : 'Edit mode'}
				</p>
			</div>

			<div className="grid gap-5 md:grid-cols-2">
				<label className={labelClass}>
					<span className="mb-2 block">Phone Number</span>
					<input
						type="tel"
						className="field-input"
						value={form.phoneNumber}
						onChange={(event) => updateField('phoneNumber', event.target.value)}
						required
						disabled={mode === 'edit'}
					/>
				</label>

				<label className={labelClass}>
					<span className="mb-2 block">Business Entity</span>
					<input
						type="text"
						className="field-input field-readonly"
						value={form.businessEntity}
						readOnly
					/>
				</label>

				<label className={labelClass}>
					<span className="mb-2 block">Business Unit</span>
					<select
						className="field-input"
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

				<label className={labelClass}>
					<span className="mb-2 block">Business Segment</span>
					<select
						className="field-input"
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

				<label className={labelClass}>
					<span className="mb-2 block">Channel</span>
					<select
						className="field-input"
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

				<label className={labelClass}>
					<span className="mb-2 block">Intent</span>
					<select
						className="field-input"
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

				<label className={labelClass}>
					<span className="mb-2 block">Status</span>
					<select
						className="field-input"
						value={form.status}
						onChange={(event) => updateField('status', event.target.value as DncRecord['status'])}
					>
						<option value="Active">Active</option>
						<option value="Pending">Pending</option>
						<option value="Revoked">Revoked</option>
					</select>
				</label>

				<label className={labelClass}>
					<span className="mb-2 block">Created Date</span>
					<input
						type="text"
						className="field-input field-readonly"
						value={new Date(form.createdDate).toLocaleString()}
						readOnly
					/>
				</label>

				<label className={labelClass}>
					<span className="mb-2 block">Created By</span>
					<input
						type="text"
						className="field-input field-readonly"
						value={form.createdBy || sessionUser.id}
						readOnly
					/>
				</label>

				<label className={labelClass}>
					<span className="mb-2 block">Modified Date</span>
					<input
						type="text"
						className="field-input field-readonly"
						value={new Date(form.modifiedDate).toLocaleString()}
						readOnly
					/>
				</label>

				<label className={labelClass}>
					<span className="mb-2 block">Modified By</span>
					<input
						type="text"
						className="field-input field-readonly"
						value={form.modifiedBy || sessionUser.id}
						readOnly
					/>
				</label>
			</div>

			{error ? (
				<p className="mt-5 rounded-xl border border-rose-300/35 bg-rose-500/12 px-4 py-3 text-sm font-semibold text-rose-100">
					{error}
				</p>
			) : null}
			{message ? (
				<p className="mt-5 rounded-xl border border-emerald-300/35 bg-emerald-500/12 px-4 py-3 text-sm font-semibold text-emerald-100">
					{message}
				</p>
			) : null}

			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
				<button type="submit" className="btn-primary hover-lift">
					{mode === 'create' ? 'Create DNC Record' : 'Save Changes'}
				</button>
				<button
					type="button"
					className="btn-secondary hover-lift"
					onClick={() => router.push('/internal-dnc')}
				>
					Cancel
				</button>
			</div>
		</form>
	)
}
