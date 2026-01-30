import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'chart.js/auto';

const Diagram = () => {
  const { t } = useTranslation();
  const chartRef = useRef(null);
  const chartInstance = useRef(null); 

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Backend', 'Frontend', 'QA', 'DevOps', 'Data Science', 'UI/UX'],
        datasets: [{
          label: t('diagram.averageScore'),
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
              text: t('diagram.averageScore')
            }
          },
          x: {
            title: {
              display: true,
              text: t('diagram.direction')
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

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [t]); 

  return (
    <canvas ref={chartRef}></canvas>
  );
};

export default Diagram;