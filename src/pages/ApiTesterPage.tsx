import { useState, useEffect } from 'react';
import { Box, Paper, Tab, Tabs, Divider } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useApi } from '../services/apiService';
import RequestHeader from '../components/api-tester/RequestHeader';
import RequestBody from '../components/api-tester/RequestBody';
import RequestParams from '../components/api-tester/RequestParams';
import RequestHeaders from '../components/api-tester/RequestHeaders';
import RequestAuth from '../components/api-tester/RequestAuth';
import ResponseViewer from '../components/api-tester/ResponseViewer';

interface ApiItem {
  id: string;
  name: string;
  type: string;
  method: string;
  url: string;
  headers?: Array<{ key: string; value: string; enabled?: boolean }>;
  params?: Array<{ key: string; value: string; enabled?: boolean }>;
  body?: {
    type: 'raw' | 'form-data';
    format?: string;
    content:
      | string
      | Array<{ key: string; value: string; enabled?: boolean; type?: string }>;
  };
  items?: ApiItem[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{
        width: '100%',
        height: '100%',
        display: value === index ? 'block' : 'none',
        p: 2,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

export default function ApiTesterPage() {
  const { id } = useParams<{ id: string }>();
  const { collections } = useApi();
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [bodyType, setBodyType] = useState<'form-data' | 'raw'>('raw');
  const [rawFormat, setRawFormat] = useState('JSON');
  const [formData, setFormData] = useState<
    Array<{
      key: string;
      value: string;
      enabled: boolean;
      type: 'text' | 'file';
      file?: File;
    }>
  >([{ key: '', value: '', enabled: true, type: 'text', file: undefined }]);
  const [params, setParams] = useState<
    Array<{ key: string; value: string; enabled: boolean }>
  >([{ key: '', value: '', enabled: true }]);
  const [headers, setHeaders] = useState<
    Array<{ key: string; value: string; enabled: boolean }>
  >([{ key: '', value: '', enabled: true }]);
  const [authType, setAuthType] = useState('none');
  const [authToken, setAuthToken] = useState('');
  const [statusCode, setStatusCode] = useState<number>();
  const [responseTime, setResponseTime] = useState<number>();
  const [isNewApi, setIsNewApi] = useState(false);

  useEffect(() => {
    // Reset all fields when the component mounts or when id changes
    setUrl('');
    setMethod('GET');
    setRequestBody('');
    setResponse('');
    setError('');
    setBodyType('raw');
    setRawFormat('JSON');
    setFormData([
      { key: '', value: '', enabled: true, type: 'text', file: undefined },
    ]);
    setParams([{ key: '', value: '', enabled: true }]);
    setHeaders([{ key: '', value: '', enabled: true }]);
    setAuthType('none');
    setAuthToken('');
    setStatusCode(undefined);
    setResponseTime(undefined);

    if (!id) {
      setIsNewApi(true);
      return;
    }

    setIsNewApi(false);
    // Find the API in collections
    for (const collection of collections) {
      for (const file of collection.files) {
        if (file.type === 'folder') {
          const api = file.items?.find((item: ApiItem) => item.id === id);
          if (api) {
            // Set the API data
            setMethod(api.method);
            setUrl(api.url);
            if (api.headers) {
              setHeaders(
                api.headers.map(
                  (header: {
                    key: string;
                    value: string;
                    enabled?: boolean;
                  }) => ({
                    ...header,
                    enabled: true,
                  })
                )
              );
            }
            if (api.params) {
              setParams(
                api.params.map(
                  (param: {
                    key: string;
                    value: string;
                    enabled?: boolean;
                  }) => ({
                    ...param,
                    enabled: true,
                  })
                )
              );
            }
            if (api.body) {
              if (api.body.type === 'raw') {
                setBodyType('raw');
                setRawFormat(api.body.format || 'JSON');
                setRequestBody(api.body.content as string);
              } else if (api.body.type === 'form-data') {
                setBodyType('form-data');
                setFormData(
                  (
                    api.body.content as Array<{
                      key: string;
                      value: string;
                      enabled?: boolean;
                      type?: string;
                    }>
                  ).map((item) => ({
                    ...item,
                    enabled: true,
                    type: (item.type as 'text' | 'file') || 'text',
                    file: undefined,
                  }))
                );
              }
            }
            break;
          }
        } else if (file.id === id) {
          // Set the API data
          setMethod(file.method);
          setUrl(file.url);
          if (file.headers) {
            setHeaders(
              file.headers.map(
                (header: {
                  key: string;
                  value: string;
                  enabled?: boolean;
                }) => ({
                  ...header,
                  enabled: true,
                })
              )
            );
          }
          if (file.params) {
            setParams(
              file.params.map(
                (param: { key: string; value: string; enabled?: boolean }) => ({
                  ...param,
                  enabled: true,
                })
              )
            );
          }
          if (file.body) {
            if (file.body.type === 'raw') {
              setBodyType('raw');
              setRawFormat(file.body.format || 'JSON');
              setRequestBody(file.body.content as string);
            } else if (file.body.type === 'form-data') {
              setBodyType('form-data');
              setFormData(
                (
                  file.body.content as Array<{
                    key: string;
                    value: string;
                    enabled?: boolean;
                    type?: string;
                  }>
                ).map((item) => ({
                  ...item,
                  enabled: true,
                  type: (item.type as 'text' | 'file') || 'text',
                  file: undefined,
                }))
              );
            }
          }
          break;
        }
      }
    }
  }, [id, collections]);

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    setStatusCode(undefined);
    setResponseTime(undefined);

    const startTime = Date.now();

    try {
      let data;
      if (method !== 'GET') {
        if (bodyType === 'form-data') {
          const formDataObj = new FormData();
          console.log(formData);
          formData.forEach(({ key, value, enabled, type, file }) => {
            if (enabled && key) {
              if (type === 'file' && file) {
                formDataObj.append(key, file);
              } else if (type === 'text' && value) {
                formDataObj.append(key, value);
              }
            }
          });
          data = formDataObj;
        } else {
          data = requestBody;
        }
      }

      // Build query string from params
      const queryString = params
        .filter(({ key, value, enabled }) => enabled && key && value)
        .map(
          ({ key, value }) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&');

      const finalUrl = queryString ? `${url}?${queryString}` : url;

      const config = {
        method,
        url: finalUrl,
        data,
        headers: {
          ...headers
            .filter(({ key, value, enabled }) => enabled && key && value)
            .reduce((acc, { key, value }) => {
              acc[key] = value;
              return acc;
            }, {} as Record<string, string>),
          ...(bodyType === 'raw' && {
            'Content-Type':
              rawFormat === 'JSON'
                ? 'application/json'
                : rawFormat === 'XML'
                ? 'application/xml'
                : rawFormat === 'HTML'
                ? 'text/html'
                : 'text/plain',
          }),
          ...(authType === 'bearer' && {
            Authorization: `Bearer ${authToken}`,
          }),
          ...(authType === 'basic' && {
            Authorization: `Basic ${authToken}`,
          }),
        },
      };

      const res = await axios(config);
      setStatusCode(res.status);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setStatusCode(err.response.status);
        setError(`${err.response.status} ${err.response.statusText}`);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      setResponse('');
    } finally {
      setResponseTime(Date.now() - startTime);
      setLoading(false);
    }
  };

  const handleFormDataChange = (
    index: number,
    field: 'key' | 'value' | 'enabled' | 'type' | 'file',
    value: string | boolean | File
  ) => {
    console.log(value, field, index);
    const newFormData = [...formData];

    // If the index is beyond the current array length, add a new item
    if (index >= newFormData.length) {
      newFormData.push({
        key: '',
        value: '',
        enabled: true,
        type: 'text',
        file: undefined,
      });
    }
    // Update the item at the specified index
    if (field === 'type' && value === 'file') {
      // When changing type to file, reset the value field
      newFormData[index] = { ...newFormData[index], [field]: value, value: '' };
    } else if (field === 'file' && value instanceof File) {
      // When a file is selected, set the filename as the value
      newFormData[index] = {
        ...newFormData[index],
        [field]: value,
        value: (value as File).name,
      };
    } else {
      // Default case for other field changes
      newFormData[index] = { ...newFormData[index], [field]: value };
    }

    // If this is the last row and the key field is being changed to a non-empty value
    if (
      field === 'key' &&
      index === newFormData.length - 1 &&
      value &&
      typeof value === 'string' &&
      value.trim() !== ''
    ) {
      newFormData.push({
        key: '',
        value: '',
        enabled: true,
        type: 'text',
        file: undefined,
      });
    }
    console.log(newFormData);
    setFormData(newFormData);
  };

  const handleParamChange = (
    index: number,
    field: 'key' | 'value' | 'enabled',
    value: string | boolean
  ) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };

    // If this is the last row and the key field is being changed to a non-empty value
    if (
      field === 'key' &&
      index === params.length - 1 &&
      value &&
      typeof value === 'string' &&
      value.trim() !== ''
    ) {
      newParams.push({ key: '', value: '', enabled: true });
    }

    setParams(newParams);
  };

  const handleDeleteParam = (index: number) => {
    if (params.length > 1) {
      setParams(params.filter((_, i) => i !== index));
    }
  };

  const handleHeaderChange = (
    index: number,
    field: 'key' | 'value' | 'enabled',
    value: string | boolean
  ) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };

