import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ApiItem } from '../services/apiService';

interface ApiDetailsProps {
  api: ApiItem;
}

const ApiDetails: React.FC<ApiDetailsProps> = ({ api }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Chip
              label={api.method}
              color={
                api.method === 'GET'
                  ? 'success'
                  : api.method === 'POST'
                  ? 'primary'
                  : api.method === 'PUT'
                  ? 'warning'
                  : api.method === 'DELETE'
                  ? 'error'
                  : 'default'
              }
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{api.name}</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {api.url}
        </Typography>
      </Paper>

      {api.headers && api.headers.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Headers
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {api.headers.map((header, index) => (
              <ListItem key={index}>
                <ListItemText primary={header.key} secondary={header.value} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {api.params && api.params.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Parameters
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {api.params.map((param, index) => (
              <ListItem key={index}>
                <ListItemText primary={param.key} secondary={param.value} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {api.body && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Body
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="body2"
            component="pre"
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              overflow: 'auto',
            }}
          >
            {typeof api.body === 'string'
              ? api.body
              : JSON.stringify(api.body, null, 2)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ApiDetails;
