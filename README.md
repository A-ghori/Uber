# User Registration API Documentation

This document describes the `/users/register` endpoint for registering a new user in your Uber Clone backend.

---

## Endpoint

**POST** `/users/register`

Registers a new user and returns a JWT token and user information.

---

## Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "string (min 5 chars, required)",
    "lastname": "string (min 5 chars, optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 5 chars, required)"
}
```

### Field Details

- **fullname.firstname**  
  - Type: String  
  - Required: Yes  
  - Minimum Length: 5  
  - Description: User's first name.

- **fullname.lastname**  
  - Type: String  
  - Required: No  
  - Minimum Length: 5 (if provided)  
  - Description: User's last name.

- **email**  
  - Type: String  
  - Required: Yes  
  - Validation: Must be a valid email address.  
  - Description: User's email address.

- **password**  
  - Type: String  
  - Required: Yes  
  - Minimum Length: 5  
  - Description: User's password.

---

## Example Request

```json
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Sohail",
    "lastname": "Khan"
  },
  "email": "sohail@example.com",
  "password": "secret123"
}
```

---

## Example Successful Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY2NjY2NjY2NjY2NjY2NjY2NiIsImlhdCI6MTY5MDAwMDAwMH0.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  "user": {
    "_id": "666666666666666666666666",
    "fullname": {
      "firstname": "Sohail",
      "lastname": "Khan"
    },
    "email": "sohail@example.com",
    "socketId": null
  }
}
```

- `token`: JWT authentication token for the user.
- `user`: The created user object (password is not included).

---

## Error Responses

### 400 Bad Request

- **Description**: One or more fields are invalid.
- **Body**:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid Email Bhai Sahi Email Likh Chori Mat Kar",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "Baba maa name dey ni bc?",
      "path": "fullname.firstname",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "Firse chori kar raha !",
      "path": "password",
      "location": "body"
    }
  ]
}
```

---

### 500 Internal Server Error

- **Description**: Server error or database issue.
- **Body**:

```json
{
  "error": "Error message"
}
```

---

## How It Works (Line-by-Line)

1. **Validation**  
   The endpoint uses `express-validator` to check:
   - `email` is a valid email.
   - `fullname.firstname` is at least 5 characters.
   - `password` is at least 5 characters.

2. **Error Handling**  
   If validation fails, returns status `400` with error details.

3. **Extract Data**  
   Extracts `fullname`, `email`, and `password` from the request body.

4. **Password Hashing**  
   Uses `userModel.hashPassword(password)` to hash the password before saving.

5. **User Creation**  
   Calls `userService.createUser` with the user's details (including hashed password).

6. **JWT Token Generation**  
   Calls `user.generateAuthToken()` to create a JWT token for the new user.

7. **Response**  
   Returns status `201` with the token and user info (password is never returned).

8. **Logging**  
   Logs the received data for debugging.

---

## Example Controller Logic

```js
const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });

    console.log("Received Data:", req.body);
}
```

---

## Notes

- All required fields must be present and valid.
- The password is hashed and never returned in the response.
- The endpoint expects the request body in