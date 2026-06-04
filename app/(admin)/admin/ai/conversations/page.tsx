"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/shared/search-input";
import { mockConversations } from "@/lib/mock-data";
import {
  MessageSquare,
  Bot,
  User,
  Search,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react";

export default function AIConversationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch =
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeConversations = mockConversations.filter((c) => c.status === "active").length;
  const resolvedConversations = mockConversations.filter((c) => c.status === "resolved").length;
  const escalatedConversations = mockConversations.filter((c) => c.status === "escalated").length;

  return (
    <div className="p-6 h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Conversations</h1>
            <p className="text-muted-foreground">Monitor and manage AI-powered customer interactions</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
              <Bot className="w-3 h-3 mr-1" />
              AI Active
            </Badge>
            <Button variant="outline" size="sm" className="text-muted-foreground">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-border">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-400">{activeConversations}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-blue-400">{resolvedConversations}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Escalated</p>
                  <p className="text-2xl font-bold text-amber-400">{escalatedConversations}</p>
                </div>
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Conversation List */}
          <Card className="border-border flex flex-col">
            <CardHeader className="pb-3">
              <div className="space-y-3">
                <SearchInput
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">All Conversations</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedConversation?.id === conv.id
                          ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30"
                          : "bg-muted hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-foreground text-sm">
                            {conv.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground truncate">{conv.customerName}</p>
                            <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                conv.status === "active"
                                  ? "border-green-500/30 text-green-400"
                                  : conv.status === "resolved"
                                  ? "border-blue-500/30 text-blue-400"
                                  : "border-amber-500/30 text-amber-400"
                              }`}
                            >
                              {conv.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{conv.channel}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat View */}
          <Card className="lg:col-span-2 border-border flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-foreground">
                          {selectedConversation.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{selectedConversation.customerName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {selectedConversation.phone}
                          <span className="text-gray-600">|</span>
                          <span>{selectedConversation.channel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-muted-foreground">
                        <User className="w-4 h-4 mr-2" />
                        Take Over
                      </Button>
                      <Badge
                        variant="outline"
                        className={`${
                          selectedConversation.status === "active"
                            ? "border-green-500/30 text-green-400"
                            : selectedConversation.status === "resolved"
                            ? "border-blue-500/30 text-blue-400"
                            : "border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {selectedConversation.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {selectedConversation.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.sender === "customer" ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.sender === "customer"
                                ? "bg-muted text-foreground"
                                : message.sender === "ai"
                                ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-foreground border border-red-500/20"
                                : "bg-blue-500/20 text-foreground border border-blue-500/20"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {message.sender === "ai" && <Bot className="w-4 h-4 text-red-400" />}
                              {message.sender === "agent" && (
                                <User className="w-4 h-4 text-blue-400" />
                              )}
                              <span className="text-xs text-muted-foreground">{message.time}</span>
                            </div>
                            <p className="text-sm">{message.text}</p>
                            {message.sender === "ai" && (
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                                <button className="text-muted-foreground hover:text-green-400 transition-colors">
                                  <ThumbsUp className="w-4 h-4" />
                                </button>
                                <button className="text-muted-foreground hover:text-red-400 transition-colors">
                                  <ThumbsDown className="w-4 h-4" />
                                </button>
                                <span className="text-xs text-muted-foreground ml-2">
                                  Confidence: {message.confidence || "95%"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="Type a message (as agent)..."
                      className="flex-1 bg-background"
                    />
                    <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-foreground">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
