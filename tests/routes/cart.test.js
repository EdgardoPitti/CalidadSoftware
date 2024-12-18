const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { initTestDb, closeTestDb } = require('../setup/testDb');
const cartRouter = require('../../routes/cart');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const Category = require('../../models/category');
const CartService = require('../../services/cartService');

const app = express();
app.use(bodyParser.json());
app.use('/api/carts', cartRouter);

describe('Cart Routes', () => {
  beforeAll(async () => {
    await initTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  beforeEach(async () => {
    await Cart.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
  });

  describe('POST /api/carts/:userId', () => {
    it('should create a new cart', async () => {
      const cart ='4';

      const response = await request(app)
        .post(`/api/carts/${cart}`)
        .expect(201);

      expect(response.body).toHaveProperty('userId', '4');
    });
  });

  describe('POST /api/carts/:cartId/items', () => {
    let cart, product;

    beforeEach(async () => {
      const category = await Category.create({ name: 'Test Category' });
      product = await Product.create({
         name: 'Test Product',
         price: 100,
         inventory: 10,
         categoryId: category.id
       });
       cart = await Cart.create({ userId: '1' });
    });

    it('should add item to cart', async () => {
      const productos = {
        productId: product.id,
        quantity: 9
      };

      const response = await request(app)
        .post(`/api/carts/${cart.id}/items`)
        .send(productos)
        .expect(201); 

      expect(response.body).toHaveProperty('cartId', '2');
      expect(response.body).toHaveProperty('productId', 1);
      expect(response.body).toHaveProperty('quantity', 9);
    });

    it('should error to add item to cart', async () => {
      const productos = {
        productId: product.id,
        quantity: 9
      };

      const response = await request(app)
        .post(`/api/carts/5/items`)
        .send(productos)
        .expect(400); 

      expect(response.body).toHaveProperty('error', 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
    });

  });

  describe('GET /api/carts/:cartId/items', () => {
    let product, cart, addItem;
    beforeEach(async () => {
      const category = await Category.create({ name: 'Test Category' });
      product = await Product.create({
         name: 'Test Product',
         price: 100,
         inventory: 10,
         categoryId: category.id
       });
       cart = await Cart.create({ userId: '1' });
       addItem = await CartService.addItemToCart(cart.id, product.id, 10);
    });
    
    
    it('should return cart items with totals', async () => {
      //1 articulo, 10 cantidades, 1000 total
      const response = await request(app)
        .get(`/api/carts/${cart.id}/items`)
        .expect(200); 

      expect(response.body.summary.total).toBe(1000);
    });

  });

  describe('PUT /api/carts/:cartId/items/:itemId', () => {
    let product, cart, addItem;
    beforeEach(async () => {
      const category = await Category.create({ name: 'Test Category' });
      product = await Product.create({
         name: 'Test Product',
         price: 100,
         inventory: 100,
         categoryId: category.id
       });
       cart = await Cart.create({ userId: '1' });
       addItem = await CartService.addItemToCart(cart.id, product.id, 10);
    });
    
    it('should update quantity to item', async () => {
      const cantidad = {
        quantity: 9
      };
      const response = await request(app)
        .put(`/api/carts/${cart.id}/items/${addItem.id}`)
        .send(cantidad)
        .expect(200); 

      expect(response.body.quantity).toBe(9);
    });

   
  });
  describe('delete /api/carts/:cartId/items/:itemId', () => {
    let product, cart, addItem;
    beforeEach(async () => {
      const category = await Category.create({ name: 'Test Category' });
      product = await Product.create({
         name: 'Test Product',
         price: 100,
         inventory: 100,
         categoryId: category.id
       });
       cart = await Cart.create({ userId: '1' });
       addItem = await CartService.addItemToCart(cart.id, product.id, 10);
    });
    
    it('should delete item to cart', async () => {

      const response = await request(app)
        .delete(`/api/carts/${cart.id}/items/${addItem.id}`)
        .expect(204); 
    });

  })
});