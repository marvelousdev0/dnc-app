import { DncForm } from '@/components/dnc-form'

export default function NewDncPage() {
	return (
		<main className="page-shell narrow-shell">
			<header className="topbar stacked-header">
				<div>
					<p className="eyebrow">Create record</p>
					<h1>New DNC Entry</h1>
				</div>
			</header>

			<DncForm mode="create" />
		</main>
	)
}
