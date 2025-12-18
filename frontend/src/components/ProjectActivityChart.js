// src/components/ProjectActivityChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from './Charts.module.css';

/**
 * Bar chart showing project activity over time
 */
const ProjectActivityChart = ({ data }) => {
    const chartData = data || [
        { name: 'Mon', issues: 0, comments: 0 },
        { name: 'Tue', issues: 0, comments: 0 },
        { name: 'Wed', issues: 0, comments: 0 },
        { name: 'Thu', issues: 0, comments: 0 },
        { name: 'Fri', issues: 0, comments: 0 },
        { name: 'Sat', issues: 0, comments: 0 },
        { name: 'Sun', issues: 0, comments: 0 },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.tooltip}>
                    <p className={styles.tooltipLabel}>{payload[0].payload.name}</p>
                    <p className={styles.tooltipValue} style={{ color: '#6366f1' }}>
                        Issues: {payload[0].value}
                    </p>
                    {payload[1] && (
                        <p className={styles.tooltipValue} style={{ color: '#8b5cf6' }}>
                            Comments: {payload[1].value}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`${styles.chartContainer} glass`}>
            <h3 className={styles.chartTitle}>Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8' }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ color: '#cbd5e1' }}
                        formatter={(value) => (
                            <span style={{ color: '#cbd5e1', textTransform: 'capitalize' }}>{value}</span>
                        )}
                    />
                    <Bar
                        dataKey="issues"
                        fill="#6366f1"
                        radius={[8, 8, 0, 0]}
                        animationBegin={0}
                        animationDuration={800}
                    />
                    <Bar
                        dataKey="comments"
                        fill="#8b5cf6"
                        radius={[8, 8, 0, 0]}
                        animationBegin={200}
                        animationDuration={800}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProjectActivityChart;
