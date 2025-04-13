import { Paper, Stack, TextField, IconButton, Checkbox } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface ParamItem {
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestParamsProps {
  params: Array<ParamItem>;
  onParamChange: (
    index: number,
    field: keyof ParamItem,
    value: string | boolean
  ) => void;
  onDeleteParam: (index: number) => void;
}

export default function RequestParams({
  params,
  onParamChange,
  onDeleteParam,
}: RequestParamsProps) {
  const handleParamChange = (
    index: number,
    field: keyof ParamItem,
    value: string | boolean
  ) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };

    // If this is the last row and the key field is being changed to a non-empty value
    if (
      field === 'key' &&
      index === params.length - 1 &&
      value &&
      typeof value === 'string' &&
      value.trim() !== ''
    ) {
      newParams.push({ key: '', value: '', enabled: true });
    }

    onParamChange(index, field, value);
  };

  const handleDeleteParam = (index: number) => {
    // Don't delete if it's the last row
    if (params.length > 1) {
      onDeleteParam(index);
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
        {params.map((param, index) => (
          <Stack key={index} direction="row" spacing={2} alignItems="center">
            <Checkbox
              checked={param.enabled}
              onChange={(e) =>
                handleParamChange(index, 'enabled', e.target.checked)
              }
              size="small"
            />
            <TextField
              size="small"
              placeholder="Key"
              value={param.key}
              onChange={(e) => handleParamChange(index, 'key', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              placeholder="Value"
              value={param.value}
              onChange={(e) =>
                handleParamChange(index, 'value', e.target.value)
              }
              sx={{ flex: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => handleDeleteParam(index)}
              color="error"
              disabled={params.length === 1}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
