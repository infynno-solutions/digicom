import Link from "next/link";
import { LuChevronLeft } from "react-icons/lu";
import ProductForm from "@/components/product/product-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CreateProduct = () => {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Link
            className={cn(
              buttonVariants({ size: "icon", variant: "outline" }),
              "h-7 w-7",
            )}
            href="/dashboard/products"
          >
            <LuChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            New Product
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Link
              className={cn(buttonVariants({ variant: "outline" }))}
              href="/dashboard/products"
            >
              Discard
            </Link>
            <Button size="sm">Save Product</Button>
          </div>
        </div>
        <ProductForm />
      </div>
    </div>
  );
};

export default CreateProduct;
