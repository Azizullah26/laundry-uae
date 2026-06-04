"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Code, User, Building2, Shield, ChevronDown, ExternalLink } from "lucide-react";

type Portal = "customer" | "facility" | "admin";

const portalConfig = {
  customer: {
    name: "Customer Portal",
    icon: User,
    color: "from-cyan-500 to-blue-500",
    routes: [
      { path: "/", label: "Home" },
      { path: "/auth/login", label: "Login" },
      { path: "/order/new", label: "New Order" },
      { path: "/orders", label: "My Orders" },
      { path: "/profile", label: "Profile" },
    ],
  },
  facility: {
    name: "Facility Portal",
    icon: Building2,
    color: "from-emerald-500 to-teal-500",
    routes: [
      { path: "/facility/dashboard", label: "Dashboard" },
      { path: "/facility/orders", label: "Orders" },
      { path: "/facility/performance", label: "Performance" },
      { path: "/facility/earnings", label: "Earnings" },
      { path: "/facility/drivers", label: "Drivers" },
      { path: "/facility/settings", label: "Settings" },
    ],
  },
  admin: {
    name: "Admin Portal",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    routes: [
      { path: "/admin/dashboard", label: "Dashboard" },
      { path: "/admin/orders", label: "Orders" },
      { path: "/admin/facilities", label: "Facilities" },
      { path: "/admin/drivers", label: "Drivers" },
      { path: "/admin/payments", label: "Payments" },
      { path: "/admin/ai/conversations", label: "AI Conversations" },
      { path: "/admin/ai/scripts", label: "AI Scripts" },
      { path: "/admin/markets", label: "Markets" },
      { path: "/admin/pricing", label: "Pricing" },
      { path: "/admin/analytics", label: "Analytics" },
    ],
  },
};

export function DevPortalSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // Determine current portal based on pathname
  const getCurrentPortal = (): Portal => {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/facility")) return "facility";
    return "customer";
  };

  const currentPortal = getCurrentPortal();
  const config = portalConfig[currentPortal];
  const Icon = config.icon;

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "d" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setIsVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2">
      {/* Quick Portal Links */}
      <div className="flex items-center gap-1 bg-[#111111] border border-[#333333] rounded-lg p-1">
        {(Object.keys(portalConfig) as Portal[]).map((portal) => {
          const portalConf = portalConfig[portal];
          const PortalIcon = portalConf.icon;
          const isActive = currentPortal === portal;
          const mainRoute = portalConf.routes[0].path;

          return (
            <Button
              key={portal}
              variant="ghost"
              size="sm"
              onClick={() => router.push(mainRoute)}
              className={`relative ${
                isActive
                  ? `bg-gradient-to-r ${portalConf.color} text-white`
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              <PortalIcon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>

      {/* Portal Switcher Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`bg-gradient-to-r ${config.color} border-none text-white hover:opacity-90`}
          >
            <Code className="w-4 h-4 mr-2" />
            <Icon className="w-4 h-4 mr-2" />
            {config.name}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64 bg-[#111111] border-[#333333]"
        >
          <DropdownMenuLabel className="text-gray-400 text-xs">
            DEV MODE - Portal Navigation
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#333333]" />

          {(Object.keys(portalConfig) as Portal[]).map((portal) => {
            const portalConf = portalConfig[portal];
            const PortalIcon = portalConf.icon;
            const isActive = currentPortal === portal;

            return (
              <div key={portal}>
                <DropdownMenuLabel className="flex items-center gap-2 text-white">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center bg-gradient-to-r ${portalConf.color}`}
                  >
                    <PortalIcon className="w-3 h-3 text-white" />
                  </div>
                  {portalConf.name}
                  {isActive && (
                    <Badge variant="outline" className="ml-auto text-xs border-green-500/30 text-green-400">
                      Active
                    </Badge>
                  )}
                </DropdownMenuLabel>
                {portalConf.routes.map((route) => (
                  <DropdownMenuItem
                    key={route.path}
                    onClick={() => router.push(route.path)}
                    className={`text-gray-300 focus:text-white focus:bg-[#1a1a1a] pl-8 ${
                      pathname === route.path ? "bg-[#1a1a1a] text-white" : ""
                    }`}
                  >
                    {route.label}
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-[#333333]" />
              </div>
            );
          })}

          <div className="px-2 py-1.5">
            <p className="text-xs text-gray-500 text-center">
              Press <kbd className="px-1 py-0.5 bg-[#1a1a1a] rounded text-gray-400">Cmd+Shift+D</kbd> to toggle
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
