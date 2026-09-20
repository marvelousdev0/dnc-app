'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'
import { tracedFetch } from '@/lib/client-trace'
import {
	asSelectionArray,
	type DncRecord,
	formatPhoneNumber,
	formatTitleCaseLabel,
} from '@/lib/dnc-data'
import styles from './dnc-table.module.css'

interface DncTableProps {
	records: DncRecord[]
	page: number
	totalPages: number
	pageSize: number
	showActions?: boolean
}

interface SelectionSummary {
	primary: string
	extraCount: number
	tooltip: string
}

function EditIcon() {
	return (
		<svg viewBox="0 0 20 20" aria-hidden="true" className={styles.icon} fill="none">
			<path
				d="M13.25 3.75L16.25 6.75M4.75 15.25L7.72 14.59C8.09 14.51 8.42 14.32 8.69 14.05L15.55 7.19C16.14 6.6 16.14 5.65 15.55 5.07L14.93 4.45C14.35 3.86 13.4 3.86 12.81 4.45L5.95 11.31C5.68 11.58 5.49 11.91 5.41 12.28L4.75 15.25Z"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function RevokeIcon() {
	return (
		<svg viewBox="0 0 20 20" aria-hidden="true" className={styles.icon} fill="none">
			<circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.7" />
			<path
				d="M6.75 13.25L13.25 6.75"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function ActivateIcon() {
	return (
		<svg viewBox="0 0 20 20" aria-hidden="true" className={styles.icon} fill="none">
			<circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.7" />
			<path
				d="M7 10.4L9.1 12.5L13.2 8.4"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function SelectionValue({ summary, className }: { summary: SelectionSummary; className?: string }) {
	return (
		<span
			className={`selection-summary ${summary.extraCount > 0 ? 'has-tooltip' : ''}`}
			data-tooltip={summary.extraCount > 0 ? summary.tooltip : ''}
			tabIndex={summary.extraCount > 0 ? 0 : -1}
		>
			<span className={className}>{summary.primary}</span>
			{summary.extraCount > 0 ? (
				<span className="selection-count-chip">+{summary.extraCount}</span>
			) : null}
		</span>
	)
}

export function DncTable({
	records,
	page,
	totalPages,
	pageSize,
	showActions = true,
}: DncTableProps) {
	const router = useRouter()
	const [localRecords, setLocalRecords] = useState(records)
	const [pendingPhone, setPendingPhone] = useState<string | null>(null)
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

	const statusClassName: Record<DncRecord['status'], string> = {
		Active: styles.statusActive,
		Pending: styles.statusPending,
		Revoked: styles.statusRevoked,
	}

	const actionClassName = (tone: 'info' | 'danger' | 'success') => {
		if (tone === 'success') {
			return styles.actionSuccess
		}

		if (tone === 'danger') {
			return styles.actionDanger
		}

		return styles.actionInfo
	}

	const onToggleStatus = async (record: DncRecord) => {
		try {
			setPendingPhone(record.phoneNumber)
			const sessionResponse = await tracedFetch('/api/session', { cache: 'no-store' })
			const sessionPayload = await sessionResponse.json()
			const sessionUser = sessionPayload.user ?? { id: 'jdoe', name: 'Jane Doe' }
			const nextStatus = record.status === 'Revoked' ? 'Active' : 'Revoked'

			const response = await tracedFetch(`/api/dnc/${encodeURIComponent(record.phoneNumber)}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ modifiedBy: sessionUser.id, status: nextStatus }),
			})

			if (!response.ok) {
				throw new Error('Unable to update record status.')
			}

			const updatedRecord = await response.json()
			setLocalRecords((current) =>
				current.map((record) =>
					record.phoneNumber === updatedRecord.phoneNumber ? updatedRecord : record,
				),
			)
			router.refresh()
		} catch (error) {
			console.error(error)
		} finally {
			setPendingPhone(null)
		}
	}

	const onToggleExpand = (phoneNumber: string) => {
		setExpandedRows((current) => ({
			...current,
			[phoneNumber]: !current[phoneNumber],
		}))
	}

	const formatSelectionSummary = (
		value: string | string[],
		formatter?: (item: string) => string,
	): SelectionSummary => {
		const values = asSelectionArray(value, [])
		const labels = values.map((item) => (formatter ? formatter(item) : item))
		return {
			primary: labels[0] ?? '',
			extraCount: Math.max(0, labels.length - 1),
			tooltip: labels.join(', '),
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.mobileOnly}>
				<ul className={styles.mobileList}>
					{localRecords.map((record) => {
						const unitSummary = formatSelectionSummary(record.businessUnit)
						const segmentSummary = formatSelectionSummary(record.businessSegment)
						const channelSummary = formatSelectionSummary(record.channel, formatTitleCaseLabel)
						const intentSummary = formatSelectionSummary(record.intent, formatTitleCaseLabel)

						return (
							<li key={record.phoneNumber} className={styles.mobileCard}>
								<div className={styles.rowHead}>
									<p className={styles.phone}>{formatPhoneNumber(record.phoneNumber)}</p>
									<span className={`${styles.statusBadge} ${statusClassName[record.status]}`}>
										{record.status}
									</span>
								</div>

								<div className={styles.detailGrid}>
									<div>
										<p className={styles.metaLabel}>Unit</p>
										<SelectionValue summary={unitSummary} className={styles.metaValue} />
									</div>
									<div>
										<p className={styles.metaLabel}>Segment</p>
										<SelectionValue summary={segmentSummary} className={styles.metaValue} />
									</div>
									<div>
										<p className={styles.metaLabel}>Channel</p>
										<SelectionValue summary={channelSummary} className={styles.metaValue} />
									</div>
									<div>
										<p className={styles.metaLabel}>Intent</p>
										<SelectionValue summary={intentSummary} className={styles.metaValue} />
									</div>
									<div className={styles.colSpan2}>
										<p className={styles.metaLabel}>Modified</p>
										<p className={styles.metaValue}>
											{new Date(record.modifiedDate).toLocaleDateString()}
										</p>
									</div>
								</div>

								{showActions ? (
									<div className={styles.mobileActions}>
										<Link
											href={`/internal-dnc/${encodeURIComponent(record.phoneNumber)}/view`}
											className={`${styles.actionLink} ${actionClassName('info')}`}
										>
											<EditIcon />
											Edit
										</Link>
										<button
											type="button"
											disabled={pendingPhone === record.phoneNumber}
											className={`${styles.actionButton} ${
												record.status === 'Revoked'
													? actionClassName('success')
													: actionClassName('danger')
											}`}
											onClick={() => onToggleStatus(record)}
										>
											{pendingPhone === record.phoneNumber ? (
												'Updating...'
											) : record.status === 'Revoked' ? (
												<>
													<ActivateIcon />
													Activate
												</>
											) : (
												<>
													<RevokeIcon />
													Revoke
												</>
											)}
										</button>
									</div>
								) : null}
							</li>
						)
					})}
				</ul>
			</div>

			<div className={`${styles.tableWrap} ${styles.tabletOnly}`}>
				<table className={styles.table}>
					<thead>
						<tr className={styles.tableHeadRow}>
							<th className={styles.tableHeader}>
								<span className={styles.srOnly}>Expand</span>
							</th>
							<th className={styles.tableHeader}>Phone Number</th>
							<th className={styles.tableHeader}>Business Unit</th>
							<th className={styles.tableHeader}>Status</th>
							<th className={styles.tableHeader}>Modified</th>
						</tr>
					</thead>
					<tbody>
						{localRecords.map((record) => {
							const isExpanded = Boolean(expandedRows[record.phoneNumber])
							const unitSummary = formatSelectionSummary(record.businessUnit)
							const segmentSummary = formatSelectionSummary(record.businessSegment)
							const channelSummary = formatSelectionSummary(record.channel, formatTitleCaseLabel)
							const intentSummary = formatSelectionSummary(record.intent, formatTitleCaseLabel)

							return (
								<Fragment key={record.phoneNumber}>
									<tr className={styles.tableRow}>
										<td className={styles.tableCell}>
											<button
												type="button"
												className={styles.expandButton}
												onClick={() => onToggleExpand(record.phoneNumber)}
												aria-expanded={isExpanded}
												aria-controls={`dnc-details-${record.phoneNumber}`}
											>
												{isExpanded ? '−' : '+'}
											</button>
										</td>
										<td className={styles.tableCell}>{formatPhoneNumber(record.phoneNumber)}</td>
										<td className={styles.tableCell}>
											<SelectionValue summary={unitSummary} className={styles.cellValue} />
										</td>
										<td className={styles.tableCell}>
											<span className={`${styles.statusBadge} ${statusClassName[record.status]}`}>
												{record.status}
											</span>
										</td>
										<td className={styles.tableCell}>
											{new Date(record.modifiedDate).toLocaleDateString()}
										</td>
									</tr>
									{isExpanded ? (
										<tr className={styles.tableRow}>
											<td colSpan={5} className={styles.expandCell}>
												<div id={`dnc-details-${record.phoneNumber}`} className={styles.detailCard}>
													<div className={styles.detailCardGrid}>
														<div>
															<p className={styles.metaLabel}>Segment</p>
															<div className={styles.valueOffset}>
																<SelectionValue
																	summary={segmentSummary}
																	className={styles.metaValue}
																/>
															</div>
														</div>
														<div>
															<p className={styles.metaLabel}>Channel</p>
															<div className={styles.valueOffset}>
																<SelectionValue
																	summary={channelSummary}
																	className={styles.metaValue}
																/>
															</div>
														</div>
														<div>
															<p className={styles.metaLabel}>Intent</p>
															<div className={styles.valueOffset}>
																<SelectionValue
																	summary={intentSummary}
																	className={styles.metaValue}
																/>
															</div>
														</div>
													</div>

													{showActions ? (
														<div className={styles.inlineActions}>
															<Link
																href={`/internal-dnc/${encodeURIComponent(record.phoneNumber)}/view`}
																className={`${styles.actionLink} ${actionClassName('info')}`}
															>
																<EditIcon />
																Edit
															</Link>
															<button
																type="button"
																disabled={pendingPhone === record.phoneNumber}
																className={`${styles.actionButton} ${
																	record.status === 'Revoked'
																		? actionClassName('success')
																		: actionClassName('danger')
																}`}
																onClick={() => onToggleStatus(record)}
															>
																{pendingPhone === record.phoneNumber ? (
																	'Updating...'
																) : record.status === 'Revoked' ? (
																	<>
																		<ActivateIcon />
																		Activate
																	</>
																) : (
																	<>
																		<RevokeIcon />
																		Revoke
																	</>
																)}
															</button>
														</div>
													) : null}
												</div>
											</td>
										</tr>
									) : null}
								</Fragment>
							)
						})}
					</tbody>
				</table>
			</div>

			<div className={`${styles.tableWrap} ${styles.desktopOnly}`}>
				<table className={`${styles.table} ${styles.tableWide}`}>
					<thead>
						<tr className={styles.tableHeadRow}>
							<th className={styles.tableHeader}>Phone Number</th>
							<th className={styles.tableHeader}>Business Unit</th>
							<th className={styles.tableHeader}>Business Segment</th>
							<th className={styles.tableHeader}>Channel</th>
							<th className={styles.tableHeader}>Intent</th>
							<th className={styles.tableHeader}>Status</th>
							<th className={styles.tableHeader}>Modified Date</th>
							{showActions ? <th className={styles.tableHeader}>Actions</th> : null}
						</tr>
					</thead>
					<tbody>
						{localRecords.map((record) => {
							const unitSummary = formatSelectionSummary(record.businessUnit)
							const segmentSummary = formatSelectionSummary(record.businessSegment)
							const channelSummary = formatSelectionSummary(record.channel, formatTitleCaseLabel)
							const intentSummary = formatSelectionSummary(record.intent, formatTitleCaseLabel)

							return (
								<tr key={record.phoneNumber} className={styles.tableRow}>
									<td className={styles.tableCell}>{formatPhoneNumber(record.phoneNumber)}</td>
									<td className={styles.tableCell}>
										<SelectionValue summary={unitSummary} className={styles.cellValue} />
									</td>
									<td className={styles.tableCell}>
										<SelectionValue summary={segmentSummary} className={styles.cellValue} />
									</td>
									<td className={styles.tableCell}>
										<SelectionValue summary={channelSummary} className={styles.cellValue} />
									</td>
									<td className={styles.tableCell}>
										<SelectionValue summary={intentSummary} className={styles.cellValue} />
									</td>
									<td className={styles.tableCell}>
										<span className={`${styles.statusBadge} ${statusClassName[record.status]}`}>
											{record.status}
										</span>
									</td>
									<td className={styles.tableCell}>
										{new Date(record.modifiedDate).toLocaleDateString()}
									</td>
									{showActions ? (
										<td className={styles.tableCell}>
											<div className={styles.inlineActions}>
												<Link
													href={`/internal-dnc/${encodeURIComponent(record.phoneNumber)}/view`}
													className={`${styles.actionLink} ${actionClassName('info')}`}
												>
													<EditIcon />
													Edit
												</Link>
												<button
													type="button"
													disabled={pendingPhone === record.phoneNumber}
													className={`${styles.actionButton} ${
														record.status === 'Revoked'
															? actionClassName('success')
															: actionClassName('danger')
													}`}
													onClick={() => onToggleStatus(record)}
												>
													{pendingPhone === record.phoneNumber ? (
														'Updating...'
													) : record.status === 'Revoked' ? (
														<>
															<ActivateIcon />
															Activate
														</>
													) : (
														<>
															<RevokeIcon />
															Revoke
														</>
													)}
												</button>
											</div>
										</td>
									) : null}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			{totalPages > 1 ? (
				<div className={styles.pagination}>
					<Link
						href={
							page > 1 ? `?page=${page - 1}&pageSize=${pageSize}` : `?page=1&pageSize=${pageSize}`
						}
						className={`${styles.pageControl} ${
							page <= 1 ? styles.pageControlDisabled : styles.pageControlActive
						}`}
						aria-disabled={page <= 1}
					>
						Previous
					</Link>
					<span className={styles.pageIndicator}>
						Page {page} of {totalPages}
					</span>
					<Link
						href={
							page < totalPages
								? `?page=${page + 1}&pageSize=${pageSize}`
								: `?page=${totalPages}&pageSize=${pageSize}`
						}
						className={`${styles.pageControl} ${
							page >= totalPages ? styles.pageControlDisabled : styles.pageControlActive
						}`}
						aria-disabled={page >= totalPages}
					>
						Next
					</Link>
				</div>
			) : null}
		</div>
	)
}
