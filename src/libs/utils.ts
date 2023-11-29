export function chooseService(service: string | undefined | null): string {
	if (service === 'americanas') {
		return 'https://www.americanas.com.br/';
	}
	if (service === 'amazon' || service === undefined || service === null) {
		return 'https://www.amazon.com.br/bestsellers';
	}

	throw new Error('Service not found, please try again');
}
