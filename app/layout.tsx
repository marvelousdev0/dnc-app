import type { Metadata } from 'next'
import { Manrope, Syne } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
	variable: '--font-manrope',
	subsets: ['latin'],
})

const syne = Syne({
	variable: '--font-syne',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'DNC Control Center',
	description: 'Internal dashboard for managing DNC records and view templates',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="en" className={`${manrope.variable} ${syne.variable}`}>
			<body>{children}</body>
		</html>
	)
}
