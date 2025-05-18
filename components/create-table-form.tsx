"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { dataTypes } from "@/lib/data-types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ColumnDefinition {
  name: string
  dataType: string
  isNullable: boolean
  defaultValue: string
  isPrimaryKey: boolean
}

export function CreateTableForm() {
  const router = useRouter()
  const [tableName, setTableName] = useState("")
  const [columns, setColumns] = useState<ColumnDefinition[]>([
    { name: "id", dataType: "uuid", isNullable: false, defaultValue: "gen_random_uuid()", isPrimaryKey: true },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addColumn = () => {
    setColumns([...columns, { name: "", dataType: "", isNullable: true, defaultValue: "", isPrimaryKey: false }])
  }

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index))
  }

  const updateColumn = (index: number, field: keyof ColumnDefinition, value: any) => {
    const newColumns = [...columns]
    newColumns[index] = { ...newColumns[index], [field]: value }

    // If setting a column as primary key, ensure it's not nullable
    if (field === "isPrimaryKey" && value === true) {
      newColumns[index].isNullable = false

      // Ensure only one primary key
      if (value) {
        newColumns.forEach((col, i) => {
          if (i !== index) {
            col.isPrimaryKey = false
          }
        })
      }
    }

    setColumns(newColumns)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, this would execute a CREATE TABLE SQL query
      console.log("Creating table:", {
        tableName,
        columns,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Table created",
        description: `Table ${tableName} has been created successfully`,
      })

      // Redirect back to the schema page
      router.push(`/schema`)
      router.refresh()
    } catch (error) {
      console.error("Error creating table:", error)
      toast({
        title: "Error creating table",
        description: "There was an error creating the table. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Table</CardTitle>
          <CardDescription>Define your table structure with columns and constraints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="table-name">Table Name</Label>
            <Input
              id="table-name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Columns</Label>
              <Button type="button" variant="outline" size="sm" onClick={addColumn}>
                <Plus className="mr-2 h-4 w-4" />
                Add Column
              </Button>
            </div>

            {columns.map((column, index) => (
              <div key={index} className="space-y-4 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Column {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColumn(index)}
                    disabled={columns.length === 1 || column.isPrimaryKey}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove column</span>
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`column-name-${index}`}>Name</Label>
                    <Input
                      id={`column-name-${index}`}
                      value={column.name}
                      onChange={(e) => updateColumn(index, "name", e.target.value)}
                      placeholder="Enter column name"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`data-type-${index}`}>Data Type</Label>
                    <Select
                      value={column.dataType}
                      onValueChange={(value) => updateColumn(index, "dataType", value)}
                      required
                    >
                      <SelectTrigger id={`data-type-${index}`}>
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
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`default-value-${index}`}>Default Value</Label>
                    <Input
                      id={`default-value-${index}`}
                      value={column.defaultValue}
                      onChange={(e) => updateColumn(index, "defaultValue", e.target.value)}
                      placeholder="No default value"
                    />
                  </div>

                  <div className="flex flex-col justify-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`primary-key-${index}`}
                        checked={column.isPrimaryKey}
                        onCheckedChange={(checked) => updateColumn(index, "isPrimaryKey", !!checked)}
                      />
                      <Label htmlFor={`primary-key-${index}`}>Primary Key</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`nullable-${index}`}
                        checked={column.isNullable}
                        onCheckedChange={(checked) => updateColumn(index, "isNullable", checked)}
                        disabled={column.isPrimaryKey}
                      />
                      <Label htmlFor={`nullable-${index}`}>Allow NULL values</Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/schema")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Table"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
