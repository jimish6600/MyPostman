import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  GetApp as GetIcon,
  PlayArrow as PlayIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';

interface ApiHeaderProps {
  method: string;
  name: string;
  url: string;
  onRunAllTests: () => void;
  onCopyUrl: () => void;
}

const ApiHeader: React.FC<ApiHeaderProps> = ({
  method,
  name,
  url,
  onRunAllTests,
  onCopyUrl,
}) => {
  const getMethodIcon = () => {
    return <GetIcon sx={{ fontSize: 24 }} />;
  };

  const getMethodColor = () => {
    return 'success' as const;
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
      <Chip
        icon={getMethodIcon()}
        label={method}
        color={getMethodColor()}
        sx={{ px: 2, py: 1 }}
      />
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {name}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Button
        variant="contained"
        startIcon={<PlayIcon />}
        onClick={onRunAllTests}
        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
      >
        Run All Tests
      </Button>
    </Stack>
  );
};

export default ApiHeader;
