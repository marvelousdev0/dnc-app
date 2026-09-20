'use client'

import { useEffect, useState } from 'react'

type ThemePreference = 'light' | 'dark' | 'system'
type ThemeResolved = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'system', label: 'System' },
]

const getResolvedTheme = (preference: ThemePreference): ThemeResolved => {
	if (preference === 'system') {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}
	return preference
}

const applyTheme = (preference: ThemePreference) => {
	const resolvedTheme = getResolvedTheme(preference)
	const root = document.documentElement
	root.dataset.themePreference = preference
	root.dataset.theme = resolvedTheme
	root.style.colorScheme = resolvedTheme
}

export function ThemeSwitch() {
	const [themePreference, setThemePreference] = useState<ThemePreference>('system')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		const savedTheme = localStorage.getItem(STORAGE_KEY)
		const preference: ThemePreference =
			savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
				? savedTheme
				: 'system'

		setThemePreference(preference)
		applyTheme(preference)
		setMounted(true)
	}, [])

	useEffect(() => {
		if (!mounted) {
			return
		}

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleSystemChange = () => {
			if (themePreference === 'system') {
				applyTheme('system')
			}
		}

		mediaQuery.addEventListener('change', handleSystemChange)
		return () => mediaQuery.removeEventListener('change', handleSystemChange)
	}, [themePreference, mounted])

	const updateTheme = (preference: ThemePreference) => {
		setThemePreference(preference)
		localStorage.setItem(STORAGE_KEY, preference)
		applyTheme(preference)
	}

	return (
		<fieldset className="theme-switch">
			<legend className="sr-only">Theme preference</legend>
			{themeOptions.map((option) => (
				<button
					key={option.value}
					type="button"
					aria-pressed={themePreference === option.value}
					onClick={() => updateTheme(option.value)}
					className={`theme-chip ${themePreference === option.value ? 'is-active' : ''}`}
				>
					{option.label}
				</button>
			))}
		</fieldset>
	)
}
