import { notFound } from 'next/navigation'
import { DncForm } from '@/components/dnc-form'
import { getDncRecordByPhone } from '@/lib/dnc-data'

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
		<main className="page-shell narrow-shell">
			<header className="topbar stacked-header">
				<div>
					<p className="eyebrow">Edit record</p>
					<h1>{record.phoneNumber}</h1>
				</div>
			</header>

			<DncForm mode="edit" record={record} />
		</main>
	)
}
