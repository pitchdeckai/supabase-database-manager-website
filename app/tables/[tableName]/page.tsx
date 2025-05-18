import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import type { TableSchema } from "@/lib/types"
import { ChevronLeft, Database, Edit, Filter, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"

interface TablePageProps {
  params: {
    tableName: string
  }
}

export async function generateMetadata({ params }: TablePageProps): Promise<Metadata> {
  return {
    title: `${params.tableName} | Supabase Database Manager`,
    description: `View and manage data in the ${params.tableName} table`,
  }
}

async function getTableSchema(tableName: string): Promise<TableSchema | null> {
  const supabase = createServerClient()

  // Get table schema using our RPC function
  const { data, error } = await supabase.rpc("get_table_schema", { table_name: tableName })

  if (error || !data) {
    console.error(`Error fetching schema for table ${tableName}:`, error)
    return null
  }

  return {
    table_schema: "public",
    table_name: tableName,
    columns: data,
  }
}

async function getTableData(tableName: string) {
  const supabase = createServerClient()

  // Get table data with pagination
  const { data, error, count } = await supabase.from(tableName).select("*", { count: "exact" }).range(0, 49) // First 50 rows

  if (error) {
    console.error(`Error fetching data for table ${tableName}:`, error)
    return { data: [], count: 0 }
  }

  return { data, count }
}

export default async function TablePage({ params }: TablePageProps) {
  const { tableName } = params
  const tableSchema = await getTableSchema(tableName)

  if (!tableSchema) {
    notFound()
  }

  const { data, count } = await getTableData(tableName)

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
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href="/tables">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to tables</span>
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">{tableName}</h1>
              <p className="text-sm text-muted-foreground">
                {tableSchema.columns.length} columns • {count || 0} rows
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/schema/${tableName}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Schema
                </Link>
              </Button>
              <Button variant="default" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Row
              </Button>
            </div>
          </div>

          <DataTable tableName={tableName} columns={tableSchema.columns} data={data} count={count || 0} />
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Supabase Database Manager. All rights reserved.</p>
      </footer>
    </div>
  )
}
