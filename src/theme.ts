import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#1A1A1A',
      paper: '#2D2D2D',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2D2D2D',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2D2D2D',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 107, 0.2)',
            },
          },
        },
      },
    },
  },
});
