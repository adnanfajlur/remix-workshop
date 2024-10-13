import pino from 'pino'

const baseConfig = {
	level: process.env.LOG_LEVEL || 'info',
}

const devConfig = {
	...baseConfig,
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
}

export const logger = pino(process.env.NODE_ENV === 'development' ? devConfig : baseConfig)
