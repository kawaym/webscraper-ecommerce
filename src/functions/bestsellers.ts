import { extractAmazonBestsellingProductsInformation } from '../libs/extracts';
import { accessPage, createBrowser } from '../libs/puppeteer';

import type {
	BestsellingProductsInfo,
	ProductCarouselInfo,
	ProductInfo,
} from '../libs/extracts';
import type { APIGatewayProxyEvent } from 'aws-lambda';

import { insertItemIntoDb } from '../libs/dynamo';
import { chooseService } from '../libs/utils';

export async function allBestsellers(
	event: APIGatewayProxyEvent,
): Promise<BestsellingProductsInfo> {
	const service = chooseService(event.queryStringParameters?.service);

	const browser = await createBrowser();
	const page = await accessPage(browser, service);

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

	await insertItemIntoDb(bestSellingProductsInfo);

	return bestSellingProductsInfo;
}

export async function bestsellers(
	event: APIGatewayProxyEvent,
): Promise<ProductInfo[]> {
	const service = chooseService(event.queryStringParameters?.service);

	const browser = await createBrowser();
	const page = await accessPage(browser, service);

	await page.exposeFunction(
		'extractAmazonBestsellingProductsInformation',
		(carousel: HTMLDivElement) =>
			extractAmazonBestsellingProductsInformation(carousel),
	);

	const bestSellingProductsInfo = await page.$eval(
		'div#zg_left_col1',
		extractAmazonBestsellingProductsInformation,
	);

	const bestsellers: ProductInfo[] = [];

	const firstCarousel: ProductCarouselInfo =
		bestSellingProductsInfo.productsSortedByCategory[0];

	for (let i = 0; i < 3; i++) {
		// eslint-disable-next-line security/detect-object-injection
		bestsellers.push(firstCarousel.products[i]);
	}

	await browser.close();

	await insertItemIntoDb(bestsellers);

	return bestsellers;
}
