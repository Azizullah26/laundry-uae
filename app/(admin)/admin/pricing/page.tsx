"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DollarSign,
  Percent,
  Plus,
  Edit,
  Save,
  Trash2,
  Clock,
  MapPin,
  Shirt,
  Settings,
  TrendingUp,
  Calculator,
} from "lucide-react";

const serviceCategories = [
  {
    id: "wash_fold",
    name: "Wash & Fold",
    basePrice: 15,
    unit: "kg",
    isActive: true,
  },
  {
    id: "dry_clean",
    name: "Dry Cleaning",
    basePrice: 25,
    unit: "item",
    isActive: true,
  },
  {
    id: "iron_only",
    name: "Iron Only",
    basePrice: 5,
    unit: "item",
    isActive: true,
  },
  {
    id: "premium",
    name: "Premium Care",
    basePrice: 45,
    unit: "item",
    isActive: true,
  },
  {
    id: "express",
    name: "Express Service",
    basePrice: 0,
    unit: "surcharge",
    isActive: true,
  },
];

const itemPricing = [
  { item: "Shirt", washFold: 3, dryCleen: 8, ironOnly: 2 },
  { item: "Pants/Trousers", washFold: 4, dryCleen: 10, ironOnly: 3 },
  { item: "Dress", washFold: 5, dryCleen: 15, ironOnly: 4 },
  { item: "Suit (2pc)", washFold: "-", dryCleen: 35, ironOnly: 8 },
  { item: "Jacket/Blazer", washFold: "-", dryCleen: 20, ironOnly: 5 },
  { item: "Bedsheet (Single)", washFold: 8, dryCleen: 15, ironOnly: 5 },
  { item: "Bedsheet (Double)", washFold: 12, dryCleen: 20, ironOnly: 7 },
  { item: "Curtains (per m)", washFold: 10, dryCleen: 18, ironOnly: 6 },
];

const surcharges = [
  { name: "Express (Same Day)", type: "percentage", value: 50, isActive: true },
  { name: "Weekend Pickup", type: "fixed", value: 10, isActive: true },
  { name: "Peak Hours (6-9 PM)", type: "percentage", value: 15, isActive: false },
  { name: "Stain Removal", type: "fixed", value: 20, isActive: true },
  { name: "Fragile Items", type: "percentage", value: 25, isActive: true },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("services");
  const [selectedMarket, setSelectedMarket] = useState("dubai");
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing Configuration</h1>
          <p className="text-muted-foreground">Manage service prices, surcharges, and commissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[180px] bg-background">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Market" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="dubai">Dubai</SelectItem>
              <SelectItem value="abu_dhabi">Abu Dhabi</SelectItem>
              <SelectItem value="riyadh">Riyadh</SelectItem>
              <SelectItem value="sharjah">Sharjah</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className={
              editMode
                ? "bg-gradient-to-r from-red-500 to-orange-500 text-foreground"
                : "text-muted-foreground"
            }
          >
            {editMode ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Prices
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold text-foreground">SAR 85</p>
              </div>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platform Commission</p>
                <p className="text-2xl font-bold text-blue-400">18%</p>
              </div>
              <Percent className="w-5 h-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Driver Share</p>
                <p className="text-2xl font-bold text-amber-400">SAR 15</p>
              </div>
              <Calculator className="w-5 h-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Price Index</p>
                <p className="text-2xl font-bold text-green-400">+5.2%</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger
            value="services"
            className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
          >
            Service Categories
          </TabsTrigger>
          <TabsTrigger
            value="items"
            className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
          >
            Item Pricing
          </TabsTrigger>
          <TabsTrigger
            value="surcharges"
            className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
          >
            Surcharges
          </TabsTrigger>
          <TabsTrigger
            value="commissions"
            className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
          >
            Commissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4 mt-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">Service Categories</CardTitle>
                <Button size="sm" className="bg-secondary text-secondary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Service</TableHead>
                    <TableHead className="text-muted-foreground">Base Price</TableHead>
                    <TableHead className="text-muted-foreground">Unit</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceCategories.map((service) => (
                    <TableRow key={service.id} className="border-border hover:bg-muted">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                            <Shirt className="w-5 h-5 text-red-400" />
                          </div>
                          <span className="font-medium text-foreground">{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {editMode ? (
                          <Input
                            type="number"
                            defaultValue={service.basePrice}
                            className="w-24 bg-background"
                          />
                        ) : (
                          <span className="text-foreground font-medium">
                            {service.basePrice > 0 ? `SAR ${service.basePrice}` : "-"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">per {service.unit}</TableCell>
                      <TableCell>
                        {editMode ? (
                          <Switch checked={service.isActive} />
                        ) : (
                          <Badge
                            variant="outline"
                            className={
                              service.isActive
                                ? "border-green-500/30 text-green-400"
                                : "border-gray-500/30 text-muted-foreground"
                            }
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4 mt-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">Item-Based Pricing</CardTitle>
                <Button size="sm" className="bg-secondary text-secondary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Item</TableHead>
                    <TableHead className="text-muted-foreground">Wash & Fold</TableHead>
                    <TableHead className="text-muted-foreground">Dry Clean</TableHead>
                    <TableHead className="text-muted-foreground">Iron Only</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemPricing.map((item, index) => (
                    <TableRow key={index} className="border-border hover:bg-muted">
                      <TableCell className="font-medium text-foreground">{item.item}</TableCell>
                      <TableCell>
                        {editMode && item.washFold !== "-" ? (
                          <Input
                            type="number"
                            defaultValue={item.washFold}
                            className="w-20 bg-background"
                          />
                        ) : (
                          <span className="text-muted-foreground">
                            {item.washFold !== "-" ? `SAR ${item.washFold}` : "-"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editMode ? (
                          <Input
                            type="number"
                            defaultValue={item.dryCleen}
                            className="w-20 bg-background"
                          />
                        ) : (
                          <span className="text-muted-foreground">SAR {item.dryCleen}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editMode ? (
                          <Input
                            type="number"
                            defaultValue={item.ironOnly}
                            className="w-20 bg-background"
                          />
                        ) : (
                          <span className="text-muted-foreground">SAR {item.ironOnly}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surcharges" className="space-y-4 mt-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">Surcharges & Extras</CardTitle>
                <Button size="sm" className="bg-secondary text-secondary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Surcharge
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {surcharges.map((surcharge, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                      {surcharge.type === "percentage" ? (
                        <Percent className="w-5 h-5 text-amber-400" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{surcharge.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {surcharge.type === "percentage"
                          ? `+${surcharge.value}% on base price`
                          : `Fixed SAR ${surcharge.value}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {editMode ? (
                      <Input
                        type="number"
                        defaultValue={surcharge.value}
                        className="w-20 bg-background"
                      />
                    ) : (
                      <span className="text-foreground font-medium">
                        {surcharge.type === "percentage"
                          ? `${surcharge.value}%`
                          : `SAR ${surcharge.value}`}
                      </span>
                    )}
                    <Switch checked={surcharge.isActive} disabled={!editMode} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Platform Commission</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Revenue share from each order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Commission Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue={18}
                      disabled={!editMode}
                      className="bg-background"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Minimum Commission</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue={5}
                      disabled={!editMode}
                      className="bg-background"
                    />
                    <span className="text-muted-foreground">SAR</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Driver Compensation</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Delivery fee structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Base Delivery Fee</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue={15}
                      disabled={!editMode}
                      className="bg-background"
                    />
                    <span className="text-muted-foreground">SAR</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Per KM Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue={2}
                      disabled={!editMode}
                      className="bg-background"
                    />
                    <span className="text-muted-foreground">SAR/km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
