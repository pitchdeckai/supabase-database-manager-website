import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import type { TableSchema } from "@/lib/types"
import { ChevronLeft, Database, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SchemaEditor } from "@/components/schema-editor"

interface SchemaPageProps {
  params: {
    tableName: string
  }
}

export async function generateMetadata({ params }: SchemaPageProps): Promise<Metadata> {
  return {
    title: `Edit ${params.tableName} Schema | Supabase Database Manager`,
    description: `Manage the schema for the ${params.tableName} table`,
  }
}

async function getTableSchema(tableName: string): Promise<TableSchema | null> {
  const supabase = createServerClient()

  // Get table columns with more detailed information using raw SQL
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

export default async function TableSchemaPage({ params }: SchemaPageProps) {
  const { tableName } = params
  const tableSchema = await getTableSchema(tableName)

  if (!tableSchema) {
    notFound()
  }

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
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href="/schema">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to schema</span>
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">{tableName} Schema</h1>
              <p className="text-sm text-muted-foreground">Manage columns, data types, and constraints</p>
            </div>
            <Button asChild>
              <Link href={`/schema/${tableName}/add-column`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Column
              </Link>
            </Button>
          </div>

          <SchemaEditor tableName={tableName} schema={tableSchema} />
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Supabase Database Manager. All rights reserved.</p>
      </footer>
    </div>
  )
}
