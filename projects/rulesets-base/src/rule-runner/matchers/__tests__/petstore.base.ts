export const exampleJsonSpec = {
  openapi: '3.0.1',
  info: {
    title: 'Swagger Petstore',
    description:
      'This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.',
    termsOfService: 'http://swagger.io/terms/',
    contact: { email: 'apiteam@swagger.io' },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
    published: true,
    version: 123,
  },
  externalDocs: {
    description: 'Find out more about Swagger',
    url: 'http://swagger.io',
  },
  servers: [
    { url: 'https://petstore.swagger.io/v2' },
    { url: 'http://petstore.swagger.io/v2' },
  ],
  tags: [
    {
      name: 'pet',
      description: 'Everything about your Pets',
      externalDocs: {
        description: 'Find out more',
        url: 'http://swagger.io',
      },
    },
    { name: 'store', description: 'Access to Petstore orders' },
    {
      name: 'user',
      description: 'Operations about user',
      externalDocs: {
        description: 'Find out more about our store',
        url: 'http://swagger.io',
      },
    },
  ],
  paths: {
    '/pet/{petId}/uploadImage': {
      post: {
        tags: ['pet'],
        summary: 'uploads an image',
        operationId: 'uploadFile',
        parameters: [
          {
            name: 'petId',
            in: 'path',
            description: 'ID of pet to update',
            required: true,
            schema: { type: 'integer', format: 'int64' },
          },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                properties: {
                  additionalMetadata: {
                    type: 'string',
                    description: 'Additional data to pass to server',
                  },
                  file: {
                    type: 'string',
                    description: 'file to upload',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    composedObject: {
                      allOf: [
                        {
                          type: 'object',
                          properties: {
                            orderId: { type: 'number' },
                            fulfillmentId: { type: 'string' },
                          },
                        },
                      ],
                    },
                    expandableObject: {
                      anyOf: [
                        {
                          type: 'object',
                          properties: {
                            orderId: { type: 'string' },
                          },
                        },
                        {
                          type: 'object',
                          properties: {
                            order: {
                              type: 'object',
                              properties: {
                                id: { type: 'string' },
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ petstore_auth: ['write:pets', 'read:pets'] }],
      },
    },
    '/store/inventory': {
      get: {
        tags: ['store'],
        summary: 'Returns pet inventories by status',
        description: 'Returns a map of status codes to quantities',
        operationId: 'getInventory',
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: {
                    type: 'integer',
                    format: 'int32',
                  },
                },
              },
            },
          },
        },
        security: [{ api_key: [] }],
      },
    },
    '/store/order': {
      post: {
        tags: ['store'],
        summary: 'Place an order for a pet',
        operationId: 'placeOrder',
        requestBody: {
          description: 'order placed for purchasing the pet',
          content: {
            '*/*': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', format: 'int64' },
                  petId: { type: 'integer', format: 'int64' },
                  quantity: { type: 'integer', format: 'int32' },
                  shipDate: { type: 'string', format: 'date-time' },
                  status: {
                    type: 'string',
                    description: 'Order Status',
                    enum: ['placed', 'approved', 'delivered'],
                  },
                  complete: { type: 'boolean', default: false },
                },
                xml: { name: 'Order' },
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/xml': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', format: 'int64' },
                    petId: { type: 'integer', format: 'int64' },
                    quantity: { type: 'integer', format: 'int32' },
                    shipDate: { type: 'string', format: 'date-time' },
                    status: {
                      type: 'string',
                      description: 'Order Status',
                      enum: ['placed', 'approved', 'delivered'],
                    },
                    complete: { type: 'boolean', default: false },
                  },
                  xml: { name: 'Order' },
                },
              },
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', format: 'int64' },
                    petId: { type: 'integer', format: 'int64' },
                    quantity: { type: 'integer', format: 'int32' },
                    shipDate: { type: 'string', format: 'date-time' },
                    status: {
                      type: 'string',
                      description: 'Order Status',
                      enum: ['placed', 'approved', 'delivered'],
                    },
                    complete: { type: 'boolean', default: false },
                  },
                  xml: { name: 'Order' },
                },
              },
            },
          },
          '400': { description: 'Invalid Order', content: {} },
        },
        'x-codegen-request-body-name': 'body',
      },
    },
    '/store/order/{orderId}': {
      get: {
        tags: ['store'],
        summary: 'Find purchase order by ID',
        description:
          'For valid response try integer IDs with value >= 1 and <= 10.         Other values will generated exceptions',
        operationId: 'getOrderById',
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            description: 'ID of pet that needs to be fetched',
            required: true,
            schema: {
              maximum: 10,
              minimum: 1,
              type: 'integer',
              format: 'int64',
            },
          },
        ],
        responses: {
          '200': {
            description: 'successful operation',
            content: {
              'application/xml': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', format: 'int64' },
                    petId: { type: 'integer', format: 'int64' },
                    quantity: { type: 'integer', format: 'int32' },
                    shipDate: { type: 'string', format: 'date-time' },
                    status: {
                      type: 'string',
                      description: 'Order Status',
                      enum: ['placed', 'approved', 'delivered'],
                    },
                    complete: { type: 'boolean', default: false },
                  },
                  xml: { name: 'Order' },
                },
              },
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', format: 'int64' },
                    petId: { type: 'integer', format: 'int64' },
                    quantity: { type: 'integer', format: 'int32' },
                    shipDate: { type: 'string', format: 'date-time' },
                    status: {
                      type: 'string',
                      description: 'Order Status',
                      enum: ['placed', 'approved', 'delivered'],
                    },
                    complete: { type: 'boolean', default: false },
                  },
                  xml: { name: 'Order' },
                },
              },
            },
          },
          '400': { description: 'Invalid ID supplied', content: {} },
          '404': { description: 'Order not found', content: {} },
        },
      },
      delete: {
        tags: ['store'],
        summary: 'Delete purchase order by ID',
        description:
          'For valid response try integer IDs with positive integer value.         Negative or non-integer values will generate API errors',
        operationId: 'deleteOrder',
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            description: 'ID of the order that needs to be deleted',
            required: true,
            schema: { minimum: 1, type: 'integer', format: 'int64' },
          },
        ],
        responses: {
          '400': { description: 'Invalid ID supplied', content: {} },
          '404': { description: 'Order not found', content: {} },
        },
      },
    },
    '/user': {
      post: {
        tags: ['user'],
        summary: 'Create user',
        description: 'This can only be done by the logged in user.',
        operationId: 'createUser',
        requestBody: {
          description: 'Created user object',
          content: {
            '*/*': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer', format: 'int64' },
                  username: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  phone: { type: 'string' },
                  userStatus: {
                    type: 'integer',
                    description: 'User Status',
                    format: 'int32',
                  },
                },
                xml: { name: 'User' },
              },
            },
          },
          required: true,
        },
        responses: {
          default: { description: 'successful operation', content: {} },
        },
        'x-codegen-request-body-name': 'body',
      },
    },
    '/user/createWithArray': {
      post: {
        tags: ['user'],
        summary: 'Creates list of users with given input array',
        operationId: 'createUsersWithArrayInput',
        requestBody: {
          description: 'List of user object',
          content: {
            '*/*': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', format: 'int64' },
                    username: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    phone: { type: 'string' },
                    userStatus: {
                      type: 'integer',
                      description: 'User Status',
                      format: 'int32',
                    },
                  },
                  xml: { name: 'User' },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          default: { description: 'successful operation', content: {} },
        },
        'x-codegen-request-body-name': 'body',
      },
    },
    '/user/createWithList': {
      post: {
        tags: ['user'],
        summary: 'Creates list of users with given input array',
        operationId: 'createUsersWithListInput',
        requestBody: {
          description: 'List of user object',
          content: {
            '*/*': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', format: 'int64' },
                    username: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    phone: { type: 'string' },
                    userStatus: {
                      type: 'integer',
                      description: 'User Status',
                      format: 'int32',
                    },
                  },
                  xml: { name: 'User' },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          default: { description: 'successful operation', content: {} },
        },
        'x-codegen-request-body-name': 'body',
      },
    },
    '/user/login': {
      get: {
        tags: ['user'],
        summary: 'Logs user into the system',
        operationId: 'loginUser',
        parameters: [
          {
            name: 'username',
            in: 'query',
            description: 'The user name for login',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'password',
            in: 'query',
            description: 'The password for login in clear text',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'successful operation',
            headers: {
              'X-Rate-Limit': {
                description: 'calls per hour allowed by the user',
                schema: { type: 'integer', format: 'int32' },
              },
              'X-Expires-After': {
                description: 'date in UTC when token expires',
                schema: { type: 'string', format: 'date-time' },
              },
            },
            content: {
              'application/xml': { schema: { type: 'string' } },
              'application/json': { schema: { type: 'string' } },
            },
          },
          '400': {
            description: 'Invalid username/password supplied',
            content: {},
          },
        },
      },
    },
    '/user/logout': {
      get: {
        tags: ['user'],
        summary: 'Logs out current logged in user session',
        operationId: 'logoutUser',
        responses: {
          default: { description: 'successful operation', content: {} },
        },
      },
    },
  },
  components: {
    schemas: {
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          petId: { type: 'integer', format: 'int64' },
          quantity: { type: 'integer', format: 'int32' },
          shipDate: { type: 'string', format: 'date-time' },
          status: {
            type: 'string',
            description: 'Order Status',
            enum: ['placed', 'approved', 'delivered'],
          },
          complete: { type: 'boolean', default: false },
        },
        xml: { name: 'Order' },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
        },
        xml: { name: 'Category' },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          username: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          phone: { type: 'string' },
          userStatus: {
            type: 'integer',
            description: 'User Status',
            format: 'int32',
          },
        },
        xml: { name: 'User' },
      },
      Tag: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
        },
        xml: { name: 'Tag' },
      },
      Pet: {
        required: ['name', 'photoUrls'],
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          category: {
            type: 'object',
            properties: {
              id: { type: 'integer', format: 'int64' },
              name: { type: 'string' },
            },
            xml: { name: 'Category' },
          },
          name: { type: 'string', example: 'doggie' },
          photoUrls: {
            type: 'array',
            xml: { name: 'photoUrl', wrapped: true },
            items: { type: 'string' },
          },
          tags: {
            type: 'array',
            xml: { name: 'tag', wrapped: true },
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', format: 'int64' },
                name: { type: 'string' },
              },
              xml: { name: 'Tag' },
            },
          },
          status: {
            type: 'string',
            description: 'pet status in the store',
            enum: ['available', 'pending', 'sold'],
          },
        },
        xml: { name: 'Pet' },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          code: { type: 'integer', format: 'int32' },
          type: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
    securitySchemes: {
      petstore_auth: {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: 'http://petstore.swagger.io/oauth/dialog',
            scopes: {
              'write:pets': 'modify pets in your account',
              'read:pets': 'read your pets',
            },
          },
        },
      },
      api_key: { type: 'apiKey', name: 'api_key', in: 'header' },
    },
  },
};