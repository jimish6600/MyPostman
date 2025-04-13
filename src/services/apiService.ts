import { ApiItem, Collection } from '../types/api';
import demoData from '../data/demoDb.json';
import { useState, useCallback } from 'react';

export interface Collection {
  id: string;
  name: string;
  files: FileItem[];
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'api';
  items?: ApiItem[];
}

export interface ApiItem {
  id: string;
  name: string;
  type: 'api';
  method: string;
  url: string;
  headers: Array<{
    key: string;
    value: string;
    enabled: boolean;
  }>;
  params?: Array<{
    key: string;
    value: string;
    enabled: boolean;
  }>;
  body?: {
    type: 'raw' | 'form-data';
    format?: string;
    content?: string;
  };
}

export const getCollections = (): Collection[] => {
  return demoData.collections;
};

export const getApiById = (id: string): ApiItem | undefined => {
  for (const collection of demoData.collections) {
    for (const file of collection.files) {
      if (file.type === 'folder' && file.items) {
        const api = file.items.find((item) => item.id === id);
        if (api) return api;
      }
    }
  }
  return undefined;
};

export const useApi = () => {
  const [collections, setCollections] = useState<Collection[]>(
    getCollections()
  );
  const [selectedApi, setSelectedApi] = useState<ApiItem | null>(null);

  const selectApi = useCallback((id: string) => {
    const api = getApiById(id);
    setSelectedApi(api || null);
  }, []);

  const addCollection = useCallback((name: string) => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name,
      files: [],
    };
    setCollections((prev) => [...prev, newCollection]);
  }, []);

  const addApiToCollection = useCallback(
    (collectionId: string, api: Omit<ApiItem, 'id'>) => {
      setCollections((prev) =>
        prev.map((collection) => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              files: [
                ...collection.files,
                {
                  ...api,
                  id: Date.now().toString(),
                },
              ],
            };
          }
          return collection;
        })
      );
    },
    []
  );

  return {
    collections,
    selectedApi,
    selectApi,
    addCollection,
    addApiToCollection,
  };
};
