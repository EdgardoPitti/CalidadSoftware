// Mock the models before requiring the service
jest.mock('../../models/product', () => ({
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    belongsTo: jest.fn()  // Mock the association method
  }));

  jest.mock('../../models/category', () => ({
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  }));

  // Now require the service after the mocks are set up
  const ProductService = require('../../services/productService');
  const Product = require('../../models/product');
  const Category = require('../../models/category');

describe('ProductService', () => {
    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const mockProduct = { id: 1, name: 'Samsung S25 Ultra', price: 100 };
            
            Product.findAll.mockResolvedValue(mockProduct);

            const result = await ProductService.getAllProducts();

            await expect(result).toEqual(mockProduct);

        });
    });

    describe('getProductById', () => {
        it('should return a product when product exists', async () => {
            const mockProduct = { id: 1, name: 'Samsung S25 Ultra', price: 100, categoryId: '1' };
            
            Product.findByPk.mockResolvedValue(mockProduct);

            const result = await ProductService.getProductById(1);

            expect(result).toEqual(mockProduct);
        });
    });

    describe('createProduct', () => {
        it('should create a product when category exists', async () => {
            const mockCategory = { id: 1, name: 'Categoria Nueva'};
            const mockProduct = { id: 1, name: 'Samsung S25 Ultra', price: 100, categoryId: '1' };


            Category.findByPk.mockResolvedValue(mockCategory);
            Product.create.mockResolvedValue(mockProduct);

            const result = await ProductService.createProduct(mockProduct);

            expect(result).toEqual(mockProduct);

        });
    });

    describe('getProductsByCategory', () => {
        it('should return products by category', async () => {

        });
    });

    describe('getProductsByCategories', () => {
        it('should return products by categories', async () => {

        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            const mockCategory = { id: 1, name: 'Categoria Nueva'};
            const mockProduct = { id: 1, name: 'Samsung S25 Ultra', price: 100, categoryId: '1' };


            Category.findByPk.mockResolvedValue(mockCategory);
            Product.update.mockResolvedValue([1]);

            const result = await ProductService.updateProduct(1, mockProduct);

            expect(Category.findByPk).toHaveBeenCalledWith(mockProduct.categoryId); 
            expect(Product.update).toHaveBeenCalledWith(mockProduct, { where: { id: 1 } }); 
            expect(result).toEqual([1]);

        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            
            const mockProduct = { destroy: jest.fn() };

            Product.findByPk.mockResolvedValue(mockProduct);

            const result = await ProductService.deleteProduct(1);

            expect(CartItem.findByPk).toHaveBeenCalledWith(1);
        });
    });


});