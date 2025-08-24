// frontend/src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [structure, setStructure] = useState({});
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/db-structure')
      .then(res => res.json())
      .then(setStructure);
  }, []);

  const loadData = (schema, table) => {
    fetch(`http://localhost:5000/data/${schema}/${table}`)
      .then(res => res.json())
      .then(rows => {
        setSelected({ schema, table });
        setData(rows);
      });
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Sidebar: Schemas & Tables */}
      <div style={{ width: "250px", borderRight: "1px solid #ddd", padding: "10px" }}>
        <h3>Database Structure</h3>
        {Object.keys(structure).map(schema => (
          <div key={schema}>
            <strong>{schema}</strong>
            <ul>
              {structure[schema].map(table => (
                <li key={table} onClick={() => loadData(schema, table)} style={{ cursor: "pointer" }}>
                  {table}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Main Content: Table Data */}
      <div style={{ flex: 1, padding: "10px" }}>
        {selected ? (
          <>
            <h3>{selected.schema}.{selected.table}</h3>
            <table border="1" cellPadding="5">
              <thead>
                {data.length > 0 && (
                  <tr>
                    {Object.keys(data[0]).map(col => <th key={col}>{col}</th>)}
                  </tr>
                )}
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => <td key={j}>{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>Select a table to view data</p>
        )}
      </div>
    </div>
  );
}

export default App;
