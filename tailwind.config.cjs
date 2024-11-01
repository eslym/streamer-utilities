/** @type {import('tailwindcss').Config}*/
const config = {
    content: ['./src/**/*.{html,js,svelte,ts,md,svx,mdx}'],

    theme: {
        extend: {}
    },

    plugins: [
        require('rippleui'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/container-queries'),
        require('tailwind-scrollbar')
    ]
};

module.exports = config;
