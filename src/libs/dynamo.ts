import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';

export async function insertItemIntoDb(item: any): Promise<string> {
	const id = uuidv4();
	const dynamoDb = new AWS.DynamoDB.DocumentClient();
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

	await dynamoDb.put(putParams).promise();

	return id;
}
