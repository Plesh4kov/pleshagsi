module.exports = {
    async redirects() {
        return [
            {
                source: '/scoreboard',
                destination: '/api/scoreboard',
                permanent: true,
            },
        ];
    },
};
