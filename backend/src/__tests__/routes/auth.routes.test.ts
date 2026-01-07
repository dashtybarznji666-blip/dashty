import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should return 400 if registration password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          phoneNumber: '07501234567',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phoneNumber: '07501234567',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if phone number is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          phoneNumber: '07501234567',
        });

      expect(response.status).toBe(400);
    });
  });
});

