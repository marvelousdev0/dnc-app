'use client'

import { useEffect, useId, useRef, useState } from 'react'

interface AnchoredSelectProps<T extends string> {
	value?: T
	options: readonly T[]
	onChange: (value: T) => void
	disabled?: boolean
	ariaLabel?: string
	formatOptionLabel?: (option: T) => string
	placeholder?: string
}

interface AnchoredMultiSelectProps<T extends string> {
	values: readonly T[]
	options: readonly T[]
	onChange: (values: T[]) => void
	disabled?: boolean
	ariaLabel?: string
	formatOptionLabel?: (option: T) => string
	placeholder?: string
}

export function AnchoredSelect<T extends string>({
	value,
	options,
	onChange,
	disabled = false,
	ariaLabel,
	formatOptionLabel,
	placeholder = 'Select',
}: AnchoredSelectProps<T>) {
	const [isOpen, setIsOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement | null>(null)
	const listboxId = useId()
	const getOptionLabel = (option: T) => formatOptionLabel?.(option) ?? option

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const onPointerDown = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		const onEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', onPointerDown)
		document.addEventListener('keydown', onEscape)

		return () => {
			document.removeEventListener('mousedown', onPointerDown)
			document.removeEventListener('keydown', onEscape)
		}
	}, [isOpen])

	return (
		<div ref={rootRef} className="anchored-select">
			<button
				type="button"
				className="field-input anchored-select-trigger"
				aria-label={ariaLabel}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={listboxId}
				disabled={disabled}
				onClick={() => setIsOpen((current) => !current)}
			>
				<span className={`anchored-select-value ${value ? '' : 'anchored-select-placeholder'}`}>
					{value ? getOptionLabel(value) : placeholder}
				</span>
				<svg viewBox="0 0 20 20" aria-hidden="true" className="anchored-select-icon" fill="none">
					<path
						d="M5.5 7.5L10 12L14.5 7.5"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			{isOpen ? (
				<div id={listboxId} className="anchored-select-popover" role="listbox">
					{options.map((option) => {
						const isSelected = option === value

						return (
							<button
								key={option}
								type="button"
								role="option"
								aria-selected={isSelected}
								className={`anchored-select-option ${isSelected ? 'is-selected' : ''}`}
								onClick={() => {
									onChange(option)
									setIsOpen(false)
								}}
							>
								{getOptionLabel(option)}
							</button>
						)
					})}
				</div>
			) : null}
		</div>
	)
}

export function AnchoredMultiSelect<T extends string>({
	values,
	options,
	onChange,
	disabled = false,
	ariaLabel,
	formatOptionLabel,
	placeholder = 'Select',
}: AnchoredMultiSelectProps<T>) {
	const [isOpen, setIsOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement | null>(null)
	const listboxId = useId()
	const getOptionLabel = (option: T) => formatOptionLabel?.(option) ?? option

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const onPointerDown = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		const onEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', onPointerDown)
		document.addEventListener('keydown', onEscape)

		return () => {
			document.removeEventListener('mousedown', onPointerDown)
			document.removeEventListener('keydown', onEscape)
		}
	}, [isOpen])

	const toggleValue = (option: T) => {
		const isSelected = values.includes(option)
		if (isSelected) {
			if (values.length <= 1) {
				return
			}
			onChange(values.filter((value) => value !== option))
			return
		}

		onChange([...values, option])
	}

	return (
		<div ref={rootRef} className="anchored-select">
			<button
				type="button"
				className="field-input anchored-select-trigger anchored-multi-trigger"
				aria-label={ariaLabel}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={listboxId}
				disabled={disabled}
				onClick={() => setIsOpen((current) => !current)}
			>
				<span className="anchored-multi-values">
					{values.length === 0 ? (
						<span className="anchored-select-value anchored-select-placeholder">{placeholder}</span>
					) : (
						values.map((option) => (
							<span key={option} className="anchored-multi-chip">
								{getOptionLabel(option)}
							</span>
						))
					)}
				</span>
				<svg viewBox="0 0 20 20" aria-hidden="true" className="anchored-select-icon" fill="none">
					<path
						d="M5.5 7.5L10 12L14.5 7.5"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			{isOpen ? (
				<div id={listboxId} className="anchored-select-popover" role="listbox" aria-multiselectable>
					{options.map((option) => {
						const isSelected = values.includes(option)

						return (
							<button
								key={option}
								type="button"
								role="option"
								aria-selected={isSelected}
								className={`anchored-select-option ${isSelected ? 'is-selected' : ''}`}
								onClick={() => toggleValue(option)}
							>
								<span>{getOptionLabel(option)}</span>
								{isSelected ? <span className="anchored-option-check">✓</span> : null}
							</button>
						)
					})}
				</div>
			) : null}
		</div>
	)
}
