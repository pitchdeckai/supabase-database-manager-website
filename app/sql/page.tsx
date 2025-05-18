import type { Metadata } from "next"
import Link from "next/link"
import { Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SqlEditor } from "@/components/sql-editor"

export const metadata: Metadata = {
  title: "SQL Editor | Supabase Database Manager",
  description: "Run custom SQL queries against your Supabase database",
}

export default function SqlPage() {
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
          <Button asChild variant="default" size="sm">
            <Link href="/sql">SQL Editor</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">SQL Editor</h1>
            <p className="text-muted-foreground">Run custom SQL queries against your Supabase database</p>
          </div>

          <SqlEditor />
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Supabase Database Manager. All rights reserved.</p>
      </footer>
    </div>
  )
}
