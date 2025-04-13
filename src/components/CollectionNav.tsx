import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApi, FileItem, ApiItem } from '../services/apiService';

const CollectionNav: React.FC = () => {
  const navigate = useNavigate();
  const { collections, selectApi } = useApi();
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(
    new Set()
  );

  const handleFolderClick = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleApiClick = (apiId: string) => {
    selectApi(apiId);
    navigate(`/api-tester/${apiId}`);
  };

  const renderFile = (file: FileItem | ApiItem, level: number = 0) => {
    const isFolder = file.type === 'folder';
    const isExpanded = expandedFolders.has(file.id);

    return (
      <React.Fragment key={file.id}>
        <ListItem
          sx={{
            pl: level * 2,
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
          }}
          onClick={() =>
            isFolder ? handleFolderClick(file.id) : handleApiClick(file.id)
          }
        >
          <ListItemIcon>
            {isFolder ? (
              isExpanded ? (
                <FolderOpenIcon />
              ) : (
                <FolderIcon />
              )
            ) : (
              <ApiIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={file.name} />
        </ListItem>
        {isFolder && 'items' in file && file.items && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {file.items.map((item) => renderFile(item, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      <List>
        {collections.map((collection) => (
          <React.Fragment key={collection.id}>
            <ListItem
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
              }}
              onClick={() => handleFolderClick(collection.id)}
            >
              <ListItemIcon>
                {expandedFolders.has(collection.id) ? (
                  <FolderOpenIcon />
                ) : (
                  <FolderIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={collection.name} />
            </ListItem>
            <Collapse
              in={expandedFolders.has(collection.id)}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {collection.files.map((file: FileItem | ApiItem) =>
                  renderFile(file, 1)
                )}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default CollectionNav;
