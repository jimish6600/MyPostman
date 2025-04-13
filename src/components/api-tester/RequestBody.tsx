import {
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Paper,
  Stack,
  Button,
  SelectChangeEvent,
  Typography,
  useTheme,
  IconButton,
  Checkbox,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';

interface FormDataItem {
  key: string;
  value: string;
  enabled: boolean;
  type: 'text' | 'file';
  file?: File;
}

interface RequestBodyProps {
  method: string;
  bodyType: 'form-data' | 'raw';
  rawFormat: string;
  requestBody: string;
  formData: Array<FormDataItem>;
  onBodyTypeChange: (type: 'form-data' | 'raw') => void;
  onRawFormatChange: (format: string) => void;
  onRequestBodyChange: (body: string) => void;
  onFormDataChange: (
    index: number,
    field: keyof FormDataItem,
    value: string | boolean | File
  ) => void;
  onDeleteFormData: (index: number) => void;
}

export default function RequestBody({
  method,
  bodyType,
  rawFormat,
  requestBody,
  formData,
  onBodyTypeChange,
  onRawFormatChange,
  onRequestBodyChange,
  onFormDataChange,
  onDeleteFormData,
}: RequestBodyProps) {
  const theme = useTheme();

  const handleFileChange = (index: number, file: File | null) => {
    if (file) {
      console.log(file);
      onFormDataChange(index, 'file', file);
    }
  };

  const handleFormDataChange = (
    index: number,
    field: keyof FormDataItem,
    value: string | boolean | File
  ) => {
    onFormDataChange(index, field, value);
  };

  const handleDeleteFormData = (index: number) => {
    // Don't delete if it's the last row
    if (formData.length > 1) {
      onDeleteFormData(index);
    }
  };

  const renderEditor = () => {
    if (bodyType === 'raw') {
      return (
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            height: '400px',
            overflow: 'hidden',
            bgcolor: 'action.hover',
          }}
        >
          <Editor
            height="400px"
            defaultLanguage={getLanguage()}
            language={getLanguage()}
            value={requestBody}
            onChange={(value) => onRequestBodyChange(value || '')}
            theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
            options={{
              readOnly: false,
              minimap: { enabled: false },
              fontSize: 14,
              formatOnPaste: true,
              formatOnType: true,
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              tabSize: 2,
            }}
          />
        </Paper>
      );
    }

    return null;
  };

  const getLanguage = () => {
    switch (rawFormat) {
      case 'JSON':
        return 'json';
      case 'XML':
        return 'xml';
      case 'HTML':
        return 'html';
      default:
        return 'plaintext';
    }
  };

  if (method === 'GET') {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">
          Request body is not available for GET requests
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2} width="100%">
      <ToggleButtonGroup
        value={bodyType}
        exclusive
        onChange={(_, value) => value && onBodyTypeChange(value)}
        aria-label="body type"
      >
        <ToggleButton value="form-data">form-data</ToggleButton>
        <ToggleButton value="raw">raw</ToggleButton>
      </ToggleButtonGroup>

      {bodyType === 'raw' && (
        <>
          <FormControl fullWidth size="small">
            <Select
              value={rawFormat}
              onChange={(e: SelectChangeEvent) =>
                onRawFormatChange(e.target.value)
              }
            >
              <MenuItem value="JSON">JSON</MenuItem>
              <MenuItem value="XML">XML</MenuItem>
              <MenuItem value="HTML">HTML</MenuItem>
              <MenuItem value="Text">Text</MenuItem>
            </Select>
          </FormControl>
          {renderEditor()}
        </>
      )}

      {bodyType === 'form-data' && (
        <Paper variant="outlined" sx={{ p: 2, width: '100%' }}>
          <Stack
            spacing={2}
            sx={{
              maxHeight: '200px',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '3px',
                '&:hover': {
                  background: '#555',
                },
              },
            }}
          >
            {formData.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Checkbox
                  checked={item.enabled}
                  onChange={(e) =>
                    handleFormDataChange(index, 'enabled', e.target.checked)
                  }
                  size="small"
                />
                <TextField
                  size="small"
                  placeholder="Key"
                  value={item.key}
                  onChange={(e) =>
                    handleFormDataChange(index, 'key', e.target.value)
                  }
                  sx={{ flex: 1 }}
                />
                {item.type === 'text' ? (
                  <TextField
                    size="small"
                    placeholder="Value"
                    value={item.value}
                    onChange={(e) =>
                      handleFormDataChange(index, 'value', e.target.value)
                    }
                    sx={{ flex: 1 }}
                  />
                ) : (
                  <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    <TextField
                      size="small"
                      placeholder="File"
                      value={item.value}
                      disabled
                      sx={{ flex: 1 }}
                    />
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<UploadIcon />}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          handleFileChange(index, e.target.files?.[0] || null)
                        }
                      />
                    </Button>
                  </Stack>
                )}
                <Select
                  size="small"
                  value={item.type}
                  onChange={(e) =>
                    handleFormDataChange(index, 'type', e.target.value)
                  }
                  sx={{ width: 100 }}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="file">File</MenuItem>
                </Select>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteFormData(index)}
                  color="error"
                  disabled={formData.length === 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
