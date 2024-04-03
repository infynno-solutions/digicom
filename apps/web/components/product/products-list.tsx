"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { LuArrowUpDown, LuLoader, LuMoreHorizontal } from "react-icons/lu";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "../ui/use-toast";
import { useDeleteProduct } from "@/hooks/product/use-delete-product";
import { useListProducts } from "@/hooks/product/use-list-products";
import { Product } from "@/types";

const ProductsList = () => {
  const router = useRouter();
  const {
    data,
    isLoading,
    sorting,
    setSorting,
    pagination,
    setPagination,
    setSearch,
  } = useListProducts();
  const products = data?.data?.products;
  const totalPages = data?.data?.totalPages;
  const { mutate } = useDeleteProduct();
  const { toast } = useToast();
  const handleDeleteProduct = (productId: string) =>
    mutate(productId, {
      onSuccess: (res: any) => {
        toast({ title: res?.data?.message });
      },
      onError: (err: any) => {
        toast({
          title: err?.response?.data?.message || "Something went wrong!!",
          variant: "destructive",
        });
      },
    });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <LuArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          <div className="text-lg font-semibold">{row.original.title}</div>
          <div className="text-xs">{row.original.id}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <LuArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <LuArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          {row.original.currency} {row.original.price}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <span className="sr-only">Open menu</span>
                <LuMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/products/${product.id}/edit`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  const result = confirm(
                    "Are you sure you want to delete this product? This action cannot be reversed.",
                  );

                  if (result) {
                    handleDeleteProduct(product.id);
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    manualSorting: true,
    manualPagination: true,
    pageCount: totalPages || 1,
    onPaginationChange: setPagination,
  });

  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 1000);

  return (
    <div>
      <Input
        className="max-w-sm"
        placeholder="Search"
        onChange={(event) => debouncedSetSearch(event.target.value)}
      />
      <div className="mt-4 rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell className="mx-auto" colSpan={columns.length}>
                  <LuLoader className="h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={!table.getCanPreviousPage()}
          size="sm"
          variant="outline"
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          disabled={!table.getCanNextPage()}
          size="sm"
          variant="outline"
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductsList;
