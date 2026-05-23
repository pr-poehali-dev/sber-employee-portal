import { useState } from "react";
import Icon from "@/components/ui/icon";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "home", label: "Главная", icon: "LayoutDashboard" },
  { id: "tickets", label: "Талоны", icon: "Ticket" },
  { id: "queue", label: "Табло очереди", icon: "Monitor" },
  { id: "operator", label: "Рабочее место", icon: "UserCog" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          background: "hsl(var(--sidebar-background))",
          borderRight: "1px solid hsl(var(--sidebar-border))",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border/40">
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              background: "hsl(var(--sber-green))",
            }}
          >
            <span className="text-white font-bold text-sm">С</span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <div className="text-white font-semibold text-sm leading-tight">СберПортал</div>
              <div className="text-sidebar-foreground/50 text-xs">Личный кабинет</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left group"
              style={{
                background:
                  currentPage === item.id
                    ? "hsl(var(--sidebar-accent))"
                    : "transparent",
                color:
                  currentPage === item.id
                    ? "hsl(var(--sidebar-primary))"
                    : "hsl(var(--sidebar-foreground))",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.id) {
                  (e.currentTarget as HTMLElement).style.background =
                    "hsl(var(--sidebar-accent))";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.id) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
            >
              <Icon
                name={item.icon}
                size={18}
                style={{
                  color:
                    currentPage === item.id
                      ? "hsl(var(--sidebar-primary))"
                      : "hsl(var(--sidebar-foreground))",
                  flexShrink: 0,
                }}
              />
              {!collapsed && (
                <span className="text-sm font-medium animate-fade-in">{item.label}</span>
              )}
              {!collapsed && currentPage === item.id && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "hsl(var(--sidebar-primary))" }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div
          className="p-3 border-t"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0 text-white font-semibold text-sm"
              style={{
                width: 36,
                height: 36,
                background: "hsl(145 45% 42%)",
              }}
            >
              АИ
            </div>
            {!collapsed && (
              <div className="animate-fade-in overflow-hidden">
                <div className="text-white text-sm font-medium truncate">Алексей Иванов</div>
                <div className="text-sidebar-foreground/50 text-xs truncate">Менеджер отдела</div>
              </div>
            )}
          </div>
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-10 border-t transition-colors"
          style={{
            borderColor: "hsl(var(--sidebar-border))",
            color: "hsl(var(--sidebar-foreground))",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "hsl(var(--sidebar-accent))")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
        >
          <Icon name={collapsed ? "ChevronsRight" : "ChevronsLeft"} size={16} />
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-6 h-16 flex-shrink-0"
          style={{
            background: "hsl(var(--card))",
            borderBottom: "1px solid hsl(var(--border))",
          }}
        >
          <div>
            <h1 className="text-foreground font-semibold text-base">
              {navItems.find((n) => n.id === currentPage)?.label}
            </h1>
            <p className="text-muted-foreground text-xs">
              {new Date().toLocaleDateString("ru-RU", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: "hsl(var(--muted-foreground))" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "hsl(var(--muted))")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <Icon name="Bell" size={18} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "hsl(var(--sber-green))" }}
              />
            </button>
            <div
              className="w-px h-6"
              style={{ background: "hsl(var(--border))" }}
            />
            <div
              className="flex items-center justify-center rounded-full text-white font-semibold text-xs"
              style={{
                width: 32,
                height: 32,
                background: "hsl(var(--sber-green))",
              }}
            >
              АИ
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}