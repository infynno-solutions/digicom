import Link from "next/link";

interface ProductInfoProps {
  product: any;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="md:w-2/3 md:border-r">
      <h1 className="border-b p-4 text-2xl font-semibold md:p-6 md:text-3xl lg:p-8 lg:text-4xl">
        {product.title}
      </h1>
      <div className="flex items-center border-b">
        <div className="p-4 md:px-6 lg:px-8">
          {product.currency} {product.price}
        </div>
        <div className="flex items-center gap-2 border-l border-r p-4 md:px-6 lg:px-8">
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <Link
            className="text-foreground underline"
            href={`/user/${product.user.id}`}
          >
            {product.user.name}
          </Link>
        </div>
      </div>
      <div className="p-4 text-foreground md:p-6 lg:p-8">
        {product.description}
      </div>
    </div>
  );
};

export default ProductInfo;
