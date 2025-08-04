'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const pathMappings = {
  // Dashboard
  '': 'Dashboard',
  'dashboard': 'Dashboard',
  
  // Sales
  'sales': 'Sales',
  'sales/new': 'New Sale',
  
  // Inventory
  'inventory': 'Inventory',
  'inventory/new': 'Add Item',
  
  // Analytics
  'analytics': 'Analytics',
  'analytics/profit': 'Profit Analysis',
  'analytics/todays-sales': "Today's Sales",
  'analytics/inventory-value': 'Inventory Value',
  'analytics/low-stock': 'Low Stock Alert',
  
  // Reports
  'reports': 'Reports',
  
  // Shops
  'shops': 'Shops',
  'shops/new': 'Create Shop',
  
  // Settings
  'settings': 'Settings',
  'profile': 'Profile',
  
  // Stock
  'stock-adjustments': 'Stock Adjustments',
}

const iconMappings = {
  '': Home,
  'dashboard': Home,
}

export default function Breadcrumb({ 
  customItems = null, 
  className = "",
  showHome = true 
}) {
  const pathname = usePathname()
  
  // If custom items are provided, use them instead of auto-generating
  if (customItems) {
    return (
      <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
        <div className="flex items-center px-4 py-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            {customItems.map((item, index) => {
              const isLast = index === customItems.length - 1
              const IconComponent = item.icon
              
              return (
                <li key={item.href || index} className="inline-flex items-center">
                  {index > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1.5" />
                  )}
                  
                  {isLast ? (
                    <span className="flex items-center text-gray-800 font-semibold">
                      {IconComponent && <IconComponent className="w-4 h-4 mr-2 text-gray-600" />}
                      <span className="text-sm">{item.label}</span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center text-gray-500 hover:text-blue-600 transition-all duration-200 font-medium hover:bg-blue-50 px-2 py-1 rounded-lg"
                    >
                      {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    )
  }

  // Auto-generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  
  // If we're on the root/dashboard, just show home
  if (pathSegments.length === 0 && showHome) {
    return (
      <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
        <ol className="inline-flex items-center">
          <li className="inline-flex items-center">
            <span className="flex items-center text-gray-700 font-medium">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </span>
          </li>
        </ol>
      </nav>
    )
  }

  const breadcrumbItems = []
  
  // Add home/dashboard as first item if showHome is true
  if (showHome) {
    breadcrumbItems.push({
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home
    })
  }

  // Build breadcrumb items from path segments
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const fullPath = currentPath.substring(1) // Remove leading slash for mapping lookup
    
    // Skip numeric IDs in breadcrumbs (like /sales/123)
    if (/^\d+$/.test(segment)) {
      return
    }
    
    const label = pathMappings[fullPath] || 
                  pathMappings[segment] || 
                  segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    
    breadcrumbItems.push({
      label,
      href: currentPath,
      icon: iconMappings[fullPath] || iconMappings[segment]
    })
  })

  if (breadcrumbItems.length === 0) return null

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <div className="flex z-50 items-center px-4 py-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1
            const IconComponent = item.icon
            
            return (
              <li key={item.href} className="inline-flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1.5" />
                )}
                
                {isLast ? (
                  <span className="flex items-center text-gray-800 font-semibold">
                    {IconComponent && <IconComponent className="w-4 h-4 mr-2 text-gray-600" />}
                    <span className="text-sm">{item.label}</span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-500 hover:text-blue-600 transition-all duration-200 font-medium hover:bg-blue-50 px-2 py-1 rounded-lg"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

// Export helper function for creating custom breadcrumb items
export function createBreadcrumbItem(label, href, icon = null) {
  return { label, href, icon }
}