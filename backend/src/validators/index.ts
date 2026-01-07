import { z } from 'zod';

// Phone number validation: local format starting with 0, followed by 9-10 digits
const phoneNumberSchema = z.string()
  .regex(/^0\d{9,10}$/, 'Phone number must start with 0 and be followed by 9-10 digits (e.g., 07501234567)')
  .min(10, 'Phone number must be at least 10 digits')
  .max(11, 'Phone number must be at most 11 digits');

// Auth validators
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  phoneNumber: phoneNumberSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  registrationPassword: z.string().min(1, 'Registration password is required'),
});

export const loginSchema = z.object({
  phoneNumber: phoneNumberSchema,
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  phoneNumber: phoneNumberSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const verifyResetTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Valid shoe sizes (38-48)
const VALID_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'];

// Size validation helper
const sizeSchema = z.string().refine(
  (size) => VALID_SIZES.includes(size),
  { message: 'Size must be between 38 and 48' }
);

// Shoe validators
export const createShoeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  brand: z.string().min(1, 'Brand is required').max(100),
  category: z.enum(['men', 'women', 'kids'], {
    errorMap: () => ({ message: 'Category must be men, women, or kids' }),
  }),
  sizes: z.array(sizeSchema).min(1, 'At least one size is required'),
  price: z.number().positive('Price must be positive'),
  costPrice: z.number().positive('Cost price must be positive'),
  sku: z.string().min(1, 'SKU is required').max(100),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const updateShoeSchema = createShoeSchema.partial();

// Stock validators
export const addStockSchema = z.object({
  shoeId: z.string().uuid('Invalid shoe ID'),
  size: sizeSchema,
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
});

export const bulkAddStockSchema = z.object({
  shoeId: z.string().uuid('Invalid shoe ID'),
  stockEntries: z.array(
    z.object({
      size: sizeSchema,
      quantity: z.number().int().min(0, 'Quantity must be non-negative'),
    })
  ).min(1, 'At least one stock entry is required'),
});

export const updateStockSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
});

// Sale validators
export const createSaleSchema = z.object({
  shoeId: z.string().uuid('Invalid shoe ID'),
  size: sizeSchema,
  quantity: z.number().int().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive').optional(),
  isOnline: z.boolean().optional(),
});

// Expense validators
export const createExpenseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  category: z.enum(['salary', 'rent', 'utilities', 'supplies', 'other'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  type: z.enum(['daily', 'monthly'], {
    errorMap: () => ({ message: 'Type must be daily or monthly' }),
  }),
  date: z.string().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

// Supplier validators
export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  contact: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

// Purchase validators
export const createPurchaseSchema = z.object({
  supplierId: z.string().uuid('Invalid supplier ID'),
  shoeId: z.string().uuid('Invalid shoe ID'),
  size: sizeSchema,
  quantity: z.number().int().positive('Quantity must be positive'),
  unitCost: z.number().positive('Unit cost must be positive'),
  isCredit: z.boolean(),
  paidAmount: z.number().min(0, 'Paid amount must be non-negative').optional(),
  notes: z.string().max(1000).optional(),
  purchaseDate: z.string().optional(),
  addToStock: z.boolean().optional(),
});

export const updatePurchaseSchema = createPurchaseSchema.partial();

// Supplier Payment validators
export const createSupplierPaymentSchema = z.object({
  supplierId: z.string().uuid('Invalid supplier ID'),
  purchaseId: z.string().uuid('Invalid purchase ID').optional(),
  amount: z.number().positive('Amount must be positive'),
  paymentDate: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export const updateSupplierPaymentSchema = createSupplierPaymentSchema.partial();

// User validators
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phoneNumber: phoneNumberSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user']).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phoneNumber: phoneNumberSchema.optional(),
  role: z.enum(['admin', 'user']).optional(),
  isActive: z.boolean().optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['admin', 'user'], {
    errorMap: () => ({ message: 'Role must be admin or user' }),
  }),
});

export const adminResetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

// Exchange Rate validators
export const setExchangeRateSchema = z.object({
  rate: z.number().positive('Exchange rate must be positive'),
});

