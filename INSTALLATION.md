# Enhanced Authentication System Installation Guide

This guide explains how to install and set up the enhanced authentication system with role-based access control, CSRF protection, and improved security features.

## Prerequisites

- Node.js 16.x or later
- PostgreSQL database
- npm or yarn package manager

## Installation Steps

1. **Install Dependencies**
```bash
npm install csrf express-rate-limit jsonwebtoken bcryptjs nodemailer
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

4. **File Structure**
```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts
│   │       ├── logout/
│   │       │   └── route.ts
│   │       └── me/
│   │           └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   └── login/
│       └── page.tsx
├── components/
│   └── ui/
│       └── sidebar.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── prisma.ts
│   └── security.ts
└── middleware.ts
```

5. **Security Configuration**
The system includes:
- CSRF protection
- Rate limiting
- HTTP-only cookies
- Role-based access control
- Secure session management

## Usage

1. **Start the Development Server**
```bash
npm run dev
```

2. **Access the Application**
- Login page: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/dashboard`

3. **Role-Based Access**
The system supports three roles:
- ADMIN: Full access to all features
- OPERATOR: Access to dashboard, representatives, and invoices
- REPRESENTATIVE: Access to dashboard and invoices only

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

## API Endpoints

1. **Login**
```
POST /api/auth/login
Body: { username, password, rememberMe }
```

2. **Logout**
```
POST /api/auth/logout
```

3. **Check Authentication**
```
GET /api/auth/me
```

## Error Handling

The system includes comprehensive error handling for:
- Invalid credentials
- Expired sessions
- CSRF token mismatches
- Rate limit exceeded
- Unauthorized access attempts

## Maintenance

1. **Session Cleanup**
- JWT tokens expire automatically
- No manual cleanup required

2. **Security Updates**
- Regularly update dependencies
- Monitor security advisories
- Update JWT_SECRET periodically

## Troubleshooting

1. **CSRF Token Issues**
- Ensure cookies are enabled
- Check for proper token transmission
- Verify cookie domains

2. **Authentication Failures**
- Verify database connection
- Check JWT_SECRET configuration
- Confirm user credentials

3. **Role-Based Access Issues**
- Verify user role assignments
- Check route protection configuration
- Review middleware settings

## Best Practices

1. **Security**
- Use strong JWT secrets
- Enable HTTPS in production
- Regular security audits
- Monitor failed login attempts

2. **Performance**
- Implement caching where appropriate
- Optimize database queries
- Monitor response times

3. **Maintenance**
- Regular dependency updates
- Log monitoring
- Database backups
- Documentation updates

## Support

For issues and support:
1. Check the troubleshooting guide
2. Review error logs
3. Contact system administrator

This authentication system provides a secure, scalable, and maintainable solution for user authentication and authorization.
