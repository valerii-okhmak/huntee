import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Diagram = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // 🔹 зберігаємо інстанс графіка

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // 🔥 Знищуємо попередню діаграму, якщо вона вже існує
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // 🎯 Створюємо нову діаграму
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Backend', 'Frontend', 'QA', 'DevOps', 'Data Science', 'UI/UX'],
        datasets: [{
          label: 'Середня оцінка',
          data: [89, 75, 92, 68, 80, 85],
          backgroundColor: [
            '#001F66',
            '#08308E',
            '#1E4CB6',
            '#2083E6',
            '#4B9EF2',
            '#4BBAF2'
          ],
          borderRadius: 5,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            },
            title: {
              display: true,
              text: 'Середня оцінка'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Напрям'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });

    // 🧹 Повертаємо функцію очищення при демонтажі компонента
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <canvas ref={chartRef}></canvas>
  );
};

export default Diagram;
