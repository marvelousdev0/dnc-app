import { DncTable } from '@/components/dnc-table'
import { getDncRecordsPage } from '@/lib/dnc-data'

export default async function TemplatesPage({
	searchParams,
}: {
	searchParams?: Promise<{ page?: string; pageSize?: string }>
}) {
	const params = (await searchParams) ?? {}
	const page = Number(params.page ?? '1')
	const pageSize = Number(params.pageSize ?? '10')
	const data = getDncRecordsPage(page, pageSize)

	return (
		<main className="page-shell">
			<header className="topbar">
				<div>
					<p className="eyebrow">Template</p>
					<h1>DNC Template View</h1>
				</div>
			</header>

			<section className="panel">
				<div className="panel-header">
					<h2>Paginated mock data</h2>
				</div>

				<DncTable
					records={data.items}
					page={data.currentPage}
					totalPages={data.totalPages}
					pageSize={data.pageSize}
					showActions
				/>
			</section>
		</main>
	)
}
