import { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/product/checkout-button";
import ProductInfo from "@/components/product/product-info";
import { getProductData } from "@/data/get-product";
import { getCurrentUser } from "@/lib/session";

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

const CheckoutPage = async ({ params: { id } }: ProductPageProps) => {
  const idArray = id.split("-");
  const productId = idArray[idArray.length - 1] as string;
  const product = await getProductData(productId);
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto">
      <div className="my-8 rounded-xl border lg:my-16">
        <div className="h-40 lg:h-80" />
        <div className="flex flex-col border-t md:flex-row">
          <ProductInfo product={product} />
          <CheckoutForm product={product} user={user} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
