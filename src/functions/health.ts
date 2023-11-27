interface Message {
	message: string;
	body: any;
}

// @ts-expect-error: Ignores the any type of event

export async function health(event): Promise<Message> {
	return {
		message: 'Your app is working successfully',
		body: event,
	};
}
