import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Fullscreen as FullscreenIcon } from '@mui/icons-material';

interface CodeEditorProps {
  title: string;
  content: string | null;
  onViewFull: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  title,
  content,
  onViewFull,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: '#e0e0e0' }}>
          {title}:
        </Typography>
        <Button
          size="small"
          startIcon={<FullscreenIcon />}
          onClick={onViewFull}
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
          {content ? (
            <Typography variant="body2" sx={{ color: '#9cdcfe' }}>
              {JSON.stringify(content, null, 2)
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
                    <Typography component="span" sx={{ color: '#d4d4d4' }}>
                      {line}
                    </Typography>
                  </Box>
                ))}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: '#6a9955' }}>
              No content required
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CodeEditor;
