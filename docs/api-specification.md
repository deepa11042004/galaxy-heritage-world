# Galaxy Heritage World — REST API Specification

REST API Version: **v1**  
Base Path: `/api/v1`  
Architecture: Node.js + Express.js + TypeScript  
Validation: Zod schemas on body, params, and queries  
Authentication: JWT tokens (Access + Refresh tokens with HTTP-only cookies)  
Documentation: Swagger/OpenAPI available at `/api/v1/docs`

## 1. System Endpoints
- **GET /api/v1/health**
  - Public
  - Description: Returns server uptime, memory, and database connectivity.
  - Response: `{ success: true, status: "UP", timestamp: "...", db: "connected" }`
- **GET /api/v1/ready**
  - Public
  - Description: Readiness probe for container orchestration.
- **GET /api/v1/version**
  - Public
  - Description: Returns API build version and environment info.

## 2. Authentication & Authorization
- **POST /api/v1/auth/login**
  - Public
  - Body: `{ email: string, password: string }`
  - Response: `{ success: true, user: { id, email, name, role }, token }` + HTTP-only cookie.
- **POST /api/v1/auth/logout**
  - Authenticated
  - Clears auth cookies and invalidates session.
- **POST /api/v1/auth/refresh**
  - Public (reads HTTP-only refresh token)
  - Refreshes expired access tokens.
- **GET /api/v1/auth/me**
  - Authenticated
  - Returns profile of logged-in user.

## 3. Destinations
- **GET /api/v1/destinations**
  - Public
  - Query: `type` ("DOMESTIC" | "INTERNATIONAL"), `featured` (boolean), `search` (string)
  - Response: List of published destinations with images, highlight features, and associated resorts.
- **GET /api/v1/destinations/:slug**
  - Public
  - Response: Detailed destination profile with itinerary links, highlights, and gallery.
- **POST /api/v1/admin/destinations** (Roles: SUPER_ADMIN, ADMIN, EDITOR)
- **PATCH /api/v1/admin/destinations/:id** (Roles: SUPER_ADMIN, ADMIN, EDITOR)
- **DELETE /api/v1/admin/destinations/:id** (Roles: SUPER_ADMIN, ADMIN)

## 4. Holiday Packages & Itineraries
- **GET /api/v1/packages**
  - Public
  - Query: `category`, `minPrice`, `maxPrice`, `destinationId`
- **GET /api/v1/packages/:slug**
  - Public
  - Detailed package inclusions, exclusions, day-by-day highlights, pricing tiers.
- **GET /api/v1/itineraries**
  - Public
- **GET /api/v1/itineraries/:slug**
  - Public
- **POST /api/v1/admin/packages**, **PATCH /api/v1/admin/packages/:id**, **DELETE /api/v1/admin/packages/:id**

## 5. Hotels & Resorts
- **GET /api/v1/hotels**
  - Public
  - Query: `city`, `state`, `featured`, `rating`
- **GET /api/v1/hotels/:slug**
  - Public
- **POST /api/v1/admin/hotels**, **PATCH /api/v1/admin/hotels/:id**, **DELETE /api/v1/admin/hotels/:id**

## 6. Day Activities & Experiences
- **GET /api/v1/activities**
  - Public
- **GET /api/v1/activities/:slug**
  - Public
- **POST /api/v1/admin/activities**, **PATCH /api/v1/admin/activities/:id**, **DELETE /api/v1/admin/activities/:id**

## 7. Enquiries, Leads & Contact
- **POST /api/v1/enquiries**
  - Public (Rate limited)
  - Body:
    ```json
    {
      "name": "string (min 2)",
      "email": "string (email)",
      "phone": "string (phone format)",
      "city": "string",
      "destinationInterest": "string (optional)",
      "packageInterest": "string (optional)",
      "travelDates": "string (optional)",
      "travelersCount": "number (optional)",
      "message": "string (optional)",
      "consent": true
    }
    ```
  - Saves to database, creates reference `GHW-ENQ-XXXX`, triggers acknowledgement email if SMTP active.
- **GET /api/v1/admin/enquiries** (Roles: SUPER_ADMIN, ADMIN, SALES, SUPPORT)
- **PATCH /api/v1/admin/enquiries/:id** (Status update: NEW | CONTACTED | QUALIFIED | CLOSED | CANCELLED)
- **POST /api/v1/contact**
  - Direct contact form submission.
- **POST /api/v1/newsletter/subscribe**
  - Newsletter subscription.

## 8. Media Assets Management
- **GET /api/v1/media**
  - Public / Filtered
- **POST /api/v1/admin/media/upload**
  - Authenticated (Admins)
  - Validates MIME type (image/jpeg, image/png, image/webp, image/avif), size limit (< 10MB), non-executable.
- **PATCH /api/v1/admin/media/:id** (Update alt text, tags, title)
- **DELETE /api/v1/admin/media/:id**

## 9. Search & Global Suggestions
- **GET /api/v1/search?q=query**
  - Cross-searches destinations, packages, hotels, and activities using indexed parameterized queries.
- **GET /api/v1/search/suggestions?q=query**
  - Fast autocomplete suggestions.

## 10. FAQs & Testimonials
- **GET /api/v1/faqs**
- **GET /api/v1/testimonials**
