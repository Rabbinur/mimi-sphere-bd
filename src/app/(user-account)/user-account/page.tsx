"use client";
import {
  Box,
  Camera,
  ChevronRight,
  CreditCard,
  Headphones,
  LogOut,
  MapPin,
  MessageSquare,
  RotateCcw,
  Settings,
  Truck,
  User as UserIcon,
  XCircle
} from "lucide-react";
import Link from "next/link";

import { logoutUser } from "@/components/Authentication/logoutUser";
import RecentOrderSlider from "@/components/Pages/MyAccount/RecentOrderSlider";
import { useAppDispatch } from "@/components/Redux/hooks";
import { useMyProfileQuery } from "@/components/Redux/RTK/authApi";
import { logOut } from "@/components/Redux/Slice/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto border-x border-gray-100">
        {/* Header Skeleton */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-sm" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-6 w-24 mt-2" />
          </div>
        </div>

        {/* Info Bar Skeleton */}
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-4" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-3 md:grid-cols-6 border-b border-gray-100">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center py-8 border-r border-gray-50 last:border-r-0">
              <Skeleton className="h-6 w-6 rounded-full mb-3" />
              <Skeleton className="h-2 w-12" />
            </div>
          ))}
        </div>

        {/* Slider Skeleton */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/10">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>

        {/* Nav List Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-6 border-b border-r border-gray-100">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data, isLoading } = useMyProfileQuery(undefined);

  const handleLogout = () => {
    logoutUser(router);
    dispatch(logOut());
    toast.success("Logged Out Successfully");
  };

  const user = data?.data || {};

  if (isLoading) return <DashboardSkeleton />;

  // API Response mapping for Order Stats
  const stats = user.orderStats || {
    placed_orders: 0,
    to_ship_orders: 0,
    to_received_orders: 0,
    delivered_orders: 0,
    cancelled_orders: 0,
    total_orders: 0
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 ">
      <div className="max-w-4xl mx-auto border-x border-gray-100 ">

        {/* 1. Header: Flat & Clean */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-5">
          <div className="relative group">
            <div className="h-20 w-20 rounded-sm bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
              {user.photo ? (
                <img src={user.photo} alt="profile" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-10 w-10 text-gray-300" />
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-white border border-gray-200 p-1 hover:bg-gray-50 transition-colors">
              <Camera className="h-3 w-3 text-gray-600" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{user.name || "User Name"}</h2>
            <p className="text-xs text-gray-500  tracking-wider mb-2">{user.email || "user@example.com"}</p>
            <Link href="/user-account/account-settings" className="text-[10px] uppercase font-bold border border-gray-300 px-3 py-1 hover:bg-black hover:text-white transition-all">
              Edit Account
            </Link>
          </div>
        </div>

        {/* 2. Compact Order Info Header */}
        <Link href="/user-account/orders" className="flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-widest">My Orders</span>
            <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">
              {stats.total_orders} TOTAL
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>

        {/* 3. Status Grid with Counts */}
        <div className="grid grid-cols-3 md:grid-cols-6 border-b border-gray-100">
          {[
            { label: "ALL", icon: <Box />, color: "text-slate-800", status: "", count: stats.total_orders },
            { label: "PENDING", icon: <CreditCard />, color: "text-orange-500", status: "pending", count: stats.placed_orders },
            { label: "TO SHIP", icon: <Truck />, color: "text-blue-500", status: "processing", count: stats.to_ship_orders },
            { label: "TO RECEIVE", icon: <Box />, color: "text-indigo-500", status: "shipped", count: stats.to_received_orders },
            { label: "DELIVERED", icon: <MessageSquare />, color: "text-emerald-600", status: "delivered", count: stats.delivered_orders },
            { label: "CANCELED", icon: <XCircle />, color: "text-red-500", status: "canceled", count: stats.cancelled_orders },
          ].map((item, idx) => (
            <Link key={idx} href={`/user-account/orders?status=${item.status}`}
              className="flex flex-col items-center py-6 border-r border-gray-50 last:border-r-0 hover:bg-gray-50 transition-colors relative">

              {/* Stat Counter */}
              {item.count > 0 && (
                <span className="absolute top-3 right-4 text-[10px] font-black text-primary">
                  {item.count}
                </span>
              )}

              <div className={`${item.color} mb-2`}>
                {Object.assign({}, item.icon, { props: { ...item.icon.props, className: "h-5 w-5 stroke-[1.5px]" } })}
              </div>
              <span className="text-[10px] font-bold text-gray-500 tracking-tighter">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 4. Recent Order Slider Section */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/30">
          <RecentOrderSlider recentOrders={user.recentOrders || []} />
        </div>

        {/* 5. Utility Navigation List */}
        <div className="grid grid-cols-2 md:grid-cols-3">
          {[
            { label: "Settings", icon: <Settings />, link: "/user-account/account-settings", color: "text-slate-500" },
            { label: "Help Center", icon: <Headphones />, link: "/contact", color: "text-blue-500" },
            { label: "Track Order", icon: <Truck />, link: "/track-order", color: "text-emerald-500" },
            { label: "Address Book", icon: <MapPin />, link: "/user-account/address", color: "text-amber-500" },
            { label: "Returns", icon: <RotateCcw />, link: "/return-policy", color: "text-rose-500" },
          ].map((item, idx) => (
            <Link key={idx} href={item.link} className="flex items-center gap-4 px-6 py-5 border-b border-r border-gray-100 hover:bg-gray-50 transition-all">
              <div className={item.color}>
                {Object.assign({}, item.icon, { props: { ...item.icon.props, className: "h-5 w-5 stroke-[1.5px]" } })}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-tight text-gray-700">{item.label}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 hover:bg-red-50 group transition-all text-left">
            <LogOut className="h-5 w-5 text-red-500 stroke-[1.5px]" />
            <span className="text-[11px] font-bold uppercase tracking-tight text-red-600 transition-colors">Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
}