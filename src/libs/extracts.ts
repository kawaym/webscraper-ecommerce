import type { Page } from 'puppeteer-core';

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

export async function extractBestsellingProducts(
	page: Page,
	service: string,
): Promise<BestsellingProductsInfo> {
	let bestSellingProductsInfo: BestsellingProductsInfo;

	if (service === 'americanas') {
		await page.exposeFunction(
			'extractAmericanasBestsellingProductsInformation',
			(carousel: HTMLDivElement) =>
				extractAmericanasBestsellingProductsInformation(carousel),
		);

		bestSellingProductsInfo = await page.$eval(
			'div',
			extractAmericanasBestsellingProductsInformation,
		);

		return bestSellingProductsInfo;
	}
	await page.exposeFunction(
		'extractAmazonBestsellingProductsInformation',
		(carousel: HTMLDivElement) =>
			extractAmazonBestsellingProductsInformation(carousel),
	);

	bestSellingProductsInfo = await page.$eval(
		'div#zg_left_col1',
		extractAmazonBestsellingProductsInformation,
	);

	return bestSellingProductsInfo;
}

export function extractAmericanasBestsellingProductsInformation(
	bestsellingContainer: HTMLDivElement,
): BestsellingProductsInfo {
	const extractCarousel = (carousel: HTMLDivElement): ProductCarouselInfo => {
		const extractCard = (card: HTMLDivElement): ProductInfo => {
			const productName: string =
				card?.querySelector('h3')?.innerText ?? 'productName';
			const productImg: string =
				card?.querySelector('img')?.getAttribute('src') ?? 'productImg';
			const productPriceExtract: string =
				card.querySelector('[class*="price"] > span')?.innerHTML.trim() ?? '0';
			const productPrice: number =
				parseInt(
					productPriceExtract?.substring(3).replace(',', '').replace('.', ''),
				) ?? 0;
			const productUrl: string = card.querySelector('a')?.href ?? 'productUrl';

			return { productName, productImg, productPrice, productUrl };
		};

		const category: string =
			carousel.querySelector('h2')?.innerText ?? 'category';

		const productsRaw: NodeListOf<HTMLDivElement> =
			carousel?.querySelectorAll('div.card');

		const products: ProductInfo[] = [];

		productsRaw.forEach((card) => {
			products.push(extractCard(card));
		});

		return { category, products };
	};

	const baseUrl = bestsellingContainer.baseURI;
	const accessDate = bestsellingContainer.ownerDocument.lastModified;

	const carouselsRaw: NodeListOf<HTMLDivElement> =
		bestsellingContainer?.querySelectorAll('[data-position*="home_page.rr"]');

	const carousels: ProductCarouselInfo[] = [];

	carouselsRaw.forEach((carousel) => {
		carousels.push(extractCarousel(carousel));
	});

	return { baseUrl, accessDate, productsSortedByCategory: carousels };
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

	const carouselsRaw: NodeListOf<HTMLDivElement> =
		bestsellingContainer?.querySelectorAll('div.a-carousel-container');

	const carousels: ProductCarouselInfo[] = [];

	carouselsRaw.forEach((carousel) => {
		carousels.push(extractCarousel(carousel));
	});

	return { baseUrl, accessDate, productsSortedByCategory: carousels };
}
