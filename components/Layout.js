'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useShop } from '@/contexts/ShopContext'
import ShopSelector from './ShopSelector'
import CreateShopModal from './CreateShopModal'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  BarChart, 
  Menu, 
  X,
  ShoppingBag,
  User,
  LogOut,
  Plus,
} from 'lucide-react'
import Image from "next/image";

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
  },
  {
    name: 'Sales',
    href: '/sales',
    icon: ShoppingCart,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart,
  },
  {
    name: 'Shops',
    href: '/shops',
    icon: ShoppingBag,
  },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCreateShopModal, setShowCreateShopModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { currentShop } = useShop()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl px-4 py-4 shadow-sm border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                InvenTree
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* User Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session?.user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{session?.user?.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-md transition-colors duration-200 text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                className="rounded-xl p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className={`fixed inset-y-0 left-0 flex w-72 flex-col bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  InvenTree
                </h1>
              </div>
              <button
                type="button"
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl">
            <div className="flex items-center px-6 py-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <Image src={"/logo.svg"} alt="InvenTree Logo" width={40} height={40} className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    InvenTree
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Inventory & Sales</p>
                </div>
              </div>
            </div>
            
            {/* Shop Selector */}
            <div className="px-4 mb-6">
              <ShopSelector onCreateShop={() => setShowCreateShopModal(true)} />
            </div>

            <nav className="flex-1 px-4 pb-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-[1.01]'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            
            {/* User Menu */}
            <div className="px-4 py-4 border-t border-gray-200/50">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{session?.user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{session?.user?.email}</p>
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-md">
                    <div className="p-1">
                      <button
                        onClick={() => setShowCreateShopModal(true)}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-md transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 text-gray-500" />
                        <span>Create New Shop</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-md transition-colors duration-200 text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="lg:pl-76 lg:pr-4 lg:py-4">
          <div className="px-4 sm:px-6 lg:px-0">
            {children}
          </div>
        </main>
      </div>
      
      {/* Create Shop Modal */}
      <CreateShopModal 
        isOpen={showCreateShopModal}
        onClose={() => setShowCreateShopModal(false)}
      />
    </div>
  )
}