    // If this is the last row and the key field is being changed to a non-empty value
    if (
      field === 'key' &&
      index === headers.length - 1 &&
      value &&
      typeof value === 'string' &&
      value.trim() !== ''
    ) {
      newHeaders.push({ key: '', value: '', enabled: true });
    }

    setHeaders(newHeaders);
  };

  const handleDeleteHeader = (index: number) => {
    if (headers.length > 1) {
      setHeaders(headers.filter((_, i) => i !== index));
    }
  };

  const handleDeleteFormData = (index: number) => {
    if (formData.length > 1) {
      setFormData(formData.filter((_, i) => i !== index));
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={0}
        sx={{ p: 1, mt: 1, borderBottom: 1, borderColor: 'divider' }}
      >
        <RequestHeader
          method={method}
          url={url}
          loading={loading}
          onMethodChange={setMethod}
          onUrlChange={(value) => setUrl(value)}
          onSend={handleSendRequest}
        />
      </Paper>

      <Box sx={{ mt: 1, px: 2 }}>
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
          <Tab label="Params" />
          <Tab label="Authorization" />
          <Tab label="Headers" />
          <Tab label="Body" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <TabPanel value={tabValue} index={0}>
          <RequestParams
            params={params}
            onParamChange={handleParamChange}
            onDeleteParam={handleDeleteParam}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <RequestAuth
            authType={authType}
            authToken={authToken}
            onAuthTypeChange={setAuthType}
            onAuthTokenChange={setAuthToken}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <RequestHeaders
            headers={headers}
            onHeaderChange={handleHeaderChange}
            onDeleteHeader={handleDeleteHeader}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <RequestBody
            method={method}
            bodyType={bodyType}
            rawFormat={rawFormat}
            requestBody={requestBody}
            formData={formData}
            onBodyTypeChange={setBodyType}
            onRawFormatChange={setRawFormat}
            onRequestBodyChange={setRequestBody}
            onFormDataChange={handleFormDataChange}
            onDeleteFormData={handleDeleteFormData}
          />
        </TabPanel>
      </Box>

      <Divider />

      <ResponseViewer
        error={error}
        response={response}
        statusCode={statusCode}
        responseTime={responseTime}
      />
    </Box>
  );
}
