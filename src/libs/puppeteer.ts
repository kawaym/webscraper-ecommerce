import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

import type { Browser, Page } from 'puppeteer-core';

export async function createBrowser(): Promise<Browser> {
	const browser = await puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath(),
		headless: chromium.headless,
		ignoreHTTPSErrors: true,
	});

	return browser;
}

export async function accessPage(browser: Browser, url: string): Promise<Page> {
	const page = await browser.newPage();

	await page.goto(url, { waitUntil: 'domcontentloaded' });

	return page;
}
