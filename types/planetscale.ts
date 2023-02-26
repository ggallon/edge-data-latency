export interface EmployeeTable {
  emp_no: number;
  first_name: string;
  last_name: string;
}

export interface Database {
  employees: EmployeeTable;
}
