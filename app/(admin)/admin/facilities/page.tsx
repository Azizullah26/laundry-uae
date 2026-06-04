"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SearchInput } from "@/components/shared/search-input";
import { mockFacilities } from "@/lib/mock-data";
import {
  MoreVertical,
  Eye,
  Building2,
  Star,
  ShoppingBag,
  Clock,
  Plus,
  Download,
  MapPin,
  Phone,
  Settings,
  Pause,
  Play,
  Upload,
  X,
  Loader2,
  User,
  Lock,
  Mail,
  Globe,
  CheckCircle,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

interface NewFacility {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  service_radius_km: string;
  commission_rate: string;
  logo_url: string;
}

export default function AdminFacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ username: string; password: string } | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newFacility, setNewFacility] = useState<NewFacility>({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    service_radius_km: "10",
    commission_rate: "15",
    logo_url: "",
  });

  const filteredFacilities = mockFacilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || facility.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeFacilities = mockFacilities.filter((f) => f.status === "active").length;
  const pendingFacilities = mockFacilities.filter((f) => f.status === "pending").length;
  const suspendedFacilities = mockFacilities.filter((f) => f.status === "suspended").length;

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewFacility({ ...newFacility, password });
  };

  // Handle logo upload
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setLogoPreview(dataUrl);
        setNewFacility((prev) => ({ ...prev, logo_url: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewFacility({
            ...newFacility,
            latitude: position.coords.latitude.toFixed(8),
            longitude: position.coords.longitude.toFixed(8),
          });
          toast.success("Location captured!");
        },
        (error) => {
          toast.error("Failed to get location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  // Handle create facility
  const handleCreateFacility = async () => {
    if (!newFacility.name || !newFacility.username || !newFacility.password) {
      toast.error("Name, username, and password are required");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/admin/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newFacility,
          latitude: newFacility.latitude ? parseFloat(newFacility.latitude) : null,
          longitude: newFacility.longitude ? parseFloat(newFacility.longitude) : null,
          service_radius_km: parseFloat(newFacility.service_radius_km),
          commission_rate: parseFloat(newFacility.commission_rate),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create facility");
      }

      // Show credentials
      setCreatedCredentials({
        username: newFacility.username,
        password: newFacility.password,
      });

      toast.success("Facility created successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create facility");
    } finally {
      setIsCreating(false);
    }
  };

  // Reset modal
  const resetModal = () => {
    setNewFacility({
      name: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      latitude: "",
      longitude: "",
      service_radius_km: "10",
      commission_rate: "15",
      logo_url: "",
    });
    setLogoPreview(null);
    setCreatedCredentials(null);
    setIsCreateModalOpen(false);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Facility Management</h1>
          <p className="text-muted-foreground">Monitor and manage laundry partners</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-muted-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Facility
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-400">{activeFacilities}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-amber-400">{pendingFacilities}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-red-400">{suspendedFacilities}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Pause className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search by name, zone..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Facilities Table */}
      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Facility</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Zone</TableHead>
                <TableHead className="text-muted-foreground">Rating</TableHead>
                <TableHead className="text-muted-foreground">Orders</TableHead>
                <TableHead className="text-muted-foreground">Capacity</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFacilities.map((facility) => (
                <TableRow key={facility.id} className="border-border hover:bg-muted">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{facility.name}</p>
                        <p className="text-xs text-muted-foreground">{facility.ownerName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        facility.status === "active"
                          ? "border-green-500/30 text-green-400 bg-green-500/10"
                          : facility.status === "pending"
                          ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                          : "border-red-500/30 text-red-400 bg-red-500/10"
                      }
                    >
                      {facility.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {facility.zone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-foreground">{facility.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ShoppingBag className="w-4 h-4" />
                      {facility.totalOrders}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            facility.currentLoad > 80
                              ? "bg-red-500"
                              : facility.currentLoad > 50
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${facility.currentLoad}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{facility.currentLoad}%</span>
                    </div>
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
                        <DropdownMenuItem className="text-muted-foreground focus:text-foreground focus:bg-muted">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-muted-foreground focus:text-foreground focus:bg-muted">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Owner
                        </DropdownMenuItem>
                        {facility.status === "active" ? (
                          <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-muted">
                            <Pause className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-400 focus:text-green-300 focus:bg-muted">
                            <Play className="w-4 h-4 mr-2" />
                            Activate
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

      {/* Create Facility Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={resetModal}>
        <DialogContent className="max-w-2xl border-border text-foreground max-h-[90vh] overflow-y-auto">
          {createdCredentials ? (
            // Success view with credentials
            <>
              <DialogHeader>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <DialogTitle className="text-center text-xl">Facility Created Successfully!</DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                  Share these login credentials with the facility owner
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="text-lg font-mono text-foreground">{createdCredentials.username}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(createdCredentials.username)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Password</p>
                      <p className="text-lg font-mono text-foreground">{createdCredentials.password}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(createdCredentials.password)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-amber-400 text-center">
                  Make sure to save these credentials. The password cannot be recovered later.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={resetModal} className="w-full bg-gradient-to-r from-red-500 to-orange-500">
                  Done
                </Button>
              </DialogFooter>
            </>
          ) : (
            // Create form
            <>
              <DialogHeader>
                <DialogTitle>Add New Facility</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Create a new laundry facility and set up their login credentials
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Logo Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-[#444444] cursor-pointer flex items-center justify-center overflow-hidden bg-muted transition-colors"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                        <span className="text-xs text-muted-foreground">Upload Logo</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {logoPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLogoPreview(null);
                        setNewFacility({ ...newFacility, logo_url: "" });
                      }}
                      className="text-red-400"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Facility Name *</Label>
                    <Input
                      value={newFacility.name}
                      onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                      placeholder="Enter facility name"
                      className="mt-1.5 bg-background border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={newFacility.email}
                        onChange={(e) => setNewFacility({ ...newFacility, email: e.target.value })}
                        placeholder="email@example.com"
                        className="pl-10 bg-background border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={newFacility.phone}
                        onChange={(e) => setNewFacility({ ...newFacility, phone: e.target.value })}
                        placeholder="+971 50 123 4567"
                        className="pl-10 bg-background border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Login Credentials */}
                <div className="space-y-4 p-4 bg-muted rounded-lg border border-border">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Login Credentials
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Username *</Label>
                      <div className="relative mt-1.5">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={newFacility.username}
                          onChange={(e) =>
                            setNewFacility({ ...newFacility, username: e.target.value })
                          }
                          placeholder="facility_username"
                          className="pl-10 bg-background border-border"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Password *</Label>
                      <div className="flex gap-2 mt-1.5">
                        <div className="relative flex-1">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="text"
                            value={newFacility.password}
                            onChange={(e) =>
                              setNewFacility({ ...newFacility, password: e.target.value })
                            }
                            placeholder="Password"
                            className="pl-10 bg-background border-border"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generatePassword}
                          className="text-muted-foreground"
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location Details
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      className="text-muted-foreground"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Get Current Location
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Address</Label>
                      <Textarea
                        value={newFacility.address}
                        onChange={(e) => setNewFacility({ ...newFacility, address: e.target.value })}
                        placeholder="Full address"
                        className="mt-1.5 bg-background border-border min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground">City</Label>
                      <Input
                        value={newFacility.city}
                        onChange={(e) => setNewFacility({ ...newFacility, city: e.target.value })}
                        placeholder="Dubai"
                        className="mt-1.5 bg-background border-border"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Service Radius (km)</Label>
                      <Input
                        type="number"
                        value={newFacility.service_radius_km}
                        onChange={(e) =>
                          setNewFacility({ ...newFacility, service_radius_km: e.target.value })
                        }
                        placeholder="10"
                        className="mt-1.5 bg-background border-border"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Latitude</Label>
                      <Input
                        value={newFacility.latitude}
                        onChange={(e) => setNewFacility({ ...newFacility, latitude: e.target.value })}
                        placeholder="25.2048493"
                        className="mt-1.5 bg-background border-border"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Longitude</Label>
                      <Input
                        value={newFacility.longitude}
                        onChange={(e) =>
                          setNewFacility({ ...newFacility, longitude: e.target.value })
                        }
                        placeholder="55.2707828"
                        className="mt-1.5 bg-background border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Commission */}
                <div>
                  <Label className="text-muted-foreground">Commission Rate (%)</Label>
                  <Input
                    type="number"
                    value={newFacility.commission_rate}
                    onChange={(e) =>
                      setNewFacility({ ...newFacility, commission_rate: e.target.value })
                    }
                    placeholder="15"
                    className="mt-1.5 bg-background border-border w-32"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetModal} className="border-border">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateFacility}
                  disabled={isCreating}
                  className="bg-gradient-to-r from-red-500 to-orange-500"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Facility"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
