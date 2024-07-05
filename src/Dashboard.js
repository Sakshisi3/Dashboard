import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://dummy.restapiexample.com/api/v1/employees');
      setEmployees(response.data.data);
      setErrorMessage('');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching employees:', error);
      setErrorMessage('Error fetching employees. Please try again later.');
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() !== '') {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://dummy.restapiexample.com/api/v1/employee/${searchQuery}`);
        const employee = response.data.data;
        setEmployees([employee]);
        setErrorMessage('');
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (error.response && error.response.status === 404) {
          setErrorMessage(`Employee with ID ${searchQuery} not found.`);
        } else if (error.response && error.response.status === 429) {
          // Handle "Too many requests" error
          const retryAfter = error.response.headers['retry-after'] || 5; // Default to 5 seconds if 'retry-after' header is not provided
          console.error('Too many requests. Retrying in', retryAfter, 'seconds...');
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Wait for the specified time before retrying
          await handleSearch(); // Retry the request
        } else {
          console.error('Error searching employee:', error);
          setErrorMessage('Error searching employee. Please try again later.');
        }
      }
    } else {
      fetchEmployees();
    }
  };

  const handleDelete = (employeeId) => {
    const updatedEmployees = employees.filter((employee) => employee.id !== employeeId);
    setEmployees(updatedEmployees);
  };

  const toggleSelect = (employeeId) => {
    setSelectedEmployees((prevSelectedEmployees) => {
      if (prevSelectedEmployees.includes(employeeId)) {
        return prevSelectedEmployees.filter((id) => id !== employeeId);
      } else {
        return [...prevSelectedEmployees, employeeId];
      }
    });
  };

  const handleDeleteSelected = () => {
    const updatedEmployees = employees.filter((employee) => !selectedEmployees.includes(employee.id));
    setEmployees(updatedEmployees);
    setSelectedEmployees([]);
  };

  const handleEmployeeClick = (employeeId) => {
    navigate(`/employee/${employeeId}`);
  };

  return (
    <div className="dashboard">
      <h1>Employee Dashboard</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          placeholder="Search employee by ID"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isLoading && <div className="loading-spinner">Loading...</div>}
      <div className="employee-cards">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className={`employee-card ${selectedEmployees.includes(employee.id) ? 'selected' : ''}`}
            onClick={() => handleEmployeeClick(employee.id)}
          >
            <input
              type="checkbox"
              checked={selectedEmployees.includes(employee.id)}
              onChange={() => toggleSelect(employee.id)}
            />
            <h3>{employee.employee_name}</h3>
            <p>ID: {employee.id}</p>
            <p>Age: {employee.employee_age}</p>
            <p>Salary: {employee.employee_salary}</p>
            <div className="card-buttons">
              <button onClick={(e) => {
                e.stopPropagation();
                handleDelete(employee.id);
              }} className="delete-button">
                Delete
              </button>
              <button className="edit-button">Edit</button>
            </div>
          </div>
        ))}
      </div>
      {selectedEmployees.length > 0 && (
        <div className="selected-employees">
          <p>Number of selected employees: {selectedEmployees.length}</p>
          <button onClick={handleDeleteSelected} className="delete-selected-button">
            Delete Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;