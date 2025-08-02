
import {
    Coins,
    Package,
    ShoppingCart,
    AlertTriangle,
    TrendingUp,
    Star,
    Clock,
    ArrowUpRight,
    PieChart,
    ShoppingBag
} from 'lucide-react';

const SkeletonCard = () => (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
);

const DashboardSkeleton = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 overflow-hidden p-6 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div>
                            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>
                    <div className="h-10 bg-gray-300 rounded-lg w-36"></div>
                </div>
            </div>

            {/* Title */}
            <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-xl w-1/3 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded-xl w-1/2"></div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Bottom Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                </div>
                                <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 p-6 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                </div>
                                <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
