import { extractAmazonBestsellingProductsInformation } from '../libs/extracts';
import { accessPage, createBrowser } from '../libs/puppeteer';

import type { BestsellingProductsInfo } from '../libs/extracts';

export async function bestsellers(): Promise<BestsellingProductsInfo> {
	const browser = await createBrowser();
	const page = await accessPage(
		browser,
		'https://www.amazon.com.br/bestsellers',
	);

	await page.exposeFunction(
		'extractAmazonBestsellingProductsInformation',
		(carousel: HTMLDivElement) =>
			extractAmazonBestsellingProductsInformation(carousel),
	);

	const bestSellingProductsInfo = await page.$eval(
		'div#zg_left_col1',
		extractAmazonBestsellingProductsInformation,
	);

	await browser.close();

	return bestSellingProductsInfo;
}
