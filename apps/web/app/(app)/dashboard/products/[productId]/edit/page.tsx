import EditProductForm from "@/components/product/edit-product-form";

interface EditProductProps {
  params: {
    productId: string;
  };
}

const EditProduct = ({ params: { productId } }: EditProductProps) => {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <EditProductForm productId={productId} />
    </div>
  );
};

export default EditProduct;
