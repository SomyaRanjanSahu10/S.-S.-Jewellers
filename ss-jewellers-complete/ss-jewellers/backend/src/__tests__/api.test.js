// ============================================================
// backend/src/__tests__/auth.test.js
// ============================================================
const request   = require('supertest');
const mongoose  = require('mongoose');
const app       = require('../server');
const { User }  = require('../models');

// Test database URL (use a separate test DB)
const TEST_DB = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ssjewellers_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  const validUser = {
    name:     'Test User',
    email:    'test@ssjewellers.in',
    password: 'Test@1234567',
    phone:    '+91 98765 00000',
  };

  // ── Register ─────────────────────────────────────────
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(validUser.email);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  // ── Login ─────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'wrongpassword' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@test.com', password: 'Test@1234567' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  // ── Get Me ────────────────────────────────────────
  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const { body: { data: { accessToken } } } = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.data.user.email).toBe(validUser.email);
    });

    it('should reject request without token', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });
  });
});

// ============================================================
// backend/src/__tests__/product.test.js
// ============================================================
describe('Products API', () => {
  it('should return product list', async () => {
    const res = await request(app).get('/api/products').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.products)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();
  });

  it('should support pagination', async () => {
    const res = await request(app)
      .get('/api/products?page=1&limit=4')
      .expect(200);

    expect(res.body.data.pagination.limit).toBe(4);
  });

  it('should support category filter', async () => {
    const res = await request(app)
      .get('/api/products?category=rings')
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it('should return 404 for non-existent product', async () => {
    await request(app)
      .get('/api/products/507f1f77bcf86cd799439011')
      .expect(404);
  });
});

// ============================================================
// backend/src/__tests__/health.test.js
// ============================================================
describe('Health Check', () => {
  it('GET /health should return ok', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('S.S. Jewellers API');
  });
});
