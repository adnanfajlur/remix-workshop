import * as yup from 'yup'

export async function yupAction<T extends yup.Schema>(
	request: Request,
	schema: T,
): Promise<yup.InferType<T> | { message: string; errors: string[] }> {
	const formData = await request.formData()
	const data = Object.fromEntries(formData)

	try {
		const validatedData = await schema.validate(data, { abortEarly: false })
		return validatedData
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return { message: 'Validation error', errors: error.errors }
		}

		throw error
	}
}
