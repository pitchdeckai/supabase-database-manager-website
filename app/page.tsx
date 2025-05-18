import type { Metadata } from "next"
import Link from "next/link"
import { Database, Table, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Supabase Database Manager",
  description: "A comprehensive interface for managing Supabase database tables",
}

export default function HomePage() {
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
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Supabase Database Manager</h1>
            <p className="text-muted-foreground">
              A comprehensive interface for managing your Supabase database tables
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  <span>Tables</span>
                </CardTitle>
                <CardDescription>View and manage database tables</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Browse, search, and modify data in your database tables with a spreadsheet-like interface.
                </p>
                <Button asChild>
                  <Link href="/tables">View Tables</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <span>Schema</span>
                </CardTitle>
                <CardDescription>Manage database schema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Add, modify, or remove fields from your tables and manage data types and constraints.
                </p>
                <Button asChild>
                  <Link href="/schema">Manage Schema</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M17 17h-3a5 5 0 0 1-5-5V5a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v8a3 3 0 0 0 6 0V8a5 5 0 0 0-5-5h0a5 5 0 0 0-5 5v8a7 7 0 0 0 7 7h3" />
                  </svg>
                  <span>Relationships</span>
                </CardTitle>
                <CardDescription>Manage table relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Create and manage relationships between tables, including one-to-one, one-to-many, and many-to-many.
                </p>
                <Button asChild>
                  <Link href="/relationships">Manage Relationships</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <span>SQL Editor</span>
                </CardTitle>
                <CardDescription>Run custom SQL queries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Execute custom SQL queries against your database and view the results in a tabular format.
                </p>
                <Button asChild>
                  <Link href="/sql">Open SQL Editor</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Supabase Database Manager. All rights reserved.</p>
      </footer>
    </div>
  )
}
