const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "My Express API",
    version: "1.0.0",
    description: "API documentation for Express + Prisma app",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
    },
  ],
  paths: {
    "/user/register": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "secret123" },
                  role: {
                    type: "string",
                    enum: ["ADMIN", "CUSTOMER"],
                    example: "CUSTOMER",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Email already registered" },
        },
      },
    },
    "/user/login": {
      post: {
        summary: "Login user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "secret123" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
            },
          },
          401: { description: "Invalid credentials" },
          404: { description: "User not found" },
        },
      },
    },
    "/produk/create": {
      post: {
        summary: "Create a new product",
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "description", "price", "stock"],
                properties: {
                  name: {
                    type: "string",
                    example: "iPhone 13",
                  },
                  price: {
                    type: "number",
                    format: "integer",
                    example: 999,
                  },
                  stock: {
                    type: "integer",
                    example: 100,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Product created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          400: { description: "Invalid input data" },
          401: { description: "Unauthorized - Invalid or missing token" },
          403: { description: "Forbidden - User does not have admin rights" },
        },
      },
    },
    "/produk": {
      post: {
        summary: "Create a new product (Admin only)",
        tags: ["Produk"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nama", "harga", "stok"],
                properties: {
                  nama: { type: "string", example: "Kopi Hitam" },
                  harga: { type: "number", example: 15000 },
                  stok: { type: "integer", example: 10 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Produk created successfully" },
          400: { description: "Validation error" },
          500: { description: "Internal server error" },
        },
      },
      get: {
        summary: "Get all products",
        tags: ["Produk"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of all products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/produk/{id}": {
      put: {
        summary: "Update product by ID (Admin only)",
        tags: ["Produk"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nama: { type: "string", example: "Kopi Susu" },
                  harga: { type: "number", example: 20000 },
                  stok: { type: "integer", example: 5 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Produk updated successfully" },
          404: { description: "Produk not found" },
          400: { description: "Validation error" },
          500: { description: "Internal server error" },
        },
      },
      delete: {
        summary: "Delete product by ID (Admin only)",
        tags: ["Produk"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Produk deleted successfully" },
          404: { description: "Produk not found" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/order": {
      post: {
        summary: "Create a new order (1 product per order)",
        tags: ["Order"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["produkId", "quantity"],
                properties: {
                  produkId: {
                    type: "integer",
                    example: 1,
                  },
                  quantity: {
                    type: "integer",
                    example: 2,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Order created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Order created successfully",
                    },
                    orderId: { type: "integer", example: 101 },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad request (missing data or insufficient stock)",
          },
          401: { description: "Unauthorized - Invalid or missing token" },
          404: { description: "Product not found" },
          500: { description: "Server error" },
        },
      },
      get: {
        summary: "Get order history for the logged-in user",
        tags: ["Order"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of user's past orders",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Order",
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized - Invalid or missing token" },
          500: { description: "Server error" },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          price: { type: "number" },
          stock: { type: "integer" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "integer", example: 101 },
          userId: { type: "integer", example: 1 },
          status: { type: "string", example: "PENDING" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-08-15T14:48:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2025-08-15T14:48:00.000Z",
          },
          items: {
            type: "array",
            items: {
              $ref: "#/components/schemas/OrderItem",
            },
          },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "integer", example: 55 },
          productId: { type: "integer", example: 1 },
          quantity: { type: "integer", example: 2 },
          price: { type: "number", format: "float", example: 199.99 },
          product: {
            $ref: "#/components/schemas/Product",
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
