import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface ChartDataPoint {
  name: string;
  responseTime: number;
  successCases: number;
}

interface PerformanceMetricsProps {
  chartData: ChartDataPoint[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  chartData,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#e0e0e0' }}>
        Performance Metrics
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper
          sx={{
            p: 2,
            flex: 1,
            minWidth: '300px',
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#e0e0e0' }}>
            Response Times
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="name"
                  stroke="#e0e0e0"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#e0e0e0"
                  label={{
                    value: 'ms',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#e0e0e0',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2d2d2d',
                    border: '1px solid #333',
                    color: '#e0e0e0',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#9cdcfe"
                  strokeWidth={2}
                  dot={{ fill: '#9cdcfe' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2,
            flex: 1,
            minWidth: '300px',
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#e0e0e0' }}>
            Success Test Cases
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="name"
                  stroke="#e0e0e0"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#e0e0e0"
                  label={{
                    value: 'cases',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#e0e0e0',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2d2d2d',
                    border: '1px solid #333',
                    color: '#e0e0e0',
                  }}
                />
                <Bar
                  dataKey="successCases"
                  fill="#6a9955"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default PerformanceMetrics;
