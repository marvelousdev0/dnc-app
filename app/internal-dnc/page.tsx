import Link from 'next/link'
import { DncTable } from '@/components/dnc-table'
import { getDncRecordsPage } from '@/lib/dnc-data'

export default async function InternalDncPage({
	searchParams,
}: {
	searchParams?: Promise<{ page?: string; pageSize?: string }>
}) {
	const params = (await searchParams) ?? {}
	const page = Number(params.page ?? '1')
	const pageSize = Number(params.pageSize ?? '8')
	const data = getDncRecordsPage(page, pageSize)

	return (
		<main className="app-shell">
			<div className="bg-orb right-0 top-16 h-64 w-64 bg-cyan-300/16" />
			<div className="bg-orb left-1/3 top-0 h-52 w-52 bg-amber-300/10" />

			<div className="content-shell">
				<header className="reveal mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="eyebrow">Do not call</p>
						<h1 className="font-[family-name:var(--font-syne)] text-4xl tracking-tight text-slate-50 sm:text-5xl">
							Internal DNC
						</h1>
					</div>
					<Link href="/internal-dnc/new" className="btn-primary">
						Create DNC record
					</Link>
				</header>

				<section className="panel reveal reveal-delay-1">
					<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<h2 className="font-[family-name:var(--font-syne)] text-2xl text-slate-100">
							Managed records
						</h2>
						<Link
							href="/dashboard"
							className="text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
						>
							Back to dashboard
						</Link>
					</div>

					<DncTable
						records={data.items}
						page={data.currentPage}
						totalPages={data.totalPages}
						pageSize={data.pageSize}
					/>
				</section>
			</div>
		</main>
	)
}
