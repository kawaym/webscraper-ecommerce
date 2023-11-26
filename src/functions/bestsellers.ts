import { extractAmazonCardInformation } from '../libs/extracts';
import { accessPage, createBrowser } from '../libs/puppeteer';

import type { ProductInfo } from '../libs/extracts';

export async function bestsellers(event): Promise<ProductInfo> {
	const browser = await createBrowser();
	const page = await accessPage(
		browser,
		'https://www.amazon.com.br/bestsellers',
	);

	const productInfo = await page.$eval(
		'li.a-carousel-card',
		extractAmazonCardInformation,
	);

	await browser.close();

	return productInfo;
}
