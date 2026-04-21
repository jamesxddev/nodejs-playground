import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'nodejs-playground API',
      version: '1.0.0',
      description: 'Clean Architecture API with Express and TypeScript',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
            statusCode: {
              type: 'number',
            },
          },
        },
      },
    },
  },
  apis: ['./src/interfaces/http/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
