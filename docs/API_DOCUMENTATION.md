# DesignForge API Reference

## Overview

This document provides the complete API reference for DesignForge backend services. All API endpoints follow RESTful conventions and return JSON responses.

---

## Base URL

```
Production: https://api.designforge.io
Development: http://localhost:4000
```

## Authentication

All API requests require authentication using Bearer tokens:

```bash
curl -H "Authorization: Bearer <token>" https://api.designforge.io/api/v1/endpoint
```

### Token Types

| Token Type | Description | Expiry |
|------------|-------------|--------|
| Access Token | Short-lived token for API access | 15 minutes |
| Refresh Token | Long-lived token to get new access tokens | 7 days |
| API Key | For server-to-server communication | 1 year |

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "d547e8e9-8f7a-4c8a-9d3f-3a8b7c1d9e5f",
    "name": "My Design",
    "createdAt": "2024-02-03T10:30:00Z",
    "updatedAt": "2024-02-03T10:30:00Z"
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Authentication Endpoints

### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "organization": "Acme Inc"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

### Forgot Password

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "newSecurePassword123"
}
```

---

## Design Endpoints

### List Designs

```http
GET /api/v1/designs?page=1&limit=20&sort=createdAt&order=desc
Authorization: Bearer <access_token>
```

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| sort | string | createdAt | Sort field |
| order | string | desc | Sort order (asc/desc) |
| search | string | - | Search query |
| status | string | - | Filter by status |

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "dsn_1234567890",
      "name": "Mobile App Design",
      "description": "Design for mobile application",
      "status": "published",
      "version": "1.2.0",
      "thumbnail": "https://cdn.designforge.io/thumbnails/123.jpg",
      "createdAt": "2024-02-03T10:30:00Z",
      "updatedAt": "2024-02-03T10:30:00Z",
      "owner": {
        "id": "usr_1234567890",
        "name": "John Doe",
        "avatar": "https://cdn.designforge.io/avatars/123.jpg"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Get Single Design

```http
GET /api/v1/designs/:id
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "dsn_1234567890",
    "name": "Mobile App Design",
    "description": "Design for mobile application",
    "status": "draft",
    "version": "1.2.0",
    "tokens": {
      "colors": [...],
      "typography": [...],
      "spacing": [...],
      "components": [...]
    },
    "settings": {
      "theme": "light",
      "fontSize": 16
    },
    "createdAt": "2024-02-03T10:30:00Z",
    "updatedAt": "2024-02-03T10:30:00Z"
  }
}
```

### Create Design

```http
POST /api/v1/designs
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "New Design",
  "description": "Description of the design",
  "template": "blank",
  "tokens": {
    "colors": [...],
    "typography": [...],
    "spacing": [...]
  }
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": "dsn_1234567890",
    "name": "New Design",
    "createdAt": "2024-02-03T10:30:00Z"
  }
}
```

### Update Design

```http
PUT /api/v1/designs/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Design Name",
  "description": "Updated description"
}
```

### Delete Design

```http
DELETE /api/v1/designs/:id
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

### Duplicate Design

```http
POST /api/v1/designs/:id/duplicate
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Copy of Design"
}
```

---

## Token Endpoints

### List Tokens

```http
GET /api/v1/tokens?type=color&brandId=brand_123
Authorization: Bearer <access_token>
```

### Create Token

```http
POST /api/v1/tokens
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "primary-500",
  "type": "color",
  "value": "#3b82f6",
  "description": "Primary brand color",
  "brandId": "brand_123",
  "tags": ["brand", "primary"]
}
```

### Update Token

```http
PUT /api/v1/tokens/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "value": "#2563eb",
  "description": "Updated primary color"
}
```

### Delete Token

```http
DELETE /api/v1/tokens/:id
Authorization: Bearer <access_token>
```

### Bulk Import Tokens

```http
POST /api/v1/tokens/import
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "tokens": [
    {
      "name": "primary-500",
      "type": "color",
      "value": "#3b82f6"
    },
    {
      "name": "font-size-base",
      "type": "typography",
      "value": "16px"
    }
  ],
  "strategy": "merge"
}
```

### Export Tokens

```http
GET /api/v1/tokens/export?format=css
Authorization: Bearer <access_token>
```

**Formats Supported:** `css`, `scss`, `json`, `tailwind`, `ios`, `android`

---

## Brand Endpoints

### List Brands

