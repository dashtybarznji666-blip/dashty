# Shoe Store Management System

A complete, production-ready shoe store management system built with Node.js, Prisma, React, TypeScript, and shadcn/ui.

## Features

### 🔹 Core Features

1. **Shoe Management**
   - Add, update, and delete shoes
   - Track brand, category (men/women/kids), sizes, prices, SKU, and descriptions
   - Image URL support

2. **Stock Management**
   - Add stock per shoe per size
   - Automatic stock deduction on sales
   - Low stock indicators (≤10 units)
   - Real-time inventory tracking

3. **Sales System**
   - Create sale entries with automatic stock reduction
   - Profit calculation (sale price - cost price)
   - Today's sales tracking
   - Complete sales history
   - Revenue and profit analytics

### 🔹 Technical Stack

**Backend:**
- Node.js with Express
- Prisma ORM (SQLite)
- TypeScript
- RESTful API architecture

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- shadcn/ui components
- Tailwind CSS for styling
- React Router for navigation

## Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed script
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── lib/               # Utilities
│   │   └── index.ts          # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities & API client
│   │   ├── pages/            # Page components
│   │   └── App.tsx           # Main app component
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and fill in your values
# Required variables:
# - DATABASE_URL: Database connection string
# - JWT_SECRET: Secret key for JWT tokens (minimum 32 characters)
# - JWT_REFRESH_SECRET: Secret key for refresh tokens (minimum 32 characters)
```

**Required Environment Variables:**
- `DATABASE_URL` - Database connection string (e.g., `file:./prisma/prisma/dev.db` for SQLite)
- `JWT_SECRET` - Secret key for JWT access tokens (minimum 32 characters)
- `JWT_REFRESH_SECRET` - Secret key for JWT refresh tokens (minimum 32 characters)

**Optional Environment Variables:**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development, production, test)
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: 30d)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `CLOUDINARY_URL` or `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary configuration for image uploads

See `backend/.env.example` for a complete list of all available environment variables.

4. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set your API URL if different from default
# VITE_API_URL=http://localhost:3001/api
```

**Frontend Environment Variables:**
- `VITE_API_URL` - Backend API base URL (default: http://localhost:3001/api)

If you don't create a `.env` file, the frontend will use the default API URL (`http://localhost:3001/api`).

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Shoes
- `GET /api/shoes` - Get all shoes
- `GET /api/shoes/:id` - Get shoe by ID
- `POST /api/shoes` - Create a new shoe
- `PUT /api/shoes/:id` - Update a shoe
- `DELETE /api/shoes/:id` - Delete a shoe

### Stock
- `GET /api/stock` - Get all stock entries
- `GET /api/stock/low?threshold=10` - Get low stock items
- `GET /api/stock/shoe/:shoeId` - Get stock for a specific shoe
- `POST /api/stock` - Add stock
- `PUT /api/stock/:id` - Update stock quantity

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/today` - Get today's sales
- `GET /api/sales/stats` - Get sales statistics
- `POST /api/sales` - Create a new sale

## Usage

1. **Dashboard**: View overview statistics including total stock, sales, revenue, and profit
2. **Shoes**: Manage your shoe inventory - add, edit, or delete shoes
3. **Stock**: Add stock for shoes and monitor low stock alerts
4. **Sales**: Record sales transactions and view sales history

## Development

### Backend Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Frontend Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Database

The project uses SQLite by default (configured in `backend/prisma/schema.prisma`). The database file will be created at `backend/prisma/dev.db` after running migrations.

To use a different database (PostgreSQL, MySQL, etc.):
1. Update the `DATABASE_URL` in your `.env` file with the appropriate connection string
2. Change the `provider` in `backend/prisma/schema.prisma` to match your database type
3. Run migrations again: `npm run prisma:migrate`

## Environment Configuration

### Backend Environment Variables

See `backend/.env.example` for a complete reference. Key variables:

**Required:**
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT secret (min 32 characters)
- `JWT_REFRESH_SECRET` - Refresh token secret (min 32 characters)

**Optional:**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode
- `FRONTEND_URL` - Frontend URL for CORS
- Cloudinary configuration for image uploads

### Frontend Environment Variables

See `frontend/.env.example` for reference:
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001/api)

**Note:** In development, the backend will use default values for missing environment variables (with warnings). In production, all required variables must be set.

## Production Deployment

### Pre-Deployment Checklist

1. **Backend Environment Variables:**
   - Set `NODE_ENV=production`
   - Configure `DATABASE_URL` for your production database
   - Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` (32+ characters each)
   - Configure `FRONTEND_URL` to your production frontend URL
   - Configure Cloudinary or image storage service

2. **Frontend Environment Variables:**
   - Set `VITE_API_URL` to your production backend API URL

3. **Security:**
   - Ensure CORS is properly configured with `FRONTEND_URL`
   - Review and test authentication flows
   - Enable rate limiting (already configured)
   - Review security headers (helmet.js is configured)

### Deployment Steps

1. **Build the backend:**
```bash
cd backend
npm install --production
npm run build
npm start
```

2. **Build the frontend:**
```bash
cd frontend
npm install
npm run build
```

3. **Serve the application:**
   - Serve the frontend build files from the `frontend/dist` directory
   - Proxy API requests to the backend server
   - Set up SSL/TLS certificates for HTTPS

### Production Environment Variables Example

**Backend `.env` (production):**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/shoestore
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-minimum-32-characters-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://yourdomain.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend `.env` (production):**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Production Considerations

- Use a process manager like PM2 for the backend
- Set up reverse proxy (nginx) for the backend API
- Configure database backups
- Set up monitoring and logging
- Enable HTTPS/SSL certificates
- Configure firewall rules
- Set up automated deployments (CI/CD)
- Review and test all security measures

## Troubleshooting

For common issues and solutions, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

Common issues include:
- Authentication/login problems
- CORS errors
- Database connection issues
- Build errors
- Deployment issues

## Notes

- The backend CORS is configured to allow requests from the frontend
- Toast notifications are used for user feedback
- Loading states are handled throughout the application
- Error handling is implemented on both backend and frontend
- The seed script creates sample shoes with stock for testing
- Phone numbers are automatically normalized (trimmed) to prevent login issues
- All console statements have been replaced with proper logging

## Additional Resources

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions
- [DEPLOYMENT_SCRIPTS.md](DEPLOYMENT_SCRIPTS.md) - Deployment guide
- [DEPLOYMENT_TODO.md](DEPLOYMENT_TODO.md) - Deployment checklist
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide

## License

ISC
 
 #   d a s h t y 
 
 #   d a s h t y 
 
 