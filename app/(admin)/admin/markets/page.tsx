"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MetricCard } from "@/components/shared/metric-card";
import {
  MapPin,
  Plus,
  MoreVertical,
  Edit,
  Pause,
  Play,
  Settings,
  TrendingUp,
  Users,
  Building2,
  Truck,
  DollarSign,
  Globe,
} from "lucide-react";

const mockMarkets = [
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    status: "active",
    facilities: 45,
    drivers: 120,
    orders: 15420,
    revenue: 458000,
    growth: 12.5,
    currency: "AED",
    zones: ["Downtown", "Marina", "JBR", "Business Bay", "Jumeirah"],
  },
  {
    id: "abu_dhabi",
    name: "Abu Dhabi",
    country: "UAE",
    status: "active",
    facilities: 28,
    drivers: 75,
    orders: 8950,
    revenue: 285000,
    growth: 8.2,
    currency: "AED",
    zones: ["Corniche", "Al Reem", "Khalifa City", "Yas Island"],
  },
  {
    id: "sharjah",
    name: "Sharjah",
    country: "UAE",
    status: "active",
    facilities: 18,
    drivers: 45,
    orders: 5200,
    revenue: 142000,
    growth: 15.8,
    currency: "AED",
    zones: ["Al Majaz", "Al Nahda", "Al Khan"],
  },
  {
    id: "riyadh",
    name: "Riyadh",
    country: "Saudi Arabia",
    status: "active",
    facilities: 35,
    drivers: 95,
    orders: 12100,
    revenue: 385000,
    growth: 22.4,
    currency: "SAR",
    zones: ["Al Olaya", "Al Malqa", "Al Nakheel", "Al Yasmin"],
  },
  {
    id: "jeddah",
    name: "Jeddah",
    country: "Saudi Arabia",
    status: "launching",
    facilities: 12,
    drivers: 30,
    orders: 2800,
    revenue: 78000,
    growth: 0,
    currency: "SAR",
    zones: ["Al Balad", "Al Hamra", "Al Rawdah"],
  },
  {
    id: "doha",
    name: "Doha",
    country: "Qatar",
    status: "planned",
    facilities: 0,
    drivers: 0,
    orders: 0,
    revenue: 0,
    growth: 0,
    currency: "QAR",
    zones: [],
  },
];

export default function MarketsPage() {
  const [selectedMarket, setSelectedMarket] = useState(mockMarkets[0]);

  const totalFacilities = mockMarkets.reduce((sum, m) => sum + m.facilities, 0);
  const totalDrivers = mockMarkets.reduce((sum, m) => sum + m.drivers, 0);
  const totalOrders = mockMarkets.reduce((sum, m) => sum + m.orders, 0);
  const totalRevenue = mockMarkets.reduce((sum, m) => sum + m.revenue, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Management</h1>
          <p className="text-muted-foreground">Configure and manage geographic markets</p>
        </div>
        <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Market
        </Button>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Facilities"
          value={totalFacilities.toString()}
          change="+8 this month"
          trend="up"
          icon={Building2}
        />
        <MetricCard
          title="Total Drivers"
          value={totalDrivers.toString()}
          change="+15 this month"
          trend="up"
          icon={Truck}
        />
        <MetricCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          change="+18.2%"
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Markets List */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Active Markets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Market</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Facilities</TableHead>
                  <TableHead className="text-muted-foreground">Drivers</TableHead>
                  <TableHead className="text-muted-foreground">Revenue</TableHead>
                  <TableHead className="text-muted-foreground">Growth</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMarkets.map((market) => (
                  <TableRow
                    key={market.id}
                    className={`border-border cursor-pointer transition-colors ${
                      selectedMarket?.id === market.id
                        ? "bg-gradient-to-r from-red-500/10 to-orange-500/10"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedMarket(market)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{market.name}</p>
                          <p className="text-xs text-muted-foreground">{market.country}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          market.status === "active"
                            ? "border-green-500/30 text-green-400 bg-green-500/10"
                            : market.status === "launching"
                            ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                            : "border-gray-500/30 text-muted-foreground bg-gray-500/10"
                        }
                      >
                        {market.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{market.facilities}</TableCell>
                    <TableCell className="text-muted-foreground">{market.drivers}</TableCell>
                    <TableCell className="text-foreground font-medium">
                      {market.currency} {(market.revenue / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell>
                      {market.growth > 0 ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          {market.growth}%
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-background border-border"
                        >
                          <DropdownMenuItem className="text-muted-foreground focus:text-foreground focus:bg-muted">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Market
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-muted-foreground focus:text-foreground focus:bg-muted">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                          {market.status === "active" ? (
                            <DropdownMenuItem className="text-amber-400 focus:text-amber-300 focus:bg-muted">
                              <Pause className="w-4 h-4 mr-2" />
                              Pause Market
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-400 focus:text-green-300 focus:bg-muted">
                              <Play className="w-4 h-4 mr-2" />
                              Activate Market
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Market Details */}
        {selectedMarket && (
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">{selectedMarket.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {selectedMarket.country}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={
                    selectedMarket.status === "active"
                      ? "border-green-500/30 text-green-400"
                      : "border-amber-500/30 text-amber-400"
                  }
                >
                  {selectedMarket.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Facilities</p>
                  <p className="text-xl font-bold text-foreground">{selectedMarket.facilities}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Drivers</p>
                  <p className="text-xl font-bold text-foreground">{selectedMarket.drivers}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-xl font-bold text-foreground">
                    {selectedMarket.orders.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold text-green-400">
                    {selectedMarket.currency} {(selectedMarket.revenue / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>

              {/* Zones */}
              <div>
                <Label className="text-muted-foreground mb-2 block">Active Zones</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedMarket.zones.length > 0 ? (
                    selectedMarket.zones.map((zone) => (
                      <Badge
                        key={zone}
                        variant="outline"
                        className="border-gray-600 text-muted-foreground"
                      >
                        {zone}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No zones configured</p>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Express Delivery</p>
                    <p className="text-xs text-muted-foreground">Same-day delivery option</p>
                  </div>
                  <Switch checked={selectedMarket.status === "active"} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">AI Chat Support</p>
                    <p className="text-xs text-muted-foreground">Automated customer support</p>
                  </div>
                  <Switch checked={selectedMarket.status === "active"} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Dynamic Pricing</p>
                    <p className="text-xs text-muted-foreground">Surge pricing during peak hours</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full text-muted-foreground"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Market Settings
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
