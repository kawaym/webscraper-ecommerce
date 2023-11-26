export interface ProductInfo {
	productName: string;
	productImg: string;
	productPrice: number;
}

export interface ProductCarouselInfo {
	category: string;
	products: ProductInfo[];
}

export function extractAmazonCarouselInformation(
	carousel: HTMLDivElement,
): ProductCarouselInfo {
	const extractCard = (card: HTMLLIElement): ProductInfo => {
		const productName: string =
			card?.querySelector('a > span > div')?.innerHTML ?? 'productName';
		const productImg: string =
			card?.querySelector('div > img')?.getAttribute('src') ?? 'productImg';
		const producPriceExtract: string =
			card.querySelector('div > span > span')?.innerHTML.trim() ?? '0';
		const productPrice: number =
			parseInt(producPriceExtract?.substring(8).replace(',', '')) ?? 0;
		return { productName, productImg, productPrice };
	};

	const category: string =
		carousel?.querySelector('h2')?.innerText.substring(17) ?? 'category';

	const productsRaw: NodeListOf<HTMLLIElement> =
		carousel?.querySelectorAll('li.a-carousel-card');

	const products: ProductInfo[] = [];

	productsRaw.forEach((card) => {
		products.push(extractCard(card));
	});

	return { category, products };
}
