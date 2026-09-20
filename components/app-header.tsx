'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BrandLogo } from '@/components/brand-logo'
import { ThemeSwitch } from '@/components/theme-switch'

const navLinks = [
	{ href: '/dashboard', label: 'Dashboard' },
	{ href: '/internal-dnc', label: 'Internal DNC' },
	{ href: '/templates', label: 'Templates' },
]

export function AppHeader() {
	const pathname = usePathname()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const headerRef = useRef<HTMLElement | null>(null)

	const isActiveLink = (href: string) => {
		if (href === '/dashboard') {
			return pathname === '/dashboard'
		}

		return pathname === href || pathname.startsWith(`${href}/`)
	}

	useEffect(() => {
		const syncHeaderHeight = () => {
			const headerHeight = headerRef.current?.offsetHeight

			if (!headerHeight) {
				return
			}

			document.documentElement.style.setProperty('--app-header-height', `${headerHeight}px`)
		}

		syncHeaderHeight()
		window.addEventListener('resize', syncHeaderHeight)

		const observer = new ResizeObserver(() => {
			syncHeaderHeight()
		})

		if (headerRef.current) {
			observer.observe(headerRef.current)
		}

		return () => {
			window.removeEventListener('resize', syncHeaderHeight)
			observer.disconnect()
		}
	}, [])

	return (
		<header ref={headerRef} className="app-header">
			<div className="app-header-inner">
				<Link href="/dashboard" className="brand-block" aria-label="Admin UI home">
					<BrandLogo className="brand-logo" />
					<div>
						<p className="brand-eyebrow">Operations console</p>
						<strong className="brand-title">Admin UI</strong>
					</div>
				</Link>

				<nav className="main-nav" aria-label="Main navigation">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`nav-link ${isActiveLink(link.href) ? 'is-active' : ''}`}
							aria-current={isActiveLink(link.href) ? 'page' : undefined}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="header-actions">
					<button
						type="button"
						className={`mobile-nav-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
						aria-label="Toggle navigation menu"
						aria-controls="mobile-main-nav"
						aria-expanded={isMobileMenuOpen}
						onClick={() => setIsMobileMenuOpen((previousValue) => !previousValue)}
					>
						Menu
					</button>
					<ThemeSwitch />
				</div>
			</div>

			<div
				id="mobile-main-nav"
				className={`mobile-nav-panel ${isMobileMenuOpen ? 'is-open' : ''}`}
				aria-hidden={!isMobileMenuOpen}
			>
				<button
					type="button"
					className="mobile-nav-backdrop"
					aria-label="Close navigation menu"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
				<nav className="mobile-nav-links" aria-label="Mobile navigation">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`mobile-nav-link ${isActiveLink(link.href) ? 'is-active' : ''}`}
							aria-current={isActiveLink(link.href) ? 'page' : undefined}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	)
}
