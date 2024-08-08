// src/components/Tables/UserTable.jsx
import React from 'react';

const UserTable = ({ users }) => {
  return (
    <div className="table-container bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">المستخدمين</h2>
      <table className="min-w-full bg-gray-200 border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-300 border-b">
            <th className="py-3 px-4 text-left text-gray-700">الاسم</th>
            <th className="py-3 px-4 text-left text-gray-700">البريد الإلكتروني</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-800">{user.name}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-3 px-4 text-center text-gray-500">لا يوجد مستخدمين.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
