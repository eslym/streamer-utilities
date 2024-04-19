/** @type {import('tailwindcss').Config}*/
const config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {}
    },

    plugins: [require('rippleui'), require('@tailwindcss/typography'), require('@tailwindcss/container-queries')]
};

module.exports = config;
