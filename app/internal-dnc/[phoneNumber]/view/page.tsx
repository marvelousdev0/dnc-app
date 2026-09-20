import { notFound } from 'next/navigation'
import { DncForm } from '@/components/dnc-form'
import { getDncRecordByPhone } from '@/lib/dnc-data'
import styles from './page.module.css'

export default async function DncViewPage({
	params,
}: {
	params: Promise<{ phoneNumber: string }>
}) {
	const { phoneNumber } = await params
	const record = getDncRecordByPhone(phoneNumber)

	if (!record) {
		notFound()
	}

	return (
		<main className="app-shell">
			<div className={`bg-orb ${styles.orbRight}`} />

			<div className={`content-shell ${styles.contentNarrow}`}>
				<header className="page-header reveal">
					<p className="eyebrow">Edit record</p>
					<h1 className={styles.title}>{record.phoneNumber}</h1>
				</header>

				<DncForm mode="edit" record={record} />
			</div>
		</main>
	)
}
