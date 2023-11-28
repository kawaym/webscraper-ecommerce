export function chooseService(service: string | undefined | null): string {
	if (service === 'americanas') {
		return 'https://www.americanas.com.br/';
	}
	return 'https://www.amazon.com.br/bestsellers';
}
