import { DncTable } from '@/components/dnc-table'
import { getDncRecordsPage } from '@/lib/dnc-data'
import styles from './page.module.css'

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
			<div className={`bg-orb ${styles.orbLeft}`} />
			<div className={`bg-orb ${styles.orbRight}`} />

			<div className="content-shell">
				<header className="page-header reveal">
					<p className="eyebrow">Template</p>
					<h1 className={styles.title}>DNC Template View</h1>
				</header>

				<section className="panel reveal reveal-delay-1">
					<div className={styles.panelSpacing}>
						<h2 className={styles.panelTitle}>Paginated mock data</h2>
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
