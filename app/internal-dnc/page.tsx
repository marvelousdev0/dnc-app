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
		<main className="page-shell">
			<header className="topbar">
				<div>
					<p className="eyebrow">Do not call</p>
					<h1>Internal DNC</h1>
				</div>
				<Link href="/internal-dnc/new" className="button primary">
					Create DNC record
				</Link>
			</header>

			<section className="panel">
				<div className="panel-header">
					<h2>Managed records</h2>
					<Link href="/dashboard" className="text-link">
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
		</main>
	)
}
