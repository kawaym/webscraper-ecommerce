export interface ProductInfo {
	productName: string;
	productImg: string;
	productPrice: number;
	productUrl: string;
}

export interface ProductCarouselInfo {
	category: string;
	products: ProductInfo[];
}

export interface BestsellingProductsInfo {
	baseUrl: string;
	accessDate: string;
	productsSortedByCategory: ProductCarouselInfo[];
}

export function extractAmazonBestsellingProductsInformation(
	bestsellingContainer: HTMLDivElement,
): BestsellingProductsInfo {
	const extractCarousel = (carousel: HTMLDivElement): ProductCarouselInfo => {
		const extractCard = (card: HTMLLIElement): ProductInfo => {
			const productName: string =
				card?.querySelector('a > span > div')?.innerHTML ?? 'productName';
			const productImg: string =
				card?.querySelector('div > img')?.getAttribute('src') ?? 'productImg';
			const producPriceExtract: string =
				card.querySelector('div > span > span')?.innerHTML.trim() ?? '0';
			const productPrice: number =
				parseInt(
					producPriceExtract?.substring(8).replace(',', '').replace('.', ''),
				) ?? 0;
			const productUrl: string = card.querySelector('a')?.href ?? 'productUrl';
			return { productName, productImg, productPrice, productUrl };
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
	};

	const baseUrl = bestsellingContainer.baseURI;
	const accessDate = bestsellingContainer.ownerDocument.lastModified;

	console.log(accessDate);

	const carouselsRaw: NodeListOf<HTMLDivElement> =
		bestsellingContainer?.querySelectorAll('div.a-carousel-container');

	const carousels: ProductCarouselInfo[] = [];

	carouselsRaw.forEach((carousel) => {
		carousels.push(extractCarousel(carousel));
	});

	return { baseUrl, accessDate, productsSortedByCategory: carousels };
}
