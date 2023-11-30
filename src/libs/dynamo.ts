import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import type { BestsellingProductsInfo, ProductInfo } from './extracts';

export interface event {
	eventId: string;
	bestSellingProductsInfo?: BestsellingProductsInfo;
	bestsellers?: ProductInfo[];
}

async function setupDb(): Promise<AWS.DynamoDB.DocumentClient> {
	const stage = process.env.STAGE;

	if (stage === 'local') {
		return new AWS.DynamoDB.DocumentClient({
			endpoint: 'http://localhost:8000',
		});
	}

	return new AWS.DynamoDB.DocumentClient();
}

export async function insertItemIntoDb(item: any): Promise<string> {
	const db = await setupDb();
	const id = uuidv4();
	const TABLE_NAME = process.env.DYNAMODB_BESTSELLINGPRODUCTS_TABLE;
	if (TABLE_NAME === null || TABLE_NAME === undefined) {
		throw new Error('dynamodb table missing');
	}
	const putParams = {
		TableName: TABLE_NAME,
		Item: {
			eventId: id,
			item,
		},
	};
	await db.put(putParams).promise();

	return id;
}

export async function retrieveItemFromDb(eventId: string): Promise<event> {
	const db = await setupDb();
	const TABLE_NAME = process.env.DYNAMODB_BESTSELLINGPRODUCTS_TABLE;
	if (TABLE_NAME === null || TABLE_NAME === undefined) {
		throw new Error('dynamodb table missing');
	}

	const getParams = {
		TableName: TABLE_NAME,
		Key: {
			eventId,
		},
	};

	const event = await db.get(getParams).promise();

	return event.Item as event;
}
