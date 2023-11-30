import { extractBestsellingProducts } from '../libs/extracts';
import { accessPage, createBrowser } from '../libs/puppeteer';

import type { ProductCarouselInfo, ProductInfo } from '../libs/extracts';
import type { APIGatewayProxyEvent } from 'aws-lambda';

import { insertItemIntoDb } from '../libs/dynamo';
import { chooseLimit, chooseService } from '../libs/utils';

export interface HTTPResponse {
	statusCode: 200 | 404 | 400 | 500;
	body?: string;
}

export async function allBestsellers(
	event: APIGatewayProxyEvent,
): Promise<HTTPResponse> {
	const baseUrl = chooseService(event.queryStringParameters?.service);

	const browser = await createBrowser();
	const page = await accessPage(browser, baseUrl);

	let response: HTTPResponse = { statusCode: 200, body: '' };
	try {
		const bestSellingProductsInfo = await extractBestsellingProducts(
			page,
			baseUrl,
		);

		const id = await insertItemIntoDb(bestSellingProductsInfo);

		response = {
			statusCode: 200,
			body: JSON.stringify({ eventId: id, bestSellingProductsInfo }),
		};
	} catch (error) {
		let message: string;
		if (error instanceof Error) {
			message = error.message;
			if (message === 'Service not found, please try again') {
				response = {
					statusCode: 400,
					body: JSON.stringify({ message }),
				};
			} else if (message.startsWith('net::ERR')) {
				response = {
					statusCode: 404,
					body: JSON.stringify({
						message:
							'Error connecting to the chosen service, please contact support',
					}),
				};
			} else {
				response = {
					statusCode: 500,
					body: JSON.stringify({
						message,
					}),
				};
			}
		} else {
			response = {
				statusCode: 500,
				body: JSON.stringify({
					message: 'Internal Server Error. Please try again later.',
				}),
			};
		}
	} finally {
		await browser.close();
	}
	return response;
}

export async function bestsellers(
	event: APIGatewayProxyEvent,
): Promise<HTTPResponse> {
	const baseUrl = chooseService(event.queryStringParameters?.service);
	const limit = chooseLimit(event.queryStringParameters?.limit);

	const browser = await createBrowser();
	const page = await accessPage(browser, baseUrl);

	let response: HTTPResponse = { statusCode: 200, body: '' };
	try {
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

		const id = await insertItemIntoDb(bestsellers);

		response = {
			statusCode: 200,
			body: JSON.stringify({ eventId: id, bestsellers }),
		};
	} catch (error) {
		let message: string;
		if (error instanceof Error) {
			message = error.message;
			if (message === 'Service not found, please try again') {
				response = {
					statusCode: 400,
					body: JSON.stringify({ message }),
				};
			} else if (message.startsWith('net::ERR')) {
				response = {
					statusCode: 404,
					body: JSON.stringify({
						message:
							'Error connecting to the chosen service, please contact support',
					}),
				};
			} else {
				response = {
					statusCode: 500,
					body: JSON.stringify({
						message,
					}),
				};
			}
		} else {
			response = {
				statusCode: 500,
				body: JSON.stringify({
					message: 'Internal Server Error. Please try again later.',
				}),
			};
		}
	} finally {
		await browser.close();
	}

	return response;
}
