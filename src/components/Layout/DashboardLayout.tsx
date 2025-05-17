
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Store, 
  Boxes, 
  ClipboardList, 
  TicketCheck, 
  LogOut,
  UserCircle
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";

type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const SidebarLink = ({ to, icon, label }: SidebarLinkProps) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
  >
    <span className="text-slate-600">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based navigation links
  const getNavLinks = () => {
    switch (user?.role) {
      case UserRole.APPLICATION_ADMIN:
        return (
          <>
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarLink to="/users" icon={<Users size={20} />} label="Users" />
            <SidebarLink to="/companies" icon={<Building2 size={20} />} label="Companies" />
            <SidebarLink to="/dealers" icon={<Store size={20} />} label="Dealers" />
            <SidebarLink to="/machines" icon={<Boxes size={20} />} label="Machines" />
            <SidebarLink to="/tasks" icon={<ClipboardList size={20} />} label="Tasks" />
            <SidebarLink to="/tickets" icon={<TicketCheck size={20} />} label="Tickets" />
          </>
        );
      
      case UserRole.COMPANY_ADMIN:
        return (
          <>
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarLink to="/users" icon={<Users size={20} />} label="Employees" />
            <SidebarLink to="/dealers" icon={<Store size={20} />} label="Dealers" />
            <SidebarLink to="/machines" icon={<Boxes size={20} />} label="Machines" />
            <SidebarLink to="/tasks" icon={<ClipboardList size={20} />} label="Tasks" />
            <SidebarLink to="/tickets" icon={<TicketCheck size={20} />} label="Tickets" />
          </>
        );
        
      case UserRole.COMPANY_EMPLOYEE:
        return (
          <>
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarLink to="/machines" icon={<Boxes size={20} />} label="Machines" />
            <SidebarLink to="/tasks" icon={<ClipboardList size={20} />} label="Tasks" />
            <SidebarLink to="/tickets" icon={<TicketCheck size={20} />} label="Tickets" />
          </>
        );
        
      case UserRole.DEALER_ADMIN:
        return (
          <>
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarLink to="/users" icon={<Users size={20} />} label="Employees" />
            <SidebarLink to="/machines" icon={<Boxes size={20} />} label="Machines" />
            <SidebarLink to="/tasks" icon={<ClipboardList size={20} />} label="Tasks" />
            <SidebarLink to="/tickets" icon={<TicketCheck size={20} />} label="Tickets" />
          </>
        );
        
      case UserRole.DEALER_EMPLOYEE:
        return (
          <>
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarLink to="/machines" icon={<Boxes size={20} />} label="Machines" />
            <SidebarLink to="/tasks" icon={<ClipboardList size={20} />} label="Tasks" />
            <SidebarLink to="/tickets" icon={<TicketCheck size={20} />} label="Tickets" />
          </>
        );
        
      default:
        return null;
    }
  };

  // Role-based styling
  const getRoleColor = () => {
    switch (user?.role) {
      case UserRole.APPLICATION_ADMIN:
        return 'bg-admin-DEFAULT';
      case UserRole.COMPANY_ADMIN:
      case UserRole.COMPANY_EMPLOYEE:
        return 'bg-company-DEFAULT';
      case UserRole.DEALER_ADMIN:
      case UserRole.DEALER_EMPLOYEE:
        return 'bg-dealer-DEFAULT';
      default:
        return 'bg-primary';
    }
  };

  // Get role display name
  const getRoleName = () => {
    switch (user?.role) {
      case UserRole.APPLICATION_ADMIN:
        return 'System Admin';
      case UserRole.COMPANY_ADMIN:
        return 'Company Admin';
      case UserRole.COMPANY_EMPLOYEE:
        return 'Company Employee';
      case UserRole.DEALER_ADMIN:
        return 'Dealer Admin';
      case UserRole.DEALER_EMPLOYEE:
        return 'Dealer Employee';
      default:
        return 'User';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="h-full flex flex-col">
          {/* Logo & App Name */}
          <div className={`${getRoleColor()} text-white p-4`}>
            <h1 className="text-xl font-bold">RBAC System</h1>
            <p className="text-sm opacity-90">Machine Management</p>
          </div>
          
          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-slate-200">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{getRoleName()}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {getNavLinks()}
          </nav>
          
          {/* Logout */}
          <div className="p-4 mt-auto border-t">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Dashboard
            </h2>
            <div className="flex items-center gap-2">
              <UserCircle size={20} className="text-slate-500" />
              <span className="text-slate-600">{user?.name}</span>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