```http
GET /api/v1/brands
Authorization: Bearer <access_token>
```

### Create Brand

```http
POST /api/v1/brands
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "My Brand",
  "description": "Brand description",
  "logo": "https://example.com/logo.png",
  "colors": [...],
  "typography": [...]
}
```

### Update Brand

```http
PUT /api/v1/brands/:id
Authorization: Bearer <access_token>
```

### Delete Brand

```http
DELETE /api/v1/brands/:id
Authorization: Bearer <access_token>
```

---

## Team Endpoints

### List Team Members

```http
GET /api/v1/teams/:teamId/members
Authorization: Bearer <access_token>
```

### Invite Member

```http
POST /api/v1/teams/:teamId/members
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "newmember@example.com",
  "role": "editor"
}
```

**Roles Available:** `owner`, `admin`, `editor`, `viewer`

### Update Member Role

```http
PUT /api/v1/teams/:teamId/members/:userId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "role": "admin"
}
```

### Remove Member

```http
DELETE /api/v1/teams/:teamId/members/:userId
Authorization: Bearer <access_token>
```

---

## Webhook Endpoints

### Register Webhook

```http
POST /api/v1/webhooks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/designforge",
  "events": ["design.created", "design.updated", "design.deleted"],
  "secret": "webhook_secret_key"
}
```

### Test Webhook

```http
POST /api/v1/webhooks/:id/test
Authorization: Bearer <access_token>
```

### Delete Webhook

```http
DELETE /api/v1/webhooks/:id
Authorization: Bearer <access_token>
```

### Webhook Events

| Event | Description |
|-------|-------------|
| design.created | A new design was created |
| design.updated | A design was updated |
| design.deleted | A design was deleted |
| design.published | A design was published |
| token.created | A token was created |
| token.updated | A token was updated |
| token.deleted | A token was deleted |
| team.member_added | A member was added to team |
| team.member_removed | A member was removed from team |

---

## File Upload Endpoints

### Upload Asset

```http
POST /api/v1/assets/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: [binary file data]
folder: "brand-assets"
```

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": "ast_1234567890",
    "url": "https://cdn.designforge.io/assets/1234567890.png",
    "filename": "image.png",
    "mimeType": "image/png",
    "size": 102400,
    "dimensions": {
      "width": 800,
      "height": 600
    }
  }
}
```

### List Assets

```http
GET /api/v1/assets?folder=brand-assets&type=image
Authorization: Bearer <access_token>
```

### Delete Asset

```http
DELETE /api/v1/assets/:id
Authorization: Bearer <access_token>
```

---

## Rate Limiting

### Rate Limits by Plan

| Plan | Requests/Hour | Requests/Day |
|------|---------------|--------------|
| Free | 100 | 1,000 |
| Pro | 1,000 | 10,000 |
| Enterprise | 10,000 | 100,000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_REQUIRED | 401 | Authentication required |
| INVALID_TOKEN | 401 | Invalid or expired token |
| INSUFFICIENT_PERMISSIONS | 403 | User lacks required permissions |
| RESOURCE_NOT_FOUND | 404 | Resource does not exist |
| VALIDATION_ERROR | 400 | Invalid input data |
| DUPLICATE_RESOURCE | 409 | Resource already exists |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

---

## SDKs & Libraries

### JavaScript/TypeScript

```bash
npm install @designforge/sdk
```

```typescript
import { DesignForge } from '@designforge/sdk'

const client = new DesignForge({
  apiKey: process.env.DESIGNFORGE_API_KEY,
})

const designs = await client.designs.list()
```

### Python

```bash
pip install designforge-sdk
```

```python
from designforge import DesignForge

client = DesignForge(api_key="your_api_key")
designs = client.designs.list()
```

### Go

```bash
go get github.com/designforge/sdk-go
```

```go
import "github.com/designforge/sdk-go"

client := designforge.NewClient("your_api_key")
designs, err := client.Designs.List()
```

---

## Postman Collection

Import the following collection to test the API:

```json
{
  "info": {
    "name": "DesignForge API",
    "description": "Complete DesignForge API Reference",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://api.designforge.io/api/v1"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ]
}
```

---

## Related Documentation

- [Authentication Flow Review](../AUTHENTICATION_FLOW_REVIEW.md)
- [Production Review](../PRODUCTION_REVIEW.md)
- [Backend Architecture](./BACKEND_ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
