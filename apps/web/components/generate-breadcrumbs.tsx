import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export const generateBreadcrumbs = (pathname: string) => {
  let crumbs = [];

  if (pathname === "/dashboard") {
    crumbs.push({ title: "Dashboard", href: "/dashboard" });
  } else if (pathname === "/dashboard/products") {
    crumbs.push({ title: "Dashboard", href: "/dashboard" });
    crumbs.push({ title: "Products", href: "/products" });
  }

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <Fragment key={i}>
            <BreadcrumbItem>
              {i === crumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {crumbs.length > 1 && i < crumbs.length - 1 && (
              <BreadcrumbSeparator />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
