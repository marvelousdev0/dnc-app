'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { AnchoredMultiSelect, AnchoredSelect } from '@/components/anchored-select'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/text-field'
import { tracedFetch } from '@/lib/client-trace'
import {
	asSelectionArray,
	BUSINESS_ENTITY,
	BUSINESS_SEGMENTS,
	BUSINESS_UNITS,
	CHANNELS,
	type DncBusinessUnit,
	type DncRecord,
	formatTitleCaseLabel,
	INTENTS,
} from '@/lib/dnc-data'
import type { SessionUser } from '@/lib/session'
import styles from './dnc-form.module.css'

interface DncFormProps {
	mode: 'create' | 'edit'
	record?: DncRecord | null
}

type DncFormState = Omit<DncRecord, 'status'> & {
	status: DncRecord['status'] | ''
}

const defaultRecord: DncFormState = {
	phoneNumber: '',
	businessEntity: BUSINESS_ENTITY,
	businessUnit: [],
	businessSegment: [],
	channel: [],
	intent: [],
	createdDate: new Date().toISOString(),
	createdBy: '',
	modifiedDate: new Date().toISOString(),
	modifiedBy: '',
	status: '',
}

const STATUS_OPTIONS: DncRecord['status'][] = ['Active', 'Pending', 'Revoked']

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

	const initialValue = useMemo<DncFormState>(
		() => ({
			...defaultRecord,
			...record,
			businessUnit: asSelectionArray(record?.businessUnit, []),
			businessSegment: asSelectionArray(record?.businessSegment, []),
			channel: asSelectionArray(record?.channel, []),
			intent: asSelectionArray(record?.intent, []),
			status: (record?.status ?? '') as DncFormState['status'],
			createdBy: record?.createdBy ?? '',
			modifiedBy: record?.modifiedBy ?? '',
		}),
		[record],
	)

	const [form, setForm] = useState<DncFormState>(initialValue)
	const [error, setError] = useState('')
	const [message, setMessage] = useState('')

	const selectedBusinessUnits = asSelectionArray(form.businessUnit, [])
	const businessSegments = Array.from(
		new Set(
			selectedBusinessUnits.flatMap((unit) => BUSINESS_SEGMENTS[unit as DncBusinessUnit] ?? []),
		),
	)
	const selectedBusinessSegments = asSelectionArray(form.businessSegment, []).filter((segment) =>
		businessSegments.includes(segment),
	)
	const isPhoneRequiredMissing = mode === 'create' && form.phoneNumber.trim().length === 0

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')
		setMessage('')

		const selectedUnits = asSelectionArray(form.businessUnit, [])
		const selectedSegments = asSelectionArray(form.businessSegment, [])
		const selectedChannels = asSelectionArray(form.channel, [])
		const selectedIntents = asSelectionArray(form.intent, [])

		if (
			isPhoneRequiredMissing ||
			selectedUnits.length === 0 ||
			selectedSegments.length === 0 ||
			selectedChannels.length === 0 ||
			selectedIntents.length === 0 ||
			!form.status
		) {
			return
		}

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
					businessUnit: selectedUnits,
					businessSegment: selectedSegments,
					channel: selectedChannels,
					intent: selectedIntents,
					createdBy: mode === 'create' ? sessionUser.id : form.createdBy || sessionUser.id,
					modifiedBy: sessionUser.id,
					modifiedDate: new Date().toISOString(),
					status: form.status,
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

	const updateField = <K extends keyof DncFormState>(field: K, value: DncFormState[K]) => {
		setForm((current) => {
			const next = { ...current, [field]: value } as DncFormState
			if (field === 'businessUnit') {
				const units = asSelectionArray(value as DncRecord['businessUnit'], [])
				const segmentOptions = Array.from(
					new Set(units.flatMap((unit) => BUSINESS_SEGMENTS[unit as DncBusinessUnit] ?? [])),
				)
				const currentSegments = asSelectionArray(next.businessSegment, [])
				const validSegments = currentSegments.filter((segment) => segmentOptions.includes(segment))
				next.businessSegment = validSegments
			}

			if (field === 'businessSegment') {
				const segments = asSelectionArray(value as DncRecord['businessSegment'], [])
				next.businessSegment = segments
			}
			return next
		})
	}

	return (
		<form
			className={`panel reveal reveal-delay-2 ${styles.form}`}
			onSubmit={handleSubmit}
			noValidate
		>
			<div className={styles.formHead}>
				<p className={styles.headLabel}>Record profile</p>
				<p className={styles.modeChip}>{mode === 'create' ? 'Create mode' : 'Edit mode'}</p>
			</div>

			<div className={styles.grid}>
				<div className={styles.label}>
					<span className={styles.labelText}>
						Phone Number
						{mode === 'create' ? <span className={styles.requiredMark}> *</span> : null}
					</span>
					<TextField
						type="tel"
						value={form.phoneNumber}
						onChange={(event) => updateField('phoneNumber', event.target.value)}
						disabled={mode === 'edit'}
					/>
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>Business Entity</span>
					<TextField type="text" value={form.businessEntity} readOnly />
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>
						Business Unit<span className={styles.requiredMark}> *</span>
					</span>
					<AnchoredMultiSelect
						values={selectedBusinessUnits}
						options={BUSINESS_UNITS}
						ariaLabel="Business Unit"
						placeholder="Select"
						onChange={(values) => updateField('businessUnit', values as DncRecord['businessUnit'])}
					/>
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>
						Business Segment<span className={styles.requiredMark}> *</span>
					</span>
					<AnchoredMultiSelect
						values={selectedBusinessSegments}
						options={businessSegments}
						ariaLabel="Business Segment"
						placeholder="Select"
						onChange={(values) =>
							updateField('businessSegment', values as DncRecord['businessSegment'])
						}
					/>
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>
						Channel<span className={styles.requiredMark}> *</span>
					</span>
					<AnchoredMultiSelect
						values={asSelectionArray(form.channel, [])}
						options={CHANNELS}
						ariaLabel="Channel"
						placeholder="Select"
						formatOptionLabel={formatTitleCaseLabel}
						onChange={(values) => updateField('channel', values as DncRecord['channel'])}
					/>
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>
						Intent<span className={styles.requiredMark}> *</span>
					</span>
					<AnchoredMultiSelect
						values={asSelectionArray(form.intent, [])}
						options={INTENTS}
						ariaLabel="Intent"
						placeholder="Select"
						formatOptionLabel={formatTitleCaseLabel}
						onChange={(values) => updateField('intent', values as DncRecord['intent'])}
					/>
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>
						Status<span className={styles.requiredMark}> *</span>
					</span>
					<AnchoredSelect
						value={form.status || undefined}
						options={STATUS_OPTIONS}
						ariaLabel="Status"
						placeholder="Select"
						onChange={(value) => updateField('status', value)}
					/>
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>Created Date</span>
					<TextField type="text" value={new Date(form.createdDate).toLocaleString()} readOnly />
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>Created By</span>
					<TextField type="text" value={form.createdBy || sessionUser.id} readOnly />
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>Modified Date</span>
					<TextField type="text" value={new Date(form.modifiedDate).toLocaleString()} readOnly />
				</div>

				<div className={styles.label}>
					<span className={styles.labelText}>Modified By</span>
					<TextField type="text" value={form.modifiedBy || sessionUser.id} readOnly />
				</div>
			</div>

			{error ? <p className={styles.error}>{error}</p> : null}
			{message ? <p className={styles.success}>{message}</p> : null}

			<div className={styles.actions}>
				<Button type="submit">{mode === 'create' ? 'Create DNC Record' : 'Save Changes'}</Button>
				<Button type="button" variant="secondary" onClick={() => router.push('/internal-dnc')}>
					Cancel
				</Button>
			</div>
		</form>
	)
}
