"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimalType } from "@/types/AnimalTypes";
import React from "react";
import { AnimalCard } from "../animal-card";
import { AnimalDialog } from "../animal-dialog";
import { Button } from "../ui/button";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";

type DataTableProps<TValue> = {
  columns: ColumnDef<AnimalType, TValue>[];
  data: AnimalType[];
  type: "animal";
};

export function DataTable<TValue>({
  columns,
  data,
  type,
}: DataTableProps<TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [displayType, setDisplayType] = React.useState<"table" | "card">(
    "table",
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [selectedItem, setSelectedItem] = React.useState<
    AnimalType | undefined
  >(undefined);

  const handleSetOpen = (open: boolean) => {
    if (!open) {
      setSelectedItem(undefined);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setDisplayType(displayType === "table" ? "card" : "table")
          }
        >
          {displayType === "table" ? "Voir en carte" : "Voir en table"}
        </Button>
        <DataTableViewOptions table={table} />
      </div>
      {displayType === "card" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <AnimalCard
                  key={row.original.id}
                  animal={row.original}
                  onClick={() => setSelectedItem(row.original)}
                />
              ))
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
                      if (type === "animal") {
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
      {type === "animal" && selectedItem && (
        <AnimalDialog
          animal={selectedItem}
          open={!!selectedItem}
          setOpen={handleSetOpen}
        />
      )}
    </div>
  );
}
