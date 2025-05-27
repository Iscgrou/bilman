# Enhanced Authentication System Installation Guide

## Repository Information
This project is hosted at: https://github.com/Iscgrou/bilman

## Initial Setup on VPS

1. **Clone the Repository**
```bash
# Clone the repository
git clone https://github.com/Iscgrou/bilman.git

# Navigate to project directory
cd bilman
```

## Prerequisites

- Node.js 16.x or later
- PostgreSQL database
- npm or yarn package manager

## Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
JWT_SECRET="your-secure-jwt-secret"
```

3. **Database Setup**
```bash
# Initialize Prisma
npx prisma init

# Apply migrations
npx prisma migrate dev

# Seed the database (if needed)
npx prisma db seed
```

4. **Build and Start the Application**
```bash
# Build the application
npm run build

# Start in production mode
npm start
```

## Security Features

1. **CSRF Protection**
- Tokens are automatically generated and rotated
- Required for all API requests
- Stored in HTTP-only cookies

2. **Rate Limiting**
- Prevents brute force attacks
- Configurable limits per IP address
- Customizable timeframes

3. **Session Management**
- JWT-based authentication
- Configurable session duration
- "Remember me" functionality
- Secure cookie handling

4. **Role-Based Access Control**
- Route protection based on user roles
- Dynamic navigation menu
- Automatic redirects for unauthorized access

## Access and Usage

1. **Application Access**
- Login page: `http://your-vps-ip-or-domain/login`
- Dashboard: `http://your-vps-ip-or-domain/dashboard`

2. **User Roles**
- ADMIN: Full access to all features
- OPERATOR: Access to dashboard, representatives, and invoices
- REPRESENTATIVE: Access to dashboard and invoices only

## Maintenance

1. **Updates and Maintenance**
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart the application
npm start
```

2. **Database Maintenance**
```bash
# Apply any new migrations
npx prisma migrate deploy

# Update Prisma client
npx prisma generate
```

## Troubleshooting

1. **Common Issues**
- Database connection errors: Check DATABASE_URL in .env
- Authentication failures: Verify JWT_SECRET
- Permission issues: Check user role assignments

2. **Logs**
```bash
# View application logs
pm2 logs # if using PM2
# or
npm run dev # for development mode with logs
```

## Support

For issues and support:
1. Check the troubleshooting section above
2. Review application logs
3. Visit the repository: https://github.com/Iscgrou/bilman
4. Contact system administrator

This authentication system provides a secure, scalable, and maintainable solution for user authentication and authorization.
