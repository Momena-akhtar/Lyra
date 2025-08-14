import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lyra AI API',
      version: '1.0.0',
      description: 'API documentation for Lyra AI backend services',
      contact: {
        name: 'Momena Akhtar',
        email: 'contact@lyra.ai'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5500',
        description: 'Development server'
      },
      {
        url: 'https://api.lyra.ai',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Firebase ID token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            uid: {
              type: 'string',
              description: 'User unique identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            displayName: {
              type: 'string',
              description: 'User display name'
            },
            photoURL: {
              type: 'string',
              format: 'uri',
              description: 'User profile photo URL'
            },
            emailVerified: {
              type: 'boolean',
              description: 'Whether email is verified'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            lastSignInAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last sign-in timestamp'
            }
          }
        },
        CreateUserRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (minimum 6 characters)'
            },
            displayName: {
              type: 'string',
              description: 'User display name (optional)'
            }
          }
        },
        GoogleAuthRequest: {
          type: 'object',
          required: ['idToken'],
          properties: {
            idToken: {
              type: 'string',
              description: 'Google ID token from client'
            }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            displayName: {
              type: 'string',
              description: 'New display name'
            },
            photoURL: {
              type: 'string',
              format: 'uri',
              description: 'New profile photo URL'
            }
          }
        },
        VerifyTokenRequest: {
          type: 'object',
          required: ['idToken'],
          properties: {
            idToken: {
              type: 'string',
              description: 'Firebase ID token to verify'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data (if any)'
            },
            error: {
              type: 'string',
              description: 'Error message (if any)'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            code: {
              type: 'string',
              description: 'Error code (optional)'
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const specs = swaggerJsdoc(options);
