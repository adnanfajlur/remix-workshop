import { expect } from '@playwright/test'
import { appTest } from './utils/app-test'

appTest('Should show todo page', async ({ page }) => {
	await page.goto('/todo')

	await expect(page).toHaveTitle('Todo - Remix workshop')
	await expect(page).toHaveURL('/todo')
})
