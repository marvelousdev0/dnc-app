interface BrandLogoProps {
	className?: string
}

export function BrandLogo({ className }: BrandLogoProps) {
	return (
		<svg viewBox="0 0 96 96" aria-hidden="true" focusable="false" className={className}>
			<g fill="none" strokeLinecap="round" strokeLinejoin="round">
				<path d="M48 10V86" stroke="var(--logo-mark)" strokeWidth="10" />
				<path d="M10 48H86" stroke="var(--logo-mark)" strokeWidth="10" />
				<path d="M20 20L76 76" stroke="var(--logo-mark-alt)" strokeWidth="9" />
				<path d="M76 20L20 76" stroke="var(--logo-mark-alt)" strokeWidth="9" />
			</g>
		</svg>
	)
}
