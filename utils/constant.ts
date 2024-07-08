export const SUCCESS_RESPONSE_CONSTANT = {
  AUTH: {
    REGISTER_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
  },
  ORG: {
    RETREIVE_SUCCESS: 'Organisation retrieved successfully',
    CREATE_SUCCESS: 'Organisation created successfully',
    ADD_USER_SUCCESS: 'User added to organisation successfully',
  },
  USER: {
    RETREIVE_SUCCESS: 'User retrieved successfully',
  },
};

export const ROUTE_NAME = {
  AUTH: {
    REGISTER: 'register',
    LOGIN: 'login',
  },
  ORG: {
    CREATE: 'org',
    ADD_USER: 'org/:orgId/user',
  },
};

export const ERROR_MESSAGE = {
  AUTH: {
    REGISTRATION_ERROR: 'Registration unsuccessful',
    LOGIN_ERROR: 'Authentication failed',
  },
  ORG: {
    CREATE_ERROR: 'Failed to create organisation',
    ADD_USER_ERROR: 'Failed to add user to organisation',
    NOT_FOUND: 'Organisation not found',
    CLIENT_ERROR: 'Client error',
  },
  DEFAULT_ERROR: {
    UNKNOWN: 'An unknown error occurred',
    FORBIDDEN: 'Forbidden',
    INTERNAL: 'Internal server error',
    BAD_REQUEST: 'Bad Request',
  },
};
