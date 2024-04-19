const request = require('supertest');
const app = require('../src/app');
const hashPassword = require("../src/utils/password.hasher");
const resetDb = require("./helpers/reset.db")
const redisClient = require('../src/utils/redis.client');

jest.mock('../src/utils/redis.client', () => ({
  setEx: jest.fn(),
  get: jest.fn(),
}));

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
      const mockUser = {
        email: "test@gmail.com",
        name: "Test User",
        password: "password123",
      };

      const registerResponse = await request(app)
        .post('/api/v1/register')
        .send(mockUser)
        .expect(201);

      redisClient.get.mockResolvedValue(JSON.stringify(mockUser));

      const loginResponse = await request(app)
        .post('/api/v1/login')
        .send({
          email: mockUser.email,
          password: "password123",
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('message', 'Login successful');
      expect(loginResponse.body.user).toHaveProperty('id', registerResponse.body.id);
      expect(loginResponse.body.user.email).toBe(mockUser.email);
    });
  });
});
