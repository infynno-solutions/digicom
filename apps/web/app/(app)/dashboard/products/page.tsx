import Link from "next/link";
import { LuPlusCircle } from "react-icons/lu";
import ProductsList from "@/components/product/products-list";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Products = () => {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="ml-auto flex items-center gap-2">
        <Link
          className={cn("h-8 gap-1", buttonVariants({ size: "sm" }))}
          href="/dashboard/products/add"
        >
          <LuPlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Product
          </span>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
