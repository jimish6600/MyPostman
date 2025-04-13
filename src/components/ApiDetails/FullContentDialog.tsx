import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
} from '@mui/material';

interface FullContentDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const FullContentDialog: React.FC<FullContentDialogProps> = ({
  open,
  title,
  content,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#2d2d2d',
          color: '#e0e0e0',
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #333' }}>{title}</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Paper
          sx={{
            p: 2,
            backgroundColor: '#1e1e1e',
            border: '1px solid #333',
            color: '#d4d4d4',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            position: 'relative',
            borderRadius: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '30px',
              background: '#252525',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="body2" sx={{ color: '#9cdcfe' }}>
              {content.split('\n').map((line, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start' }}>
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
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #333' }}>
        <Button onClick={onClose} sx={{ color: '#9cdcfe' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FullContentDialog;
