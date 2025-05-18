export interface TableSchema {
  table_schema: string
  table_name: string
  columns: ColumnSchema[]
}

export interface ColumnSchema {
  column_name: string
  data_type: string
  is_nullable?: boolean
  column_default?: string | null
  is_identity?: boolean
  is_primary_key?: boolean
  is_foreign_key?: boolean
  foreign_key_table?: string
  foreign_key_column?: string
}

export interface TableData {
  [key: string]: any
}

export interface TableRelationship {
  table_name: string
  column_name: string
  foreign_table: string
  foreign_column: string
  constraint_name: string
  constraint_type: "FOREIGN KEY" | "PRIMARY KEY"
}

export interface DataTypeOption {
  label: string
  value: string
  description?: string
}
