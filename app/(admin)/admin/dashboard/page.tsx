"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/shared/metric-card";
import { mockOrders, mockFacilities, mockDrivers } from "@/lib/mock-data";
import {
  ShoppingBag,
  Users,
  Building2,
  Truck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  DollarSign,
  Activity,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { date: "Mon", revenue: 4200, orders: 42 },
  { date: "Tue", revenue: 5100, orders: 51 },
  { date: "Wed", revenue: 4800, orders: 48 },
  { date: "Thu", revenue: 6200, orders: 62 },
  { date: "Fri", revenue: 7500, orders: 75 },
  { date: "Sat", revenue: 8900, orders: 89 },
  { date: "Sun", revenue: 7200, orders: 72 },
];

const marketData = [
  { market: "Dubai", orders: 245, revenue: 12500 },
  { market: "Abu Dhabi", orders: 189, revenue: 9800 },
  { market: "Sharjah", orders: 156, revenue: 7200 },
  { market: "Riyadh", orders: 98, revenue: 5100 },
];

export default function AdminDashboardPage() {
  const pendingOrders = mockOrders.filter((o) => o.status === "pending").length;
  const activeFacilities = mockFacilities.filter((f) => f.status === "active").length;
  const activeDrivers = mockDrivers.filter((d) => d.status === "online").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
          <p className="text-muted-foreground">Real-time platform overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
          <Button variant="outline" size="sm" className="text-muted-foreground">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Orders"
          value="439"
          trend={{ value: "+12.5%", direction: "up" }}
          icon={<ShoppingBag className="w-5 h-5" />}
        />
        <MetricCard
          title="Revenue (Today)"
          value="SAR 45,230"
          trend={{ value: "+8.2%", direction: "up" }}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <MetricCard
          title="Active Facilities"
          value={activeFacilities.toString()}
          trend={{ value: "+2", direction: "up" }}
          icon={<Building2 className="w-5 h-5" />}
        />
        <MetricCard
          title="Online Drivers"
          value={activeDrivers.toString()}
          trend={{ value: "-3", direction: "down" }}
          icon={<Truck className="w-5 h-5" />}
        />
      </div>

      {/* Alerts Section */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-red-400">High SLA Breach Risk</p>
                  <p className="text-xs text-muted-foreground">5 orders approaching delivery deadline</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                View
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div>
                  <p className="text-sm font-medium text-amber-400">Driver Shortage</p>
                  <p className="text-xs text-muted-foreground">Dubai Marina zone has 3 pending pickups</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-amber-400 hover:text-amber-300">
                Assign
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-400">New Facility Application</p>
                  <p className="text-xs text-muted-foreground">Premium Dry Clean Co. awaiting review</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-foreground">Revenue Trend</CardTitle>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18.2% vs last week
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis dataKey="date" stroke="#666666" fontSize={12} />
                  <YAxis stroke="#666666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333333",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market Performance */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-foreground">Market Performance</CardTitle>
              <Link href="/admin/markets">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" horizontal={false} />
                  <XAxis type="number" stroke="#666666" fontSize={12} />
                  <YAxis dataKey="market" type="category" stroke="#666666" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333333",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                  />
                  <Bar dataKey="orders" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-foreground">Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">SAR {order.total.toFixed(2)}</p>
                    <Badge
                      variant="outline"
                      className={
                        order.status === "delivered"
                          ? "border-green-500/30 text-green-400"
                          : order.status === "processing"
                          ? "border-blue-500/30 text-blue-400"
                          : "border-amber-500/30 text-amber-400"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/orders" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:bg-muted"
              >
                <ShoppingBag className="w-4 h-4 mr-3" />
                Manage Orders
              </Button>
            </Link>
            <Link href="/admin/facilities" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:bg-muted"
              >
                <Building2 className="w-4 h-4 mr-3" />
                Facility Management
              </Button>
            </Link>
            <Link href="/admin/drivers" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:bg-muted"
              >
                <Truck className="w-4 h-4 mr-3" />
                Driver Operations
              </Button>
            </Link>
            <Link href="/admin/payments" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:bg-muted"
              >
                <DollarSign className="w-4 h-4 mr-3" />
                Payment Center
              </Button>
            </Link>
            <Link href="/admin/ai/conversations" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:bg-muted"
              >
                <Activity className="w-4 h-4 mr-3" />
                AI Conversations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
