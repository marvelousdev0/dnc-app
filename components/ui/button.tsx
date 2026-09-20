import type { ButtonHTMLAttributes } from 'react'
import styles from './button.module.css'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	fullWidth?: boolean
	fullWidthSmAuto?: boolean
}

export function Button({
	variant = 'primary',
	fullWidth = false,
	fullWidthSmAuto = false,
	className,
	...props
}: ButtonProps) {
	const variantClass = variant === 'primary' ? styles.primary : styles.secondary
	const widthClass = fullWidth ? styles.fullWidth : ''
	const smAutoClass = fullWidthSmAuto ? styles.fullWidthSmAuto : ''

	return (
		<button
			className={[styles.button, variantClass, widthClass, smAutoClass, className]
				.filter(Boolean)
				.join(' ')}
			{...props}
		/>
	)
}
