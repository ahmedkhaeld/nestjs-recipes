module.exports = {
    apps: [{
        name: "nestjs-recipes",
        script: "./dist/src/main.js",
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "dev"
        }
    }]
}