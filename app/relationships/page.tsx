import type { Metadata } from "next"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import type { TableRelationship } from "@/lib/types"
import { Database, LinkIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RelationshipDiagram } from "@/components/relationship-diagram"

export const metadata: Metadata = {
  title: "Table Relationships | Supabase Database Manager",
  description: "Manage relationships between your Supabase database tables",
}

async function getTableRelationships(): Promise<TableRelationship[]> {
  const supabase = createServerClient()

  // Get relationships using raw SQL
  const { data, error } = await supabase.rpc("get_table_relationships")

  if (error) {
    console.error("Error fetching relationships:", error)
    return []
  }

  return data || []
}

export default async function RelationshipsPage() {
  const relationships = await getTableRelationships()

  // Get unique tables involved in relationships
  const tables = Array.from(
    new Set([...relationships.map((r) => r.table_name), ...relationships.map((r) => r.foreign_table)]),
  )

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
          <Button asChild variant="ghost" size="sm">
            <Link href="/schema">Schema</Link>
          </Button>
          <Button asChild variant="default" size="sm">
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
              <h1 className="text-3xl font-bold tracking-tight">Table Relationships</h1>
              <p className="text-muted-foreground">Manage relationships between your database tables</p>
            </div>
            <Button asChild>
              <Link href="/relationships/create">Create Relationship</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Database Diagram</CardTitle>
              <CardDescription>Visual representation of table relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full border rounded-md bg-muted/20 p-4">
                <RelationshipDiagram relationships={relationships} tables={tables} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">All Relationships</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relationships.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No relationships found</p>
                    <Button asChild className="mt-4">
                      <Link href="/relationships/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Relationship
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                relationships.map((rel) => (
                  <Card key={rel.constraint_name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LinkIcon className="h-5 w-5 text-blue-500" />
                        <span>{rel.constraint_name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Source Table:</span>
                          <span>{rel.table_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Source Column:</span>
                          <span>{rel.column_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Referenced Table:</span>
                          <span>{rel.foreign_table}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Referenced Column:</span>
                          <span>{rel.foreign_column}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/relationships/${rel.constraint_name}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Supabase Database Manager. All rights reserved.</p>
      </footer>
    </div>
  )
}
