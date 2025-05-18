import type { Metadata } from "next"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import type { TableSchema } from "@/lib/types"
import { Database, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Schema Management | Supabase Database Manager",
  description: "Manage your Supabase database schema",
}

async function getTables(): Promise<TableSchema[]> {
  const supabase = createServerClient()

  // Get all tables in the public schema using the RPC function
  const { data: tables, error } = await supabase.rpc("get_tables")

  if (error) {
    console.error("Error fetching tables:", error)
    return []
  }

  // Transform the data into the expected format
  return tables.map((table: any) => ({
    table_schema: "public",
    table_name: table.table_name,
    columns: table.columns.map((col: any) => ({
      column_name: col.column_name,
      data_type: col.data_type,
    })),
  }))
}

export default async function SchemaPage() {
  const tables = await getTables()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Database className="h-6 w-6" />
          <span>Supabase Database Manager</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/tables">Tables</Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <Link href="/schema">Schema</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/relationships">Relationships</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/sql">SQL Editor</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Schema Management</h1>
              <p className="text-muted-foreground">Manage your database schema, tables, and columns</p>
            </div>
            <Button asChild>
              <Link href="/schema/create-table">Create New Table</Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <Card key={table.table_name}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Table className="h-5 w-5" />
                    <span>{table.table_name}</span>
                  </CardTitle>
                  <CardDescription>{table.columns.length} columns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 max-h-32 overflow-y-auto text-sm">
                    <ul className="space-y-1">
                      {table.columns.slice(0, 5).map((column) => (
                        <li key={column.column_name} className="flex items-center justify-between">
                          <span className="font-medium">{column.column_name}</span>
                          <span className="text-xs text-muted-foreground">{column.data_type}</span>
                        </li>
                      ))}
                      {table.columns.length > 5 && (
                        <li className="text-xs text-muted-foreground">+ {table.columns.length - 5} more columns</li>
                      )}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/schema/${table.table_name}`}>Edit Schema</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/schema/${table.table_name}/rename`}>Rename</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Supabase Database Manager. All rights reserved.</p>
      </footer>
    </div>
  )
}
