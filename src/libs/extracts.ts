export interface ProductInfo {
	productName: string;
	productImg: string;
	productPrice: number;
}

export function extractAmazonCardInformation(card: HTMLLIElement): ProductInfo {
	// console.log(card);
	const productName: string =
		card?.querySelector('a > span > div')?.innerHTML ?? 'productName';
	const productImg: string =
		card?.querySelector('div > img')?.getAttribute('src') ?? 'productImg';
	const producPriceExtract: string =
		card.querySelector('div > span > span')?.innerHTML.trim() ?? '0';
	const productPrice: number =
		parseInt(producPriceExtract?.substring(8).replace(',', '')) ?? 0;
	// const productName = 'productName';
	// const productImg = 'productImg';
	// const productPrice = 0;
	return { productName, productImg, productPrice };
}
