import { DncForm } from '@/components/dnc-form'

export default function NewDncPage() {
	return (
		<main className="app-shell">
			<div className="bg-orb left-10 top-10 h-60 w-60 bg-emerald-400/20" />

			<div className="content-shell max-w-5xl">
				<header className="reveal mb-6">
					<p className="eyebrow">Create record</p>
					<h1 className="font-[family-name:var(--font-syne)] text-4xl tracking-tight text-slate-50 sm:text-5xl">
						New DNC Entry
					</h1>
				</header>

				<DncForm mode="create" />
			</div>
		</main>
	)
}
