import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { cn } from "@/utils/cn";

const DataTable = ({
  columns,
  data,
  onSearch,
  onFilter,
  pagination,
  onPageChange,
  isLoading,
  actions,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {onFilter && (
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="size-4" /> Filter
            </Button>
          )}

          {actions}
        </div>
      </div>

      <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data?.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-4 text-slate-700">
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
