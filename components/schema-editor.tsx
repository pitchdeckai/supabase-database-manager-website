"use client"

import { useState } from "react"
import type { TableSchema, ColumnSchema } from "@/lib/types"
import { dataTypes } from "@/lib/data-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Key, LinkIcon, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SchemaEditorProps {
  tableName: string
  schema: TableSchema
}

export function SchemaEditor({ tableName, schema }: SchemaEditorProps) {
  const [columns, setColumns] = useState<ColumnSchema[]>(schema.columns)
  const [editingColumn, setEditingColumn] = useState<ColumnSchema | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEditColumn = (column: ColumnSchema) => {
    setEditingColumn({ ...column })
    setIsEditDialogOpen(true)
  }

  const handleDeleteColumn = (column: ColumnSchema) => {
    setEditingColumn(column)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteColumn = async () => {
    if (!editingColumn) return

    try {
      // In a real implementation, this would execute an ALTER TABLE DROP COLUMN SQL query
      console.log(`Deleting column ${editingColumn.column_name} from ${tableName}`)

      // Update local state
      setColumns(columns.filter((c) => c.column_name !== editingColumn.column_name))

      toast({
        title: "Column deleted",
        description: `Column ${editingColumn.column_name} has been deleted from ${tableName}`,
      })
    } catch (error) {
      console.error("Error deleting column:", error)
      toast({
        title: "Error deleting column",
        description: "There was an error deleting the column. Please try again.",
        variant: "destructive",
      })
    }

    setIsDeleteDialogOpen(false)
    setEditingColumn(null)
  }

  const saveColumnChanges = async () => {
    if (!editingColumn) return

    try {
      // In a real implementation, this would execute an ALTER TABLE ALTER COLUMN SQL query
      console.log(`Updating column ${editingColumn.column_name} in ${tableName}`, editingColumn)

      // Update local state
      setColumns(columns.map((c) => (c.column_name === editingColumn.column_name ? editingColumn : c)))

      toast({
        title: "Column updated",
        description: `Column ${editingColumn.column_name} has been updated`,
      })
    } catch (error) {
      console.error("Error updating column:", error)
      toast({
        title: "Error updating column",
        description: "There was an error updating the column. Please try again.",
        variant: "destructive",
      })
    }

    setIsEditDialogOpen(false)
    setEditingColumn(null)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Actions</TableHead>
              <TableHead>Column Name</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Nullable</TableHead>
              <TableHead>Default Value</TableHead>
              <TableHead>Primary Key</TableHead>
              <TableHead>Foreign Key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No columns found. Add a column to get started.
                </TableCell>
              </TableRow>
            ) : (
              columns.map((column) => (
                <TableRow key={column.column_name}>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditColumn(column)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleDeleteColumn(column)}
                        disabled={column.is_primary_key}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{column.column_name}</TableCell>
                  <TableCell>{column.data_type}</TableCell>
                  <TableCell>{column.is_nullable === "YES" ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {column.column_default || <span className="text-muted-foreground italic">null</span>}
                  </TableCell>
                  <TableCell>
                    {column.is_primary_key ? (
                      <div className="flex items-center">
                        <Key className="h-4 w-4 text-amber-500 mr-1" />
                        <span>Yes</span>
                      </div>
                    ) : (
                      "No"
                    )}
                  </TableCell>
                  <TableCell>
                    {column.is_foreign_key ? (
                      <div className="flex items-center">
                        <LinkIcon className="h-4 w-4 text-blue-500 mr-1" />
                        <span>
                          {column.foreign_key_table}.{column.foreign_key_column}
                        </span>
                      </div>
                    ) : (
                      "No"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Column Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
            <DialogDescription>Make changes to the column properties. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {editingColumn && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="column-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="column-name"
                  value={editingColumn.column_name}
                  onChange={(e) => setEditingColumn({ ...editingColumn, column_name: e.target.value })}
                  className="col-span-3"
                  disabled={editingColumn.is_primary_key}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="data-type" className="text-right">
                  Data Type
                </Label>
                <Select
                  value={editingColumn.data_type}
                  onValueChange={(value) => setEditingColumn({ ...editingColumn, data_type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col">
                          <span>{type.label}</span>
                          {type.description && (
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nullable" className="text-right">
                  Nullable
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="nullable"
                    checked={editingColumn.is_nullable === "YES"}
                    onCheckedChange={(checked) =>
                      setEditingColumn({ ...editingColumn, is_nullable: checked ? "YES" : "NO" })
                    }
                    disabled={editingColumn.is_primary_key}
                  />
                  <Label htmlFor="nullable">Allow NULL values</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="default-value" className="text-right">
                  Default Value
                </Label>
                <Input
                  id="default-value"
                  value={editingColumn.column_default || ""}
                  onChange={(e) => setEditingColumn({ ...editingColumn, column_default: e.target.value })}
                  className="col-span-3"
                  placeholder="No default value"
                />
              </div>
              {editingColumn.is_primary_key && (
                <div className="flex items-center space-x-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    This is a primary key column. Some properties cannot be modified.
                  </p>
                </div>
              )}
              {editingColumn.is_foreign_key && (
                <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <LinkIcon className="h-4 w-4 text-blue-500" />
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    This is a foreign key referencing {editingColumn.foreign_key_table}.
                    {editingColumn.foreign_key_column}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveColumnChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Column Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Column</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this column? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {editingColumn && (
            <div className="py-4">
              <p className="text-center font-medium">{editingColumn.column_name}</p>
              <p className="text-center text-sm text-muted-foreground">{editingColumn.data_type}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteColumn}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
