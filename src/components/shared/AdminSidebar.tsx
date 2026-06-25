"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Map, ClipboardList, Users, MessageSquare, Shield, MapPin, CreditCard, FileText, UserCheck, Globe, AlertTriangle, Radio, FileBarChart, History, Layers, Bell, Settings, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import logo from "@/assets/logo/logo.png"
import Image from 'next/image'


interface AdminSidebarProps {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
    mobileOpen: boolean
    setMobileOpen: (open: boolean) => void
}

const AdminSidebar = ({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen
}: AdminSidebarProps) => {
    const pathname = usePathname()

    const sections = [
        {
            title: 'OVERVIEW',
            items: [
                { name: 'Dashboard', href: '/', icon: LayoutDashboard }
            ]
        },
        {
            title: 'LAND',
            items: [
                { name: 'Parcels', href: '/parcels', icon: Map },
                { name: 'Registrations', href: '/registrations', icon: ClipboardList }
            ]
        },
        {
            title: 'PEOPLE',
            items: [
                { name: 'Users', href: '/users', icon: Users },
                { name: 'Consultations', href: '/consultations', icon: MessageSquare }
            ]
        },
        {
            title: 'OPERATIONS',
            items: [
                { name: 'Investigations', href: '/investigations', icon: Shield },
                { name: 'Site Visits', href: '/site-visits', icon: MapPin },
                { name: 'Payments', href: '/payments', icon: CreditCard },
                { name: 'Documents', href: '/documents', icon: FileText },
                { name: 'Surveyor Assignment', href: '/surveyor-assignment', icon: UserCheck }
            ]
        },
        {
            title: 'GIS',
            items: [
                { name: 'GIS / Map', href: '/gis-map', icon: Globe },
                { name: 'Conflicts', href: '/conflicts', icon: AlertTriangle, badge: '3' },
                { name: 'QField Submissions', href: '/qfield-submissions', icon: Radio }
            ]
        },
        {
            title: 'ANALYTICS',
            items: [
                { name: 'Reports', href: '/reports', icon: FileBarChart },
                { name: 'Audit Logs', href: '/audit-logs', icon: History },
                { name: 'Reliability Score', href: '/reliability-score', icon: Shield },
            ]
        },
        {
            title: 'SYSTEM',
            items: [
                { name: 'Subscription', href: '/subscription', icon: Layers },
                { name: 'Notifications', href: '/notifications', icon: Bell, badge: '7' },
                { name: 'Settings', href: '/settings', icon: Settings }
            ]
        }
    ]

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#1A2332] text-subtitle">
            {/* Brand Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                <Link href="/" className="flex items-center gap-3 select-none">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-button-color text-white shrink-0 font-bold text-lg">
                        <Image src={logo} alt="LandSecure Logo" width={40} height={40} />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-white tracking-wide text-sm">LandSecure</span>
                            <span className="text-xs text-subtitle mt-0.5">Cameroon Admin</span>
                        </div>
                    )}
                </Link>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="md:hidden text-subtitle hover:text-white p-1"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-none">
                {sections.map((section, idx) => (
                    <div key={section.title} className={cn("px-3 mb-6", collapsed && "px-2 mb-4")}>
                        {/* Section Heading */}
                        {!collapsed ? (
                            <h2 className="px-3 mb-2 text-[10px] font-bold text-slate-500 tracking-wider">
                                {section.title}
                            </h2>
                        ) : (
                            <div className="h-px bg-slate-800/60 my-2 mx-1" />
                        )}

                        {/* Menu Items */}
                        <div className="space-y-0.5 ">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all relative group font-medium",
                                            isActive
                                                ? "bg-[#1e3a8a]/60 text-white font-semibold shadow-inner"
                                                : "text-subtitle hover:text-white hover:bg-slate-800/40",
                                            collapsed && "justify-center px-0 py-2.5"
                                        )}
                                    >
                                        <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-button-color" : "text-subtitle group-hover:text-white")} />
                                        {!collapsed && (
                                            <span className="truncate flex-1">{item.name}</span>
                                        )}

                                        {/* Badge */}
                                        {item.badge && (
                                            <span
                                                className={cn(
                                                    "flex items-center justify-center text-[10px] font-bold bg-[#EF4444] text-white rounded-full min-w-[16px] h-4 px-1 shrink-0",
                                                    collapsed ? "absolute -top-1.5 -right-1.5 border border-[#111827]" : ""
                                                )}
                                            >
                                                {item.badge}
                                            </span>
                                        )}

                                        {/* Tooltip on collapse */}
                                        {collapsed && (
                                            <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-md">
                                                {item.name}
                                            </div>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Profile Section */}
            <div className="p-3 border-t border-slate-800 bg-[#0b0f19] flex flex-col items-center">
                {!collapsed && (
                    <div className="flex items-center gap-3 w-full px-2 py-1.5 mb-2.5">
                        {/* Avatar */}
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-button-color text-white font-bold text-xs shrink-0 select-none border border-slate-700 shadow-sm">
                            JA
                        </div>
                        <div className="flex flex-col min-w-0 leading-tight">
                            <span className="font-semibold text-white text-xs truncate">Jean Alima</span>
                            <span className="text-[10px] text-subtitle truncate mt-0.5">Super Admin</span>
                        </div>
                    </div>
                )}

                {/* Collapse Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "flex items-center justify-center p-1.5 rounded-full hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-slate-500",
                        collapsed ? "w-8 h-8" : "w-full text-center hover:bg-slate-800/80"
                    )}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4.5 h-4.5" />
                    ) : (
                        <div className="flex items-center gap-2 text-xs font-semibold">
                            <ChevronLeft className="w-4 h-4" />
                            <span>Collapse Menu</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden md:block h-screen sticky top-0 border-r border-slate-800 shrink-0 transition-all duration-300 z-20",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay Drawer */}
            <div
                className={cn(
                    "fixed inset-0 bg-slate-900/60 z-40 transition-opacity duration-300 md:hidden",
                    mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setMobileOpen(false)}
            >
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-[#111827] shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden",
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SidebarContent />
                </aside>
            </div>
        </>
    )
}

export default AdminSidebar