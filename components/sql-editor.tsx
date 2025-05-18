"use client"

import { useState } from "react"
import { executeSqlQuery } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Download, Copy, AlertCircle, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function SqlEditor() {
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("results")
  const [executionTime, setExecutionTime] = useState<number | null>(null)

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Query is empty",
        description: "Please enter a SQL query to execute",
        variant: "destructive",
      })
      return
    }

    setIsExecuting(true)
    setError(null)
    setResults(null)
    setExecutionTime(null)
    setActiveTab("results")

    const startTime = performance.now()

    try {
      const response = await executeSqlQuery(query)
      const endTime = performance.now()
      setExecutionTime(endTime - startTime)

      if (!response.success) {
        setError(response.error || "An error occurred while executing the query")
        toast({
          title: "Query Error",
          description: response.error || "An error occurred while executing the query",
          variant: "destructive",
        })
      } else {
        setResults(response.data || [])
        toast({
          title: "Query Executed Successfully",
          description: `Execution time: ${((endTime - startTime) / 1000).toFixed(2)}s`,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "Query Error",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const copyQuery = () => {
    navigator.clipboard.writeText(query)
    toast({
      title: "Copied to clipboard",
      description: "SQL query has been copied to clipboard",
    })
  }

  const downloadResults = () => {
    if (!results || results.length === 0) return

    try {
      // Convert results to CSV
      const headers = Object.keys(results[0]).join(",")
      const rows = results.map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value === null ? "" : String(value),
          )
          .join(","),
      )
      const csv = [headers, ...rows].join("\n")

      // Create download link
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `query-results-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Results downloaded",
        description: "Query results have been downloaded as CSV",
      })
    } catch (err) {
      toast({
        title: "Download Error",
        description: "Failed to download results",
        variant: "destructive",
      })
    }
  }

  const renderResultsTable = () => {
    if (!results || results.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          {isExecuting ? "Executing query..." : "No results to display"}
        </div>
      )
    }

    const columns = Object.keys(results[0])

    return (
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column}`}>{renderCellValue(row[column])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderCellValue = (value: any) => {
    if (value === null) return <span className="text-muted-foreground italic">null</span>
    if (typeof value === "object") return <span className="font-mono text-xs">{JSON.stringify(value)}</span>
    return String(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">SQL Query Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyQuery} disabled={!query.trim()}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button variant="default" size="sm" onClick={executeQuery} disabled={isExecuting || !query.trim()}>
            <Play className="mr-2 h-4 w-4" />
            {isExecuting ? "Executing..." : "Run Query"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            className="font-mono min-h-[200px] resize-y"
          />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="results">Results</TabsTrigger>
            {error && <TabsTrigger value="error">Error</TabsTrigger>}
          </TabsList>
          {results && results.length > 0 && (
            <Button variant="outline" size="sm" onClick={downloadResults}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          )}
        </div>

        <TabsContent value="results" className="mt-2">
          <Card>
            <CardContent className="p-4">
              {executionTime !== null && results && (
                <div className="mb-2 flex items-center text-sm text-muted-foreground">
                  <Check className="mr-1 h-4 w-4 text-green-500" />
                  <span>
                    Query executed in {(executionTime / 1000).toFixed(2)}s • {results.length} rows returned
                  </span>
                </div>
              )}
              {renderResultsTable()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="error" className="mt-2">
          <Card>
            <CardContent className="p-4">
              <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                <div className="flex items-start">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <div>
                    <h3 className="font-medium">Error executing query</h3>
                    <div className="mt-2 text-sm">{error}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
