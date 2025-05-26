# VPN Reseller Billing & Management Suite

This project is a comprehensive web application for managing VPN reseller billing, representatives, invoices, and accounting. It is built with Next.js, React, Tailwind CSS, and TypeScript, with a Persian RTL user interface.

## Features

- User authentication with JWT and bcrypt
- Representative management with CRUD operations
- Invoice management with import and PDF generation
- Accounting and payment logging
- Representative referral hierarchy visualization
- Payment history logs
- Invoice status management
- Responsive and modern Persian RTL UI with Tailwind CSS

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Access the app at `http://localhost:3000`

## Docker

Build and run with Docker:

```bash
docker-compose up --build
```

## Project Structure

- `src/app`: Frontend pages and components
- `src/pages/api`: Backend API routes
- `src/lib`: Utility libraries (i18n, auth)
- `Dockerfile`, `docker-compose.yml`: Containerization setup

## Next Steps

- Integration testing
- Deployment setup
- User acceptance testing
- Feature enhancements and bug fixes

## License

MIT License
