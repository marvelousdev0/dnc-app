import { DncForm } from '@/components/dnc-form'
import styles from './page.module.css'

export default function NewDncPage() {
	return (
		<main className="app-shell">
			<div className={`bg-orb ${styles.orbLeft}`} />

			<div className={`content-shell ${styles.contentNarrow}`}>
				<header className="page-header reveal">
					<p className="eyebrow">Create record</p>
					<h1 className={styles.title}>New DNC Entry</h1>
				</header>

				<DncForm mode="create" />
			</div>
		</main>
	)
}
