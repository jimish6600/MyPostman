import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  GetApp as GetIcon,
  PlayArrow as PlayIcon,
  ContentCopy as CopyIcon,
  Fullscreen as FullscreenIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import testCasesData from '../data/testCases.json';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface TestCase {
  id: string;
  name: string;
  description: string;
  expectedStatus: number;
  expectedResponse: Record<string, unknown>;
  requestBody: {
    url: string;
    method: string;
    [key: string]: unknown;
  } | null;
}

interface TestCasesData {
  testCases: {
    [key: string]: {
      name: string;
      testCases: TestCase[];
      responseTimes: number[];
      successTestCases: number[];
    };
  };
}

interface ChartDataPoint {
  name: string;
  responseTime: number;
  successCases: number;
}

interface Api {
  id: string;
  method: string;
  name: string;
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  testCases: TestCase[];
  responseTimes: number[];
  successTestCases: number[];
}

const ApiDetails: React.FC = () => {
  const apiId = '1-1-1'; // Hardcoded for API ID 1
  const apiTestCases =
    (testCasesData as TestCasesData).testCases[apiId]?.testCases || [];
  const apiData = (testCasesData as TestCasesData).testCases[apiId];

  // Prepare chart data
  const chartData: ChartDataPoint[] = apiData.responseTimes.map(
    (time: number, index: number) => ({
      name: `Test ${index + 1}`,
      responseTime: time,
      successCases: apiData.successTestCases[index],
    })
  );

  const getMethodIcon = () => {
    return <GetIcon sx={{ fontSize: 24 }} />;
  };

  const getMethodColor = () => {
    return 'success' as const;
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success' as const;
    if (status >= 400 && status < 500) return 'error' as const;
    if (status >= 500) return 'error' as const;
    return 'default' as const;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState<{
    title: string;
    content: string;
  }>({ title: '', content: '' });

  const handleOpenDialog = (title: string, content: string) => {
    setDialogContent({ title, content });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRunAllTests = () => {
    // Implementation of handleRunAllTests
  };

  const api: Api = {
    id: apiId,
    method: apiTestCases[0].requestBody ? 'POST' : 'GET',
    name: apiTestCases[0].requestBody ? apiTestCases[0].name : 'Get User',
    url: apiTestCases[0].requestBody
      ? apiTestCases[0].requestBody.url
      : '/api/users/{id}',
    headers: {},
    body: apiTestCases[0].requestBody || {},
    testCases: apiTestCases,
    responseTimes: apiData.responseTimes,
    successTestCases: apiData.successTestCases,
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#1a1a1a' }}>
      {/* API Details Section */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: '#2d2d2d',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          borderRadius: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Chip
            icon={getMethodIcon()}
            label={api.method}
            color={getMethodColor()}
            sx={{ px: 2, py: 1 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#e0e0e0' }}>
            {api.name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            startIcon={<ApiIcon />}
            onClick={() =>
              window.open(
                `/api-tester?url=${encodeURIComponent(api.url)}&method=${
                  api.method
                }`,
                '_blank'
              )
            }
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              color: '#9cdcfe',
              borderColor: '#9cdcfe',
              mr: 2,
              '&:hover': {
                borderColor: '#9cdcfe',
                backgroundColor: 'rgba(156, 220, 254, 0.1)',
              },
            }}
          >
            Open in API Tester
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={handleRunAllTests}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Run All Tests
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {api.url}
          </Typography>
          <Tooltip title="Copy URL">
            <IconButton
              size="small"
              onClick={() => copyToClipboard(api.url)}
              sx={{ color: 'text.secondary' }}
            >
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#e0e0e0' }}>
              Headers
            </Typography>
            <Paper
              sx={{
                p: 2,
                backgroundColor: '#1e1e1e',
                border: '1px solid #333',
                color: '#d4d4d4',
                fontFamily: 'monospace',
                borderRadius: 1,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '30px',
                  background: '#252525',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="body2" sx={{ color: '#9cdcfe' }}>
                  Content-Type:{' '}
                  <span style={{ color: '#ce9178' }}>application/json</span>
                </Typography>
              </Box>
            </Paper>
          </Box>
          <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#e0e0e0' }}>
              Body
            </Typography>
            <Paper
              sx={{
                p: 2,
                backgroundColor: '#1e1e1e',
                border: '1px solid #333',
                color: '#d4d4d4',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                position: 'relative',
                borderRadius: 1,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '30px',
                  background: '#252525',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {Object.entries(api.body).map(([key, value], index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'flex-start' }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: '#6a9955',
                        minWidth: '20px',
                        textAlign: 'right',
                        mr: 1,
                        opacity: 0.7,
                      }}
                    >
                      {key}:
                    </Typography>
                    <Typography component="span" sx={{ color: '#d4d4d4' }}>
                      {typeof value === 'object'
                        ? JSON.stringify(value)
                        : value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Paper>

      {/* Test Cases Section */}
      <Typography variant="h5" sx={{ mb: 3, color: '#e0e0e0' }}>
        Test Cases
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {api.testCases.map((testCase) => (
          <Box
            key={testCase.id}
            sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}
          >
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease-in-out',
                backgroundColor: '#2d2d2d',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {testCase.name}
                  </Typography>
                  <Chip
                    label={`Status: ${testCase.expectedStatus}`}
                    color={getStatusColor(testCase.expectedStatus)}
                    size="small"
                  />
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {testCase.description}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: '#e0e0e0' }}>
                    Request Body:
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<FullscreenIcon />}
                    onClick={() =>
                      handleOpenDialog(
                        'Request Body',
                        JSON.stringify(testCase.requestBody, null, 2)
                      )
                    }
                    sx={{ color: '#9cdcfe' }}
                  >
                    View Full
                  </Button>
                </Box>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #333',
                    color: '#d4d4d4',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    position: 'relative',
                    mb: 2,
                    borderRadius: 1,
                    height: '200px',
                    overflow: 'auto',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '30px',
                      background: '#252525',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {testCase.requestBody ? (
                      <Typography variant="body2" sx={{ color: '#9cdcfe' }}>
                        {JSON.stringify(testCase.requestBody, null, 2)
                          .split('\n')
                          .map((line, i) => (
                            <Box
                              key={i}
                              sx={{ display: 'flex', alignItems: 'flex-start' }}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  color: '#6a9955',
                                  minWidth: '20px',
                                  textAlign: 'right',
                                  mr: 1,
                                  opacity: 0.7,
                                }}
                              >
                                {i + 1}
                              </Typography>
                              <Typography
                                component="span"
                                sx={{ color: '#d4d4d4' }}
                              >
                                {line}
                              </Typography>
                            </Box>
                          ))}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#6a9955' }}>
                        No request body required
                      </Typography>
                    )}
                  </Box>
                </Paper>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: '#e0e0e0' }}>
                    Expected Response:
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<FullscreenIcon />}
                    onClick={() =>
                      handleOpenDialog(
                        'Expected Response',
                        JSON.stringify(testCase.expectedResponse, null, 2)
                      )
                    }
                    sx={{ color: '#9cdcfe' }}
                  >
                    View Full
                  </Button>
                </Box>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #333',
                    color: '#d4d4d4',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    position: 'relative',
                    borderRadius: 1,
                    height: '200px',
                    overflow: 'auto',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '30px',
                      background: '#252525',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#9cdcfe' }}>
                      {JSON.stringify(testCase.expectedResponse, null, 2)
                        .split('\n')
                        .map((line, i) => (
                          <Box
                            key={i}
                            sx={{ display: 'flex', alignItems: 'flex-start' }}
                          >
                            <Typography
                              component="span"
                              sx={{
                                color: '#6a9955',
                                minWidth: '20px',
                                textAlign: 'right',
                                mr: 1,
                                opacity: 0.7,
                              }}
                            >
                              {i + 1}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{ color: '#d4d4d4' }}
                            >
                              {line}
                            </Typography>
                          </Box>
                        ))}
                    </Typography>
                  </Box>
                </Paper>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="outlined"
                  startIcon={<ApiIcon />}
                  onClick={() =>
                    window.open(
                      `/api-tester?url=${encodeURIComponent(
                        testCase.requestBody?.url || api.url
                      )}&method=${testCase.requestBody?.method || api.method}`,
                      '_blank'
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    color: '#9cdcfe',
                    borderColor: '#9cdcfe',
                    mr: 1,
                    '&:hover': {
                      borderColor: '#9cdcfe',
                      backgroundColor: 'rgba(156, 220, 254, 0.1)',
                    },
                  }}
                >
                  Open in Tester
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PlayIcon />}
                  onClick={() => handleRunAllTests()}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'rgba(255, 4, 0, 0.1)',
                      backgroundColor: 'rgba(228, 116, 115, 0.1)',
                    },
                  }}
                >
                  Run Test
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Full Content Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            color: '#e0e0e0',
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #333' }}>
          {dialogContent.title}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: '#1e1e1e',
              border: '1px solid #333',
              color: '#d4d4d4',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              position: 'relative',
              borderRadius: 0,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '30px',
                background: '#252525',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="body2" sx={{ color: '#9cdcfe' }}>
                {dialogContent.content.split('\n').map((line, i) => (
                  <Box
                    key={i}
                    sx={{ display: 'flex', alignItems: 'flex-start' }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: '#6a9955',
                        minWidth: '20px',
                        textAlign: 'right',
                        mr: 1,
                        opacity: 0.7,
                      }}
                    >
                      {i + 1}
                    </Typography>
                    <Typography component="span" sx={{ color: '#d4d4d4' }}>
                      {line}
                    </Typography>
                  </Box>
                ))}
              </Typography>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #333' }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#9cdcfe' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Charts Section */}
      <Typography variant="h5" sx={{ mb: 3, mt: 4, color: '#e0e0e0' }}>
        Performance Metrics
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Response Times Chart */}
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
          <Paper
            sx={{
              p: 2,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#2d2d2d',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Response Times (ms)
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Time (ms)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' },
                    }}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [
                      `${value} ms`,
                      'Response Time',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Success Cases Chart */}
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
          <Paper
            sx={{
              p: 2,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#2d2d2d',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Success Test Cases
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Number of Cases',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' },
                    }}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [
                      `${value} cases`,
                      'Success Cases',
                    ]}
                  />
                  <Bar
                    dataKey="successCases"
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ApiDetails;
