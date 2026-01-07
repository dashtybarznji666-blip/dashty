# Quick Start Guide

Get the Shoe Store Management System up and running in minutes!

## Step 1: Backend Setup

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The backend will start on `http://localhost:3001`

## Step 2: Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Step 3: Access the Application

Open your browser and navigate to `http://localhost:5173`

You should see the Dashboard with sample data from the seed script.

## What's Included in Seed Data?

- 3 sample shoes (Nike running shoes, Zara heels, Adidas kids sneakers)
- Pre-populated stock for all sizes
- Ready to test sales functionality immediately

## Testing the System

1. **View Dashboard**: See total stock, sales, revenue, and profit
2. **Add a Shoe**: Go to Shoes page → Click "Add Shoe"
3. **Add Stock**: Go to Stock page → Click "Add Stock"
4. **Make a Sale**: Go to Sales page → Click "Add Sale"

## Troubleshooting

- **Backend won't start**: Make sure port 3001 is available
- **Frontend can't connect**: Check that backend is running on port 3001
- **Database errors**: Run `npm run prisma:migrate` again in the backend folder
- **Missing dependencies**: Run `npm install` in both backend and frontend folders

## Next Steps

- Customize the seed data in `backend/prisma/seed.ts`
- Add your own shoes and stock
- Start recording sales!


