import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { api } from "@/lib/api";

export const useListProducts = (): any => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 20,
    pageIndex: 0,
  });
  const [search, setSearch] = useState<string>("");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["list-products", sorting, pagination, search],
    queryFn: () =>
      api.get(`/product`, {
        params: {
          orderBy: sorting?.[0]?.id,
          order: sorting?.[0]?.desc ? "desc" : "asc",
          page: pagination.pageIndex + 1,
          search,
        },
      }),
  });

  return {
    data,
    isLoading,
    sorting,
    setSorting,
    pagination,
    setPagination,
    search,
    setSearch,
  };
};
