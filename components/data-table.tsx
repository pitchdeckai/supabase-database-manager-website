"use client"

import { useState } from "react"
import type { ColumnSchema, TableData } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2, Check, X } from "lucide-react"

interface DataTableProps {
  tableName: string
  columns: ColumnSchema[]
  data: TableData[]
  count: number
}

export function DataTable({ tableName, columns, data, count }: DataTableProps) {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editData, setEditData] = useState<TableData | null>(null)

  const totalPages = Math.ceil(count / rowsPerPage)

  const handleEdit = (rowIndex: number, rowData: TableData) => {
    setEditingRow(rowIndex)
    setEditData({ ...rowData })
  }

  const handleCancelEdit = () => {
    setEditingRow(null)
    setEditData(null)
  }

  const handleSaveEdit = async () => {
    // In a real implementation, this would update the data in Supabase
    console.log("Saving edited data:", editData)
    setEditingRow(null)
    setEditData(null)
  }

  const handleInputChange = (columnName: string, value: any) => {
    if (editData) {
      setEditData({
        ...editData,
        [columnName]: value,
      })
    }
  }

  const renderCellContent = (rowIndex: number, row: TableData, column: ColumnSchema) => {
    const isEditing = rowIndex === editingRow
    const columnName = column.column_name

    if (isEditing) {
      return (
        <Input
          value={editData?.[columnName] || ""}
          onChange={(e) => handleInputChange(columnName, e.target.value)}
          className="h-8 w-full"
        />
      )
    }

    // Handle different data types for display
    const value = row[columnName]

    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">null</span>
    }

    if (typeof value === "object") {
      return <span className="font-mono text-xs">{JSON.stringify(value)}</span>
    }

    return String(value)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Actions</TableHead>
              {columns.map((column) => (
                <TableHead key={column.column_name}>
                  {column.column_name}
                  <div className="text-xs font-normal text-muted-foreground">{column.data_type}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    {rowIndex === editingRow ? (
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveEdit}>
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEdit(rowIndex, row)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.column_name}>{renderCellContent(rowIndex, row, column)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {data.length > 0 ? (page - 1) * rowsPerPage + 1 : 0} to {Math.min(page * rowsPerPage, count)} of{" "}
          {count} results
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="icon" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
