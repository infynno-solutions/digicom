import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProductInfo from "@/components/product/product-info";
import { buttonVariants } from "@/components/ui/button";
import { getProductData } from "@/data/get-product";
import { cn } from "@/lib/utils";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export const generateMetadata = async ({
  params: { id },
}: ProductPageProps): Promise<Metadata> => {
  const idArray = id.split("-");
  const productId = idArray[idArray.length - 1] as string;
  try {
    const product = await getProductData(productId);

    return {
      title: product.title,
      description: product.description,
    };
  } catch (e) {
    return redirect("/404");
  }
};

const ProductPage = async ({ params: { id } }: ProductPageProps) => {
  const idArray = id.split("-");
  const productId = idArray[idArray.length - 1] as string;
  const product = await getProductData(productId);

  return (
    <div className="container mx-auto">
      <div className="my-8 overflow-hidden rounded-xl border lg:my-16">
        <div className="h-40 bg-gray-100 lg:h-80" />
        <div className="flex flex-col border-t md:flex-row">
          <ProductInfo product={product} />
          <div className="p-4 md:w-1/3 md:p-6 lg:p-8">
            <Link
              className={cn(
                "w-full",
                buttonVariants({ variant: "default", size: "lg" }),
              )}
              href={`/product/${productId}/checkout`}
            >
              I want this!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
