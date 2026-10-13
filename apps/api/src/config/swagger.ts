export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Galaxy Heritage World API',
    version: '1.0.0',
    description: 'REST API for Galaxy Heritage World luxury travel booking, enquiries, resorts, packages, and CMS management.',
    contact: {
      name: 'Galaxy Heritage World Tech Desk',
      email: 'info@galaxyheritageworld.com',
      url: 'https://galaxyheritageworld.com',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Production / Local API Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'ghw_access_token',
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Service health status',
        responses: {
          '200': { description: 'API and MySQL database healthy' },
        },
      },
    },
    '/destinations': {
      get: {
        summary: 'List published destinations',
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['DOMESTIC', 'INTERNATIONAL'] } },
          { name: 'featured', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'List of destinations' },
        },
      },
      post: {
        summary: 'Create a destination (Admin)',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: { '201': { description: 'Destination created' } },
      },
    },
    '/destinations/{slug}': {
      get: {
        summary: 'Get destination by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Destination details' }, '404': { description: 'Not found' } },
      },
    },
    '/packages': {
      get: {
        summary: 'List vacation packages',
        parameters: [
          { name: 'destinationId', in: 'query', schema: { type: 'string' } },
          { name: 'featured', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'List of vacation packages' } },
      },
    },
    '/packages/{slug}': {
      get: {
        summary: 'Get package details by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Package details' } },
      },
    },
    '/hotels': {
      get: {
        summary: 'List hotels & resorts',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string', enum: ['ASSOCIATED', 'INTERNAL', 'EXCHANGE'] } },
        ],
        responses: { '200': { description: 'List of hotels & resorts' } },
      },
    },
    '/itineraries': {
      get: {
        summary: 'List curated holiday itineraries',
        responses: { '200': { description: 'List of itineraries' } },
      },
    },
    '/activities': {
      get: {
        summary: 'List day outings & activities',
        responses: { '200': { description: 'List of activities' } },
      },
    },
    '/enquiries': {
      post: {
        summary: 'Submit customer holiday enquiry / lead form',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'phone', 'city', 'consent'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  city: { type: 'string' },
                  ageGroup: { type: 'string' },
                  destinationInterest: { type: 'string' },
                  consent: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Enquiry logged and acknowledgement reference generated' },
        },
      },
      get: {
        summary: 'List enquiries (Admin/Sales)',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: { '200': { description: 'Paginated enquiries' } },
      },
    },
    '/enquiries/voucher': {
      post: {
        summary: 'Submit voucher redemption request',
        responses: { '201': { description: 'Voucher registered' } },
      },
    },
    '/search': {
      get: {
        summary: 'Unified search across destinations, packages, hotels, itineraries',
        parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Aggregated search results' } },
      },
    },
    '/faqs': {
      get: {
        summary: 'List FAQ items',
        responses: { '200': { description: 'FAQ items list' } },
      },
    },
    '/settings': {
      get: {
        summary: 'Get public site settings and contact coordinates',
        responses: { '200': { description: 'Site settings' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Staff authentication login',
        responses: { '200': { description: 'JWT token and session cookies set' } },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Staff logout',
        responses: { '200': { description: 'Logged out successfully' } },
      },
    },
  },
};
