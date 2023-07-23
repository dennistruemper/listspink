/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				fadein: 'fadein 0.2s ease-out'
			},
			keyframes: {
				fadein: {
					'0%': { transform: 'scale(0.0)' },
					'5%': { transform: 'scale(0.4)' },
					'10%': { transform: 'scale(0.6)' },
					'20%': { transform: 'scale(0.7)' },
					'100%': { transform: 'scale(1)' }
				}
			}
		}
	},

	plugins: [require('@tailwindcss/forms')]
};
