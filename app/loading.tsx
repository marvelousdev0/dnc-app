export default function RootLoading() {
	return (
		<div className="page-loader-shell" role="status" aria-live="polite" aria-label="Loading page">
			<div className="page-loader-card">
				<span className="loader-spinner loader-spinner-lg" aria-hidden="true" />
				<p className="page-loader-title">Loading Admin UI...</p>
				<p className="page-loader-caption">Preparing data and interface</p>
			</div>
		</div>
	)
}
