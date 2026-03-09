import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Palette, Box, FileText, Eye, Layers, Zap, Users, ShieldCheck,
  ShoppingBag, Package, Sparkles, Brain, SwatchBook, BarChart3,
  Shield, ExternalLink, History, Settings, Menu, Type, Ruler,
  Cast, Grid3X3, ChevronDown,
} from "lucide-react";

interface NavItem {
  value: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Foundation",
    items: [
      { value: "overview", label: "Overview", icon: Palette },
      { value: "colors", label: "Colors", icon: Palette },
      { value: "typography", label: "Typography", icon: Type },
      { value: "spacing", label: "Spacing & Radius", icon: Ruler },
      { value: "shadows", label: "Shadows", icon: Cast },
      { value: "grid", label: "Layout Grid", icon: Grid3X3 },
    ],
  },
  {
    label: "Tools",
    items: [
      { value: "tokens", label: "Tokens", icon: Box },
      { value: "preview", label: "Preview", icon: Eye },
      { value: "components", label: "Components", icon: Layers },
      { value: "motion", label: "Motion", icon: Zap },
      { value: "docs", label: "Docs", icon: FileText },
    ],
  },
  {
    label: "Collaborate",
    items: [
      { value: "team", label: "Team", icon: Users },
      { value: "governance", label: "Governance", icon: ShieldCheck },
      { value: "marketplace", label: "Store", icon: ShoppingBag },
      { value: "assets", label: "Assets", icon: Package },
    ],
  },
  {
    label: "AI & Insights",
    items: [
      { value: "vision", label: "Vision", icon: Sparkles },
      { value: "insights", label: "Insights", icon: Brain },
      { value: "themes", label: "Themes", icon: SwatchBook },
      { value: "analytics", label: "Analytics", icon: BarChart3 },
      { value: "accessibility", label: "Accessibility", icon: Shield },
    ],
  },
  {
    label: "Integrations",
    items: [
      { value: "figma", label: "Figma", icon: ExternalLink },
      { value: "saved", label: "Saved", icon: History },
      { value: "settings", label: "Settings", icon: Settings },
    ],
  },
];

interface DesignSystemSidebarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

function SidebarNav({ activeTab, onTabChange, onItemClick }: DesignSystemSidebarProps & { onItemClick?: () => void }) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <nav className="flex flex-col gap-1 py-2">
      {navGroups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.label);
        return (
          <div key={group.label} className="px-3">
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex items-center justify-between w-full px-2 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {group.label}
              <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isCollapsed && "-rotate-90")} />
            </button>
            {!isCollapsed && (
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.value;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.value}
                      onClick={() => {
                        onTabChange(item.value);
                        onItemClick?.();
                      }}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        "hover:bg-muted/50 hover:text-foreground",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground/70")} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function DesignSystemSidebar({ activeTab, onTabChange }: DesignSystemSidebarProps) {
  return (
    <aside className="hidden md:flex w-[240px] shrink-0 border-r border-border/40 bg-card/30 backdrop-blur-sm">
      <ScrollArea className="h-[calc(100vh-73px)] w-full sticky top-[73px]">
        <SidebarNav activeTab={activeTab} onTabChange={onTabChange} />
      </ScrollArea>
    </aside>
  );
}

export function DesignSystemSidebarMobile({ activeTab, onTabChange }: DesignSystemSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-full" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] p-0 bg-card/95 backdrop-blur-xl">
        <div className="px-4 py-4 border-b border-border/40">
          <p className="text-sm font-semibold text-foreground">Navigation</p>
        </div>
        <ScrollArea className="h-[calc(100vh-65px)]">
          <SidebarNav activeTab={activeTab} onTabChange={onTabChange} onItemClick={() => setOpen(false)} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
