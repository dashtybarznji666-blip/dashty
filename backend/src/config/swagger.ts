import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../lib/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shoe Store Management API',
      version: '1.0.0',
      description: 'API documentation for the Shoe Store Management System',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'user'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Shoe: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            brand: { type: 'string' },
            category: { type: 'string', enum: ['men', 'women', 'kids'] },
            sizes: { type: 'string', description: 'JSON array of sizes' },
            price: { type: 'number' },
            costPrice: { type: 'number' },
            sku: { type: 'string' },
            description: { type: 'string', nullable: true },
            imageUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Stock: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            shoeId: { type: 'string', format: 'uuid' },
            size: { type: 'string' },
            quantity: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Sale: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            shoeId: { type: 'string', format: 'uuid' },
            size: { type: 'string' },
            quantity: { type: 'integer' },
            unitPrice: { type: 'number' },
            totalPrice: { type: 'number' },
            profit: { type: 'number' },
            exchangeRate: { type: 'number', nullable: true },
            isOnline: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);
