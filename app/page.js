'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowRight, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Shield, 
  Zap,
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Stock Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Manage Your Inventory with
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Streamline your stock management, track sales, and grow your business with our comprehensive inventory management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage your inventory
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From small shops to growing businesses, our platform scales with your needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-200">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Inventory Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Track stock levels, set minimum thresholds, and get alerts when items are running low.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-200">
              <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sales Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Process sales, manage customers, and automatically update inventory levels.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-200">
              <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics & Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Get insights into your sales performance and inventory trends with detailed reports.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-200">
              <div className="p-3 bg-yellow-100 rounded-xl w-fit mb-4">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Shop Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage multiple shops from one dashboard with separate inventory tracking.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-200">
              <div className="p-3 bg-red-100 rounded-xl w-fit mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with enterprise-grade security and regular backups.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-200">
              <div className="p-3 bg-indigo-100 rounded-xl w-fit mb-4">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy to Use</h3>
              <p className="text-gray-600 leading-relaxed">
                Intuitive interface designed for business owners, no technical knowledge required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to streamline your inventory management?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Stock Manager to optimize their operations.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Stock Manager</h3>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Professional inventory management system designed to help businesses of all sizes streamline their operations and grow efficiently.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Built by</span>
                <a 
                  href="https://kentom.co.ke" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
                >
                  <span>Ken Tom</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span>& Claude</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">+254 758 481 320</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href="mailto:info@kentom.co.ke" className="text-sm hover:text-white">
                    info@kentom.co.ke
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">Kenya</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/auth/signin" className="block text-gray-300 hover:text-white text-sm">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="block text-gray-300 hover:text-white text-sm">
                  Get Started
                </Link>
                <a 
                  href="https://kentom.co.ke" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-gray-300 hover:text-white text-sm"
                >
                  Developer Portfolio
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Stock Manager. Built with ❤️ in Kenya.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
