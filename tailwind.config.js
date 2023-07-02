/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: colors.fuchsia,
				primaryDark: colors.purple,
				secondary: colors.purple,
				secondaryDark: colors.fuchsia,
				neutral: colors.gray,
				background: colors.pink,
				backgroundDark: colors.purple
			}
		}
	},
	plugins: []
};
