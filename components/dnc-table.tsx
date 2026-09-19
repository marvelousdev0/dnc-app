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

	const statusClassName: Record<DncRecord['status'], string> = {
		Active: 'border border-emerald-300/35 bg-emerald-500/15 text-emerald-100',
		Pending: 'border border-amber-300/35 bg-amber-500/15 text-amber-100',
		Revoked: 'border border-rose-300/35 bg-rose-500/15 text-rose-100',
	}

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
		<div className="overflow-x-auto rounded-2xl border border-white/8 bg-slate-950/20">
			<table className="min-w-[860px] w-full border-collapse">
				<thead>
					<tr className="border-b border-white/12">
						<th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-slate-300/80">
							Phone Number
						</th>
						<th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-slate-300/80">
							Business Unit
						</th>
						<th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-slate-300/80">
							Business Segment
						</th>
						<th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-slate-300/80">
							Channel
						</th>
						<th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-slate-300/80">
							Intent
						</th>
						<th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-slate-300/80">
							Status
						</th>
						<th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-slate-300/80">
							Modified Date
						</th>
						{showActions ? (
							<th className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-slate-300/80">
								Actions
							</th>
						) : null}
					</tr>
				</thead>
				<tbody>
					{localRecords.map((record) => (
						<tr
							key={record.phoneNumber}
							className="border-b border-white/10 transition duration-200 hover:bg-cyan-300/6"
						>
							<td className="px-3 py-3 text-sm text-slate-100">
								{formatPhoneNumber(record.phoneNumber)}
							</td>
							<td className="px-3 py-3 text-sm text-slate-200">{record.businessUnit}</td>
							<td className="px-3 py-3 text-sm text-slate-200">{record.businessSegment}</td>
							<td className="px-3 py-3 text-sm text-slate-200">{record.channel}</td>
							<td className="px-3 py-3 text-sm text-slate-200">{record.intent}</td>
							<td className="px-3 py-3">
								<span
									className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClassName[record.status]}`}
								>
									{record.status}
								</span>
							</td>
							<td className="px-3 py-3 text-sm text-slate-300">
								{new Date(record.modifiedDate).toLocaleDateString()}
							</td>
							{showActions ? (
								<td className="px-3 py-3">
									<div className="flex items-center gap-2">
										<Link
											href={`/internal-dnc/${encodeURIComponent(record.phoneNumber)}/view`}
											className="rounded-lg border border-cyan-300/35 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-300/20"
										>
											Edit
										</Link>
										<button
											type="button"
											className="rounded-lg border border-rose-300/35 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-100 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-400/20"
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
				<div className="mt-5 flex items-center justify-between gap-4 border-t border-white/12 px-2 pt-5 text-sm text-slate-300">
					<Link
						href={
							page > 1 ? `?page=${page - 1}&pageSize=${pageSize}` : `?page=1&pageSize=${pageSize}`
						}
						className={`rounded-lg px-3 py-1.5 font-semibold transition ${
							page <= 1
								? 'pointer-events-none border border-white/10 bg-white/5 text-slate-500'
								: 'border border-cyan-300/35 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-300/20'
						}`}
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
						className={`rounded-lg px-3 py-1.5 font-semibold transition ${
							page >= totalPages
								? 'pointer-events-none border border-white/10 bg-white/5 text-slate-500'
								: 'border border-cyan-300/35 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-300/20'
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
