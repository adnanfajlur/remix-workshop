import { expect } from '@playwright/test'
import { appTest } from './utils/app-test'

appTest('Should show chat page', async ({ page }) => {
	await page.goto('/')

	await expect(page).toHaveTitle('Chat - Remix workshop')
	await expect(page).toHaveURL('/')
})
