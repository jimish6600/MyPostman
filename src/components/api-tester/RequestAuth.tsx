import {
  Paper,
  Stack,
  FormControl,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from '@mui/material';

interface RequestAuthProps {
  authType: string;
  authToken: string;
  onAuthTypeChange: (type: string) => void;
  onAuthTokenChange: (token: string) => void;
}

export default function RequestAuth({
  authType,
  authToken,
  onAuthTypeChange,
  onAuthTokenChange,
}: RequestAuthProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <FormControl fullWidth size="small">
          <Select
            value={authType}
            onChange={(e: SelectChangeEvent) =>
              onAuthTypeChange(e.target.value)
            }
          >
            <MenuItem value="none">No Auth</MenuItem>
            <MenuItem value="bearer">Bearer Token</MenuItem>
            <MenuItem value="basic">Basic Auth</MenuItem>
          </Select>
        </FormControl>
        {authType !== 'none' && (
          <TextField
            fullWidth
            size="small"
            placeholder={
              authType === 'bearer'
                ? 'Bearer Token'
                : 'Username:Password (Base64 encoded)'
            }
            value={authToken}
            onChange={(e) => onAuthTokenChange(e.target.value)}
          />
        )}
      </Stack>
    </Paper>
  );
}
