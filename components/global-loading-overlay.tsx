'use client'

import { useEffect, useState } from 'react'

interface LoadingEventDetail {
	count: number
	phase: 'start' | 'end'
	method: string
	url: string
}

const LOADING_EVENT_NAME = 'dnc:network-loading'

export function GlobalLoadingOverlay() {
	const [activeRequests, setActiveRequests] = useState(0)

	useEffect(() => {
		const onLoadingEvent = (event: Event) => {
			const { detail } = event as CustomEvent<LoadingEventDetail>
			if (!detail || typeof detail.count !== 'number') {
				return
			}
			setActiveRequests(Math.max(0, detail.count))
		}

		window.addEventListener(LOADING_EVENT_NAME, onLoadingEvent)
		return () => window.removeEventListener(LOADING_EVENT_NAME, onLoadingEvent)
	}, [])

	const isVisible = activeRequests > 0

	return (
		<div
			className={`network-loader-overlay ${isVisible ? 'is-visible' : ''}`}
			aria-hidden={!isVisible}
		>
			<div className="network-loader-mask" />
			<div className="network-loader-banner" role="status" aria-live="polite">
				<span className="loader-spinner" aria-hidden="true" />
				<span className="network-loader-text">Refreshing data...</span>
			</div>
		</div>
	)
}
