import Link from 'next/link'
import { ButtonLink } from '@/components/ui/button-link'
import { getDncRecordsPage } from '@/lib/dnc-data'
import styles from './page.module.css'

const cards = [
	{ href: '/internal-dnc', title: 'Internal DNC', subtitle: 'Manage DNC records and statuses' },
	{ href: '/internal-dnc/new', title: 'Create DNC', subtitle: 'Add a new Do Not Call record' },
	{ href: '/templates', title: 'Templates', subtitle: 'Review paginated DNC records' },
	{ href: '/dashboard', title: 'Dashboard', subtitle: 'Overview of available pages' },
]

export default async function DashboardPage() {
	const { totalItems } = getDncRecordsPage(1, 10)

	return (
		<main className="app-shell">
			<div className={`bg-orb ${styles.orbLeft}`} />
			<div className={`bg-orb ${styles.orbRight}`} />

			<div className="content-shell">
				<header className={`page-header reveal ${styles.header}`}>
					<div>
						<p className="eyebrow">Operations dashboard</p>
						<h1 className={styles.title}>DNC Command Deck</h1>
						<p className={styles.subtitle}>
							Monitor records, update statuses, and route high-risk numbers through a single
							compliance workspace.
						</p>
					</div>
					<ButtonLink href="/internal-dnc" fullWidth fullWidthSmAuto>
						View DNC list
					</ButtonLink>
				</header>

				<section className={`reveal reveal-delay-1 ${styles.metrics}`}>
					<div className={`panel ${styles.metricHighlight}`}>
						<p className={styles.metricLabel}>Total records</p>
						<strong className={styles.metricValue}>{totalItems}</strong>
					</div>
					<div className="panel">
						<p className={styles.metricLabel}>Active rules</p>
						<strong className={styles.metricValue}>24</strong>
					</div>
					<div className="panel">
						<p className={styles.metricLabel}>Revocations</p>
						<strong className={styles.metricValue}>8</strong>
					</div>
				</section>

				<section className={`reveal reveal-delay-2 ${styles.cards}`}>
					{cards.map((card) => (
						<Link key={card.href} href={card.href} className={styles.card}>
							<div className={styles.cardIcon}>→</div>
							<h2 className={styles.cardTitle}>{card.title}</h2>
							<p className={styles.cardSubtitle}>{card.subtitle}</p>
						</Link>
					))}
				</section>
			</div>
		</main>
	)
}
