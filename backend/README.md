# JobSecure Backend

This is the backend API for the JobSecure platform, a secure freelance marketplace designed to protect freelancers from scams.

## Features

- User authentication with JWT
- Email verification
- Job listing management
- Application and hiring process
- Secure payment handling
- Role-based access control

## Tech Stack

- Node.js
- Express
- MongoDB
- JWT for authentication
- Nodemailer for email notifications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/jobsecure
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@jobsecure.com
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/update-password` - Update password (authenticated)
- `GET /api/auth/logout` - Logout user

### Jobs

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job (employers only)
- `PUT /api/jobs/:id` - Update job (owner only)
- `DELETE /api/jobs/:id` - Delete job (owner only)
- `POST /api/jobs/:id/apply` - Apply for a job (freelancers only)
- `GET /api/jobs/:id/applicants` - Get job applicants (owner only)
- `PUT /api/jobs/:id/hire/:userId` - Hire a freelancer (owner only)
- `PUT /api/jobs/:id/complete` - Mark job as completed (owner only)

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/jobs` - Get user's jobs
- `GET /api/users/jobs/active` - Get user's active jobs
- `GET /api/users/jobs/completed` - Get user's completed jobs
- `GET /api/users/dashboard` - Get user's dashboard stats

## Security Features

- JWT authentication
- Password hashing with Argon2
- Email verification
- Role-based access control
- Input validation
- MongoDB injection protection
- Email domain verification

## Email Restrictions

For security purposes, only Gmail and ProtonMail accounts are allowed for registration.
