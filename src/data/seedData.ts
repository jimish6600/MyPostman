interface TestCase {  id: string;
  name: string;
  description: string;
  expectedStatus: number;
  expectedResponse: Record<string, unknown>;
  requestBody: Record<string, unknown> | null;
}

interface Api {
  id: string;
  method: string;
  name: string;
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | null;
  testCases: TestCase[];
  responseTimes: number[];
  successTestCases: number[];
}

export const seedData: Api[] = [
  {
    id: '1',
    method: 'GET',
    name: 'Get User',
    url: '/api/users/{id}',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer {token}',
    },
    body: null,
    testCases: [
      {
        id: '1-1',
        name: 'Get User Success',
        description: 'Get user details with valid ID',
        expectedStatus: 200,
        expectedResponse: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
        },
        requestBody: null,
      },
      {
        id: '1-2',
        name: 'Get User Not Found',
        description: 'Get user with non-existent ID',
        expectedStatus: 404,
        expectedResponse: {
          error: 'User not found',
        },
        requestBody: null,
      },
    ],
    responseTimes: [150, 120],
    successTestCases: [1, 0],
  },
  {
    id: '2',
    method: 'POST',
    name: 'Create User',
    url: '/api/users',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      name: 'string',
      email: 'string',
      password: 'string',
    },
    testCases: [
      {
        id: '2-1',
        name: 'Create User Success',
        description: 'Create user with valid data',
        expectedStatus: 201,
        expectedResponse: {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
        requestBody: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        },
      },
      {
        id: '2-2',
        name: 'Create User Invalid Data',
        description: 'Create user with invalid email',
        expectedStatus: 400,
        expectedResponse: {
          error: 'Invalid email format',
        },
        requestBody: {
          name: 'Jane Doe',
          email: 'invalid-email',
          password: 'password123',
        },
      },
    ],
    responseTimes: [200, 180],
    successTestCases: [1, 0],
  },
];
