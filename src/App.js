import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import EmployeeDetails from './EmployeeDetails';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employee/:employeeId" element={<EmployeeDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;