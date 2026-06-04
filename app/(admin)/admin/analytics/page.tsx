"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricCard } from "@/components/shared/metric-card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Building2,
  Truck,
  Clock,
  Star,
  Download,
  Calendar,
  RefreshCw,
} from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { date: "Jan", revenue: 125000, orders: 1250 },
  { date: "Feb", revenue: 142000, orders: 1420 },
  { date: "Mar", revenue: 158000, orders: 1580 },
  { date: "Apr", revenue: 175000, orders: 1750 },
  { date: "May", revenue: 192000, orders: 1920 },
  { date: "Jun", revenue: 215000, orders: 2150 },
];

const ordersByService = [
  { name: "Wash & Fold", value: 45, color: "#ef4444" },
  { name: "Dry Cleaning", value: 30, color: "#f97316" },
  { name: "Iron Only", value: 15, color: "#eab308" },
  { name: "Premium", value: 10, color: "#22c55e" },
];

const marketPerformance = [
  { market: "Dubai", orders: 4520, revenue: 158000, growth: 12.5 },
  { market: "Abu Dhabi", orders: 2890, revenue: 98000, growth: 8.2 },
  { market: "Sharjah", orders: 1560, revenue: 52000, growth: 15.8 },
  { market: "Riyadh", orders: 3210, revenue: 112000, growth: 22.4 },
];

const hourlyData = [
  { hour: "6AM", orders: 12 },
  { hour: "8AM", orders: 45 },
  { hour: "10AM", orders: 78 },
  { hour: "12PM", orders: 92 },
  { hour: "2PM", orders: 85 },
  { hour: "4PM", orders: 110 },
  { hour: "6PM", orders: 145 },
  { hour: "8PM", orders: 120 },
  { hour: "10PM", orders: 65 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [selectedMarket, setSelectedMarket] = useState("all");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Platform performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder="Market" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="dubai">Dubai</SelectItem>
              <SelectItem value="abu_dhabi">Abu Dhabi</SelectItem>
              <SelectItem value="riyadh">Riyadh</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px] bg-background">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="text-muted-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value="SAR 1.2M"
          change="+18.5%"
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          title="Total Orders"
          value="12,470"
          change="+12.3%"
          trend="up"
          icon={ShoppingBag}
        />
        <MetricCard
          title="Active Customers"
          value="8,542"
          change="+8.7%"
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="Avg Order Value"
          value="SAR 96"
          change="+5.2%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-foreground">Revenue Trend</CardTitle>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18.5% vs last period
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
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
                  <YAxis stroke="#666666" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333333",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                    formatter={(value: number) => [`SAR ${value.toLocaleString()}`, "Revenue"]}
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

        {/* Orders by Service */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Orders by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ordersByService}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ordersByService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333333",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {ordersByService.map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <span className="text-sm text-muted-foreground">{service.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{service.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Order Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Hourly Order Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                  <XAxis dataKey="hour" stroke="#666666" fontSize={12} />
                  <YAxis stroke="#666666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333333",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="orders" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market Performance */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Market Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketPerformance.map((market) => (
                <div key={market.market} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{market.market}</span>
                    <Badge
                      variant="outline"
                      className={
                        market.growth > 10
                          ? "border-green-500/30 text-green-400"
                          : "border-amber-500/30 text-amber-400"
                      }
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {market.growth}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {market.orders.toLocaleString()} orders
                    </span>
                    <span className="text-green-400 font-medium">
                      SAR {(market.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      style={{ width: `${(market.orders / 5000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
                <p className="text-2xl font-bold text-foreground">42 min</p>
                <p className="text-xs text-green-400">-8% from last month</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customer Rating</p>
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-xs text-green-400">+0.2 from last month</p>
              </div>
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Facility Utilization</p>
                <p className="text-2xl font-bold text-foreground">78%</p>
                <p className="text-xs text-green-400">+5% from last month</p>
              </div>
              <Building2 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Driver Efficiency</p>
                <p className="text-2xl font-bold text-foreground">12.4</p>
                <p className="text-xs text-muted-foreground">deliveries/day avg</p>
              </div>
              <Truck className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
