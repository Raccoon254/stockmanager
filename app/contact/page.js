'use client'

import Navbar from '@/components/Navbar'
import Link from 'next/link'
import {
    Phone,
    Mail,
    MapPin,
    ExternalLink,
    Clock,
    MessageCircle,
    Send,
    ArrowRight,
    Globe,
    Github,
    Linkedin
} from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        Get in 
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Touch</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                        Have questions about InvenTree? Need help getting started? We're here to help you succeed.
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {/* Email */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-8 text-center hover:shadow-sm transition-shadow duration-200">
                            <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-6">
                                <Mail className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Us</h3>
                            <p className="text-gray-600 mb-4">
                                Send us an email and we'll get back to you within 24 hours.
                            </p>
                            <a 
                                href="mailto:tomsteve187@gmail.com"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                            >
                                info@kentom.co.ke
                                <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-8 text-center hover:shadow-sm transition-shadow duration-200">
                            <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-6">
                                <Phone className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Call Us</h3>
                            <p className="text-gray-600 mb-4">
                                Speak directly with our team for immediate assistance.
                            </p>
                            <a 
                                href="tel:+254758481320"
                                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                            >
                                +254 758 481 320
                                <Phone className="h-4 w-4 ml-2" />
                            </a>
                        </div>

                        {/* Location */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-8 text-center hover:shadow-sm transition-shadow duration-200 md:col-span-2 lg:col-span-1">
                            <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-6">
                                <MapPin className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
                            <p className="text-gray-600 mb-4">
                                Based in Kenya, serving businesses globally.
                            </p>
                            <span className="text-purple-600 font-medium">
                                Nairobi, Kenya
                            </span>
                        </div>
                    </div>

                    {/* Support Hours */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-8 mb-16">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <Clock className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Support Hours</h3>
                        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                                <p className="text-gray-600">24/7 - We respond within 24 hours</p>
                            </div>
                            <div className="text-center">
                                <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
                                <p className="text-gray-600">Monday - Friday, 9 AM - 6 PM EAT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer Contact */}
            <section className="py-16 px-6 bg-white/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Meet the Developer
                        </h2>
                        <p className="text-lg text-gray-600">
                            InvenTree is built and maintained by Ken Tom, a passionate software developer from Kenya.
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">KT</span>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ken Tom</h3>
                                <p className="text-blue-600 font-medium mb-4">Full-Stack Developer & Entrepreneur</p>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    With years of experience in software development and a deep understanding of African business challenges, 
                                    Ken created InvenTree to empower small and medium businesses with professional-grade inventory management tools.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <a
                                        href="https://kentom.co.ke"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        <Globe className="h-4 w-4 mr-2" />
                                        Visit Portfolio
                                        <ExternalLink className="h-4 w-4 ml-2" />
                                    </a>
                                    <a
                                        href="mailto:tomsteve187@gmail.com"
                                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Direct Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600">
                            Quick answers to common questions about InvenTree.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Is InvenTree really free?</h3>
                            <p className="text-gray-600">
                                Yes! InvenTree is completely free with no hidden costs, subscription fees, or trial limitations. 
                                All core features including inventory tracking, sales management, and analytics are free forever.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I get started?</h3>
                            <p className="text-gray-600">
                                Simply sign up for a free account, create your first shop, and start adding your products. 
                                The system is designed to be intuitive and easy to use from day one.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I manage multiple shops?</h3>
                            <p className="text-gray-600">
                                Absolutely! InvenTree supports multiple shop locations with separate inventory tracking, 
                                sales management, and analytics for each location.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">What about future premium features?</h3>
                            <p className="text-gray-600">
                                We may introduce a one-time lifetime purchase option for advanced features in the future, 
                                but all current functionality will always remain free. We believe in transparency and will 
                                communicate any changes well in advance.
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-black/5 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">How secure is my data?</h3>
                            <p className="text-gray-600">
                                We use enterprise-grade security measures including encryption, secure authentication, 
                                and regular backups to protect your business data. Your privacy and security are our top priorities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                        Join hundreds of businesses already using InvenTree to streamline their operations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md group"
                        >
                            Start Using InvenTree
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-200"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}