import type { Metadata } from "next"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { ChevronLeft, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddColumnForm } from "@/components/add-column-form"

interface AddColumnPageProps {
  params: {
    tableName: string
  }
}

export async function generateMetadata({ params }: AddColumnPageProps): Promise<Metadata> {
  return {
    title: `Add Column to ${params.tableName} | Supabase Database Manager`,
    description: `Add a new column to the ${params.tableName} table`,
  }
}

async function getTableNames(): Promise<string[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .order("table_name")

  if (error) {
    console.error("Error fetching tables:", error)
    return []
  }

  return data.map((table) => table.table_name)
}

export default async function AddColumnPage({ params }: AddColumnPageProps) {
  const { tableName } = params
  const tableNames = await getTableNames()

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
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href={`/schema/${tableName}`}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to schema</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Add Column to {tableName}</h1>
              <p className="text-sm text-muted-foreground">Define a new column with data type and constraints</p>
            </div>
          </div>

          <AddColumnForm tableName={tableName} tableNames={tableNames} />
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Supabase Database Manager. All rights reserved.</p>
      </footer>
    </div>
  )
}
