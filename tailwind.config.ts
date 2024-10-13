import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
	content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
	plugins: [
		require('@tailwindcss/typography'),
	],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'"Inter"',
					'ui-sans-serif',
					'system-ui',
					'sans-serif',
					'"Apple Color Emoji"',
					'"Segoe UI Emoji"',
					'"Segoe UI Symbol"',
					'"Noto Color Emoji"',
				],
			},
			typography: (theme: any) => ({
				DEFAULT: {
					css: {
						color: theme('colors.white'),
						'--tw-prose-invert-body': theme('colors.white'),
						'--tw-prose-invert-headings': theme('colors.white'),
						'--tw-prose-invert-lead': theme('colors.white'),
						'--tw-prose-invert-links': theme('colors.white'),
						'--tw-prose-invert-bold': theme('colors.white'),
						'--tw-prose-invert-counters': theme('colors.white'),
						'--tw-prose-invert-bullets': theme('colors.white'),
						'--tw-prose-invert-hr': theme('colors.white'),
						'--tw-prose-invert-quotes': theme('colors.white'),
						'--tw-prose-invert-quote-borders': theme('colors.white'),
						'--tw-prose-invert-captions': theme('colors.white'),
						'--tw-prose-invert-code': theme('colors.white'),
						'--tw-prose-invert-pre-code': theme('colors.white'),
						'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
						'--tw-prose-invert-th-borders': theme('colors.white'),
						'--tw-prose-invert-td-borders': theme('colors.white'),
					},
				},
			}),
		},
		screens: {
			xs: '36em', // 36em * 16px = 576px
			sm: '48em', // 48em * 16px = 768px
			md: '62em', // 62em * 16px = 992px
			lg: '75em', // 75em * 16px = 1200px
			xl: '88em', // 88em * 16px = 1408px
		},
		fontFamily: {
			body: ['var(--mantine-font-family)'],
			heading: ['var(--mantine-font-family-headings)'],
		},
		colors: {
			inherit: colors.inherit,
			current: colors.current,
			transparent: colors.transparent,
			black: colors.black,
			white: colors.white,
			dark: {
				0: 'var(--mantine-color-dark-0)', // #c9c9c9
				1: 'var(--mantine-color-dark-1)', // #b8b8b8
				2: 'var(--mantine-color-dark-2)', // #828282
				3: 'var(--mantine-color-dark-3)', // #696969
				4: 'var(--mantine-color-dark-4)', // #424242
				5: 'var(--mantine-color-dark-5)', // #3b3b3b
				6: 'var(--mantine-color-dark-6)', // #2e2e2e
				7: 'var(--mantine-color-dark-7)', // #242424
				8: 'var(--mantine-color-dark-8)', // #1f1f1f
				9: 'var(--mantine-color-dark-9)', // #141414
			},
			gray: {
				0: 'var(--mantine-color-gray-0)', // #f8f9fa
				1: 'var(--mantine-color-gray-1)', // #f1f3f5
				2: 'var(--mantine-color-gray-2)', // #e9ecef
				3: 'var(--mantine-color-gray-3)', // #dee2e6
				4: 'var(--mantine-color-gray-4)', // #ced4da
				5: 'var(--mantine-color-gray-5)', // #adb5bd
				6: 'var(--mantine-color-gray-6)', // #868e96
				7: 'var(--mantine-color-gray-7)', // #495057
				8: 'var(--mantine-color-gray-8)', // #343a40
				9: 'var(--mantine-color-gray-9)', // #212529
			},
			red: {
				0: 'var(--mantine-color-red-0)', // #fff5f5
				1: 'var(--mantine-color-red-1)', // #ffe3e3
				2: 'var(--mantine-color-red-2)', // #ffc9c9
				3: 'var(--mantine-color-red-3)', // #ffa8a8
				4: 'var(--mantine-color-red-4)', // #ff8787
				5: 'var(--mantine-color-red-5)', // #ff6b6b
				6: 'var(--mantine-color-red-6)', // #fa5252
				7: 'var(--mantine-color-red-7)', // #f03e3e
				8: 'var(--mantine-color-red-8)', // #e03131
				9: 'var(--mantine-color-red-9)', // #c92a2a
			},
			pink: {
				0: 'var(--mantine-color-pink-0)', // #fff0f6
				1: 'var(--mantine-color-pink-1)', // #ffdeeb
				2: 'var(--mantine-color-pink-2)', // #fcc2d7
				3: 'var(--mantine-color-pink-3)', // #faa2c1
				4: 'var(--mantine-color-pink-4)', // #f783ac
				5: 'var(--mantine-color-pink-5)', // #f06595
				6: 'var(--mantine-color-pink-6)', // #e64980
				7: 'var(--mantine-color-pink-7)', // #d6336c
				8: 'var(--mantine-color-pink-8)', // #c2255c
				9: 'var(--mantine-color-pink-9)', // #a61e4d
			},
			grape: {
				0: 'var(--mantine-color-grape-0)', // #f8f0fc
				1: 'var(--mantine-color-grape-1)', // #f3d9fa
				2: 'var(--mantine-color-grape-2)', // #eebefa
				3: 'var(--mantine-color-grape-3)', // #e599f7
				4: 'var(--mantine-color-grape-4)', // #da77f2
				5: 'var(--mantine-color-grape-5)', // #cc5de8
				6: 'var(--mantine-color-grape-6)', // #be4bdb
				7: 'var(--mantine-color-grape-7)', // #ae3ec9
				8: 'var(--mantine-color-grape-8)', // #9c36b5
				9: 'var(--mantine-color-grape-9)', // #862e9c
			},
			violet: {
				0: 'var(--mantine-color-violet-0)', // #f3f0ff
				1: 'var(--mantine-color-violet-1)', // #e5dbff
				2: 'var(--mantine-color-violet-2)', // #d0bfff
				3: 'var(--mantine-color-violet-3)', // #b197fc
				4: 'var(--mantine-color-violet-4)', // #9775fa
				5: 'var(--mantine-color-violet-5)', // #845ef7
				6: 'var(--mantine-color-violet-6)', // #7950f2
				7: 'var(--mantine-color-violet-7)', // #7048e8
				8: 'var(--mantine-color-violet-8)', // #6741d9
				9: 'var(--mantine-color-violet-9)', // #5f3dc4
			},
			indigo: {
				0: 'var(--mantine-color-indigo-0)', // #edf2ff
				1: 'var(--mantine-color-indigo-1)', // #dbe4ff
				2: 'var(--mantine-color-indigo-2)', // #bac8ff
				3: 'var(--mantine-color-indigo-3)', // #91a7ff
				4: 'var(--mantine-color-indigo-4)', // #748ffc
				5: 'var(--mantine-color-indigo-5)', // #5c7cfa
				6: 'var(--mantine-color-indigo-6)', // #4c6ef5
				7: 'var(--mantine-color-indigo-7)', // #4263eb
				8: 'var(--mantine-color-indigo-8)', // #3b5bdb
				9: 'var(--mantine-color-indigo-9)', // #364fc7
			},
			blue: {
				0: 'var(--mantine-color-blue-0)', // e7f5ff
				1: 'var(--mantine-color-blue-1)', // d0ebff
				2: 'var(--mantine-color-blue-2)', // a5d8ff
				3: 'var(--mantine-color-blue-3)', // 74c0fc
				4: 'var(--mantine-color-blue-4)', // 4dabf7
				5: 'var(--mantine-color-blue-5)', // 339af0
				6: 'var(--mantine-color-blue-6)', // 228be6
				7: 'var(--mantine-color-blue-7)', // 1c7ed6
				8: 'var(--mantine-color-blue-8)', // 1971c2
				9: 'var(--mantine-color-blue-9)', // 1864ab
			},
			cyan: {
				0: 'var(--mantine-color-cyan-0)', // #e3fafc
				1: 'var(--mantine-color-cyan-1)', // #c5f6fa
				2: 'var(--mantine-color-cyan-2)', // #99e9f2
				3: 'var(--mantine-color-cyan-3)', // #66d9e8
				4: 'var(--mantine-color-cyan-4)', // #3bc9db
				5: 'var(--mantine-color-cyan-5)', // #22b8cf
				6: 'var(--mantine-color-cyan-6)', // #15aabf
				7: 'var(--mantine-color-cyan-7)', // #1098ad
				8: 'var(--mantine-color-cyan-8)', // #0c8599
				9: 'var(--mantine-color-cyan-9)', // #0b7285
			},
			teal: {
				0: 'var(--mantine-color-teal-0)', //  #e6fcf5
				1: 'var(--mantine-color-teal-1)', //  #c3fae8
				2: 'var(--mantine-color-teal-2)', //  #96f2d7
				3: 'var(--mantine-color-teal-3)', //  #63e6be
				4: 'var(--mantine-color-teal-4)', //  #38d9a9
				5: 'var(--mantine-color-teal-5)', //  #20c997
				6: 'var(--mantine-color-teal-6)', //  #12b886
				7: 'var(--mantine-color-teal-7)', //  #0ca678
				8: 'var(--mantine-color-teal-8)', //  #099268
				9: 'var(--mantine-color-teal-9)', //  #087f5b
			},
			green: {
				0: 'var(--mantine-color-green-0)', // #ebfbee
				1: 'var(--mantine-color-green-1)', // #d3f9d8
				2: 'var(--mantine-color-green-2)', // #b2f2bb
				3: 'var(--mantine-color-green-3)', // #8ce99a
				4: 'var(--mantine-color-green-4)', // #69db7c
				5: 'var(--mantine-color-green-5)', // #51cf66
				6: 'var(--mantine-color-green-6)', // #40c057
				7: 'var(--mantine-color-green-7)', // #37b24d
				8: 'var(--mantine-color-green-8)', // #2f9e44
				9: 'var(--mantine-color-green-9)', // #2b8a3e
			},
			lime: {
				0: 'var(--mantine-color-lime-0)', // #f4fce3
				1: 'var(--mantine-color-lime-1)', // #e9fac8
				2: 'var(--mantine-color-lime-2)', // #d8f5a2
				3: 'var(--mantine-color-lime-3)', // #c0eb75
				4: 'var(--mantine-color-lime-4)', // #a9e34b
				5: 'var(--mantine-color-lime-5)', // #94d82d
				6: 'var(--mantine-color-lime-6)', // #82c91e
				7: 'var(--mantine-color-lime-7)', // #74b816
				8: 'var(--mantine-color-lime-8)', // #66a80f
				9: 'var(--mantine-color-lime-9)', // #5c940d
			},
			yellow: {
				0: 'var(--mantine-color-yellow-0)', // #fff9db
				1: 'var(--mantine-color-yellow-1)', // #fff3bf
				2: 'var(--mantine-color-yellow-2)', // #ffec99
				3: 'var(--mantine-color-yellow-3)', // #ffe066
				4: 'var(--mantine-color-yellow-4)', // #ffd43b
				5: 'var(--mantine-color-yellow-5)', // #fcc419
				6: 'var(--mantine-color-yellow-6)', // #fab005
				7: 'var(--mantine-color-yellow-7)', // #f59f00
				8: 'var(--mantine-color-yellow-8)', // #f08c00
				9: 'var(--mantine-color-yellow-9)', // #e67700
			},
			orange: {
				0: 'var(--mantine-color-orange-0)', // #fff4e6
				1: 'var(--mantine-color-orange-1)', // #ffe8cc
				2: 'var(--mantine-color-orange-2)', // #ffd8a8
				3: 'var(--mantine-color-orange-3)', // #ffc078
				4: 'var(--mantine-color-orange-4)', // #ffa94d
				5: 'var(--mantine-color-orange-5)', // #ff922b
				6: 'var(--mantine-color-orange-6)', // #fd7e14
				7: 'var(--mantine-color-orange-7)', // #f76707
				8: 'var(--mantine-color-orange-8)', // #e8590c
				9: 'var(--mantine-color-orange-9)', // #d9480f
			},
		},
	},
} satisfies Config
