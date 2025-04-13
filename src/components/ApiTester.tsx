import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ApiTester() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [responseTime, setResponseTime] = useState<number[]>([]);
  const [error, setError] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    const startTime = performance.now();

    try {
      const config = {
        method,
        url,
        data: method !== 'GET' ? JSON.parse(requestBody) : undefined,
      };

      const res = await axios(config);
      const endTime = performance.now();
      const timeTaken = endTime - startTime;

      setResponse(JSON.stringify(res.data, null, 2));
      setResponseTime((prev) => [...prev, timeTaken].slice(-10)); // Keep last 10 response times
    } catch (err: any) {
      setError(err.message);
      setResponse('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Method</InputLabel>
            <Select
              value={method}
              label="Method"
              onChange={(e) => setMethod(e.target.value)}
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
          />
          <Button
            variant="contained"
            onClick={handleSendRequest}
            disabled={loading || !url}
          >
            {loading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </Box>

        {method !== 'GET' && (
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Request Body"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            placeholder="Enter JSON request body"
          />
        )}
      </Paper>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Response" />
            <Tab label="Performance" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : response ? (
            <pre style={{ margin: 0 }}>{response}</pre>
          ) : (
            <Typography>Send a request to see the response</Typography>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {responseTime.length > 0 ? (
            <LineChart
              xAxis={[{ data: responseTime.map((_, i) => i + 1) }]}
              series={[
                {
                  data: responseTime,
                  label: 'Response Time (ms)',
                },
              ]}
              width={500}
              height={300}
            />
          ) : (
            <Typography>Send requests to see performance metrics</Typography>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}
