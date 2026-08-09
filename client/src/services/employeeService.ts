import api from "./api";

/* ----------------------------------------
   Register Employee
----------------------------------------- */

export async function registerEmployee(
  employee: any,
  images: string[]
) {
  const response = await api.post(
    "/api/employees/register",
    {
      employee,
      images,
    }
  );

  return response.data;
}

/* ----------------------------------------
   Get All Employees
----------------------------------------- */

export async function getEmployees() {
  const response = await api.get(
    "/api/employees"
  );

  return response.data;
}

/* ----------------------------------------
   Update Employee
----------------------------------------- */

export async function updateEmployee(
  employeeId: string,
  employee: any
) {
  const response = await api.put(
    `/api/employees/${employeeId}`,
    employee
  );

  return response.data;
}

/* ----------------------------------------
   Delete Employee
----------------------------------------- */

export async function deleteEmployee(
  employeeId: string
) {
  const response = await api.delete(
    `/api/employees/${employeeId}`
  );

  return response.data;
}

/* ----------------------------------------
   Get Single Employee
----------------------------------------- */

export async function getEmployee(
  employeeId: string
) {
  const response = await api.get(
    `/api/employees/${employeeId}`
  );

  return response.data;
}

/* ----------------------------------------
   Re-Register Face
----------------------------------------- */

export async function reRegisterFace(
  employeeId: string,
  images: string[]
) {
  const response = await api.put(
    `/api/employees/${employeeId}/face`,
    { images }
  );

  return response.data;
}