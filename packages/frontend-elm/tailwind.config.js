/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,elm,ts,css,html}', '.elm-land/**/*.{js,elm,ts,css,html}'],
	theme: {},
	plugins: [require('@tailwindcss/forms')]
};
