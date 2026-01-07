export interface CreateShoeInput {
  name: string;
  brand: string;
  category: 'men' | 'women' | 'kids';
  sizes: string[];
  price: number;
  costPrice: number;
  sku: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateShoeInput extends Partial<CreateShoeInput> {}

export interface AddStockInput {
  shoeId: string;
  size: string;
  quantity: number;
}

export interface BulkAddStockInput {
  shoeId: string;
  stockEntries: Array<{ size: string; quantity: number }>;
}

export interface CreateSaleInput {
  shoeId: string;
  size: string;
  quantity: number;
  unitPrice?: number; // Price in IQD (optional, will use shoe's default price if not provided)
  isOnline?: boolean; // Whether sale was made online
}

export interface CreateExpenseInput {
  title: string;
  description?: string;
  amount: number; // Amount in IQD
  category: 'salary' | 'rent' | 'utilities' | 'supplies' | 'other';
  type: 'daily' | 'monthly';
  date?: Date;
}

export interface UpdateExpenseInput extends Partial<CreateExpenseInput> {}

export interface CreateSupplierInput {
  name: string;
  contact?: string;
  address?: string;
  notes?: string;
}

export interface UpdateSupplierInput extends Partial<CreateSupplierInput> {}

export interface SupplierBalance {
  totalCredit: number;
  totalPaid: number;
  outstandingBalance: number;
}

export interface CreatePurchaseInput {
  supplierId: string;
  shoeId: string;
  size: string;
  quantity: number;
  unitCost: number; // Cost per unit in IQD
  isCredit: boolean;
  paidAmount?: number; // Optional initial payment
  notes?: string;
  purchaseDate?: Date;
  addToStock?: boolean; // Whether to automatically add to stock
  isTodo?: boolean; // Whether purchase needs attention
}

export interface UpdatePurchaseInput extends Partial<CreatePurchaseInput> {}

export interface SupplierTodoGroup {
  supplier: {
    id: string;
    name: string;
    contact?: string;
    address?: string;
    notes?: string;
  };
  purchases: Array<{
    id: string;
    shoeId: string;
    size: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    isCredit: boolean;
    paidAmount: number;
    notes?: string;
    purchaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
    shoe: {
      id: string;
      name: string;
      brand: string;
      sku: string;
    };
  }>;
}

export interface PurchaseBalance {
  totalCost: number;
  paidAmount: number;
  remainingBalance: number;
}

export interface CreateSupplierPaymentInput {
  supplierId: string;
  purchaseId?: string; // Optional: link to specific purchase
  amount: number;
  paymentDate?: Date;
  notes?: string;
}

export interface UpdateSupplierPaymentInput extends Partial<CreateSupplierPaymentInput> {}

export interface CreateUserInput {
  name: string;
  phoneNumber: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserInput {
  name?: string;
  phoneNumber?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export interface LoginInput {
  phoneNumber: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  phoneNumber: string;
  password: string;
  registrationPassword: string;
}


