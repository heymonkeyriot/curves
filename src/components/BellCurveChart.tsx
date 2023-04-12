import React from 'react';
import { Line } from 'react-chartjs-2';
import { ResponseCounts } from '../utils/processData'
import { ChartData, ChartOptions } from 'chart.js';
import 'chart.js/auto';

interface BellCurveChartProps {
    data: number[];
    responseCounts: ResponseCounts;
    maxCount: number;
}


const BellCurveChart: React.FC<BellCurveChartProps> = ({
    data,
    responseCounts,
    maxCount,
}) => {
    const chartData: ChartData<'line'> = {
        labels: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        datasets: [
            {
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.35, // This value controls the smoothness of the line
            },
        ],
    };

    const chartOptions: ChartOptions<'line'> = {
        elements: {
            point: {
                radius: 0,
            },
        },
        scales: {
            x: {
                grid: { color: "rgba(0, 0, 0, 0)", },
                ticks: {
                    display: false,
                    // beginAtZero: true,
                },
            },
            y: {
                max: maxCount,
                grid: { color: "rgba(0, 0, 0, 0)", },
                ticks: {
                    stepSize: 4,
                    // beginAtZero: true,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };


    // Render the key-value pairs with responsive styles
    const renderKeyValuePairs = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mt-2">
            {Object.entries(responseCounts).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center justify-center">
                    <span className="mr-1 text-sm text-gray-600">{key}</span>
                    <span className="mr-1 text-sm font-bold text-gray-800">{String(value).padStart(2, '0')}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full h-full">
            <Line data={chartData} options={chartOptions} />
            {renderKeyValuePairs()}
        </div>
    );
};

export default BellCurveChart;
