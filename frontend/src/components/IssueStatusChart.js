// src/components/IssueStatusChart.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from './Charts.module.css';

/**
 * Pie chart displaying issue status distribution
 */
const IssueStatusChart = ({ data }) => {
    const COLORS = {
        open: '#3b82f6',
        in_progress: '#f59e0b',
        closed: '#10b981',
    };

    const chartData = [
        { name: 'Open', value: data?.open || 0, color: COLORS.open },
        { name: 'In Progress', value: data?.in_progress || 0, color: COLORS.in_progress },
        { name: 'Closed', value: data?.closed || 0, color: COLORS.closed },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.tooltip}>
                    <p className={styles.tooltipLabel}>{payload[0].name}</p>
                    <p className={styles.tooltipValue}>{payload[0].value} issues</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`${styles.chartContainer} glass`}>
            <h3 className={styles.chartTitle}>Issue Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ color: '#cbd5e1' }}
                        formatter={(value) => <span style={{ color: '#cbd5e1' }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IssueStatusChart;
