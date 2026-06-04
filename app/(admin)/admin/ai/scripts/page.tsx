"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Bot,
  Save,
  Play,
  Plus,
  Trash2,
  Copy,
  MessageSquare,
  Settings,
  Globe,
  Zap,
  Clock,
  CheckCircle,
  Edit,
  ChevronRight,
} from "lucide-react";

const scriptCategories = [
  { id: "greeting", name: "Greeting & Welcome", count: 5 },
  { id: "order_status", name: "Order Status", count: 8 },
  { id: "pricing", name: "Pricing & Services", count: 6 },
  { id: "complaints", name: "Complaints", count: 4 },
  { id: "scheduling", name: "Scheduling", count: 7 },
  { id: "payment", name: "Payment", count: 5 },
];

const mockScripts = [
  {
    id: 1,
    name: "Welcome Message - New Customer",
    category: "greeting",
    language: "en",
    content:
      "Welcome to LaundryKhalas! I'm your AI assistant. How can I help you today? I can assist with:\n- Placing a new order\n- Tracking an existing order\n- Pricing information\n- Service inquiries",
    isActive: true,
    lastModified: "2024-01-15",
  },
  {
    id: 2,
    name: "Order Status Check",
    category: "order_status",
    language: "en",
    content:
      "I'd be happy to check your order status! Please provide your order ID or the phone number associated with your account.",
    isActive: true,
    lastModified: "2024-01-14",
  },
  {
    id: 3,
    name: "Pricing Information",
    category: "pricing",
    language: "en",
    content:
      "Our pricing is based on the type of garment and service selected. Basic wash & fold starts at SAR 15 per kg. Would you like me to share our complete price list?",
    isActive: true,
    lastModified: "2024-01-13",
  },
];

export default function AIScriptsPage() {
  const [selectedCategory, setSelectedCategory] = useState("greeting");
  const [selectedScript, setSelectedScript] = useState(mockScripts[0]);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(selectedScript.content);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Scripts & Responses</h1>
          <p className="text-muted-foreground">Manage automated conversation scripts and AI responses</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="text-muted-foreground">
            <Play className="w-4 h-4 mr-2" />
            Test Script
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Script
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scripts</p>
                <p className="text-2xl font-bold text-foreground">35</p>
              </div>
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-400">28</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Languages</p>
                <p className="text-2xl font-bold text-blue-400">3</p>
              </div>
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-amber-400">0.8s</p>
              </div>
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scriptCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors flex items-center justify-between ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30"
                    : "bg-muted hover:bg-muted"
                }`}
              >
                <span className="text-foreground">{category.name}</span>
                <Badge variant="outline" className="border-gray-600 text-muted-foreground">
                  {category.count}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Scripts List & Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Scripts List */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">
                  {scriptCategories.find((c) => c.id === selectedCategory)?.name} Scripts
                </CardTitle>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[120px] bg-background">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockScripts
                .filter((s) => s.category === selectedCategory)
                .map((script) => (
                  <button
                    key={script.id}
                    onClick={() => {
                      setSelectedScript(script);
                      setEditedContent(script.content);
                      setEditMode(false);
                    }}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      selectedScript?.id === script.id
                        ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30"
                        : "bg-muted hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bot className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="font-medium text-foreground">{script.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Last modified: {script.lastModified}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            script.isActive
                              ? "border-green-500/30 text-green-400"
                              : "border-gray-500/30 text-muted-foreground"
                          }
                        >
                          {script.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </button>
                ))}
            </CardContent>
          </Card>

          {/* Script Editor */}
          {selectedScript && (
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-foreground">{selectedScript.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Edit script content and settings
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => setEditMode(!editMode)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {editMode ? "Cancel" : "Edit"}
                    </Button>
                    {editMode && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-foreground"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Script Content</Label>
                  <Textarea
                    value={editMode ? editedContent : selectedScript.content}
                    onChange={(e) => setEditedContent(e.target.value)}
                    readOnly={!editMode}
                    className={`min-h-[200px] bg-background ${
                      !editMode ? "opacity-75" : ""
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Language</Label>
                    <Select defaultValue={selectedScript.language} disabled={!editMode}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Category</Label>
                    <Select defaultValue={selectedScript.category} disabled={!editMode}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {scriptCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <Label className="text-muted-foreground">Active Status</Label>
                    <Switch checked={selectedScript.isActive} disabled={!editMode} />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="text-muted-foreground">
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className="text-muted-foreground">
                    <Play className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
