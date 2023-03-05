import type { ColumnType } from "kysely"

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>

export type ID_UUID = ColumnType<number | string>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Employees {
  emp_no: Generated<ID_UUID>
  first_name: string
  last_name: string
  inserted_at: Generated<Timestamp | null>
  updated_at: Generated<Timestamp | null>
}

export interface Database {
  employees: Employees
}
