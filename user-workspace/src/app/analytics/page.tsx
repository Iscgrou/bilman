'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await axios.get('/api/analytics/kpis');
        setData(response.data);
      } catch (err) {
        setError('خطا در بارگذاری داده‌های تحلیلی');
      }
    }
    fetchAnalytics();
  }, []);

  if (error) {
    return <p className="text-red-600 text-center mt-4">{error}</p>;
  }

  if (!data) {
    return <p className="text-center mt-4">در حال بارگذاری...</p>;
  }

  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: 'فروش ماهانه',
        data: data.monthlySales,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
    ],
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-black">داشبورد تحلیلی نمایندگان</h1>
      <div className="bg-white p-6 rounded shadow">
        <Bar data={chartData} />
        {/* Additional KPIs and alerts can be added here */}
      </div>
    </main>
  );
}
