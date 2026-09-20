import type { InputHTMLAttributes } from 'react'
import styles from './text-field.module.css'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {}

export function TextField({ className, ...props }: TextFieldProps) {
	return <input className={[styles.input, className].filter(Boolean).join(' ')} {...props} />
}
