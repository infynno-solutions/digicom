"use client";

import { LuLoader } from "react-icons/lu";
import ProductForm from "./product-form";
import { useGetProduct } from "@/hooks/product/use-get-product";

interface EditProductFormProps {
  productId: string;
}

const EditProductForm = ({ productId }: EditProductFormProps) => {
  const { data, isLoading } = useGetProduct(productId);
  const product = data?.data?.product;

  if (isLoading) {
    return <LuLoader className="h-6 w-6 animate-spin" />;
  }

  return <ProductForm product={product} />;
};

export default EditProductForm;
