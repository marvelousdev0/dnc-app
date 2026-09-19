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
		<main className="app-shell">
			<div className="bg-orb left-20 top-10 h-56 w-56 bg-cyan-300/14" />
			<div className="bg-orb right-8 top-24 h-56 w-56 bg-emerald-400/16" />

			<div className="content-shell">
				<header className="reveal mb-7">
					<p className="eyebrow">Template</p>
					<h1 className="font-[family-name:var(--font-syne)] text-4xl tracking-tight text-slate-50 sm:text-5xl">
						DNC Template View
					</h1>
				</header>

				<section className="panel reveal reveal-delay-1">
					<div className="mb-5">
						<h2 className="font-[family-name:var(--font-syne)] text-2xl text-slate-100">
							Paginated mock data
						</h2>
					</div>

					<DncTable
						records={data.items}
						page={data.currentPage}
						totalPages={data.totalPages}
						pageSize={data.pageSize}
						showActions
					/>
				</section>
			</div>
		</main>
	)
}
