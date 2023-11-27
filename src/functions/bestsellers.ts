import { extractAmazonBestsellingProductsInformation } from '../libs/extracts';
import { accessPage, createBrowser } from '../libs/puppeteer';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';

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

	const dynamoDb = new AWS.DynamoDB.DocumentClient();
	const TABLE_NAME = process.env.DYNAMODB_BESTSELLINGPRODUCTS_TABLE;

	if (TABLE_NAME === null || TABLE_NAME === undefined) {
		throw new Error('dynamodb table missing');
	}
	const putParams = {
		TableName: TABLE_NAME,
		Item: {
			productsId: uuidv4(),
			BestsellingProducts: bestSellingProductsInfo,
		},
	};

	await dynamoDb.put(putParams).promise();

	return bestSellingProductsInfo;
}
