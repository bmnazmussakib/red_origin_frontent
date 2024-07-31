// const { i18n } = require('./next-i18next.config');
const withPWA = require('next-pwa')({
    dest: 'public'
})

const nextConfig = withPWA({
    reactStrictMode: false,
    swcMinify: true,
    // i18n,
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: '**',
        },
        {
            protocol: 'http',
            hostname: '**',
        },
        ],
    },
    generateBuildId: async () => {
        return 'mediasoft-build';
    },
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
    },
});

module.exports = nextConfig;