'use client'

import { createBreadcrumbItem } from '@/components/Breadcrumb'
import { 
  Home, 
  ShoppingCart, 
  Package, 
  BarChart, 
  TrendingUp, 
  AlertTriangle, 
  ShoppingBag,
  Plus 
} from 'lucide-react'

export function useBreadcrumbs() {
  const createBreadcrumbs = {
    // Dashboard
    dashboard: () => [],
    
    // Sales
    sales: () => [
      createBreadcrumbItem('Dashboard', '/dashboard', Home),
      createBreadcrumbItem('Sales', '/sales', ShoppingCart),
    ],
    salesNew: () => [
      createBreadcrumbItem('Dashboard', '/dashboard', Home),
      createBreadcrumbItem('Sales', '/sales', ShoppingCart),
      createBreadcrumbItem('New Sale', '/sales/new', Plus),
    ],
    saleDetails: (id) => [
      createBreadcrumbItem('Dashboard', '/dashboard', Home),
      createBreadcrumbItem('Sales', '/sales', ShoppingCart),
      createBreadcrumbItem(`Sale #${id}`, `/sales/${id}`, ShoppingCart),
    ],
    
    // Inventory
    inventory: () => [
      createBreadcrumbItem('Dashboard', '/dashboard', Home),
      createBreadcrumbItem('Inventory', '/inventory', Package),
    ],
    
    // Analytics
    analyticsProfit: () => [
      createBreadcrumbItem('Dashboard', '/dashboard', Home),
      createBreadcrumbItem('Analytics', '/analytics', BarChart),
      createBreadcrumbItem('Profit Analysis', '/analytics/profit', TrendingUp),
    ],
    analyticsSales: () => [
      createBreadcrumbItem('Dashboard', '/dashboard', Home),
      createBreadcrumbItem('Analytics', '/analytics', BarChart),
      createBreadcrumbItem("Today's Sales", '/analytics/todays-sales', ShoppingCart),
    ],
    analyticsLowStock: () => [
      createBreadcrumbItem('Dashboard', '/dashboard', Home),
      createBreadcrumbItem('Analytics', '/analytics', BarChart),
      createBreadcrumbItem('Low Stock Alert', '/analytics/low-stock', AlertTriangle),
    ],
    analyticsInventoryValue: () => [
      createBreadcrumbItem('Dashboard', '/dashboard', Home),
      createBreadcrumbItem('Analytics', '/analytics', BarChart),
      createBreadcrumbItem('Inventory Value', '/analytics/inventory-value', Package),
    ],
    
    // Shops
    shops: () => [
      createBreadcrumbItem('Dashboard', '/dashboard', Home),
      createBreadcrumbItem('Shops', '/shops', ShoppingBag),
    ],
  }

  return createBreadcrumbs
}