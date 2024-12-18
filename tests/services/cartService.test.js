// Mock the models
jest.mock('../../models/cart', () => ({
  create: jest.fn(),
  findByPk: jest.fn()
}));

jest.mock('../../models/cartItem', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn()
}));

jest.mock('../../models/product', () => ({
  create: jest.fn(),
  findByPk: jest.fn()
}));

const CartService = require('../../services/cartService');
const Cart = require('../../models/cart');
const CartItem = require('../../models/cartItem');
const Product = require('../../models/product');

describe('CartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCart', () => {

    it('should create a new cart', async () => {
      const mockCart = {id: 1};
      Cart.create.mockResolvedValue(mockCart);
      const result = await CartService.createCart();
      expect(result).toEqual(mockCart);

    });
  });

  describe('addItemToCart', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should add new item to cart when product exists and has sufficient inventory', async () => {
      const mockProduct = { id: 1, inventory: 10, price: 100, categoryId: 1 };
      const mockCartItem = { cartId: 1, productId: 1, quantity: 2 };

      Product.findByPk.mockResolvedValue(mockProduct);
      CartItem.create.mockResolvedValue(mockCartItem);

      const result = await CartService.addItemToCart();

      expect(result).toEqual(mockCartItem);
 
    });

    it('should add new item to cart when product  not exists', async () => {

      const mockCartItem = { cartId: 1, productId: 1, quantity: 2 };

      Product.findByPk.mockResolvedValue(null);
      CartItem.create.mockResolvedValue(mockCartItem);

      await expect(CartService.addItemToCart(mockCartItem)).rejects.toThrow('Product not found');
 
    });

    it('should add new item to cart when products not has sufficient inventory', async () => {
      const mockProduct = { id: 2, inventory: 10 };

      Product.findByPk.mockResolvedValue(mockProduct);

      await expect(CartService.addItemToCart(1,2,1000)).rejects.toThrow('Not enough inventory available');
 
    });

  });

  describe('getCartItems', () => {
    it('should return cart items with calculated totals', async () => {

    });
  });

  describe('updateCartItem', () => {
    it('should update cart item quantity when sufficient inventory', async () => {
      
      const mockProduct = { id: 1, inventory: 15, price: 100 };
      const mockCartItem = { id: 1, quantity: 10, Product: mockProduct};
      
      CartItem.findByPk.mockResolvedValue(mockCartItem);

      //const result = await CartService.updateCartItem();
      
      //await expect(CartService.updateCartItem()).toEqual(mockCartItem);
    });
  });

  describe('removeCartItem', () => {
    it('should remove cart item successfully', async () => {
      const mockCartItem = { id: 1, quantity: 10, productId: 2};

      CartItem.create.mockResolvedValue(mockCartItem);

      //const result = await CartService.removeCartItem();

     // console.log(result);
    });
  });
});