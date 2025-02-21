import React, { useState } from 'react';
import { Calendar, Pencil, Trash2 } from 'lucide-react';
import '../css/ReporteIndicadores.css';

const ReporteIndicadores = () => {
  const [filters, setFilters] = useState({
    centro: 'P108',
    departamento: '801',
    linea: 'BOLSAS LINEA 1',
    proceso: 'DOSIFICADO',
    velocidad: '',
    fechaDesde: '2025-01-01',
    fechaHasta: '2025-01-30'
  });

  const [results, setResults] = useState([
    {
      material: '4003179',
      orden: '12266177',
      lote: 'Q24E028',
      piezas: '0',
      nominales: '0',
      fecha: '2025-01-01',
      hora: '00:00',
      turno: 'C',
      ciclo: '60',
      peros: '60',
      rechazos: '0',
      proceso: 'DOSIFICADO'
    },
    // Add more sample data as needed
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('YOUR_API_ENDPOINT/indicadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(filters)
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleEdit = (row) => {
    // Add your edit logic here
    console.log('Edit row:', row);
  };
  
  const handleDelete = (row) => {
    // Add your delete logic here
    console.log('Delete row:', row);
  };

  const handleReset = () => {
    setFilters({
      centro: '',
      departamento: '',
      linea: '',
      proceso: '',
      velocidad: '',
      fechaDesde: '',
      fechaHasta: ''
    });
  };

  return (
    <div className="reporte-container">
      <h1>Reporte de Indicadores</h1>
      
      <div className="filters-card">
        <form onSubmit={handleSubmit}>
          <div className="filters-grid">
            <div className="form-group">
              <label>Centro</label>
              <select name="centro" value={filters.centro} onChange={handleFilterChange}>
                <option value="P108">P108</option>
              </select>
            </div>

            <div className="form-group">
              <label>Departamento</label>
              <select name="departamento" value={filters.departamento} onChange={handleFilterChange}>
                <option value="801">801</option>
              </select>
            </div>

            <div className="form-group">
              <label>Línea</label>
              <select name="linea" value={filters.linea} onChange={handleFilterChange}>
                <option value="BOLSAS LINEA 1">BOLSAS LINEA 1</option>
              </select>
            </div>

            <div className="form-group">
              <label>Proceso</label>
              <select name="proceso" value={filters.proceso} onChange={handleFilterChange}>
                <option value="DOSIFICADO">DOSIFICADO</option>
              </select>
            </div>

            <div className="form-group">
              <label>Velocidad</label>
              <select name="velocidad" value={filters.velocidad} onChange={handleFilterChange}>
                <option value="">Seleccionar...</option>
              </select>
            </div>

            <div className="date-range">
              <div className="form-group">
                <label>Desde</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    name="fechaDesde"
                    value={filters.fechaDesde}
                    onChange={handleFilterChange}
                  />
                  <Calendar className="calendar-icon" size={20} />
                </div>
              </div>

              <div className="form-group">
                <label>Hasta</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    name="fechaHasta"
                    value={filters.fechaHasta}
                    onChange={handleFilterChange}
                  />
                  <Calendar className="calendar-icon" size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn-primary">OBTENER INFORMACIÓN</button>
            <button type="button" className="btn-secondary" onClick={handleReset}>
              INICIALIZAR PARÁMETROS
            </button>
          </div>
        </form>
      </div>

      <div className="results-card">
        <h2>Resultados</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Orden</th>
                <th>Lote</th>
                <th>Piezas</th>
                <th>Nominales</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Turno</th>
                <th>Ciclo</th>
                <th>Peros</th>
                <th>Rechazos</th>
                <th>Proceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index}>
                  <td>{row.material}</td>
                  <td>{row.orden}</td>
                  <td>{row.lote}</td>
                  <td>{row.piezas}</td>
                  <td>{row.nominales}</td>
                  <td>{row.fecha}</td>
                  <td>{row.hora}</td>
                  <td>{row.turno}</td>
                  <td>{row.ciclo}</td>
                  <td>{row.peros}</td>
                  <td>{row.rechazos}</td>
                  <td>{row.proceso}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEdit(row)}
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(row)}
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
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

export default ReporteIndicadores;