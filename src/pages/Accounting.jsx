import React, { useState, useMemo } from 'react';
import { Wallet, Plus, Search, Building2, CreditCard, Banknote, ArrowLeftRight, Trash2, Edit3, FileText, Filter, Eye, Printer, ChevronRight, AlertCircle, UploadCloud, Globe, CheckCircle2, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';

const AccountCard = ({ acc, onSelect, isActive, onAdjust }) => {
  const getIcon = (type) => {
    if (type === 'bank') return <Building2 size={18} />;
    if (type === 'e-wallet') return <CreditCard size={18} />;
    return <Banknote size={18} />;
  };

  return (
    <div 
      className="glass-panel hover-glow" 
      onClick={() => onSelect(acc)}
      style={{ 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px', 
        minWidth: '220px', 
        cursor: 'pointer',
        border: isActive ? '1px solid var(--primary)' : '1px solid var(--surface-border)',
        boxShadow: isActive ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'none'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>{acc.type}</span>
        <Settings2 size={14} onClick={(e) => { e.stopPropagation(); onAdjust(acc); }} style={{ cursor: 'pointer' }} title="Điều chỉnh số dư" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ color: isActive ? 'var(--primary)' : 'inherit' }}>{getIcon(acc.type)}</div>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{acc.name}</h4>
      </div>
      <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
        {acc.balance.toLocaleString('vi-VN')} đ
      </p>
    </div>
  );
};

// Simplified icon for Settings/Adjust
const Settings2 = ({ size, onClick, style, title }) => (
  <Edit3 size={size} onClick={onClick} style={style} title={title} />
);

const Accounting = () => {
  const { state, dispatch } = useData();
  
  // State
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(null); // Account Object
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [viewVoucher, setViewVoucher] = useState(null); // Transaction Object

  // Forms
  const [vForm, setVForm] = useState({ id: null, type: 'Chi', accountId: 'ACC1', categoryId: 'FC9', amount: '', note: '', collector: '', payer: '', relatedId: '', date: new Date().toISOString().split('T')[0] });
  const [adjustForm, setAdjustForm] = useState({ actual: '' });
  const [transferForm, setTransferForm] = useState({ fromId: 'ACC1', toId: 'ACC2', amount: '', fee: 0, note: '', date: new Date().toISOString().split('T')[0] });
  const [catForm, setCatForm] = useState({ name: '', type: 'expense' });
  const [confirmDelete, setConfirmDelete] = useState(null); // Transaction ID
  const [viewOrder, setViewOrder] = useState(null); // PO or POS Order for detail view
  const [debtFilters, setDebtFilters] = useState({ supplierId: 'all', channelId: 'all' });

  const [filters, setFilters] = useState({ start: '', end: '', type: 'all', categoryId: 'all', search: '' });
  const [activeJournalTab, setActiveJournalTab] = useState('all'); // all, income, expense, payable, receivable
  const [datePreset, setDatePreset] = useState('this_month'); 

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADJUST_BALANCE', payload: { accountId: showAdjustModal.id, actualBalance: Number(adjustForm.actual), note: 'Điều chỉnh số dư định kỳ.' } });
    setShowAdjustModal(null);
  };

  // Calculate range for Statistics
  const statsByRange = useMemo(() => {
    const now = new Date();
    let start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    let end = new Date().getTime();

    const today = new Date().setHours(0,0,0,0);
    const yesterday = new Date(today - 24*60*60*1000).getTime();

    if (datePreset === 'today') {
        start = today;
    } else if (datePreset === 'yesterday') {
        start = yesterday;
        end = new Date(yesterday).setHours(23,59,59,999);
    } else if (datePreset === '7days') {
        start = today - 7*24*60*60*1000;
    } else if (datePreset === '30days') {
        start = today - 30*24*60*60*1000;
    } else if (datePreset === 'last_month') {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
        end = new Date(now.getFullYear(), now.getMonth(), 0).setHours(23,59,59,999);
    } else if (datePreset === 'this_year') {
        start = new Date(now.getFullYear(), 0, 1).getTime();
    }
    
    return state.transactions.reduce((acc, t) => {
        const tDate = new Date(t.date).getTime();
        if (tDate >= start && tDate <= end) {
            if (t.type === 'Thu') acc.income += t.amount;
            else if (t.type === 'Chi') acc.expense += t.amount;
        }
        return acc;
    }, { income: 0, expense: 0 });
  }, [state.transactions, datePreset]);

  const monthlyNet = statsByRange.income - statsByRange.expense;

  const filteredTransactions = useMemo(() => {
    return state.transactions.filter(t => {
      // Tab filter
      if (activeJournalTab === 'income' && t.type !== 'Thu') return false;
      if (activeJournalTab === 'expense' && t.type !== 'Chi') return false;

      const matchAcc = !selectedAcc || t.accountId === selectedAcc.id;
      const matchType = filters.type === 'all' || t.type === filters.type;
      const matchCat = filters.categoryId === 'all' || t.categoryId === filters.categoryId;
      const matchSearch = !filters.search || 
        t.note?.toLowerCase().includes(filters.search.toLowerCase()) || 
        t.voucherCode?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.collector?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.payer?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.relatedId?.toLowerCase().includes(filters.search.toLowerCase()); // Link with orders/inventory
      
      const itemDate = new Date(t.date).setHours(0,0,0,0);
      const start = filters.start ? new Date(filters.start).setHours(0,0,0,0) : null;
      const end = filters.end ? new Date(filters.end).setHours(23,59,59,999) : null;
      const matchDate = (!start || itemDate >= start) && (!end || itemDate <= end);
      
      return matchAcc && matchType && matchCat && matchSearch && matchDate;
    });
  }, [state.transactions, filters, selectedAcc, activeJournalTab]);

  const handleVoucherSubmit = (e) => {
    e.preventDefault();
    const payload = { ...vForm, amount: Number(vForm.amount) };
    
    if (vForm.id) {
        dispatch({ type: 'UPDATE_TRANSACTION', payload });
    } else {
        dispatch({ type: 'ADD_TRANSACTION', payload });
        // Auto-update order status if linked
        if (vForm.relatedId) {
            if (vForm.relatedId.startsWith('NK-')) {
                dispatch({ type: 'UPDATE_PURCHASE_ORDER_STATUS', payload: { id: vForm.relatedId, status: 'Paid' } });
            } else if (vForm.relatedId.startsWith('DH-')) {
                dispatch({ type: 'UPDATE_POS_ORDER_STATUS', payload: { id: vForm.relatedId, paymentStatus: 'Paid' } });
            }
        }
    }
    
    setShowVoucherModal(false);
    setVForm({ id: null, type: 'Chi', accountId: 'ACC1', categoryId: 'FC9', amount: '', note: '', collector: '', payer: '', relatedId: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleEditTransaction = (t) => {
    setVForm({ ...t, amount: t.amount.toString() });
    setShowVoucherModal(true);
  };

  const handleDeleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    setConfirmDelete(null);
  };

  const handleProcessDebt = (item, type) => {
    const isPayable = type === 'payable';
    setVForm({
        id: null,
        type: isPayable ? 'Chi' : 'Thu',
        accountId: 'ACC1',
        categoryId: isPayable ? 'FC9' : 'FC1',
        amount: item.totalAmount,
        note: isPayable ? `Thanh toán công nợ đơn nhập ${item.id}` : `Thu tiền công nợ đơn bán ${item.id}`,
        collector: isPayable ? (item.seller || 'NCC') : 'Cửa hàng',
        payer: isPayable ? 'Cửa hàng' : (item.customerName || 'Khách hàng'),
        relatedId: item.id,
        date: new Date().toISOString().split('T')[0]
    });
    setShowVoucherModal(true);
  };

  // Unified Filter Logic for all lists
  const matchCommonFilters = (item, dateField = 'date') => {
      const matchSearch = !filters.search || 
        item.id?.toLowerCase().includes(filters.search.toLowerCase()) || 
        (item.note || '').toLowerCase().includes(filters.search.toLowerCase()) || 
        (item.seller || item.channelName || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.customerName || '').toLowerCase().includes(filters.search.toLowerCase());

      const itemDate = new Date(item[dateField]).setHours(0,0,0,0);
      const start = filters.start ? new Date(filters.start).setHours(0,0,0,0) : null;
      const end = filters.end ? new Date(filters.end).setHours(23,59,59,999) : null;
      return matchSearch && (!start || itemDate >= start) && (!end || itemDate <= end);
  };

  const filteredPayables = useMemo(() => {
    return state.purchaseOrders
      .filter(p => p.status !== 'Paid')
      .filter(p => debtFilters.supplierId === 'all' || p.seller === debtFilters.supplierId)
      .filter(p => matchCommonFilters(p));
  }, [state.purchaseOrders, debtFilters, filters]);

  const filteredReceivables = useMemo(() => {
    return state.posOrders
      .filter(o => o.paymentStatus !== 'Paid')
      .filter(o => debtFilters.channelId === 'all' || (o.channelName || 'Tại quầy') === debtFilters.channelId)
      .filter(o => matchCommonFilters(o));
  }, [state.posOrders, debtFilters, filters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '40px' }}>
      <div className="accounting-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--font-xl)' }}>
            <Wallet color="var(--primary)" /> Sổ Quỹ & Công Nợ
          </h2>
          <p className="mobile-hide" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Quản lý dòng tiền, đối soát ví và công nợ tập trung.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
           <button className="btn btn-ghost" onClick={() => setShowTransferModal(true)} style={{ border: '1px solid var(--surface-border)', padding: '6px 12px', fontSize: 'var(--font-xs)' }}>
              <ArrowLeftRight size={16} /> Chuyển Ví
           </button>
           <button className="btn btn-primary" onClick={() => setShowVoucherModal(true)} style={{ padding: '6px 16px', fontSize: 'var(--font-xs)' }}>
              <Plus size={16} /> Lập Phiếu
           </button>
        </div>
      </div>


      <div className="accounting-layout">
         {/* Top Section: Stats & Quick Actions (HORIZONTAL) */}
         <div className="stats-horizontal-grid">
            {/* Debt Alerts Card (NEW V34) */}
            <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '4px solid var(--danger)', background: 'rgba(239, 68, 68, 0.02)' }}>
               <h4 style={{ margin: 0, marginBottom: '8px', fontSize: '10px', color: 'var(--danger)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Cảnh Báo Công Nợ</h4>
               <div style={{ display: 'flex', gap: '20px' }}>
                  <div>
                     <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Phải trả NCC:</span>
                     <strong style={{ fontSize: '1.2rem', color: 'var(--danger)' }}>
                        {state.purchaseOrders.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()} <small style={{fontSize:'var(--font-xs)'}}>đ</small>
                     </strong>
                  </div>
                  <div style={{ width: '1px', background: 'var(--surface-border)', height: '30px', alignSelf: 'center' }}></div>
                  <div>
                     <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Đơn sắp đến hạn:</span>
                     <strong style={{ fontSize: '1.2rem', color: 'var(--warning)' }}>
                        {state.purchaseOrders.filter(p => p.status !== 'Paid').length} <small style={{fontSize:'var(--font-xs)'}}>phiếu</small>
                     </strong>
                  </div>
               </div>
            </div>

            {/* Statistics Row Card */}
            <div className="glass-panel" style={{ padding: '12px 20px', gridColumn: 'span 2' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-sm)' }}>
                     <TrendingUp size={18} color="var(--primary)"/> Thống Kê Nhanh
                  </h4>
                  <select 
                    value={datePreset} 
                    onChange={e => setDatePreset(e.target.value)}
                    style={{ background: 'var(--surface-variant)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-xs)', fontWeight: 700, outline: 'none' }}
                  >
                    <option value="today">Hôm nay</option>
                    <option value="yesterday">Hôm qua</option>
                    <option value="7days">7 ngày qua</option>
                    <option value="30days">30 ngày qua</option>
                    <option value="this_month">Tháng này</option>
                    <option value="last_month">Tháng trước</option>
                    <option value="this_year">Năm nay</option>
                  </select>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '10px 16px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--success)', display: 'flex', flexDirection: 'column' }}>
                     <p style={{ margin: 0, fontSize: '10px', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>Tổng Thu</p>
                     <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--success)' }}>
                        {statsByRange.income.toLocaleString()} <span style={{fontSize:'var(--font-xs)', opacity: 0.8}}>đ</span>
                     </p>
                  </div>

                  <div style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--danger)', display: 'flex', flexDirection: 'column' }}>
                     <p style={{ margin: 0, fontSize: '10px', color: 'var(--danger)', fontWeight: 700, textTransform: 'uppercase' }}>Tổng Chi</p>
                     <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--danger)' }}>
                        {statsByRange.expense.toLocaleString()} <span style={{fontSize:'var(--font-xs)', opacity: 0.8}}>đ</span>
                     </p>
                  </div>

                  <div style={{ padding: '10px 16px', background: monthlyNet >= 0 ? 'rgba(59, 130, 246, 0.05)' : 'rgba(249, 115, 22, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${monthlyNet >= 0 ? 'var(--primary)' : 'var(--warning)'}`, display: 'flex', flexDirection: 'column' }}>
                     <p style={{ margin: 0, fontSize: '10px', color: monthlyNet >= 0 ? 'var(--primary)' : 'var(--warning)', fontWeight: 700, textTransform: 'uppercase' }}>Dòng Tiền</p>
                     <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: monthlyNet >= 0 ? 'var(--primary)' : 'var(--warning)' }}>
                        {monthlyNet >= 0 ? '+' : ''}{monthlyNet.toLocaleString()} <span style={{fontSize:'var(--font-xs)', opacity: 0.8}}>đ</span>
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Bottom Section: Ledger Table (FULL WIDTH) */}
         <div className="glass-panel ledger-container" style={{ padding: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="journal-tabs" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--surface-border)', marginBottom: '20px', paddingBottom: '2px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {['all', 'income', 'expense', 'payable', 'receivable'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => { setActiveJournalTab(tab); if (tab !== 'payable' && tab !== 'receivable') setFilters(prev => ({ ...prev, categoryId: 'all' })); }}
                        style={{ 
                            padding: '12px 24px', background: 'transparent', border: 'none', 
                            borderBottom: activeJournalTab === tab ? `2px solid ${tab === 'payable' ? 'var(--warning)' : tab === 'receivable' ? '#a855f7' : tab === 'income' ? 'var(--success)' : tab === 'expense' ? 'var(--danger)' : 'var(--primary)'}` : '2px solid transparent', 
                            color: activeJournalTab === tab ? (tab === 'payable' ? 'var(--warning)' : tab === 'receivable' ? '#a855f7' : tab === 'income' ? 'var(--success)' : tab === 'expense' ? 'var(--danger)' : 'var(--primary)') : 'var(--text-secondary)', 
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' 
                        }}
                    >
                        {tab === 'all' ? 'Sổ Nhật Ký Chung' : tab === 'income' ? 'Nhật Ký THU' : tab === 'expense' ? 'Nhật Ký CHI' : tab === 'payable' ? 'Nợ PHẢI TRẢ (NCC)' : 'Nợ PHẢI THU (Khách)'}
                    </button>
                ))}
            </div>

            <div className="ledger-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
               <h3 style={{ margin: 0, fontSize: 'var(--font-base)', minWidth: '150px' }}>
                  {activeJournalTab === 'payable' ? 'Chi tiết công nợ phải trả' : activeJournalTab === 'receivable' ? 'Chi tiết công nợ phải thu' : (selectedAcc ? `Sổ Chi Tiết: ${selectedAcc.name}` : 'Toàn bộ dòng tiền')}
               </h3>
               
               <div className="ledger-toolbar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                  <div className="search-box" style={{ width: 'clamp(240px, 100%, 300px)', padding: '10px 16px', background: 'var(--surface-variant)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Search size={16} color="var(--text-secondary)" />
                    <input type="text" placeholder="Tìm theo Mã, Diễn giải, Đối tác..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', flex: 1, fontSize: 'var(--font-sm)' }} />
                  </div>

                  {activeJournalTab !== 'payable' && activeJournalTab !== 'receivable' && (
                     <select 
                        style={{ background:'var(--surface-variant)', color:'var(--text-primary)', border:'1px solid var(--surface-border)', padding:'10px 16px', borderRadius:'var(--radius-sm)', outline:'none', fontSize: 'var(--font-xs)', fontWeight: 600 }}
                        value={selectedAcc?.id || 'all'} 
                        onChange={e => setSelectedAcc(state.accounts.find(a => a.id === e.target.value) || null)}
                     >
                        <option value="all">Tất cả Ví</option>
                        {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                     </select>
                  )}

                  {activeJournalTab === 'payable' && (
                     <select 
                        style={{ background:'var(--surface-variant)', color:'var(--text-primary)', border:'1px solid var(--surface-border)', padding:'10px 16px', borderRadius:'var(--radius-sm)', outline:'none', fontSize: 'var(--font-xs)', fontWeight: 600 }}
                        value={debtFilters.supplierId}
                        onChange={e => setDebtFilters({...debtFilters, supplierId: e.target.value})}
                     >
                        <option value="all">Tất cả NCC</option>
                        {state.suppliers?.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                     </select>
                  )}

                  {activeJournalTab === 'receivable' && (
                     <select 
                        style={{ background:'var(--surface-variant)', color:'var(--text-primary)', border:'1px solid var(--surface-border)', padding:'10px 16px', borderRadius:'var(--radius-sm)', outline:'none', fontSize: 'var(--font-xs)', fontWeight: 600 }}
                        value={debtFilters.channelId}
                        onChange={e => setDebtFilters({...debtFilters, channelId: e.target.value})}
                     >
                        <option value="all">Tất cả Kênh</option>
                        <option value="Grab">Grab Order</option>
                        <option value="Shopee">Shopee Order</option>
                        <option value="Tại quầy">Tại quầy</option>
                     </select>
                  )}

                  <div style={{ display: 'flex', gap: '8px' }}>
                     <input type="date" className="form-control" value={filters.start} onChange={e => setFilters({...filters, start: e.target.value})} style={{ width: '135px', padding: '8px', background: 'var(--surface-variant)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-xs)' }} />
                     <input type="date" className="form-control" value={filters.end} onChange={e => setFilters({...filters, end: e.target.value})} style={{ width: '135px', padding: '8px', background: 'var(--surface-variant)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-xs)' }} />
                  </div>
                  <button className="btn btn-ghost" onClick={() => { setFilters({ start: '', end: '', type: 'all', categoryId: 'all', search: '' }); setSelectedAcc(null); setActiveJournalTab('all'); setDebtFilters({ supplierId: 'all', channelId: 'all' }); }} style={{ color: 'var(--danger)', fontSize: '0.75rem', padding: '4px 8px' }}>Xóa Lọc</button>
               </div>
            </div>
            
            <div className="divider-solid" style={{ marginBottom: '20px', opacity: 0.5 }}></div>

            <div className="table-responsive" style={{ flex: 1 }}>
               <table className="table">
                  <thead>
                     {activeJournalTab === 'payable' ? (
                        <tr>
                           <th>Ngày Nhập</th>
                           <th>Mã Đơn Nhập</th>
                           <th>Nhà Cung Cấp</th>
                           <th>Diễn Giải</th>
                           <th style={{ textAlign: 'right' }}>Tổng Tiền</th>
                           <th style={{ textAlign: 'center' }}>Trạng Thái</th>
                        </tr>
                     ) : activeJournalTab === 'receivable' ? (
                        <tr>
                           <th>Ngày Bán</th>
                           <th>Mã Đơn Hàng</th>
                           <th>Kênh/Khách</th>
                           <th>Sản Phẩm</th>
                           <th style={{ textAlign: 'right' }}>Thanh Toán</th>
                           <th style={{ textAlign: 'center' }}>Trạng Thái</th>
                        </tr>
                     ) : (
                        <tr>
                           <th>Mã Phiếu</th>
                           <th>Ngày Tháng</th>
                           <th>Vật Mang</th>
                           <th>Đối Tượng</th>
                           <th>Diễn Giải</th>
                           <th style={{ textAlign: 'right' }}>Số Tiền</th>
                           <th style={{ textAlign: 'center' }}>Chi Tiết</th>
                        </tr>
                     )}
                  </thead>
                  <tbody>
                     {activeJournalTab === 'payable' ? (
                        filteredPayables.map(p => (
                           <tr key={p.id} className="hover-row">
                              <td style={{ padding:'12px', fontSize:'0.8rem' }}>{new Date(p.date).toLocaleDateString('vi-VN')}</td>
                              <td style={{ padding:'12px', fontWeight:700 }}>{p.id}</td>
                              <td style={{ padding:'12px' }}>{p.seller}</td>
                              <td style={{ padding:'12px' }}>
                                 <button className="btn btn-ghost" onClick={() => setViewOrder({ ...p, orderType: 'PO' })} style={{ padding: '0', color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.8rem' }}>Xem {p.items?.length || 0} mục</button>
                              </td>
                              <td style={{ padding:'12px', textAlign:'right', fontWeight:700, color:'var(--danger)' }}>{p.totalAmount.toLocaleString()} đ</td>
                              <td style={{ padding:'12px', textAlign:'center', display:'flex', gap:'8px', justifyContent:'center' }}>
                                 <span style={{ padding:'4px 8px', borderRadius:'4px', background:'rgba(239, 68, 68, 0.1)', color:'var(--danger)', fontSize:'10px', fontWeight:800 }}>{p.status}</span>
                                 <button className="btn btn-primary" onClick={() => handleProcessDebt(p, 'payable')} style={{ padding:'4px 12px', fontSize:'10px', background:'var(--success)' }}>Thanh toán</button>
                              </td>
                           </tr>
                        ))
                     ) : activeJournalTab === 'receivable' ? (
                        filteredReceivables.map(o => (
                           <tr key={o.id} className="hover-row">
                              <td style={{ padding:'12px', fontSize:'0.8rem' }}>{new Date(o.date).toLocaleDateString('vi-VN')}</td>
                              <td style={{ padding:'12px', fontWeight:700 }}>{o.id}</td>
                              <td style={{ padding:'12px' }}>{o.channelName || 'Tại quầy'}</td>
                              <td style={{ padding:'12px' }}>
                                 <button className="btn btn-ghost" onClick={() => setViewOrder({ ...o, orderType: 'POS' })} style={{ padding: '0', color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.8rem' }}>Xem {o.items?.length || 0} món</button>
                              </td>
                              <td style={{ padding:'12px', textAlign:'right', fontWeight:700, color:'var(--warning)' }}>{o.totalAmount.toLocaleString()} đ</td>
                              <td style={{ padding:'12px', textAlign:'center', display:'flex', gap:'8px', justifyContent:'center' }}>
                                 <span style={{ padding:'4px 8px', borderRadius:'4px', background:'rgba(249, 115, 22, 0.1)', color:'var(--warning)', fontSize:'10px', fontWeight:800 }}>{o.paymentStatus}</span>
                                 <button className="btn btn-primary" onClick={() => handleProcessDebt(o, 'receivable')} style={{ padding:'4px 12px', fontSize:'10px', background:'var(--primary)' }}>Thu tiền</button>
                              </td>
                           </tr>
                        ))
                     ) : (
                        filteredTransactions.map(t => (
                           <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="hover-row">
                              <td style={{ padding: '12px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>{t.voucherCode}</td>
                              <td style={{ padding: '12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{new Date(t.date).toLocaleString('vi-VN', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</td>
                              <td style={{ padding: '12px', fontSize: '0.8rem' }}>{state.accounts.find(a => a.id === t.accountId)?.name}</td>
                              <td style={{ padding: '12px', fontSize: '0.85rem' }}>{t.type === 'Thu' ? (t.payer || '---') : (t.collector || '---')}</td>
                              <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                                 <div style={{ display:'flex', flexDirection:'column' }}>
                                    <span>{t.note}</span>
                                    {t.relatedId && <small style={{ color:'var(--success)', opacity:0.8 }}>Ref: {t.relatedId}</small>}
                                 </div>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: t.type === 'Thu' ? 'var(--success)' : 'var(--danger)' }}>
                                 {t.type === 'Thu' ? '+' : '-'}{t.amount.toLocaleString()} đ
                              </td>
                               <td style={{ padding: '12px', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                     <button className="btn btn-ghost" onClick={() => handleEditTransaction(t)} style={{ padding: '4px' }} title="Sửa"><Edit3 size={14} color="var(--primary)"/></button>
                                     <button className="btn btn-ghost" onClick={() => setConfirmDelete(t.id)} style={{ padding: '4px' }} title="Xóa"><Trash2 size={14} color="var(--danger)"/></button>
                                     <button className="btn btn-ghost" onClick={() => setViewVoucher(t)} style={{ padding: '4px' }} title="In/Xem"><Printer size={14}/></button>
                                  </div>
                               </td>
                           </tr>
                        ))
                     )}
                     {((activeJournalTab === 'payable' && state.purchaseOrders.filter(p => p.status !== 'Paid').length === 0) || 
                       (activeJournalTab === 'receivable' && state.posOrders.filter(o => o.paymentStatus !== 'Paid').length === 0) ||
                       (activeJournalTab !== 'payable' && activeJournalTab !== 'receivable' && filteredTransactions.length === 0)) && (
                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', opacity: 0.5 }}>Hệ thống chưa ghi nhận dữ liệu nợ trong mục này.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

      </div>

      {/* MODALS */}
      {confirmDelete && (
         <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="glass-panel" style={{ width: '320px', padding: '24px', textAlign: 'center' }}>
               <AlertCircle size={40} color="var(--danger)" style={{ marginBottom: '16px' }} />
               <h3 style={{ margin: 0, marginBottom: '8px' }}>Xác nhận xóa?</h3>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Hành động này sẽ xóa vĩnh viễn chứng từ và hoàn tác số dư tài khoản.</p>
               <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmDelete(null)}>Hủy</button>
                  <button className="btn btn-primary" style={{ flex: 1, background: 'var(--danger)' }} onClick={() => handleDeleteTransaction(confirmDelete)}>Xóa Ngay</button>
               </div>
            </div>
         </div>
      )}
      {viewOrder && (
         <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
            <div className="glass-panel" style={{ width: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0 }}>Chi tiết đơn: {viewOrder.id}</h3>
                  <button className="btn btn-ghost" onClick={() => setViewOrder(null)}>Đóng</button>
               </div>
               <div style={{ background: 'var(--surface-variant)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p><strong>Ngày:</strong> {new Date(viewOrder.date).toLocaleString('vi-VN')}</p>
                  <p><strong>Đối tác:</strong> {viewOrder.orderType === 'PO' ? viewOrder.seller : (viewOrder.customerName || 'Khách lẻ')}</p>
                  <p><strong>Trạng thái:</strong> {viewOrder.orderType === 'PO' ? viewOrder.status : viewOrder.paymentStatus}</p>
               </div>
               <table className="table">
                  <thead>
                     <tr>
                        <th>Sản phẩm / Nguyên liệu</th>
                        <th style={{ textAlign: 'center' }}>SL</th>
                        <th style={{ textAlign: 'right' }}>Giá</th>
                        <th style={{ textAlign: 'right' }}>Thành tiền</th>
                     </tr>
                  </thead>
                  <tbody>
                     {viewOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                           <td>
                              {viewOrder.orderType === 'PO' ? 
                                 state.ingredients.find(i => i.id === item.ingredientId)?.name : 
                                 item.product?.name}
                           </td>
                           <td style={{ textAlign: 'center' }}>{item.quantity || item.baseQty}</td>
                           <td style={{ textAlign: 'right' }}>{(item.price || item.unitCost).toLocaleString()} đ</td>
                           <td style={{ textAlign: 'right' }}>{(item.itemTotal || (item.quantity * item.price)).toLocaleString()} đ</td>
                        </tr>
                     ))}
                  </tbody>
                  <tfoot>
                     <tr>
                        <td colSpan="3" style={{ textAlign: 'right', padding: '16px', fontWeight: 800 }}>TỔNG CỘNG:</td>
                        <td style={{ textAlign: 'right', padding: '16px', fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>{viewOrder.totalAmount.toLocaleString()} đ</td>
                     </tr>
                  </tfoot>
               </table>
            </div>
         </div>
      )}

      {showVoucherModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <form className="glass-panel" style={{ width: '560px', padding: '32px' }} onSubmit={handleVoucherSubmit}>
             <h3 style={{ margin: 0, marginBottom: '24px', display:'flex', alignItems:'center', gap:'12px' }}>
                <FileText color="var(--primary)"/> Lập Chứng Từ Tài Chính
             </h3>
             <div style={{ display:'grid', gap:'16px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                   <div>
                      <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Loại Chứng Từ:</label>
                      <select className="form-control" value={vForm.type} onChange={e => setVForm({...vForm, type: e.target.value, categoryId: state.financeCategories.find(c => c.type === (e.target.value === 'Thu' ? 'income' : 'expense'))?.id || 'FC9'})}>
                        <option value="Thu">PHIẾU THU (Dòng tiền vào)</option>
                        <option value="Chi">PHIẾU CHI (Dòng tiền ra)</option>
                      </select>
                   </div>
                   <div>
                      <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Ngày hạch toán:</label>
                      <input type="date" className="form-control" value={vForm.date} onChange={e => setVForm({...vForm, date: e.target.value})} />
                   </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                   <div>
                      <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Tài khoản nguồn/đích:</label>
                      <select className="form-control" value={vForm.accountId} onChange={e => setVForm({...vForm, accountId: e.target.value})}>
                        {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                   </div>
                   <div>
                      <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Danh mục:</label>
                      <select className="form-control" value={vForm.categoryId} onChange={e => setVForm({...vForm, categoryId: e.target.value})}>
                        {state.financeCategories.filter(c => c.type === (vForm.type === 'Thu' ? 'income' : 'expense')).map(cat => (
                           <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                   </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                   <div>
                      <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{vForm.type === 'Thu' ? 'Người nộp tiền:' : 'Người nhận tiền:'}</label>
                      <input required type="text" className="form-control" value={vForm.type === 'Thu' ? vForm.payer : vForm.collector} onChange={e => setVForm({...vForm, [vForm.type === 'Thu' ? 'payer' : 'collector']: e.target.value})} placeholder="Họ tên..." />
                   </div>
                   <div>
                      <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Mã liên kết (Đơn hàng/Kho):</label>
                      <input type="text" className="form-control" value={vForm.relatedId} onChange={e => setVForm({...vForm, relatedId: e.target.value})} placeholder="DH-xxx / NK-xxx" />
                   </div>
                </div>

                <div>
                   <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Số tiền (đ):</label>
                   <input required type="number" className="form-control" value={vForm.amount} onChange={e => setVForm({...vForm, amount: e.target.value})} placeholder="0" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }} />
                </div>
                <div>
                   <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Nội dung diễn giải:</label>
                   <textarea className="form-control" value={vForm.note} onChange={e => setVForm({...vForm, note: e.target.value})} style={{ minHeight:'80px' }} />
                </div>
             </div>
             <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
               <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowVoucherModal(false)}>Hủy Bỏ</button>
               <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Xác Nhận & Lưu Phiếu</button>
            </div>
          </form>
        </div>
      )}

      {showAdjustModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <form className="glass-panel" style={{ width: '400px', padding: '24px' }} onSubmit={handleAdjustSubmit}>
             <h3 style={{ margin: 0, marginBottom: '8px' }}>Điều Chỉnh Số Dư</h3>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Thay đổi số tiền thực tế trong ví: <strong>{showAdjustModal.name}</strong>
             </p>
             <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                   <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Số dư trong App:</label>
                   <p style={{ margin: '4px 0', fontSize: '1.1rem', fontWeight: 600 }}>{showAdjustModal.balance.toLocaleString()} đ</p>
                </div>
                <div>
                   <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Số tiền THỰC TẾ:</label>
                   <input required type="number" className="form-control" value={adjustForm.actual} onChange={e => setAdjustForm({...adjustForm, actual: e.target.value})} placeholder="0" autoFocus style={{ fontSize: '1.2rem', fontWeight: 800 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '6px', color: 'var(--warning)', fontSize: '0.75rem' }}>
                   <AlertCircle size={16}/> 
                   <span>Hệ thống sẽ tự động tạo phiếu Thu/Chi để cân đối.</span>
                </div>
             </div>
             <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowAdjustModal(null)}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Khớp Số Dư</button>
             </div>
          </form>
        </div>
      )}

      {viewVoucher && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
           <div className="glass-panel" style={{ width: '500px', padding: '40px', background: 'white', color: 'black' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '20px', marginBottom: '20px' }}>
                 <h2 style={{ margin: 0, textTransform: 'uppercase' }}>{viewVoucher.type === 'Thu' ? 'Phiếu Thu' : 'Phiếu Chi'}</h2>
                 <p style={{ margin: '4px 0', fontWeight: 600 }}>Số: {viewVoucher.voucherCode}</p>
                 <p style={{ margin: 0, fontSize: '0.8rem' }}>Ngày lập: {new Date(viewVoucher.date).toLocaleString('vi-VN')}</p>
              </div>
              <div style={{ display: 'grid', gap: '12px', fontSize: '1rem' }}>
                 <p><strong>Người {viewVoucher.type === 'Thu' ? 'nộp' : 'nhận'}:</strong> {viewVoucher.type === 'Thu' ? viewVoucher.payer : viewVoucher.collector}</p>
                 <p><strong>Nội dung:</strong> {viewVoucher.note}</p>
                 <p><strong>Số tiền:</strong> <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{viewVoucher.amount.toLocaleString()} đ</span></p>
                 <p><strong>Bằng chữ:</strong> ....................................................................</p>
                 <p><strong>Tài khoản:</strong> {state.accounts.find(a => a.id === viewVoucher.accountId)?.name}</p>
                 {viewVoucher.relatedId && <p><strong>Kèm theo:</strong> Chứng từ gốc {viewVoucher.relatedId}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '40px', textAlign: 'center' }}>
                 <div>
                    <p style={{ fontWeight: 700, margin: 0 }}>Người lập</p>
                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>(Ký, họ tên)</p>
                 </div>
                 <div>
                    <p style={{ fontWeight: 700, margin: 0 }}>{viewVoucher.type === 'Thu' ? 'Người nộp' : 'Người nhận'}</p>
                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>(Ký, họ tên)</p>
                 </div>
              </div>
              <div style={{ marginTop: '50px', display: 'flex', gap: '12px' }}>
                 <button className="btn btn-primary" style={{ flex: 1, filter: 'none', background: 'black' }} onClick={() => window.print()}><Printer size={18}/> In Phiếu</button>
                 <button className="btn btn-ghost" style={{ flex: 1, border: '1px solid #ccc', color: 'black' }} onClick={() => setViewVoucher(null)}>Đóng</button>
              </div>
           </div>
        </div>
      )}

      {/* Simplified Acc/Cat Modal remain same logic as Finance or Accountings previous but integrated */}

      {showCatModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '24px' }}>
             <h3>Thêm Danh Mục Mới</h3>
             <form style={{ display:'grid', gap:'12px' }} onSubmit={(e) => { e.preventDefault(); dispatch({type:'ADD_FINANCE_CATEGORY', payload:catForm}); setShowCatModal(false); }}>
                <input className="form-control" placeholder="Tên danh mục..." value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} required />
                <select className="form-control" value={catForm.type} onChange={e => setCatForm({...catForm, type: e.target.value})}>
                  <option value="income">Loại: KHOẢN THU</option>
                  <option value="expense">Loại: KHOẢN CHI</option>
                </select>
                <div style={{ display:'flex', gap:'12px', marginTop:'12px' }}>
                   <button type="button" className="btn btn-ghost" style={{ flex:1 }} onClick={() => setShowCatModal(false)}>Hủy</button>
                   <button type="submit" className="btn btn-primary" style={{ flex:1 }}>Lưu</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {showTransferModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <form className="glass-panel" style={{ width: '480px', padding: '28px' }} onSubmit={(e) => { e.preventDefault(); dispatch({type:'TRANSFER_FUNDS', payload:transferForm}); setShowTransferModal(false); }}>
             <h3 style={{ margin: 0, marginBottom: '24px' }}>Luân Chuyển Dòng Tiền</h3>
             <div style={{ display:'grid', gap:'16px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                   <div>
                      <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Tài khoản Nguồn:</label>
                      <select className="form-control" value={transferForm.fromId} onChange={e => setTransferForm({...transferForm, fromId: e.target.value})}>
                        {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                   </div>
                   <div>
                      <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Tài khoản Đích:</label>
                      <select className="form-control" value={transferForm.toId} onChange={e => setTransferForm({...transferForm, toId: e.target.value})}>
                        {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                   </div>
                </div>
                <div>
                   <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Số tiền chuyển:</label>
                   <input required type="number" className="form-control" value={transferForm.amount} onChange={e => setTransferForm({...transferForm, amount: e.target.value})} />
                </div>
                <div>
                   <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Phí giao dịch (nếu có):</label>
                   <input type="number" className="form-control" value={transferForm.fee} onChange={e => setTransferForm({...transferForm, fee: e.target.value})} />
                </div>
                <div>
                   <label style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Ghi chú:</label>
                   <textarea className="form-control" value={transferForm.note} onChange={e => setTransferForm({...transferForm, note: e.target.value})} placeholder="..." />
                </div>
             </div>
             <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
               <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowTransferModal(false)}>Hủy</button>
               <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Luân Chuyển Ngay</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Accounting;
