// src/components/StatsCard.js
import React from 'react';
import styles from './StatsCard.module.css';

/**
 * Premium glassmorphic stat card component
 * Displays a metric with title, value, icon, and optional trend
 */
const StatsCard = ({ title, value, icon, trend, color = 'primary', subtitle }) => {
    const getTrendColor = () => {
        if (!trend) return '';
        return trend > 0 ? 'var(--color-success)' : 'var(--color-error)';
    };

    const getColorClass = () => {
        const colorMap = {
            primary: styles.primary,
            success: styles.success,
            warning: styles.warning,
            error: styles.error,
            info: styles.info,
        };
        return colorMap[color] || styles.primary;
    };

    return (
        <div className={`${styles.statsCard} ${getColorClass()} stat-card`}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                </div>
                {trend !== undefined && (
                    <div className={styles.trend} style={{ color: getTrendColor() }}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.value}>{value}</div>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
        </div>
    );
};

export default StatsCard;
