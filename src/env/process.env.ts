import * as process from 'process';

export const ProcessEnv =() => ({
    port : parseInt(process.env.PORT,10) || 3000,
    appName : process.env.APP_NAME,
    nodeEnv : process.env.NODE_ENV,
    mongodb: {
        connectionUrl : process.env.MONGODB_CONNECTION_URL,
        mongooseDebug: Boolean(process.env.MONGODB_DEBUG|| true),
    },

})