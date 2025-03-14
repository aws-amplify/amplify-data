import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient, expectVariables } from '../../utils';
import { GraphQLError } from 'graphql';

describe('Validate Builder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Validate Builder', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().validate(v =>
          v.minLength(5, 'Title must be at least 5 characters')
           .maxLength(200, 'Title must be at most 200 characters')
        ),
        slug: a.string().validate(v =>
          v.matches('^[a-z0-9-]+$', 'Slug must contain only lowercase letters, numbers, and hyphens')
        ),
        summary: a.string().validate(v =>
          v.maxLength(500, 'Summary must be at most 500 characters')
        ),
        content: a.string().validate(v =>
          v.minLength(20, 'Content must be at least 20 characters')
        ),
      }).authorization((allow) => allow.publicApiKey()),
    
      Coupon: a.model({
        code: a.string().validate(v =>
          v.startsWith('CPN-', 'Code must start with CPN-')
           .endsWith('-2025', 'Code must end with -2025')
        ),
      }).authorization((allow) => allow.publicApiKey()),
    
      Product: a.model({
        price: a.float().validate(v => 
          v.positive('Price must be positive')
           .lt(10000, 'Price must be less than 10000')
        ),
        rating: a.float().validate(v =>
          v.gte(0, 'Rating must be at least 0')
           .lte(5, 'Rating must be at most 5')
        ),
        stock: a.integer().validate(v =>
          v.gte(0, 'Stock must be at least 0')
           .lte(1000, 'Stock must be at most 1000')
        ),
        profit: a.float().validate(v =>
          v.gt(0, 'Profit must be greater than 0')
        ),
        loss: a.float().validate(v =>
          v.negative('Loss must be negative')
        ),
      }).authorization((allow) => allow.publicApiKey()),
    });

    //===========================================
    // SCHEMA TRANSFORMATION TESTS
    //===========================================
    it('generates expected graphql', () => {
      const graphql = schema.transform().schema;
      expect(graphql).toMatchSnapshot();  
    });

    type Schema = ClientSchema<typeof schema>;
    
    const createMockResponse = (modelName: string, data: any, errors?: GraphQLError[]) => ({
      data: { [`create${modelName}`]: data },
      errors
    });
    
    const updateMockResponse = (modelName: string, data: any, errors?: GraphQLError[]) => ({
      data: { [`update${modelName}`]: data },
      errors
    });
    
    // Mock responses organized by model
    const mockResponses = [
      // Post responses
      createMockResponse('Post', { 
        id: 'post-id-1', 
        title: 'Valid title', 
        slug: 'valid-slug-123', 
        summary: 'A valid summary', 
        content: 'This is valid content that is longer than 20 characters.' 
      }),
      updateMockResponse('Post', { 
        id: 'post-id-1', 
        title: 'Updated title', 
        slug: 'updated-slug-123', 
        summary: 'An updated summary', 
        content: 'This is updated content that is longer than 20 characters.' 
      }),
      createMockResponse('Post', { 
        id: 'post-id-short-title', 
        title: 'Hi', // Too short, violates minLength(5)
        slug: 'valid-slug',
        summary: 'Summary',
        content: 'Long enough content here'
      }, [new GraphQLError('Validation error: Title must be at least 5 characters')]),
      updateMockResponse('Post', {
        id: 'post-id-invalid-slug', 
        title: 'Valid title',
        slug: 'INVALID_SLUG', // Contains uppercase and underscore
        summary: 'Summary',
        content: 'Long enough content here'
      }, [new GraphQLError('Validation error: Slug must contain only lowercase letters, numbers, and hyphens')]),
      createMockResponse('Post', { 
        id: 'post-id-long-summary', 
        title: 'Valid title',
        slug: 'valid-slug',
        summary: 'A'.repeat(501), // Too long
        content: 'Long enough content here'
      }, [new GraphQLError('Validation error: Summary must be at most 500 characters')]),
      updateMockResponse('Post', {
        id: 'post-id-short-content', 
        title: 'Valid title',
        slug: 'valid-slug',
        summary: 'Summary',
        content: 'Too short' // Too short
      }, [new GraphQLError('Validation error: Content must be at least 20 characters')]),
      
      // Coupon responses
      createMockResponse('Coupon', {
        id: 'coupon-id-1',
        code: 'CPN-SUMMER-2025'
      }),
      updateMockResponse('Coupon', {
        id: 'coupon-id-1',
        code: 'CPN-WINTER-2025'
      }),
      createMockResponse('Coupon', {
        id: 'coupon-id-wrong-prefix',
        code: 'COUPON-SUMMER-2025' // Wrong prefix
      }, [new GraphQLError('Validation error: Code must start with CPN-')]),
      updateMockResponse('Coupon', {
        id: 'coupon-id-wrong-suffix',
        code: 'CPN-SUMMER-2024' // Wrong suffix
      }, [new GraphQLError('Validation error: Code must end with -2025')]),
      
      // Product responses
      createMockResponse('Product', {
        id: 'product-id-1',
        price: 99.99,
        rating: 4.5,
        stock: 100,
        profit: 25.50,
        loss: -10.25
      }),
      updateMockResponse('Product', {
        id: 'product-id-1',
        price: 129.99,
        rating: 4.8,
        stock: 75,
        profit: 35.50,
        loss: -5.25
      }),
      updateMockResponse('Product', {
        id: 'product-id-negative-price',
        price: -10.00, // Negative
        rating: 4.5,
        stock: 100,
        profit: 25.50,
        loss: -10.25
      }, [new GraphQLError('Validation error: Price must be positive')]),
      createMockResponse('Product', {
        id: 'product-id-high-price',
        price: 15000.00, // Too high
        rating: 4.5,
        stock: 100,
        profit: 25.50,
        loss: -10.25
      }, [new GraphQLError('Validation error: Price must be less than 10000')]),
      updateMockResponse('Product', {
        id: 'product-id-negative-rating',
        price: 99.99,
        rating: -1.0, // Below minimum
        stock: 100,
        profit: 25.50,
        loss: -10.25
      }, [new GraphQLError('Validation error: Rating must be at least 0')]),
      createMockResponse('Product', {
        id: 'product-id-high-rating',
        price: 99.99,
        rating: 6.0, // Above maximum
        stock: 100,
        profit: 25.50,
        loss: -10.25
      }, [new GraphQLError('Validation error: Rating must be at most 5')]),
      updateMockResponse('Product', {
        id: 'product-id-negative-stock',
        price: 99.99,
        rating: 4.5,
        stock: -10, // Negative
        profit: 25.50,
        loss: -10.25
      }, [new GraphQLError('Validation error: Stock must be at least 0')]),
      createMockResponse('Product', {
        id: 'product-id-high-stock',
        price: 99.99,
        rating: 4.5,
        stock: 1500, // Too high
        profit: 25.50,
        loss: -10.25
      }, [new GraphQLError('Validation error: Stock must be at most 1000')]),
      createMockResponse('Product', {
        id: 'product-id-zero-profit',
        price: 99.99,
        rating: 4.5,
        stock: 100,
        profit: 0.0, // Not positive
        loss: -10.25
      }, [new GraphQLError('Validation error: Profit must be greater than 0')]),
      updateMockResponse('Product', {
        id: 'product-id-positive-loss',
        price: 99.99,
        rating: 4.5,
        stock: 100,
        profit: 25.50,
        loss: 10.25 // Positive
      }, [new GraphQLError('Validation error: Loss must be negative')]),
    ];
    
    const { spy, generateClient } = mockedGenerateClient(mockResponses);
    let client: ReturnType<typeof generateClient<Schema>>;
    
    beforeAll(async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      client = generateClient<Schema>();
    });
    
    const testValidCreate = async (modelName: string, data: any) => {
      await (client.models as any)[modelName].create(data);
      expectVariables(spy, { input: data });
    };
    
    const testValidUpdate = async (modelName: string, data: any) => {
      await (client.models as any)[modelName].update(data);
      expectVariables(spy, { input: data });
    };
    
    const testInvalidOperation = async (operation: 'create' | 'update', modelName: string, data: any, errorMessage: string) => {
      await (client.models as any)[modelName][operation](data)
        .catch((error: any) => {
          expect(error.message).toContain(errorMessage);
        });
    };
    
    //===========================================
    // POST MODEL TESTS
    //===========================================
    describe('Post Model Validation', () => {
      describe('Create and Update Operations', () => {
        it('should successfully create a Post with valid fields', async () => {
          await testValidCreate('Post', {
            title: 'Valid title',
            slug: 'valid-slug-123',
            summary: 'A valid summary',
            content: 'This is valid content that is longer than 20 characters.'
          });
        });
        
        it('should successfully update a Post with valid fields', async () => {
          await testValidUpdate('Post', {
            id: 'post-id-1',
            title: 'Updated title',
            slug: 'updated-slug-123',
            summary: 'An updated summary',
            content: 'This is updated content that is longer than 20 characters.'
          });
        });
        
        it('should reject a Post with title too short', async () => {
          await testInvalidOperation('create', 'Post', {
            title: 'Hi', // Too short
            slug: 'valid-slug',
            summary: 'Summary',
            content: 'Long enough content here'
          }, 'Title must be at least 5 characters');
        });
        
        it('should reject a Post update with invalid slug pattern', async () => {
          await testInvalidOperation('update', 'Post', {
            id: 'post-id-invalid-slug',
            title: 'Valid title',
            slug: 'INVALID_SLUG', // Invalid pattern
            summary: 'Summary',
            content: 'Long enough content here'
          }, 'Slug must contain only lowercase letters, numbers, and hyphens');
        });
        
        it('should reject a Post with summary too long', async () => {
          await testInvalidOperation('create', 'Post', {
            title: 'Valid title',
            slug: 'valid-slug',
            summary: 'A'.repeat(501), // Too long
            content: 'Long enough content here'
          }, 'Summary must be at most 500 characters');
        });
        
        it('should reject a Post update with content too short', async () => {
          await testInvalidOperation('update', 'Post', {
            id: 'post-id-short-content',
            title: 'Valid title',
            slug: 'valid-slug',
            summary: 'Summary',
            content: 'Too short' // Too short
          }, 'Content must be at least 20 characters');
        });
      });
    });
    
    //===========================================
    // COUPON MODEL TESTS
    //===========================================
    describe('Coupon Model Validation', () => {
      describe('Create and Update Operations', () => {
        it('should successfully create a Coupon with valid code', async () => {
          await testValidCreate('Coupon', {
            code: 'CPN-SUMMER-2025'
          });
        });
        
        it('should successfully update a Coupon with valid code', async () => {
          await testValidUpdate('Coupon', {
            id: 'coupon-id-1',
            code: 'CPN-WINTER-2025'
          });
        });
        
        it('should reject a Coupon with invalid prefix', async () => {
          await testInvalidOperation('create', 'Coupon', {
            code: 'COUPON-SUMMER-2025' // Wrong prefix
          }, 'Code must start with CPN-');
        });
        
        it('should reject a Coupon update with invalid suffix', async () => {
          await testInvalidOperation('update', 'Coupon', {
            id: 'coupon-id-wrong-suffix',
            code: 'CPN-SUMMER-2024' // Wrong suffix
          }, 'Code must end with -2025');
        });
      });
    });
    
    //===========================================
    // PRODUCT MODEL TESTS
    //===========================================
    describe('Product Model Validation', () => {
      describe('Create and Update Operations', () => {
        it('should successfully create a Product with valid fields', async () => {
          await testValidCreate('Product', {
            price: 99.99,
            rating: 4.5,
            stock: 100,
            profit: 25.50,
            loss: -10.25
          });
        });
        
        it('should successfully update a Product with valid fields', async () => {
          await testValidUpdate('Product', {
            id: 'product-id-1',
            price: 129.99,
            rating: 4.8,
            stock: 75,
            profit: 35.50,
            loss: -5.25
          });
        });
        
        it('should reject a Product update with negative price', async () => {
          await testInvalidOperation('update', 'Product', {
            id: 'product-id-negative-price',
            price: -10.00, // Negative
            rating: 4.5,
            stock: 100,
            profit: 25.50,
            loss: -10.25
          }, 'Price must be positive');
        });
        
        it('should reject a Product with price too high', async () => {
          await testInvalidOperation('create', 'Product', {
            price: 15000.00, // Too high
            rating: 4.5,
            stock: 100,
            profit: 25.50,
            loss: -10.25
          }, 'Price must be less than 10000');
        });
        
        it('should reject a Product update with negative rating', async () => {
          await testInvalidOperation('update', 'Product', {
            id: 'product-id-negative-rating',
            price: 99.99,
            rating: -1.0, // Below minimum
            stock: 100,
            profit: 25.50,
            loss: -10.25
          }, 'Rating must be at least 0');
        });
        
        it('should reject a Product with rating too high', async () => {
          await testInvalidOperation('create', 'Product', {
            price: 99.99,
            rating: 6.0, // Above maximum
            stock: 100,
            profit: 25.50,
            loss: -10.25
          }, 'Rating must be at most 5');
        });
        
        it('should reject a Product update with negative stock', async () => {
          await testInvalidOperation('update', 'Product', {
            id: 'product-id-negative-stock',
            price: 99.99,
            rating: 4.5,
            stock: -10, // Negative
            profit: 25.50,
            loss: -10.25
          }, 'Stock must be at least 0');
        });
        
        it('should reject a Product with stock too high', async () => {
          await testInvalidOperation('create', 'Product', {
            price: 99.99,
            rating: 4.5,
            stock: 1500, // Too high
            profit: 25.50,
            loss: -10.25
          }, 'Stock must be at most 1000');
        });
        
        it('should reject a Product with zero profit', async () => {
          await testInvalidOperation('create', 'Product', {
            price: 99.99,
            rating: 4.5,
            stock: 100,
            profit: 0.0, // Not positive
            loss: -10.25
          }, 'Profit must be greater than 0');
        });
        
        it('should reject a Product update with positive loss', async () => {
          await testInvalidOperation('update', 'Product', {
            id: 'product-id-positive-loss',
            price: 99.99,
            rating: 4.5,
            stock: 100,
            profit: 25.50,
            loss: 10.25 // Positive
          }, 'Loss must be negative');
        });
      });
    });
  });
});