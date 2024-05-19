"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import { useState } from "react";
import ListProduct from "./list-product";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(1);
    setProducts((prev) => [...prev, ...newProducts]);
    setIsLoading(false);
  };
  return <div className="flex flex-col gap-5 p-5">
    {products.map((product) => (
      <ListProduct key={product.id} {...product} />
    ))}
    <button className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95" onClick={onLoadMoreClick} disabled={isLoading}>{ isLoading ? "로딩 중": "Load more"}</button>
  </div>;
}