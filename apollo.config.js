module.exports = {
    client: {
            includes: ['./src/client/**/*.tsx', './src/client/**/*.ts'],
            tagName: 'gql',
            service: {
                name: 'duber-eats-backend',
                url: 'http://localhost:4000/graphql',
            }
    }
}
