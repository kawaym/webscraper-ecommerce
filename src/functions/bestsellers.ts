import { extractAmazonCarouselInformation } from '../libs/extracts';
import { accessPage, createBrowser } from '../libs/puppeteer';

import type { ProductCarouselInfo } from '../libs/extracts';

export async function bestsellers(): Promise<ProductCarouselInfo> {
	const browser = await createBrowser();
	const page = await accessPage(
		browser,
		'https://www.amazon.com.br/bestsellers',
	);

	await page.exposeFunction('extractAmazonCarouselInformation', (carousel) =>
		extractAmazonCarouselInformation(carousel),
	);

	const bestSellingCarousel = await page.$eval(
		'div#zg_left_col1 > div',
		extractAmazonCarouselInformation,
	);

	await browser.close();

	return bestSellingCarousel;
}
