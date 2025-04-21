# Voting Application

This is a backend application for a voting system where users can vote for candidates. It provides functionalities for user authentication, candidate management, and voting.

## Features

- User sign up and login with Aadhar Card Number and password
- User can view the list of candidates
- User can vote for a candidate (only once)
- Admin can manage candidates (add, update, delete)
- Admin cannot vote

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Singhdhiru/Voting_App.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   - Copy `.env.example` to `.env` and fill in values for `MONGO_URI`, `JWT_SECRET`, and `PORT`
4. Start the server:
   ```bash
   npm start
   ```

## Folder Structure

```
Voting_App/
├── controllers/         # Route logic
├── models/              # Mongoose schemas
├── routes/              # Express route definitions
├── middlewares/         # Authentication & error handling
├── utils/               # Utility functions
├── db.js                # Database connection
├── server.js            # Entry point of the app
├── .env.example         # Example env variables
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

Rename `.env.example` to `.env` and configure:
- `MONGO_URI`: MongoDB connection URI
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3000)

## API Endpoints

## Authentication

### Sign Up
- `POST /signup`: Sign up a user

### Login
- `POST /login`: Login a user

## Candidates

### Get Candidates
- `GET /candidates`: Get the list of candidates

### Add Candidate
- `POST /candidates`: Add a new candidate (Admin only)

### Update Candidate
- `PUT /candidates/:id`: Update a candidate by ID (Admin only)

### Delete Candidate
- `DELETE /candidates/:id`: Delete a candidate by ID (Admin only)

## Voting

### Get Vote Count
- `GET /candidates/vote/count`: Get the count of votes for each candidate

### Vote for Candidate
- `POST /candidates/vote/:id`: Vote for a candidate (User only)

## User Profile

### Get Profile
- `GET /users/profile`: Get user profile information

### Change Password
- `PUT /users/profile/password`: Change user password