const strict = process.env.STRICT_HEADER !== '0'

module.exports = {
	extends: ['@commitlint/config-conventional'],
	plugins: [
		{
			rules: {
				'subject-story-id': (parsed) => {
					if (process.env.STRICT_HEADER === '0') {
						return [true]
					}

					const subject = parsed.subject ?? ''
					const storyPattern = /^US\d+\s-\s.+/
					const isValid = storyPattern.test(subject)

					return [isValid, "subject must start with a story id in the format 'US123456 - message'"]
				},
			},
		},
	],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'build',
				'chore',
				'ci',
				'docs',
				'feat',
				'fix',
				'perf',
				'refactor',
				'revert',
				'style',
				'test',
			],
		],
		'type-empty': [strict ? 2 : 0, 'never'],
		'scope-empty': [strict ? 2 : 0, 'never'],
		'scope-case': [2, 'always', ['kebab-case', 'lower-case']],
		'subject-case': [0],
		'subject-empty': [strict ? 2 : 0, 'never'],
		'subject-story-id': [2, 'always'],
		'subject-full-stop': [2, 'never', '.'],
		'header-max-length': [2, 'always', 100],
	},
}
