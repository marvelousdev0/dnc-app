'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { tracedFetch } from '@/lib/client-trace'
import { type DncRecord, formatPhoneNumber } from '@/lib/dnc-data'

interface DncTableProps {
	records: DncRecord[]
	page: number
	totalPages: number
	pageSize: number
	showActions?: boolean
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

	const onRevoke = async (phoneNumber: string) => {
		try {
			const sessionResponse = await tracedFetch('/api/session', { cache: 'no-store' })
			const sessionPayload = await sessionResponse.json()
			const sessionUser = sessionPayload.user ?? { id: 'jdoe', name: 'Jane Doe' }

			const response = await tracedFetch(`/api/dnc/${encodeURIComponent(phoneNumber)}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ modifiedBy: sessionUser.id }),
			})

			if (!response.ok) {
				throw new Error('Unable to revoke record.')
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
		}
	}

	return (
		<div className="table-shell">
			<table>
				<thead>
					<tr>
						<th>Phone Number</th>
						<th>Business Unit</th>
						<th>Business Segment</th>
						<th>Channel</th>
						<th>Intent</th>
						<th>Status</th>
						<th>Modified Date</th>
						{showActions ? <th>Actions</th> : null}
					</tr>
				</thead>
				<tbody>
					{localRecords.map((record) => (
						<tr key={record.phoneNumber}>
							<td>{formatPhoneNumber(record.phoneNumber)}</td>
							<td>{record.businessUnit}</td>
							<td>{record.businessSegment}</td>
							<td>{record.channel}</td>
							<td>{record.intent}</td>
							<td>
								<span className={`status-badge ${record.status.toLowerCase()}`}>
									{record.status}
								</span>
							</td>
							<td>{new Date(record.modifiedDate).toLocaleDateString()}</td>
							{showActions ? (
								<td>
									<div className="row-actions">
										<Link
											href={`/internal-dnc/${encodeURIComponent(record.phoneNumber)}/view`}
											className="action-link"
										>
											Edit
										</Link>
										<button
											type="button"
											className="action-button revoke"
											onClick={() => onRevoke(record.phoneNumber)}
										>
											Revoke
										</button>
									</div>
								</td>
							) : null}
						</tr>
					))}
				</tbody>
			</table>

			{totalPages > 1 ? (
				<div className="pagination">
					<Link
						href={
							page > 1 ? `?page=${page - 1}&pageSize=${pageSize}` : `?page=1&pageSize=${pageSize}`
						}
						className={page <= 1 ? 'disabled' : ''}
						aria-disabled={page <= 1}
					>
						Previous
					</Link>
					<span>
						Page {page} of {totalPages}
					</span>
					<Link
						href={
							page < totalPages
								? `?page=${page + 1}&pageSize=${pageSize}`
								: `?page=${totalPages}&pageSize=${pageSize}`
						}
						className={page >= totalPages ? 'disabled' : ''}
						aria-disabled={page >= totalPages}
					>
						Next
					</Link>
				</div>
			) : null}
		</div>
	)
}
