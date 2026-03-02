import React, { MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../../hooks/useCart';
import { useSelectedProduct } from '../../hooks/useSelectedProduct';
import { FragmentType, graphql, readFragment } from '@/gql';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const ProductCardFragment = graphql(`
  fragment ProductCardFragment on Product {
    id
    name
    price
    imageUrl
    description
    stock
  }
`);

type Props = {
  data: FragmentType<typeof ProductCardFragment>;
};

export const ProductCard = ({ data }: Props) => {
  const product = readFragment(ProductCardFragment, data);
  const { isInCart, getCartItemQuantity } = useCart();
  const { selectProduct } = useSelectedProduct();
  const router = useRouter();
  const handleSelectProduct = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    selectProduct(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: getCartItemQuantity(product.id),
        description: product.description || '',
      },
      1
    );
    router.push('/quantity');
  };
  const cartQuantity = getCartItemQuantity(product.id);
  const inCart = isInCart(product.id);

  return (
    <Link href={`/products/detail?productId=${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
          {inCart ? (
            <Badge className="absolute top-2 right-2">カート内: {cartQuantity}個</Badge>
          ) : null}
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>

          {product.description ? (
            <p className="text-gray-600 text-sm mb-3">{product.description}</p>
          ) : null}

          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-900">
              ¥{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">在庫: {product.stock}個</span>
          </div>

          <Button onClick={handleSelectProduct} disabled={product.stock === 0} className="w-full">
            {product.stock === 0 ? '在庫切れ' : '購入数を選択'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};
