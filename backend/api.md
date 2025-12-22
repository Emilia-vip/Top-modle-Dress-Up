## Basic API Documentation

**Base URL (local development)**: `http://10.100.3.10:3000`

All endpoints accept and return JSON.

---

## Authentication

### **POST** `/sign_up`

Create a new user account and receive access + refresh tokens.

**Request body**

```json
{
  "name": "Jane Doe",
  "phone": "+46123456789",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Responses**

- **201 Created**

  ```json
  {
    "access_token": "<JWT access token>",
    "refresh_token": "<JWT refresh token>",
    "user": {
      "_id": "uuid-string",
      "name": "Jane Doe",
      "role": "user",
      "email": "jane@example.com",
      "phone": "+46123456789",
      "password": "secret123",
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  }
  ```

- **400 Bad Request**
  - Missing body or any of: `name`, `phone`, `email`, `password`.
  - User already exists for given email.

---

### **POST** `/login`

Log in an existing user and receive new tokens.

**Request body**

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Responses**

- **201 Created**

  ```json
  {
    "access_token": "<JWT access token>",
    "refresh_token": "<JWT refresh token>",
    "user": {
      "_id": "uuid-string",
      "name": "Jane Doe",
      "role": "user",
      "email": "jane@example.com",
      "phone": "+46123456789",
      "password": "secret123",
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  }
  ```

- **400 Bad Request**
  - Missing `email` or `password`.
- **404 Not Found**
  - No user for that email.
- **401 Unauthorized**
  - Wrong password.

---

### **POST** `/refresh_token`

Exchange a valid refresh token for a new pair of access + refresh tokens.

**Request body**

```json
{
  "refresh_token": "<JWT refresh token>"
}
```

**Responses**

- **200 OK**

  ```json
  {
    "access_token": "<new JWT access token>",
    "refresh_token": "<new JWT refresh token>",
    "user": {
      "_id": "uuid-string",
      "name": "Jane Doe",
      "role": "user",
      "email": "jane@example.com",
      "phone": "+46123456789",
      "password": "secret123",
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  }
  ```

- **400 Bad Request**
  - Missing `refresh_token`.
- **401 Unauthorized**
  - Invalid or non-refresh token.
- **404 Not Found**
  - User in token no longer exists.

---

## Products

### **GET** `/products`

Get the list of products. **Requires a valid access token.**

**Headers**

- **Authorization**: `Bearer <access_token>`

**Responses**

- **200 OK**

  ```json
  [
    {
      "id": "product-id-1",
      "name": "Example Product",
      "price": 100
      // ...other fields depending on the dataset...
    }
    // more products...
  ]
  ```

- **401 Unauthorized**
  - Missing or invalid/expired access token.

---

## Outfits

### Types

```ts
type Rating = {
  grade: number;
  username: string;
};

type Outfit = {
  _id: string;
  username: string;
  top_id: string;
  bottom_id: string;
  ratings: Rating[];
  created_at: string;
};
```

All outfit endpoints accept and return JSON.

---

### **POST** `/outfits`

Create a new outfit.

**Request body**

```json
{
  "username": "alice",
  "top_id": "top-1",
  "bottom_id": "bottom-3"
}
```

**Responses**

- **201 Created**

  ```json
  {
    "_id": "uuid-string",
    "username": "alice",
    "top_id": "top-1",
    "bottom_id": "bottom-3",
    "ratings": [],
    "created_at": "2025-01-01T12:00:00.000Z"
  }
  ```

- **400 Bad Request**
  - Missing `username`, `top_id` or `bottom_id`.

---

### **GET** `/outfits`

Get all outfits.

**Responses**

- **200 OK**

  ```json
  [
    {
      "_id": "uuid-string",
      "username": "alice",
      "top_id": "top-1",
      "bottom_id": "bottom-3",
      "ratings": [
        { "grade": 4, "username": "bob" }
      ],
      "created_at": "2025-01-01T12:00:00.000Z"
    }
    // ...more outfits
  ]
  ```

- **500 Internal Server Error**
  - Unexpected error when fetching outfits.

---

### **GET** `/outfits/user/:userId`

Get all outfits for a specific user. In this API, `userId` corresponds to the `username` field.

**Path params**

- `userId` – the username string.

**Responses**

- **200 OK**

  ```json
  [
    {
      "_id": "uuid-string",
      "username": "alice",
      "top_id": "top-1",
      "bottom_id": "bottom-3",
      "ratings": [],
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  ]
  ```

- **400 Bad Request**
  - Missing `userId` path param.
- **500 Internal Server Error**
  - Unexpected error when fetching outfits for user.

---

### **PUT** `/outfits/:outfitId`

Update an existing outfit’s `top_id` and/or `bottom_id`.

**Path params**

- `outfitId` – the `_id` of the outfit.

**Request body**

At least one of the following is required:

```json
{
  "top_id": "new-top-id",
  "bottom_id": "new-bottom-id"
}
```

**Responses**

- **200 OK**

  ```json
  {
    "message": "Outfit updated successfully",
    "outfit": {
      "_id": "uuid-string",
      "username": "alice",
      "top_id": "new-top-id",
      "bottom_id": "new-bottom-id",
      "ratings": [],
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  }
  ```

- **400 Bad Request**
  - Missing `outfitId` path param.
  - Body does not contain `top_id` or `bottom_id`.
- **404 Not Found**
  - Outfit with given `outfitId` does not exist.
- **500 Internal Server Error**
  - Unexpected error when updating outfit.

---

### **POST** `/outfits/:outfitId/rate`

Add a rating to an existing outfit.

**Path params**

- `outfitId` – the `_id` of the outfit.

**Request body**

```json
{
  "grade": 4,
  "username": "bob"
}
```

Constraints:

- `grade` must be a number between `0` and `5` (inclusive).
- `username` is required (the rater’s username).

**Responses**

- **200 OK**

  ```json
  {
    "message": "Outfit rated successfully",
    "outfit": {
      "_id": "uuid-string",
      "username": "alice",
      "top_id": "top-1",
      "bottom_id": "bottom-3",
      "ratings": [
        { "grade": 4, "username": "bob" }
      ],
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  }
  ```

- **400 Bad Request**
  - Missing `outfitId` path param.
  - `grade` missing, not a number, or outside `0–5`.
  - Missing `username` in body.
- **404 Not Found**
  - Outfit with given `outfitId` does not exist.
- **500 Internal Server Error**
  - Unexpected error when rating outfit.
