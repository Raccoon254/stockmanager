# Build a Next.js Shop Inventory & Sales Management Application

## Project Overview
Create a simple web application for managing shop inventory and recording sales. The application should be built with modern web technologies and provide an intuitive interface for small business owners.

## Tech Stack Requirements
- **Framework**: Next.js 14+ (App Router, no TypeScript)
- **Database**: MySQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React icons
- **Authentication**: None required (simple standalone app)

## Core Features

### 1. Inventory Management
- **Add New Items**: Form to create inventory items with fields:
  - Item name (required)
  - Description (optional)
  - Category (dropdown with predefined categories + custom option)
  - Purchase price (number)
  - Selling price (number)
  - Current stock quantity (number)
  - SKU/Product code (optional, auto-generated if empty)
  - Date added (auto-generated)

- **View Inventory**: 
  - Display all items in a responsive table/grid layout
  - Show: name, category, stock quantity, selling price, profit margin
  - Search functionality by name or SKU
  - Filter by category
  - Sort by name, stock quantity, price, date added
  - Pagination for large inventories

- **Edit Items**: 
  - Update any item details
  - Adjust stock quantities (with reason notes)
  - Archive/delete items

- **Low Stock Alerts**: 
  - Visual indicators for items with stock below threshold
  - Configurable minimum stock levels per item

### 2. Sales Management
- **Record Sales**: 
  - Quick sale interface with item search/selection
  - Add multiple items to a single sale
  - Adjust quantities for each item
  - Apply discounts (percentage or fixed amount)
  - Calculate totals automatically
  - Record customer name (optional)
  - Payment method selection (cash, card, etc.)
  - Generate sale receipt/summary

- **Sales History**:
  - List all completed sales with date, total amount, items sold
  - View detailed sale information
  - Search sales by date range, customer, or items
  - Daily/weekly/monthly sales summaries

- **Inventory Updates**: 
  - Automatically reduce stock quantities when sales are recorded
  - Prevent overselling (warn when stock is insufficient)

### 3. Dashboard & Analytics
- **Overview Dashboard**:
  - Total inventory value
  - Today's sales count and revenue
  - Low stock items count
  - Top-selling items (this week/month)
  - Recent sales activity

- **Basic Reports**:
  - Sales by date range
  - Most profitable items
  - Inventory turnover
  - Stock levels summary

## Database Schema (Prisma)

### Models Required:
```prisma
model Item {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  category    String
  sku         String   @unique
  purchasePrice Decimal @db.Decimal(10,2)
  sellingPrice  Decimal @db.Decimal(10,2)
  stockQuantity Int
  minStockLevel Int     @default(5)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  saleItems   SaleItem[]
  stockAdjustments StockAdjustment[]
}

model Sale {
  id          Int      @id @default(autoincrement())
  customerName String?
  paymentMethod String
  subtotal    Decimal  @db.Decimal(10,2)
  discount    Decimal  @db.Decimal(10,2) @default(0)
  total       Decimal  @db.Decimal(10,2)
  createdAt   DateTime @default(now())
  
  saleItems   SaleItem[]
}

model SaleItem {
  id          Int     @id @default(autoincrement())
  quantity    Int
  unitPrice   Decimal @db.Decimal(10,2)
  subtotal    Decimal @db.Decimal(10,2)
  
  saleId      Int
  sale        Sale    @relation(fields: [saleId], references: [id])
  itemId      Int
  item        Item    @relation(fields: [itemId], references: [id])
}

model StockAdjustment {
  id          Int      @id @default(autoincrement())
  quantity    Int      // positive for additions, negative for reductions
  reason      String
  createdAt   DateTime @default(now())
  
  itemId      Int
  item        Item     @relation(fields: [itemId], references: [id])
}
```

## UI/UX Requirements

### Layout Structure:
- **Sidebar Navigation**: 
  - Dashboard (home icon)
  - Inventory (package icon)
  - Sales (shopping-cart icon)
  - Reports (bar-chart icon)

- **Main Content Area**: 
  - Page headers with action buttons
  - Responsive design for mobile and desktop
  - Loading states and error handling
  - Success/error toast notifications

### Design Guidelines:
- Clean, modern interface using Tailwind CSS
- Consistent color scheme (blue primary, gray neutrals)
- Use Lucide React icons throughout
- Responsive tables with mobile-friendly alternatives
- Form validation with clear error messages
- Confirm dialogs for destructive actions

## API Routes Structure
```
/api/items
  GET    - Fetch all items with pagination/filtering
  POST   - Create new item
  
/api/items/[id]
  GET    - Fetch single item
  PUT    - Update item
  DELETE - Delete/archive item

/api/sales
  GET    - Fetch sales with pagination
  POST   - Create new sale

/api/sales/[id]
  GET    - Fetch single sale details

/api/dashboard
  GET    - Fetch dashboard statistics

/api/stock-adjustments
  POST   - Record stock adjustment
```

## Page Structure
```
/                    - Dashboard
/inventory           - Inventory list page
/inventory/new       - Add new item form
/inventory/[id]      - Edit item page
/sales               - Sales history page
/sales/new           - Record new sale page
/sales/[id]          - Sale details page
/reports             - Basic reports page
```

## Implementation Guidelines

### 1. Setup Instructions:
- Initialize Next.js project with App Router
- Install and configure Prisma with MySQL
- Set up Tailwind CSS
- Install Lucide React icons
- Create environment variables for database connection

### 2. Development Priorities:
1. Set up database schema and connections
2. Create basic CRUD operations for inventory
3. Build inventory management UI
4. Implement sales recording functionality
5. Add dashboard with basic statistics
6. Enhance with search, filtering, and sorting
7. Add reports and analytics

### 3. Key Features to Implement:
- Real-time stock quantity updates
- Automatic SKU generation if not provided
- Input validation and error handling
- Responsive design for mobile use
- Export functionality for reports (CSV)
- Keyboard shortcuts for quick navigation

### 4. Nice-to-Have Additions:
- Barcode scanning support (future enhancement)
- Print receipt functionality
- Backup/restore data features
- Multi-currency support
- Category management interface
- Bulk import/export of inventory

## Environment Setup Required:
```env
DATABASE_URL="mysql://username:password@localhost:3306/shop_db"
NEXTAUTH_SECRET="your-secret-key"
```

Create a professional, user-friendly application that can handle the daily operations of a small retail shop with inventory tracking and sales management capabilities.
