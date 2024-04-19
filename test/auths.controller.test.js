const request = require('supertest');
const app = require('../src/app');
const hashPassword = require("../src/utils/password.hasher");
const resetDb = require("./helpers/reset.db")

beforeEach(async () => {
  await resetDb();
});

describe('Auth', () => {
  describe('POST /api/v1/register', () => {
    it('should register a new user', async () => {
      const hashedPassword = await hashPassword("password123");
      const registerParams = {
        email: "test@gmail.com",
        name: "Test User",
        password: hashedPassword
      };

      const response = await request(app)
        .post('/api/v1/register')
        .send(registerParams)
        .expect(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@gmail.com');
      expect(response.body.name).toBe('Test User');
    });
  });

  describe('POST /api/v1/login', () => {
    it('should login a user', async () => {
      // Implement
    });
  });
});