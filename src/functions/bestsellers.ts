import { extractBestsellingProducts } from '../libs/extracts';
import { accessPage, createBrowser } from '../libs/puppeteer';

import type { ProductCarouselInfo, ProductInfo } from '../libs/extracts';
import type { APIGatewayProxyEvent } from 'aws-lambda';

import { insertItemIntoDb } from '../libs/dynamo';
import { chooseLimit, chooseService } from '../libs/utils';

interface HTTPResponse {
	statusCode: 200 | 404 | 400 | 500;
	body?: string;
}

export async function allBestsellers(
	event: APIGatewayProxyEvent,
): Promise<HTTPResponse> {
	try {
		const baseUrl = chooseService(event.queryStringParameters?.service);

		const browser = await createBrowser();
		const page = await accessPage(browser, baseUrl);

		const bestSellingProductsInfo = await extractBestsellingProducts(
			page,
			baseUrl,
		);

		await browser.close();

		const id = await insertItemIntoDb(bestSellingProductsInfo);

		return {
			statusCode: 200,
			body: JSON.stringify({ eventId: id, bestSellingProductsInfo }),
		};
	} catch (error) {
		let message: string;
		if (error instanceof Error) {
			message = error.message;
			if (message === 'Service not found, please try again') {
				return {
					statusCode: 400,
					body: JSON.stringify({ message }),
				};
			} else if (message.startsWith('net::ERR')) {
				return {
					statusCode: 404,
					body: JSON.stringify({
						message:
							'Error connecting to the chosen service, please contact support',
					}),
				};
			} else {
				return {
					statusCode: 500,
					body: JSON.stringify({
						message,
					}),
				};
			}
		} else {
			return {
				statusCode: 500,
				body: JSON.stringify({
					message: 'Internal Server Error. Please try again later.',
				}),
			};
		}
	}
}

export async function bestsellers(
	event: APIGatewayProxyEvent,
): Promise<HTTPResponse> {
	try {
		const baseUrl = chooseService(event.queryStringParameters?.service);
		const limit = chooseLimit(event.queryStringParameters?.limit);

		const browser = await createBrowser();
		const page = await accessPage(browser, baseUrl);

		const bestSellingProductsInfo = await extractBestsellingProducts(
			page,
			baseUrl,
		);

		const bestsellers: ProductInfo[] = [];

		const firstCarousel: ProductCarouselInfo =
			bestSellingProductsInfo.productsSortedByCategory[0];

		let i = 0;
		while (i < limit) {
			// eslint-disable-next-line security/detect-object-injection
			bestsellers.push(firstCarousel.products[i]);
			i++;
		}

		await browser.close();

		const id = await insertItemIntoDb(bestsellers);

		return {
			statusCode: 200,
			body: JSON.stringify({ eventId: id, bestsellers }),
		};
	} catch (error) {
		let message: string;
		if (error instanceof Error) {
			message = error.message;
			if (message === 'Service not found, please try again') {
				return {
					statusCode: 400,
					body: JSON.stringify({ message }),
				};
			} else if (message.startsWith('net::ERR')) {
				return {
					statusCode: 404,
					body: JSON.stringify({
						message:
							'Error connecting to the chosen service, please contact support',
					}),
				};
			} else {
				return {
					statusCode: 500,
					body: JSON.stringify({
						message,
					}),
				};
			}
		} else {
			return {
				statusCode: 500,
				body: JSON.stringify({
					message: 'Internal Server Error. Please try again later.',
				}),
			};
		}
	}
}
