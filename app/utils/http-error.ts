import { StatusCode } from './http-status'

const httpErrors: Record<string, { status: StatusCode; message?: string }> = {
	UNAUTHORIZED: { status: 401, message: 'Unauthorized' },
}

type HttpErrorOpts = {
	res?: Response
	message?: string
	cause?: unknown
}

export class HttpError extends Error {
	readonly res?: Response
	readonly status: StatusCode
	readonly code: keyof typeof httpErrors
	readonly message: string

	constructor(code: keyof typeof httpErrors, options?: HttpErrorOpts) {
		const item = httpErrors[code]
		const message = options?.message || item.message || item.status.toString()

		super(message, { cause: options?.cause })

		this.res = options?.res
		this.status = item.status
		this.code = code
		this.message = message
	}

	getResponse(): Response {
		if (this.res) {
			const newResponse = new Response(this.res.body, {
				status: this.status,
				headers: this.res.headers,
			})

			return newResponse
		}

		return Response.json(
			{ code: this.code, message: this.message },
			{ status: this.status },
		)
	}
}
