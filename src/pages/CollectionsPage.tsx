import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Add as AddIcon,
  GetApp as GetIcon,
  Send as PostIcon,
  SystemUpdateAlt as PutIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../services/apiService';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'api';
  method?: string;
  url?: string;
  items?: FileItem[];
}

interface Collection {
  id: string;
  name: string;
  type: 'folder' | 'api';
  method?: string;
  url?: string;
  files?: FileItem[];
}

const CollectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { collections } = useApi();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newItemType, setNewItemType] = React.useState<'folder' | 'api'>(
    'folder'
  );
  const [newItemName, setNewItemName] = React.useState('');
  const [newItemMethod, setNewItemMethod] = React.useState('GET');
  const [newItemUrl, setNewItemUrl] = React.useState('');

  const handleItemClick = (item: Collection) => {
    if (item.type === 'folder') {
      navigate(`/collections/${item.id}`);
    } else if (item.type === 'api') {
      navigate(`/api-details/${item.id}`);
    }
  };

  const handleCreateNew = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewItemType('folder');
    setNewItemName('');
    setNewItemMethod('GET');
    setNewItemUrl('');
  };

  const handleCreateItem = () => {
    // TODO: Implement creation logic
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 0, maxWidth: '1400px', margin: '0 auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: 'primary.main' }}
        >
          Collections
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
        >
          Create New
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        {collections.map((collection: Collection) => (
          <Card
            key={collection.id}
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
              minWidth: { xs: '100%', sm: '300px' },
            }}
          >
            <CardActionArea
              onClick={() => handleItemClick(collection)}
              sx={{ height: '100%' }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  p: 4,
                }}
              >
                {collection.type === 'folder' ? (
                  <>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'primary.light',
                        borderRadius: 2,
                        color: 'primary.main',
                      }}
                    >
                      <FolderIcon sx={{ fontSize: 36 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {collection.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        {collection.files?.length || 0} items
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          collection.method === 'GET'
                            ? '#e3f2fd'
                            : collection.method === 'POST'
                            ? '#e8f5e9'
                            : collection.method === 'PUT'
                            ? '#fff3e0'
                            : collection.method === 'DELETE'
                            ? '#ffebee'
                            : '#f5f5f5',
                        borderRadius: 2,
                        color:
                          collection.method === 'GET'
                            ? '#1976d2'
                            : collection.method === 'POST'
                            ? '#2e7d32'
                            : collection.method === 'PUT'
                            ? '#ed6c02'
                            : collection.method === 'DELETE'
                            ? '#d32f2f'
                            : '#757575',
                      }}
                    >
                      {collection.method === 'GET' && (
                        <GetIcon sx={{ fontSize: 36 }} />
                      )}
                      {collection.method === 'POST' && (
                        <PostIcon sx={{ fontSize: 36 }} />
                      )}
                      {collection.method === 'PUT' && (
                        <PutIcon sx={{ fontSize: 36 }} />
                      )}
                      {collection.method === 'DELETE' && (
                        <DeleteIcon sx={{ fontSize: 36 }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {collection.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                          display: 'block',
                        }}
                      >
                        {collection.url}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: '500px',
            width: '100%',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Create New Item</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Type"
            value={newItemType}
            onChange={(e) => setNewItemType(e.target.value as 'folder' | 'api')}
            fullWidth
            sx={{ mt: 2 }}
            variant="outlined"
          >
            <MenuItem value="folder">Folder</MenuItem>
            <MenuItem value="api">API</MenuItem>
          </TextField>
          <TextField
            label="Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            variant="outlined"
          />
          {newItemType === 'api' && (
            <>
              <TextField
                select
                label="Method"
                value={newItemMethod}
                onChange={(e) => setNewItemMethod(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
                variant="outlined"
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </TextField>
              <TextField
                label="URL"
                value={newItemUrl}
                onChange={(e) => setNewItemUrl(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              textTransform: 'none',
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateItem}
            variant="contained"
            sx={{
              textTransform: 'none',
              px: 3,
              borderRadius: 2,
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollectionsPage;
