import { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Api as ApiIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import ApiTesterPage from './ApiTesterPage';

// Sample data for demonstration
const responseTimes = [100, 150, 120, 180, 200, 160, 140, 170, 190, 130];
const successRates = [95, 98, 97, 96, 99, 98, 97, 96, 98, 97];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
            API Tester
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<ApiIcon />}
              onClick={() => navigate('/dashboard/api-tester')}
            >
              API Test
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, pt: 8, px: 3 }}>
        <Routes>
          <Route
            path="/"
            element={
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Response Time Trend
                    </Typography>
                    <LineChart
                      xAxis={[{ data: responseTimes.map((_, i) => i + 1) }]}
                      series={[
                        {
                          data: responseTimes,
                          label: 'Response Time (ms)',
                        },
                      ]}
                      width={500}
                      height={300}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Success Rate Trend
                    </Typography>
                    <LineChart
                      xAxis={[{ data: successRates.map((_, i) => i + 1) }]}
                      series={[
                        {
                          data: successRates,
                          label: 'Success Rate (%)',
                        },
                      ]}
                      width={500}
                      height={300}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <SpeedIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          Average Response Time
                        </Typography>
                      </Box>
                      <Typography variant="h4">
                        {Math.round(
                          responseTimes.reduce((a, b) => a + b, 0) /
                            responseTimes.length
                        )}
                        ms
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <TimelineIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Success Rate</Typography>
                      </Box>
                      <Typography variant="h4">
                        {Math.round(
                          successRates.reduce((a, b) => a + b, 0) /
                            successRates.length
                        )}
                        %
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <ApiIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Total Requests</Typography>
                      </Box>
                      <Typography variant="h4">
                        {responseTimes.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            }
          />
          <Route path="/api-tester" element={<ApiTesterPage />} />
        </Routes>
      </Box>
    </Box>
  );
}
