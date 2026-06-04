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
import { SearchInput } from "@/components/shared/search-input";
import { MetricCard } from "@/components/shared/metric-card";
import { mockFacilities, mockDrivers, mockTransactions } from "@/lib/mock-data";
import {
  DollarSign,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  MoreVertical,
  Eye,
  Check,
  X,
  Clock,
  Building2,
  Truck,
  RefreshCw,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("transactions");

  const pendingPayouts = mockTransactions
    .filter((t) => t.type === "payout" && t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRevenue = mockTransactions
    .filter((t) => t.type === "order_payment" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const facilitiesPayable = mockFacilities.reduce((sum, f) => sum + f.pendingPayout, 0);
  const driversPayable = mockDrivers.reduce((sum, d) => sum + d.pendingEarnings, 0);

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Center</h1>
          <p className="text-muted-foreground">Manage transactions and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-muted-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-foreground">
            <Wallet className="w-4 h-4 mr-2" />
            Process Payouts
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`SAR ${totalRevenue.toLocaleString()}`}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          title="Pending Payouts"
          value={`SAR ${pendingPayouts.toLocaleString()}`}
          change="8 pending"
          trend="neutral"
          icon={Clock}
        />
        <MetricCard
          title="Facility Payable"
          value={`SAR ${facilitiesPayable.toLocaleString()}`}
          change={`${mockFacilities.length} facilities`}
          trend="neutral"
          icon={Building2}
        />
        <MetricCard
          title="Driver Payable"
          value={`SAR ${driversPayable.toLocaleString()}`}
          change={`${mockDrivers.length} drivers`}
          trend="neutral"
          icon={Truck}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="facility-payouts"
            className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
          >
            Facility Payouts
          </TabsTrigger>
          <TabsTrigger
            value="driver-payouts"
            className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
          >
            Driver Payouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          {/* Filters */}
          <Card className="border-border">
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search by transaction ID, description..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-background">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Description</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="border-border hover:bg-muted"
                    >
                      <TableCell className="font-medium text-foreground font-mono text-sm">
                        {transaction.id}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            transaction.type === "order_payment"
                              ? "border-green-500/30 text-green-400"
                              : transaction.type === "payout"
                              ? "border-blue-500/30 text-blue-400"
                              : "border-amber-500/30 text-amber-400"
                          }
                        >
                          {transaction.type === "order_payment"
                            ? "Payment"
                            : transaction.type === "payout"
                            ? "Payout"
                            : "Refund"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            transaction.status === "completed"
                              ? "border-green-500/30 text-green-400 bg-green-500/10"
                              : transaction.status === "pending"
                              ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                              : "border-red-500/30 text-red-400 bg-red-500/10"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {transaction.type === "order_payment" ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span
                            className={
                              transaction.type === "order_payment"
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            SAR {transaction.amount.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {transaction.date}
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
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {transaction.status === "pending" && (
                              <>
                                <DropdownMenuItem className="text-green-400 focus:text-green-300 focus:bg-muted">
                                  <Check className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-muted">
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
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
        </TabsContent>

        <TabsContent value="facility-payouts" className="space-y-4 mt-4">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Facility</TableHead>
                    <TableHead className="text-muted-foreground">Pending Payout</TableHead>
                    <TableHead className="text-muted-foreground">Last Payout</TableHead>
                    <TableHead className="text-muted-foreground">Bank Account</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFacilities.map((facility) => (
                    <TableRow
                      key={facility.id}
                      className="border-border hover:bg-muted"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{facility.name}</p>
                            <p className="text-xs text-muted-foreground">{facility.zone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        SAR {facility.pendingPayout.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{facility.lastPayout}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        ****{facility.bankAccount}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-foreground"
                          disabled={facility.pendingPayout === 0}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="driver-payouts" className="space-y-4 mt-4">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Driver</TableHead>
                    <TableHead className="text-muted-foreground">Pending Earnings</TableHead>
                    <TableHead className="text-muted-foreground">Total Deliveries</TableHead>
                    <TableHead className="text-muted-foreground">Bank Account</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDrivers.map((driver) => (
                    <TableRow
                      key={driver.id}
                      className="border-border hover:bg-muted"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{driver.name}</p>
                            <p className="text-xs text-muted-foreground">{driver.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        SAR {driver.pendingEarnings.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{driver.totalDeliveries}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        ****{driver.bankAccount}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-foreground"
                          disabled={driver.pendingEarnings === 0}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
