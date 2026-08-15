const request = require('supertest');
const { createApp, MOCK_USER } = require('../app');

describe('Item Tracker API', () => {
  let app;
  let token;

  // A fresh app (fresh in-memory data) for every test file run.
  beforeAll(() => {
    app = createApp();
  });

  // ---------------------------------------------------------------------
  // POST /api/auth/login
  // ---------------------------------------------------------------------
  describe('POST /api/auth/login', () => {
    it('returns 200 and a token for valid credentials (happy path)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: MOCK_USER.username, password: MOCK_USER.password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toEqual({ username: MOCK_USER.username });

      token = res.body.token; // reused by later tests
    });

    it('returns 401 for invalid credentials (failure case)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrong-password' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 when username or password is missing (failure case)', async () => {
      const res = await request(app).post('/api/auth/login').send({ username: 'admin' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ---------------------------------------------------------------------
  // GET /api/items
  // ---------------------------------------------------------------------
  describe('GET /api/items', () => {
    it('returns 401 when no auth token is provided (failure case)', async () => {
      const res = await request(app).get('/api/items');

      expect(res.status).toBe(401);
    });

    it('returns 200 and an items array when authenticated (happy path)', async () => {
      const res = await request(app).get('/api/items').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------
  // POST /api/items
  // ---------------------------------------------------------------------
  describe('POST /api/items', () => {
    it('creates a new item and returns 201 (happy path)', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Buy groceries' });

      expect(res.status).toBe(201);
      expect(res.body.item).toMatchObject({ name: 'Buy groceries' });
      expect(res.body.item).toHaveProperty('id');
    });

    it('returns 400 when item name is empty (failure case)', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '   ' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 401 when creating an item without auth (failure case)', async () => {
      const res = await request(app).post('/api/items').send({ name: 'Unauthorized item' });

      expect(res.status).toBe(401);
    });
  });

  // ---------------------------------------------------------------------
  // DELETE /api/items/:id
  // ---------------------------------------------------------------------
  describe('DELETE /api/items/:id', () => {
    it('returns 404 when deleting an item that does not exist (failure case)', async () => {
      const res = await request(app)
        .delete('/api/items/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('deletes an existing item and returns 200 (happy path)', async () => {
      const create = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Temp item to delete' });

      const id = create.body.item.id;

      const res = await request(app)
        .delete(`/api/items/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
