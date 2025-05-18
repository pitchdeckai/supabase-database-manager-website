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
import { toast } from "@/components/ui/use-toast"

interface AddColumnFormProps {
  tableName: string
  tableNames: string[]
}

export function AddColumnForm({ tableName, tableNames }: AddColumnFormProps) {
  const router = useRouter()
  const [columnName, setColumnName] = useState("")
  const [dataType, setDataType] = useState("")
  const [isNullable, setIsNullable] = useState(true)
  const [defaultValue, setDefaultValue] = useState("")
  const [isPrimaryKey, setIsPrimaryKey] = useState(false)
  const [isForeignKey, setIsForeignKey] = useState(false)
  const [referencedTable, setReferencedTable] = useState("")
  const [referencedColumn, setReferencedColumn] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, this would execute an ALTER TABLE ADD COLUMN SQL query
      console.log("Adding column:", {
        tableName,
        columnName,
        dataType,
        isNullable,
        defaultValue,
        isPrimaryKey,
        isForeignKey,
        referencedTable,
        referencedColumn,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Column added",
        description: `Column ${columnName} has been added to ${tableName}`,
      })

      // Redirect back to the schema page
      router.push(`/schema/${tableName}`)
      router.refresh()
    } catch (error) {
      console.error("Error adding column:", error)
      toast({
        title: "Error adding column",
        description: "There was an error adding the column. Please try again.",
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
          <CardTitle>Add New Column</CardTitle>
          <CardDescription>Define the properties for your new column</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="Enter column name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="data-type">Data Type</Label>
            <Select value={dataType} onValueChange={setDataType} required>
              <SelectTrigger id="data-type">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                {dataTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <span>{type.label}</span>
                      {type.description && <span className="text-xs text-muted-foreground">{type.description}</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="nullable" checked={isNullable} onCheckedChange={setIsNullable} disabled={isPrimaryKey} />
            <Label htmlFor="nullable">Allow NULL values</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="default-value">Default Value</Label>
            <Input
              id="default-value"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="No default value"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="primary-key"
              checked={isPrimaryKey}
              onCheckedChange={(checked) => {
                if (checked) {
                  setIsNullable(false)
                  setIsForeignKey(false)
                }
                setIsPrimaryKey(!!checked)
              }}
            />
            <Label htmlFor="primary-key">Primary Key</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="foreign-key"
              checked={isForeignKey}
              onCheckedChange={(checked) => {
                setIsForeignKey(!!checked)
                if (checked && isPrimaryKey) {
                  setIsPrimaryKey(false)
                }
              }}
            />
            <Label htmlFor="foreign-key">Foreign Key</Label>
          </div>

          {isForeignKey && (
            <div className="space-y-4 pl-6 border-l-2 border-muted">
              <div className="grid gap-2">
                <Label htmlFor="referenced-table">Referenced Table</Label>
                <Select value={referencedTable} onValueChange={setReferencedTable} required={isForeignKey}>
                  <SelectTrigger id="referenced-table">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tableNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="referenced-column">Referenced Column</Label>
                <Input
                  id="referenced-column"
                  value={referencedColumn}
                  onChange={(e) => setReferencedColumn(e.target.value)}
                  placeholder="Enter column name"
                  required={isForeignKey}
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push(`/schema/${tableName}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Column"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
