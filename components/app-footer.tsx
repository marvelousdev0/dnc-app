import Link from 'next/link'

export function AppFooter() {
	return (
		<footer className="app-footer" role="contentinfo">
			<div className="app-footer-inner">
				<p className="app-footer-copy">Admin UI • Compliance Operations</p>
				<div className="app-footer-links">
					<Link href="/dashboard" className="app-footer-link">
						Dashboard
					</Link>
					<Link href="/internal-dnc" className="app-footer-link">
						Internal DNC
					</Link>
					<Link href="/templates" className="app-footer-link">
						Templates
					</Link>
				</div>
			</div>
		</footer>
	)
}
