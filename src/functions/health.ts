interface Message {
	message: string;
	body: any;
}

export async function health(event): Promise<Message> {
	return {
		message: 'Your app is working successfully',
		body: event,
	};
}
