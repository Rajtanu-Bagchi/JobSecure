# JobSecure

A secure and scam-resistant freelance job marketplace designed to protect freelancers from common threats like fake clients, non-payment, and identity fraud.

## Project Overview

JobSecure emphasizes verified employers, secure payments, and scam detection, all while providing a seamless platform for freelancers and employers to connect.

### Main Objective

To create a trustworthy platform for freelancers by integrating:
- Scam prevention mechanisms
- Secure authentication
- Identity verification
- Escrow payment simulation

### Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React.js, Redux, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (NoSQL) |
| Authentication | JWT + bcrypt |
| Email Verification | Nodemailer + Email OTP |
| Payments (Simulated) | Stripe test API |
| Scam Detection | Rule-based system |
| Moderation | Admin dashboard for reports, bans |
| DevOps | Vercel (frontend), Render (backend) |

## Core Modules & Features

- **Home Page**: Clear CTAs, platform introduction, security guarantees
- **User Authentication**: Sign Up/Login, Email verification
- **User Dashboards**: For both freelancers and employers
- **Profile Customization**: Basic profile setup, social links
- **Settings**: Platform tour, themes, feedback
- **Job Listings**: Filterable with security indicators
- **Job Details Page**: Full descriptions with employer ratings
- **Escrow Payment Simulation**: Secure payment handling
- **Scam Detection Module**: Email/phone verification, reporting system
- **Admin Panel**: Moderation tools and user management

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
4. Set up environment variables (see .env.example files)
5. Start development servers:
   - Frontend: `npm start` (in frontend directory)
   - Backend: `npm run dev` (in backend directory)

## Project Structure

- `/frontend`: React application
- `/backend`: Express API server
- `/docs`: Project documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.
