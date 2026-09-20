import type { Metadata } from 'next'
import { DM_Sans, Sora } from 'next/font/google'
import Script from 'next/script'
import { AppFooter } from '@/components/app-footer'
import { AppHeader } from '@/components/app-header'
import { GlobalLoadingOverlay } from '@/components/global-loading-overlay'
import './globals.css'

const dmSans = DM_Sans({
	variable: '--font-manrope',
	subsets: ['latin'],
	display: 'swap',
})

const sora = Sora({
	variable: '--font-syne',
	subsets: ['latin'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Admin UI',
	description: 'Internal dashboard for managing DNC records and view templates',
}

const themeInitScript = `
(() => {
	try {
		const storageKey = 'theme-preference'
		const saved = localStorage.getItem(storageKey)
		const preference = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
		const resolvedTheme = preference === 'system' ? systemTheme : preference
		const root = document.documentElement
		root.dataset.themePreference = preference
		root.dataset.theme = resolvedTheme
		root.style.colorScheme = resolvedTheme
	} catch {
		// Keep default styling if storage is unavailable.
	}
})()
`

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="en" className={`${dmSans.variable} ${sora.variable}`} suppressHydrationWarning>
			<head>
				<Script id="theme-init" strategy="beforeInteractive">
					{themeInitScript}
				</Script>
			</head>
			<body>
				<AppHeader />
				<GlobalLoadingOverlay />
				{children}
				<AppFooter />
			</body>
		</html>
	)
}
