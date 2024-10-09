// import './Menu.css'; Make sure to include your CSS styles
import React, { useEffect, useState, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Income',
      data: [12, 19, 3, 5, 2, 3, 18],
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.1,
    },
    {
      label: 'Expenses',
      data: [8, 11, 5, 6, 9, 10, 13],
      borderColor: 'rgba(255,99,132,1)',
      tension: 0.1,
    },
  ],
};

const ordersSummaryData = {
  labels: ['Jun 24', 'Jun 25', 'Jun 26', 'Jun 27'],
  datasets: [
    {
      label: 'Orders',
      data: [12000, 15000, 10000, 14000],
      backgroundColor: 'rgba(75,192,192,1)',
    },
    {
      label: 'Deliveries',
      data: [9000, 13000, 9000, 12000],
      backgroundColor: 'rgba(153,102,255,1)',
    },
  ],
};

const ProgressBar = ({ value }) => (
  <div className="progress">
    <div className="progress-bar" style={{ width: `${value}%` }}>
      {value}%
    </div>
  </div>
);

const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = new Chart(chartRef.current, {
      type: 'line',
      data: revenueData,
    });

    // Cleanup to destroy the chart when component unmounts
    return () => {
      chartInstance.destroy();
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

const BarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = new Chart(chartRef.current, {
      type: 'bar',
      data: ordersSummaryData,
    });

    // Cleanup to destroy the chart when component unmounts
    return () => {
      chartInstance.destroy();
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

const Dashboard = () => {
  return (
    <>
    <div className='bg-light shadow-lg p-4'> 
      <h1>Dashboard</h1>
    </div>
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-dark">
            <div className="card-body">
              <h5 className="card-title">120</h5>
              <p className="card-text">Total Menus</p>
              <ProgressBar value={45} />
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">180</h5>
              <p className="card-text">Total Orders Today</p>
              <ProgressBar value={62} />
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">240</h5>
              <p className="card-text">Total Clients Today</p>
              <ProgressBar value={80} />
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">140</h5>
              <p className="card-text">Revenue Day Ratio</p>
              <ProgressBar value={85} />
            </div>
          </div>
        </div>
      </div>

      <div className="row pt-5">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Revenue</h5>
              <LineChart />
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Orders Summary</h5>
              <BarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;