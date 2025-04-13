import { Box, Paper, Typography, Chip, useTheme } from '@mui/material';
import Editor from '@monaco-editor/react';

interface ResponseViewerProps {
  error?: string;
  response?: string;
  statusCode?: number;
  responseTime?: number;
}

const getStatusColor = (status?: number) => {
  if (!status) return 'default';
  if (status < 200) return 'info';
  if (status < 300) return 'success';
  if (status < 400) return 'warning';
  return 'error';
};

const getStatusText = (status?: number) => {
  if (!status) return 'No Response';
  if (status < 200) return 'Information';
  if (status < 300) return 'Success';
  if (status < 400) return 'Redirect';
  if (status < 500) return 'Client Error';
  return 'Server Error';
};

export default function ResponseViewer({
  error,
  response,
  statusCode,
  responseTime,
}: ResponseViewerProps) {
  const theme = useTheme();

  const renderContent = () => {
    if (error) {
      return (
        <Box sx={{ p: 2 }}>
          <Typography color="error.main" sx={{ whiteSpace: 'pre-wrap' }}>
            {error}
          </Typography>
        </Box>
      );
    }

    if (!response) {
      return (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Enter the URL and click Send to get a response
          </Typography>
        </Box>
      );
    }

    try {
      // Try to parse as JSON for proper formatting
      const parsedJson = JSON.parse(response);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      return (
        <Box sx={{ position: 'relative', width: '100%', height: 'calc(100vh - 450px)' }}>
          <Editor
            defaultLanguage="json"
            value={formattedJson}
            theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              domReadOnly: true,
              renderValidationDecorations: 'off',
              fixedOverflowWidgets: true,
            }}
            loading={<Typography>Loading editor...</Typography>}
            height="calc(100vh - 450px)"
          />
        </Box>
      );
    } catch {
      // If not JSON, show as plain text
      return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <Editor
            defaultLanguage="plaintext"
            value={response}
            theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              domReadOnly: true,
              renderValidationDecorations: 'off',
              fixedOverflowWidgets: true,
            }}
            loading={<Typography>Loading editor...</Typography>}
            height="calc(100vh - 400px)"
          />
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 400px)',
        minHeight: '300px',
        maxHeight: '600px',
      }}
    >
      {(statusCode || responseTime) && (
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'action.hover',
          }}
        >
          {statusCode && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={statusCode}
                color={getStatusColor(statusCode)}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {getStatusText(statusCode)}
              </Typography>
            </Box>
          )}
          {responseTime && (
            <Typography variant="body2" color="text.secondary">
              Time: {responseTime}ms
            </Typography>
          )}
        </Paper>
      )}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          mt: 1,
          position: 'relative',
          height: 'calc(100vh - 450px)',
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
}
