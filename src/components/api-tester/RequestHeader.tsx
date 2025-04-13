import {
  Stack,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface RequestHeaderProps {
  method: string;
  url: string;
  loading: boolean;
  onMethodChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onSend: () => void;
}

export default function RequestHeader({
  method,
  url,
  loading,
  onMethodChange,
  onUrlChange,
  onSend,
}: RequestHeaderProps) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControl size="small" sx={{ width: 140 }}>
        <Select
          value={method}
          onChange={(e) => onMethodChange(e.target.value)}
          sx={{ height: 40 }}
        >
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
        </Select>
      </FormControl>
      <TextField
        size="small"
        fullWidth
        placeholder="Enter URL or paste text"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 40,
            backgroundColor: 'action.hover',
          },
        }}
      />
      <Button
        variant="contained"
        onClick={onSend}
        disabled={loading || !url}
        endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
      >
        Send
      </Button>
    </Stack>
  );
}
