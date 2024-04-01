"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LuLoader } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useListProducts } from "@/hooks/product/use-list-products";
import { Product } from "@/types";

const ProductsList = () => {
  const { data, isLoading } = useListProducts();
  const products = data?.data?.products;

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "title",
      header: "Name",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div>
          {row.original.currency} {row.original.price}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      {isLoading ? (
        <LuLoader className="h-8 w-8 animate-spin" />
      ) : (
        <div className="rounded-lg border">
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
              {table.getRowModel().rows?.length ? (
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
      )}
    </div>
  );
};

export default ProductsList;
