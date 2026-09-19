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
		<main className="app-shell">
			<div className="bg-orb -left-20 top-5 h-72 w-72 bg-emerald-400/28" />
			<div className="bg-orb -right-12 top-24 h-72 w-72 bg-cyan-400/22" />

			<div className="content-shell">
				<header className="reveal mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="eyebrow">Operations dashboard</p>
						<h1 className="font-[family-name:var(--font-syne)] text-4xl tracking-tight text-slate-50 sm:text-5xl">
							DNC Command Deck
						</h1>
						<p className="mt-3 max-w-2xl text-sm text-slate-300/85 sm:text-base">
							Monitor records, update statuses, and route high-risk numbers through a single
							compliance workspace.
						</p>
					</div>
					<Link href="/internal-dnc" className="btn-primary">
						View DNC list
					</Link>
				</header>

				<section className="reveal reveal-delay-1 mb-7 grid gap-4 md:grid-cols-3">
					<div className="panel border-emerald-200/20 bg-gradient-to-br from-emerald-400/15 to-emerald-500/5">
						<p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">Total records</p>
						<strong className="mt-3 block text-4xl font-semibold text-emerald-100">
							{totalItems}
						</strong>
					</div>
					<div className="panel">
						<p className="text-xs uppercase tracking-[0.2em] text-slate-300/70">Active rules</p>
						<strong className="mt-3 block text-4xl font-semibold text-slate-100">24</strong>
					</div>
					<div className="panel">
						<p className="text-xs uppercase tracking-[0.2em] text-slate-300/70">Revocations</p>
						<strong className="mt-3 block text-4xl font-semibold text-slate-100">8</strong>
					</div>
				</section>

				<section className="reveal reveal-delay-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{cards.map((card) => (
						<Link
							key={card.href}
							href={card.href}
							className="hover-lift group rounded-3xl border border-white/10 bg-white/6 p-5 hover:border-cyan-300/40 hover:bg-cyan-300/8"
						>
							<div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-lg text-cyan-100 transition duration-200 group-hover:rotate-6 group-hover:scale-105">
								→
							</div>
							<h2 className="font-[family-name:var(--font-syne)] text-xl text-slate-100">
								{card.title}
							</h2>
							<p className="mt-2 text-sm text-slate-300/85">{card.subtitle}</p>
						</Link>
					))}
				</section>
			</div>
		</main>
	)
}
