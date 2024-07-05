import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading]= useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://dummy.restapiexample.com/api/v1/employee/${employeeId}`);
      setEmployee(response.data.data);
      setErrorMessage('');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 404) {
        setErrorMessage(`Employee with ID ${employeeId} not found.`);
      } else if (error.response && error.response.status === 429) {
        // Handle "Too many requests" error
        const retryAfter = error.response.headers['retry-after'] || 5; // Default to 5 seconds if 'retry-after' header is not provided
        console.error('Too many requests. Retrying in', retryAfter, 'seconds...');
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000)); // Wait for the specified time before retrying
        await fetchEmployeeDetails(); // Retry the request
      } else {
        console.error('Error fetching employee details:', error);
        setErrorMessage('Error fetching employee details. Please try again later.');
      }
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (!employee) {
    if (errorMessage) {
      return (
        <div className="employee-details">
          <h1>Employee Details</h1>
          <p>{errorMessage}</p>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      );
    }
    return (
      <div className="employee-details">
        <h1>Employee Details</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="employee-details">
      <h1>Employee Details</h1>
      <p>Name: {employee.employee_name}</p>
      <p>ID: {employee.id}</p>
      <p>Age: {employee.employee_age}</p>
      <p>Salary: {employee.employee_salary}</p>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
};

export default EmployeeDetails;