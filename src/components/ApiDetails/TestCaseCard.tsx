import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';
import CodeEditor from './CodeEditor';

interface TestCase {
  id: string;
  name: string;
  description: string;
  expectedStatus: number;
  expectedResponse: Record<string, unknown>;
  requestBody: Record<string, unknown> | null;
}

interface TestCaseCardProps {
  testCase: TestCase;
  onRunTest: () => void;
  onViewFull: (title: string, content: string) => void;
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({
  testCase,
  onRunTest,
  onViewFull,
}) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success' as const;
    if (status >= 400 && status < 500) return 'error' as const;
    if (status >= 500) return 'error' as const;
    return 'default' as const;
  };

  return (
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {testCase.description}
        </Typography>

        <CodeEditor
          title="Request Body"
          content={testCase.requestBody}
          onViewFull={() =>
            onViewFull(
              'Request Body',
              JSON.stringify(testCase.requestBody, null, 2)
            )
          }
        />

        <Box sx={{ mt: 2 }}>
          <CodeEditor
            title="Expected Response"
            content={testCase.expectedResponse}
            onViewFull={() =>
              onViewFull(
                'Expected Response',
                JSON.stringify(testCase.expectedResponse, null, 2)
              )
            }
          />
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="outlined"
          startIcon={<PlayIcon />}
          onClick={onRunTest}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Run Test
        </Button>
      </CardActions>
    </Card>
  );
};

export default TestCaseCard;
