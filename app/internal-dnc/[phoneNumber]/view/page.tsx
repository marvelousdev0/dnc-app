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
		<main className="app-shell">
			<div className="bg-orb right-6 top-16 h-60 w-60 bg-cyan-300/16" />

			<div className="content-shell max-w-5xl">
				<header className="reveal mb-6">
					<p className="eyebrow">Edit record</p>
					<h1 className="font-[family-name:var(--font-syne)] text-3xl tracking-tight text-slate-50 sm:text-4xl">
						{record.phoneNumber}
					</h1>
				</header>

				<DncForm mode="edit" record={record} />
			</div>
		</main>
	)
}
