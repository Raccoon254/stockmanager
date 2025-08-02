'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useShop } from '@/contexts/ShopContext'
import {
    Menu,
    X,
    ChevronDown,
    ShoppingCart,
    User,
    LogOut,
    Settings,
    Home,
    Info,
    Box,
    TrendingUpDown,
    Eclipse,
    ShoppingBag
} from 'lucide-react'

export default function Navbar() {
    const { data: session } = useSession()
    const { currentShop } = useShop()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    const publicNavItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'About', href: '/about', icon: Info },
        { name: 'Contact', href: '/contact', icon: User },
    ]

    const privateNavItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Eclipse },
        { name: 'Shops', href: '/shops', icon: ShoppingBag },
        { name: 'Sales', href: '/sales', icon: ShoppingCart },
        { name: 'Inventory', href: '/inventory', icon: Box },
        { name: 'Reports', href: '/reports', icon: TrendingUpDown },
    ]

    const navItems = session ? privateNavItems : publicNavItems

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
    }

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-1">
                        <div className="bg-gradient-to-r from-blue-00 to-indigo-0 rounded-xl">
                            <Image src="/logo.svg" alt="InvenTree" width={34} height={34} />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            InvenTree
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <>
                                {/* Shop indicator */}
                                {currentShop && (
                                    <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                                        <span className="text-sm text-blue-700 font-medium">
                                            {currentShop.name}
                                        </span>
                                    </div>
                                )}

                                {/* User menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                                            </span>
                                        </div>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    {/* User dropdown */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {session.user?.name || 'User'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                            <Link
                                                href="/settings"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Settings className="h-4 w-4" />
                                                <span>Settings</span>
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Sign out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/auth/signin"
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}

                            {session ? (
                                <>
                                    {currentShop && (
                                        <div className="px-4 py-2 border-t border-gray-200 mt-4 pt-4">
                                            <div className="text-xs text-gray-500 mb-1">Current Shop</div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {currentShop.name}
                                            </div>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 mt-4 pt-4">
                                        <div className="px-4 py-2">
                                            <div className="text-sm font-medium text-gray-900">
                                                {session.user?.name || 'User'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {session.user?.email}
                                            </div>
                                        </div>
                                        <Link
                                            href="/settings"
                                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Settings className="h-5 w-5" />
                                            <span className="font-medium">Settings</span>
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span className="font-medium">Sign out</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                                    <Link
                                        href="/auth/signin"
                                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}