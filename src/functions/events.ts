import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { HTTPResponse } from './bestsellers';

import { retrieveItemFromDb } from '../libs/dynamo';

export async function readEvent(
	event: APIGatewayProxyEvent,
): Promise<HTTPResponse> {
	try {
		const id = event.pathParameters?.id;
		if (id === null || id === undefined) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: 'Please insert an id.' }),
			};
		}

		const retrievedEvent = await retrieveItemFromDb(id);

		if (retrievedEvent === null || retrievedEvent === undefined) {
			return {
				statusCode: 404,
				body: JSON.stringify({ message: 'Event not found' }),
			};
		}

		return { statusCode: 200, body: JSON.stringify({ retrievedEvent }) };
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: 'Internal Server Error. Please try again later.',
			}),
		};
	}
}
