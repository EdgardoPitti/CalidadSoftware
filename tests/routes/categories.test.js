const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { initTestDb, closeTestDb } = require('../setup/testDb');
const categoryRouter = require('../../routes/categories');
const Category = require('../../models/category');

const app = express();
app.use(bodyParser.json());
app.use('/api/categories', categoryRouter);

describe('Category Routes', () => {
  beforeAll(async () => {
    await initTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  beforeEach(async () => {
    await Category.destroy({ where: {} });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'Electronics'
      };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      expect(response.body).toHaveProperty('name', 'Electronics');
      expect(response.body).toHaveProperty('id');
    });

    it('shouldnot create a new category', async () => {
      const categoryData = {
        nam: 'Electronics'
      };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'notNull Violation: Category.name cannot be null');
    });
  });

  describe('GET /api/categories', () => {
    beforeEach(async () => {
      await Category.bulkCreate([
         { name: 'Electronics' },
         { name: 'Books' },
         { name: 'Clothing' }
       ]);
     });

    it('should return all categories', async () => {
      const response = await request(app)
      .get('/api/categories')
      .expect(200);

      expect(response.body).not.toBeNull();
    });
  });
});