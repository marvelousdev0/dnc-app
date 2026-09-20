import Link from 'next/link'
import { DncTable } from '@/components/dnc-table'
import { ButtonLink } from '@/components/ui/button-link'
import { getDncRecordsPage } from '@/lib/dnc-data'
import styles from './page.module.css'

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
			<div className={`bg-orb ${styles.orbRight}`} />
			<div className={`bg-orb ${styles.orbLeft}`} />

			<div className="content-shell">
				<header className={`page-header reveal ${styles.header}`}>
					<div>
						<p className="eyebrow">Do not call</p>
						<h1 className={styles.title}>Internal DNC</h1>
					</div>
					<ButtonLink href="/internal-dnc/new" fullWidth fullWidthSmAuto>
						Create DNC record
					</ButtonLink>
				</header>

				<section className="panel reveal reveal-delay-1">
					<div className={styles.panelHead}>
						<h2 className={styles.panelTitle}>Managed records</h2>
						<Link href="/dashboard" className={styles.backLink}>
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
