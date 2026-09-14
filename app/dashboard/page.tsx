import Link from 'next/link'
import { getDncRecordsPage } from '@/lib/dnc-data'

const cards = [
	{ href: '/internal-dnc', title: 'Internal DNC', subtitle: 'Manage DNC records and statuses' },
	{ href: '/internal-dnc/new', title: 'Create DNC', subtitle: 'Add a new Do Not Call record' },
	{ href: '/templates', title: 'Templates', subtitle: 'Review paginated DNC records' },
	{ href: '/dashboard', title: 'Dashboard', subtitle: 'Overview of available pages' },
]

export default async function DashboardPage() {
	const { totalItems } = getDncRecordsPage(1, 10)

	return (
		<main className="page-shell">
			<header className="topbar">
				<div>
					<p className="eyebrow">Operations dashboard</p>
					<h1>Dashboard</h1>
				</div>
				<Link href="/internal-dnc" className="button primary">
					View DNC list
				</Link>
			</header>

			<section className="stats-grid">
				<div className="stat-card highlight">
					<span>Total Records</span>
					<strong>{totalItems}</strong>
				</div>
				<div className="stat-card">
					<span>Active Rules</span>
					<strong>24</strong>
				</div>
				<div className="stat-card">
					<span>Revocations</span>
					<strong>8</strong>
				</div>
			</section>

			<section className="card-grid">
				{cards.map((card) => (
					<Link key={card.href} href={card.href} className="page-card">
						<div className="card-icon">→</div>
						<h2>{card.title}</h2>
						<p>{card.subtitle}</p>
					</Link>
				))}
			</section>
		</main>
	)
}
