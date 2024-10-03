import * as yup from 'yup'

export async function yupAction<T extends yup.Schema>(
	request: Request,
	schema: T,
	type: 'form-data' | 'search-params',
): Promise<yup.InferType<T>> {
	let data: any = null

	if (type === 'form-data') {
		const formData = await request.formData()
		data = Object.fromEntries(formData)
	}

	if (type === 'search-params') {
		const { searchParams } = new URL(request.url)
		data = Object.fromEntries(searchParams)
	}

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
