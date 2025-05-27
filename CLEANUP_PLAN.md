# Cleanup Plan

## 1. Files to Keep

### Core App Files
```
src/
├── app/
│   ├── layout.tsx              # Main layout with RTL and i18n support
│   ├── page.tsx               # Dashboard page
│   ├── login/                 # Authentication
│   │   └── page.tsx
│   ├── representatives/       # Representative management
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   └── payments/
│   │   └── referral/
│   ├── invoices/             # Invoice management
│   │   ├── page.tsx
│   │   └── status/
│   └── analytics/            # Analytics dashboard
│       └── page.tsx
```

### Essential Components
```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx        # Base button component
│   │   ├── input.tsx         # Form inputs
│   │   ├── select.tsx        # Dropdowns
│   │   ├── table.tsx         # Data tables
│   │   ├── card.tsx          # Card containers
│   │   ├── dialog.tsx        # Modal dialogs
│   │   ├── form.tsx          # Form handling
│   │   ├── sidebar.tsx       # Navigation
│   │   └── chart.tsx         # Analytics charts
│   └── i18n-provider.tsx     # Language provider
```

### Core Utilities
```
src/
├── lib/
│   ├── auth.ts               # Authentication utilities
│   ├── db.ts                # Database client
│   ├── i18n.ts              # i18n configuration
│   ├── roles.ts             # Role definitions
│   └── utils.ts             # Common utilities
```

### API Routes
```
src/
├── app/
│   └── api/
│       ├── auth/
│       │   └── login/
│       ├── representatives/
│       ├── invoices/
│       └── analytics/
```

## 2. Files to Remove

### Unused UI Components
- accordion.tsx
- alert-dialog.tsx
- aspect-ratio.tsx
- avatar.tsx
- breadcrumb.tsx
- carousel.tsx
- collapsible.tsx
- command.tsx
- context-menu.tsx
- drawer.tsx
- hover-card.tsx
- menubar.tsx
- navigation-menu.tsx
- popover.tsx
- progress.tsx
- radio-group.tsx
- resizable.tsx
- scroll-area.tsx
- separator.tsx
- sheet.tsx
- skeleton.tsx
- slider.tsx
- sonner.tsx
- switch.tsx
- tabs.tsx
- textarea.tsx
- toggle-group.tsx
- toggle.tsx
- tooltip.tsx

## 3. New Files to Create

### Database
```
prisma/
├── schema.prisma            # Database schema
└── migrations/              # Database migrations
```

### Types
```
src/
└── types/
    ├── representative.ts    # Representative types
    ├── invoice.ts          # Invoice types
    ├── payment.ts          # Payment types
    └── api.ts              # API types
```

### Services
```
src/
└── services/
    ├── auth.service.ts     # Authentication service
    ├── rep.service.ts      # Representative service
    ├── invoice.service.ts  # Invoice service
    └── telegram.service.ts # Telegram bot service
```

## 4. Configuration Files

### Development
```
.
├── .eslintrc.js           # ESLint configuration
├── .prettierrc           # Prettier configuration
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
└── docker-compose.yml    # Docker configuration
```

## 5. Action Items

1. Clean Dependencies
- Remove unused Radix UI packages
- Add required production dependencies
- Update development dependencies

2. Setup Development Environment
- Configure ESLint and Prettier
- Set up Husky pre-commit hooks
- Configure Jest and Testing Library

3. Database Setup
- Initialize Prisma
- Create initial schema
- Set up migrations

4. Documentation
- Update README.md
- Create API documentation
- Add development guides

## 6. Testing Strategy

1. Unit Tests
- Authentication flows
- Data validation
- Utility functions

2. Integration Tests
- API endpoints
- Database operations
- Service interactions

3. E2E Tests
- User flows
- Representative management
- Invoice processing

This cleanup will provide a solid foundation for implementing the core features while maintaining code quality and performance.
