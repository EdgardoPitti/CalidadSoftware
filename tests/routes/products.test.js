const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { initTestDb, closeTestDb } = require('../setup/testDb');
const productRouter = require('../../routes/products');
const Product = require('../../models/product');
const Category = require('../../models/category');

const app = express();
app.use(bodyParser.json());
app.use('/api/products', productRouter);

describe('Product Routes', () => {
  let category1, product1, category2, product2;
  beforeAll(async () => {
    await initTestDb();
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
    category1 = await Category.create({ name: 'Dispositivos Moviles' });
    category2 = await Category.create({ name: 'Electronicos' });
    product1 = await Product.create({
      name: "S25 Ultra",
      price: 599.99,
      description: "Smartphone Samsung",
      inventory: 10,
      taxRate: 0.1,
      categoryId: category1.id
    });
    product2 = await Product.create({
      name: "Barra de Sonido",
      price: 59,
      description: "Barra Sony",
      inventory: 10,
      taxRate: 0.1,
      categoryId: category2.id
    });
  });

  afterAll(async () => {
    await closeTestDb();
  });

  beforeEach(async () => {
 
  });

  describe('POST /api/products', () => {

    it('should create a new product', async () => {
      const product = {
        name: "S24 Ultra",
        price: 599.99,
        description: "Smartphone Samsung",
        inventory: 10,
        taxRate: 0.1,
        categoryId: category1.id
      };
        const response = await request(app)
        .post('/api/products')
        .send(product)
        .expect(201);

      expect(response.body).toHaveProperty('name', 'S24 Ultra');   
      
    });

    it('should return error when category does not exist', async () => {
      const product = {
        name: "S25 Ultra",
        price: 599.99,
        description: "Smartphone Samsung",
        inventory: 10,
        taxRate: 0.1,
        categoryId: 100
      };
      const response = await request(app)
        .post('/api/products')
        .send(product)
        .expect(400);   
    });
  });

  describe('GET /api/products/category/:categoryId', () => {

    it('should return products for category', async () => {
      const categoryId = '1';
      const response = await request(app)
      .get(`/api/products/category/${categoryId}`,)
      .expect(200); 
      
      expect(response.body[0]).toHaveProperty('name', 'S25 Ultra');
    });

  });

  describe('GET /api/products/categories', () => {
    it('should return products by multiple categories', async () => {

      const response = await request(app)
      .get('/api/products/categories?categories=1,2')
      .expect(200); 

      expect(response.body[0].categoryId).toBe(1);
    });

    it('should return error by multiple categories', async () => {

      const response = await request(app)
      .get('/api/products/categories?categorie=1,2')
      .expect(400); 

      expect(response.body).toHaveProperty('error', 'Categories parameter is required');
    });


  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {

      const response = await request(app)
      .get('/api/products')
      .expect(200); 
      
      expect(response.body).not.toBeNull();
    });
  });
});