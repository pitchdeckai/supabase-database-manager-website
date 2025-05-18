import type { Metadata } from "next"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import type { TableSchema } from "@/lib/types"
import { Database, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Tables | Supabase Database Manager",
  description: "View and manage your Supabase database tables",
}

async function getTables(): Promise<TableSchema[]> {
  const supabase = createServerClient()

  // Get all tables in the public schema using raw SQL
  const { data: tables, error } = await supabase.rpc("get_tables")

  if (error) {
    // Fallback to raw SQL if the RPC doesn't exist
    const { data: tablesData, error: sqlError } = await supabase
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")
      .order("tablename")

    if (sqlError) {
      console.error("Error fetching tables:", sqlError)
      return []
    }

    // For each table, get its columns
    const tablesWithColumns: TableSchema[] = await Promise.all(
      tablesData.map(async (table) => {
        const { data: columns, error: columnsError } = await supabase
          .from("pg_attribute")
          .select(`
            attname as column_name,
            format_type(atttypid, atttypmod) as data_type
          `)
          .eq("attrelid", `public.${table.tablename}::regclass`)
          .gt("attnum", 0)
          .is("attisdropped", false)
          .order("attnum")

        if (columnsError) {
          console.error(`Error fetching columns for table ${table.tablename}:`, columnsError)
          return {
            table_schema: "public",
            table_name: table.tablename,
            columns: [],
          }
        }

        return {
          table_schema: "public",
          table_name: table.tablename,
          columns: columns,
        }
      }),
    )

    return tablesWithColumns
  }

  // If the RPC exists, use its results
  return tables.map((table: any) => ({
    table_schema: "public",
    table_name: table.table_name,
    columns: table.columns.map((col: any) => ({
      column_name: col.column_name,
      data_type: col.data_type,
    })),
  }))
}

export default async function TablesPage() {
  const tables = await getTables()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Database className="h-6 w-6" />
          <span>Supabase Database Manager</span>
        </Link>
        <nav className="ml-auto flex gap-2">
          <Button asChild variant="default" size="sm">
            <Link href="/tables">Tables</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
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
              <h1 className="text-3xl font-bold tracking-tight">Database Tables</h1>
              <p className="text-muted-foreground">View and manage your Supabase database tables</p>
            </div>
            <Button asChild>
              <Link href="/tables/create">Create New Table</Link>
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
                      <Link href={`/tables/${table.table_name}`}>View Data</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/schema/${table.table_name}`}>Edit Schema</Link>
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
