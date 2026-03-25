import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Wallet, 
  Bell, 
  Store,
  Coffee,
  Tags,
  Settings as SettingsIcon,
  ClipboardList,
  CreditCard,
  ListTree
} from 'lucide-react';
import './App.css';

import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Finance from './pages/Finance';
import Accounting from './pages/Accounting';
import BusinessReports from './pages/BusinessReports';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Channels from './pages/Channels';
import Accounts from './pages/Accounts';
import Orders from './pages/Orders';
import FinanceCategories from './pages/FinanceCategories';
import Settings from './pages/Settings';

import logoPoppy from './assets/logo_poppy.png';
import { TrendingUp, BarChart3, FileText } from 'lucide-react';

const SidebarMenu = ({ onNavItemClick }) => {
  const location = useLocation();
  const menuItems = [
    { type: 'header', name: 'SALE - Kinh Doanh' },
    { path: '/pos', name: 'Bán Hàng', icon: <ShoppingCart size={20} /> },
    { path: '/orders', name: 'Danh Sách Đơn', icon: <ClipboardList size={20} /> },
    { path: '/channels', name: 'Kênh Bán', icon: <Tags size={20} /> },
    
    { type: 'header', name: 'CEO - Vận Hành' },
    { path: '/', name: 'Tổng Quan', icon: <LayoutDashboard size={20} /> },
    { path: '/products', name: 'Thực Đơn', icon: <Coffee size={20} /> },
    { path: '/inventory', name: 'Kho & Vật Tư', icon: <Package size={20} /> },
    
    { type: 'header', name: 'CFO - Tài Chính' },
    { path: '/accounting', name: 'Sổ Quỹ (Giao Dịch)', icon: <Wallet size={20} /> },
    { path: '/finance-categories', name: 'Danh Mục Thu Chi', icon: <ListTree size={20} /> },
    { path: '/accounts', name: 'Tài Khoản & Ví', icon: <CreditCard size={20} /> },
    { path: '/finance', name: 'Tài Chính (Phân Tích)', icon: <TrendingUp size={20} /> },
    { path: '/reports', name: 'Báo Cáo (P&L)', icon: <FileText size={20} /> },
    
    { type: 'header', name: 'Hệ Thống' },
    { path: '/settings', name: 'Cài Đặt', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <nav className="sidebar-nav">
      {menuItems.map((item, index) => {
        if (item.type === 'header') {
          return (
            <div key={`header-${index}`} className="sidebar-section-title">
              {item.name}
            </div>
          );
        }
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={onNavItemClick}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

import { Menu, X } from 'lucide-react';

import { useData } from './context/DataContext';

function App() {
  const { state } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const theme = state.settings?.theme || 'dark';

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className={`app-container ${theme}-mode ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        {/* Overlay for mobile menu */}
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={logoPoppy} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <span className="brand-name">Xóm Gà POPPY</span>
            </div>
            <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <SidebarMenu onNavItemClick={() => setIsMobileMenuOpen(false)} />
        </aside>

        <div className="main-wrapper">
          <header className="top-header">
            <div className="header-left">
              <button className="mobile-burger" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <h1 className="header-title">Hệ Thống Quản Lý Bán Hàng</h1>
            </div>
            <div className="header-right">
              <button className="btn btn-ghost"><Bell size={20} /></button>
              <div className="user-profile">
                <div className="user-avatar">A</div>
                <span className="user-name">Admin</span>
              </div>
            </div>
          </header>

          <main className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/finance-categories" element={<FinanceCategories />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/reports" element={<BusinessReports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
