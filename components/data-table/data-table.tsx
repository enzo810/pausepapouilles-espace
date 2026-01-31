"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { UserRole } from "@/generated/prisma/enums";
import { flexRender } from "@tanstack/react-table";
import React from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableProps<TData, TValue> {
  role: UserRole;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  renderCard?: (args: { item: TData; select: () => void }) => React.ReactNode;

  renderDialog?: (args: {
    selected: TData;
    open: boolean;
    setOpen: (open: boolean) => void;
  }) => React.ReactNode;

  onRowClick?: (item: TData) => void;
}

export function DataTable<TData, TValue>({
  role,
  columns,
  data,
  renderCard,
  renderDialog,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [displayType, setDisplayType] = React.useState<"table" | "card">(
    role === "ADMIN" || (role === "PET_SITTER" && renderCard)
      ? "table"
      : "card",
  );

  const [selectedItem, setSelectedItem] = React.useState<TData | undefined>(
    undefined,
  );

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility },
  });

  const setOpen = (open: boolean) => {
    if (!open) setSelectedItem(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        {(role === "ADMIN" || role === "PET_SITTER") && renderCard && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setDisplayType(displayType === "table" ? "card" : "table")
            }
          >
            {displayType === "table" ? "Voir en carte" : "Voir en table"}
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
      {displayType === "card" && renderCard ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) =>
              renderCard({
                item: row.original,
                select: () => setSelectedItem(row.original),
              }),
            )
          ) : (
            <p className="col-span-full py-8 text-center text-muted-foreground">
              Aucun résultat.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
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
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(row.original);
                      } else {
                        setSelectedItem(row.original);
                      }
                    }}
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
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <DataTablePagination table={table} />

      {selectedItem &&
        renderDialog &&
        renderDialog({ selected: selectedItem, open: true, setOpen })}
    </div>
  );
}
