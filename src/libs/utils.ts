export function chooseService(service: string | undefined | null): string {
	if (service === 'americanas') {
		return 'https://www.americanas.com.br/';
	}
	if (service === 'magalu') {
		return 'https://www.magazineluiza.com.br/';
	}
	if (service === 'amazon' || service === undefined || service === null) {
		return 'https://www.amazon.com.br/bestsellers';
	}

	throw new Error('Service not found, please try again');
}

export function chooseLimit(limit: string | undefined | null): number {
	if (limit === undefined || limit === null) {
		return 3;
	} else {
		const number = parseInt(limit);
		if (number === 0) {
			return 3;
		} else {
			return number;
		}
	}
}
