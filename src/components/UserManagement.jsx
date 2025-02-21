import React, { useState } from 'react';
import '../css/UserManagement.css';
import Navbar from './Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, lastLogin: '22/10/2022', name: 'Markus Suzak', active: true },
    { id: 2, lastLogin: '22/05/2022', name: 'Ankur Warikoo', active: true },
    { id: 3, lastLogin: '14/07/2020', name: 'Jodi Picoult', active: true },
    { id: 4, lastLogin: '12/04/2021', name: 'James Clear', active: true },
    { id: 5, lastLogin: '02/02/2022', name: 'Frank Herbert', active: false },
  ]);

  const toggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  return (
    <div><Navbar/> 
    <div className="user-management">
      <h1>Usuarios</h1>
      
      <div className="controls">
        <div className="search-container">
          <input type="text" placeholder="Buscar Usuario" />
          <button className="search-button">🔍</button>
        </div>
        <button className="add-button">+ Agregar Usuario</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Último Ingreso</th>
              <th>Usuario</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.lastLogin}</td>
                <td>{user.name}</td>
                <td>
                  <div className="status-container">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={user.active}
                        onChange={() => toggleStatus(user.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className={`status-text ${user.active ? 'active' : 'inactive'}`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default UserManagement;