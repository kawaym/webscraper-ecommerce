import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { HTTPResponse } from './bestsellers';

import { retrieveItemFromDb } from '../libs/dynamo';

export async function readEvent(
	event: APIGatewayProxyEvent,
): Promise<HTTPResponse> {
	let response: HTTPResponse = { statusCode: 200, body: '' };
	try {
		const id = event.pathParameters?.id;
		if (id === null || id === undefined) {
			response = {
				statusCode: 400,
				body: JSON.stringify({ message: 'Please insert an id.' }),
			};
			return response;
		}

		const retrievedEvent = await retrieveItemFromDb(id);

		if (retrievedEvent === null || retrievedEvent === undefined) {
			response = {
				statusCode: 404,
				body: JSON.stringify({ message: 'Event not found' }),
			};
		}

		return { statusCode: 200, body: JSON.stringify({ retrievedEvent }) };
	} catch (error) {
		response = {
			statusCode: 500,
			body: JSON.stringify({
				message: 'Internal Server Error. Please try again later.',
			}),
		};
	}

	return response;
}
