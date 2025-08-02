'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import {
    Package,
    BarChart3,
    ShoppingCart,
    Users,
    Shield,
    Zap,
    Heart,
    Star,
    ArrowRight,
    CheckCircle,
    Target,
    Globe,
    Lightbulb, Timer, HeartHandshake, BarChart
} from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        About 
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> InvenTree</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                        A comprehensive inventory management solution designed specifically for small to medium businesses in Kenya and beyond.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-6 bg-white/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 border border-blue-200 rounded-full mb-6">
                                <Target className="h-4 w-4 text-blue-600 mr-2" />
                                <span className="text-blue-700 font-medium text-sm">Our Mission</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Empowering Businesses Through Smart Inventory Management
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                We believe that every business, regardless of size, deserves access to professional-grade inventory management tools. That's why InvenTree is completely free - we're committed to helping businesses grow without financial barriers.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">No Hidden Costs</h3>
                                        <p className="text-gray-600">Completely free forever with no subscription fees or hidden charges.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Built for Africa</h3>
                                        <p className="text-gray-600">Designed with African businesses in mind, supporting local currencies and business practices.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Simple & Powerful</h3>
                                        <p className="text-gray-600">Easy to use interface with enterprise-level features and comprehensive analytics.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-2xl border border-black/5 text-center">
                                <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4">
                                    <HeartHandshake className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">100%</h3>
                                <p className="text-gray-600 text-sm">Free Forever</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-black/5 text-center">
                                <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
                                    <Users className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Multi</h3>
                                <p className="text-gray-600 text-sm">Shop Support</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-black/5 text-center">
                                <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
                                    <Timer className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-time</h3>
                                <p className="text-gray-600 text-sm">Analytics</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-black/5 text-center">
                                <div className="p-3 bg-orange-100 rounded-xl w-fit mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure</h3>
                                <p className="text-gray-600 text-sm">& Reliable</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Overview */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full mb-6">
                            <Lightbulb className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-green-700 font-medium text-sm">What We Offer</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Complete Inventory Management Suite
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need to manage your business inventory, sales, and analytics in one comprehensive platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-sm transition-shadow duration-200">
                            <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Inventory Tracking</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Track stock levels in real-time, set automatic reorder points, and never run out of your best-selling items.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-sm transition-shadow duration-200">
                            <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
                                <ShoppingCart className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Seamless Sales Management</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Process sales quickly, track customer information, and automatically update inventory levels with every transaction.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-sm transition-shadow duration-200">
                            <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                                <BarChart className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Analytics</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get detailed insights into sales trends, inventory performance, and profit margins to make informed decisions.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-sm transition-shadow duration-200">
                            <div className="p-3 bg-yellow-100 rounded-xl w-fit mb-4">
                                <Users className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Shop Support</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Manage multiple shop locations from a single dashboard with separate inventory and sales tracking.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-sm transition-shadow duration-200">
                            <div className="p-3 bg-red-100 rounded-xl w-fit mb-4">
                                <Shield className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Your business data is protected with enterprise-grade security, regular backups, and reliable uptime.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-sm transition-shadow duration-200">
                            <div className="p-3 bg-indigo-100 rounded-xl w-fit mb-4">
                                <Zap className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Built with modern technology for lightning-fast performance, even with thousands of products and transactions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Free Section */}
            <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <div className="flex justify-center mb-6">
                        <Heart className="h-12 w-12 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-6">Why is InvenTree Free?</h2>
                    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                        We believe that access to professional business tools shouldn't be limited by budget. By providing InvenTree for free, we're investing in the growth of small businesses everywhere.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4">Our Future Plans</h3>
                        <p className="text-blue-100 leading-relaxed text-start">
                            While InvenTree is completely free today, we may introduce a <strong>one-time lifetime purchase</strong> option in the future for advanced premium features. However, all core functionality - inventory tracking, sales management, and basic analytics - will always remain free. This will ensure we can continue to support and improve the platform while keeping it accessible to all businesses.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md group"
                        >
                            Start Using InvenTree
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-6">
                <div className="mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-6">
                        <Users className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-purple-700 font-medium text-sm">Our Team</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Built by Developers, for Business Owners</h2>
                    <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                        InvenTree is developed by experienced software engineers who understand the challenges of running a business.
                    </p>
                    
                    <div className="">
                        <div className="flex items-center justify-center space-x-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white text-xl font-bold">KT</span>
                                </div>
                                <h3 className="font-semibold text-gray-900">Ken Tom</h3>
                                <p className="text-gray-600 text-sm">Lead Developer</p>
                                <p className="text-xs text-gray-500 mt-2">Kenya</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white text-xl font-bold"></span>
                                </div>
                                <h3 className="font-semibold text-gray-900">Your Name</h3>
                                <p className="text-gray-600 text-sm">Check Github</p>
                                <p className="text-xs text-gray-500 mt-2">Global</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}