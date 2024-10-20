import { expect, test } from '@playwright/test'
import { serverEnv } from '~/configs/server-env.server'

test('Should show auth page', async ({ page }) => {
	await page.goto('/')

	await expect(page).toHaveTitle('Auth - Remix workshop')
	await expect(page).toHaveURL('/auth')
})
