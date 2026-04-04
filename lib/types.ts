export type Product={
id: string,
name:string,
slug: string,
description: string,
price: number,
currency:string,
category: string,
images: string[],
tags: string[],
featured: boolean,
createdAt: string
};

//Make these types more consistent 
export type FeaturedProductData = {
    success: boolean,
    data: Product[]
}

export type ProductResponse = {
    success: boolean,
    data: Product
}

export type ProductStock = {
    data:{
        productId:string,
        stock:number,
        inStock:boolean,
        lowStock:boolean
    }
}

