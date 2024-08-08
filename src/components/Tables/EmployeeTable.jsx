// src/components/Tables/EmployeeTable.jsx
import React from 'react';

const EmployeeTable = ({ employees }) => {
  return (
    <div className="table-container mt-8">
      <h2 className="text-2xl font-semibold mb-4">الموظفين</h2>
      <table className="table">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map(employee => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="table-empty">لا يوجد موظفين.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
