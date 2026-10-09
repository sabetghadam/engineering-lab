# Node.js HTTP Server

A minimal HTTP server built directly with Node.js core modules, without Express or NestJS.

## Purpose

This example demonstrates the basic mechanics of handling HTTP requests and responses in Node.js.

It focuses on the underlying HTTP API rather than framework abstractions.

## Concepts

This example covers:

* Creating an HTTP server with `http.createServer()`
* Reading the HTTP method with `req.method`
* Reading the request URL with `req.url`
* Basic request routing
* Setting HTTP status codes
* Setting response headers
* Sending JSON responses
* Ending an HTTP response with `res.end()`

## Implementation

The server provides a simple `/users` endpoint and demonstrates basic handling of other requests.

No external dependencies are required.

## Run

```bash
node server.js
```

The server listens on:

```text
http://localhost:3000
```

Example:

```text
GET /users
```

Response:

```json
{
  "success": true,
  "body": [
    {
      "username": "admin"
    }
  ]
}
```

## Why Start Without a Framework?

Frameworks such as Express and NestJS provide useful abstractions for routing, middleware, dependency injection, validation, and many other concerns.

Understanding the underlying Node.js HTTP API first makes these abstractions easier to understand and reason about.

This example intentionally keeps the implementation small.

## Engineering Note

The goal is not to build a production-ready HTTP server.

The goal is to understand what happens underneath higher-level Node.js web frameworks.

> Start with the primitive. Understand the abstraction.
