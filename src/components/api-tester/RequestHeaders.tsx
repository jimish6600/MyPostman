import { Paper, Stack, TextField, IconButton, Checkbox } from '@mui/material';import { Delete as DeleteIcon } from '@mui/icons-material';

interface HeaderItem {
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestHeadersProps {
  headers: Array<HeaderItem>;
  onHeaderChange: (
    index: number,
    field: keyof HeaderItem,
    value: string | boolean
  ) => void;
  onDeleteHeader: (index: number) => void;
}

export default function RequestHeaders({
  headers,
  onHeaderChange,
  onDeleteHeader,
}: RequestHeadersProps) {
  const handleHeaderChange = (
    index: number,
    field: keyof HeaderItem,
    value: string | boolean
  ) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };

    // If this is the last row and the key field is being changed to a non-empty value
    if (
      field === 'key' &&
      index === headers.length - 1 &&
      value &&
      typeof value === 'string' &&
      value.trim() !== ''
    ) {
      newHeaders.push({ key: '', value: '', enabled: true });
    }

    onHeaderChange(index, field, value);
  };

  const handleDeleteHeader = (index: number) => {
    // Don't delete if it's the last row
    if (headers.length > 1) {
      onDeleteHeader(index);
    }
  };

  return (
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
        {headers.map((header, index) => (
          <Stack key={index} direction="row" spacing={2} alignItems="center">
            <Checkbox
              checked={header.enabled}
              onChange={(e) =>
                handleHeaderChange(index, 'enabled', e.target.checked)
              }
              size="small"
            />
            <TextField
              size="small"
              placeholder="Key"
              value={header.key}
              onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              placeholder="Value"
              value={header.value}
              onChange={(e) =>
                handleHeaderChange(index, 'value', e.target.value)
              }
              sx={{ flex: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => handleDeleteHeader(index)}
              color="error"
              disabled={headers.length === 1}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
