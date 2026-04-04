'use client';

import {Button} from '@/components/ui/button'
export function AddToCartButton({product}: {product: string}) {
    function addToCart(product: string){
        fetch('/api/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: product }),
        });
    }
  return <Button onClick={()=>addToCart(product)}>Add to Cart</Button>;
}