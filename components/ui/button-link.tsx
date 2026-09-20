import Link, { type LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import styles from './button.module.css'

type ButtonLinkVariant = 'primary' | 'secondary'

interface ButtonLinkProps extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
	children: ReactNode
	variant?: ButtonLinkVariant
	fullWidth?: boolean
	fullWidthSmAuto?: boolean
}

export function ButtonLink({
	children,
	variant = 'primary',
	fullWidth = false,
	fullWidthSmAuto = false,
	className,
	...props
}: ButtonLinkProps) {
	const variantClass = variant === 'primary' ? styles.primary : styles.secondary
	const widthClass = fullWidth ? styles.fullWidth : ''
	const smAutoClass = fullWidthSmAuto ? styles.fullWidthSmAuto : ''

	return (
		<Link
			className={[styles.button, variantClass, widthClass, smAutoClass, className]
				.filter(Boolean)
				.join(' ')}
			{...props}
		>
			{children}
		</Link>
	)
}
