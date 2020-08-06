import pino from 'pino';
import { logflarePinoVercel } from 'pino-logflare';

// create pino-logflare console stream for serverless functions and send function for browser logs
const { stream } = logflarePinoVercel({
    apiKey: process.env.LOGFLARE_API_KEY || 'LOGFLARE_API_KEY not set',
    sourceToken: process.env.LOGLFARE_SOURCE_TOKEN || 'LOGLFARE_SOURCE_TOKEN not set',
});

// create pino loggger
const logger = pino({
    level: 'debug',
    base: {
        env: process.env.ENV || 'ENV not set',
        revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
}, stream);

export default logger;
