import type { DataTypeOption } from "./types"

export const dataTypes: DataTypeOption[] = [
  {
    label: "Text",
    value: "text",
    description: "Variable unlimited length",
  },
  {
    label: "Varchar",
    value: "character varying",
    description: "Variable length with limit",
  },
  {
    label: "Integer",
    value: "integer",
    description: "4 bytes, -2147483648 to +2147483647",
  },
  {
    label: "Bigint",
    value: "bigint",
    description: "8 bytes, -9223372036854775808 to 9223372036854775807",
  },
  {
    label: "Boolean",
    value: "boolean",
    description: "true/false",
  },
  {
    label: "UUID",
    value: "uuid",
    description: "Universally unique identifier",
  },
  {
    label: "JSON",
    value: "json",
    description: "Textual JSON data",
  },
  {
    label: "JSONB",
    value: "jsonb",
    description: "Binary JSON data, decomposed",
  },
  {
    label: "Date",
    value: "date",
    description: "Calendar date (year, month, day)",
  },
  {
    label: "Time",
    value: "time",
    description: "Time of day (no time zone)",
  },
  {
    label: "Timestamp",
    value: "timestamp without time zone",
    description: "Date and time (no time zone)",
  },
  {
    label: "Timestamp with time zone",
    value: "timestamp with time zone",
    description: "Date and time, including time zone",
  },
  {
    label: "Double precision",
    value: "double precision",
    description: "8-byte floating-point number",
  },
  {
    label: "Real",
    value: "real",
    description: "4-byte floating-point number",
  },
]
