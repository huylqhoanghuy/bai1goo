import React, { useState } from 'react';
import { ListTree, Plus, Edit, Trash2, ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react';
import { useData } from '../context/DataContext';

const FinanceCategories = () => {
  const { state, dispatch } = useData();
  const [activeTab, setActiveTab] = useState('expense');
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', type: 'expense' });

  const saveCategory = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (form.id) dispatch({ type: 'UPDATE_FINANCE_CATEGORY', payload });
    else dispatch({ type: 'ADD_FINANCE_CATEGORY', payload });
    setShowForm(false);
  };

  const deleteCategory = (id) => {
    if (confirm('Bạn có chắc muốn xóa danh mục này? Các giao dịch cũ vẫn sẽ giữ mã danh mục này.')) {
        dispatch({ type: 'DELETE_FINANCE_CATEGORY', payload: id });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
               <ListTree color="var(--primary)" /> Danh Mục Thu Chi (CFO)
            </h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Quản lý các nhóm phân loại dòng tiền để báo cáo P&L chính xác.</p>
         </div>
         <button className="btn btn-primary" onClick={() => { setForm({ id: '', name: '', type: activeTab }); setShowForm(true); }}>
            <Plus size={18} /> Thêm Danh Mục Mới
         </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
             <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{form.id ? 'Cập Nhật Danh Mục' : 'Tạo Danh Mục Thu Chi'}</h3>
                <button className="btn btn-ghost" onClick={() => setShowForm(false)} style={{ padding: '8px' }}><X size={20}/></button>
             </div>
             
             <form onSubmit={saveCategory} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                   <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Tên danh mục (Vd: Tiền điện, Tiếp khách...):</label>
                   <input required style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: 'white', padding: '12px', borderRadius: '8px', width: '100%', outline: 'none' }} 
                          value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nhập tên danh mục..." />
                </div>
                <div>
                   <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Loại dòng tiền:</label>
                   <select required style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: 'white', padding: '12px', borderRadius: '8px', width: '100%', outline: 'none' }} 
                           value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                      <option value="expense">Khoản CHI (Tiền ra)</option>
                      <option value="income">Khoản THU (Tiền vào)</option>
                   </select>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '1.1rem', marginTop: '12px' }}>{form.id ? 'Lưu Thay Đổi' : 'Xác Nhận Thêm'}</button>
             </form>
          </div>
        </div>
      )}

       <div className="glass-panel" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
         <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px', marginBottom: '16px' }}>
            <button className={`btn ${activeTab === 'expense' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('expense')}>
               <ArrowDownCircle size={18} style={{ marginRight: '8px' }}/> Danh Mục CHI
            </button>
            <button className={`btn ${activeTab === 'income' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('income')}>
               <ArrowUpCircle size={18} style={{ marginRight: '8px' }}/> Danh Mục THU
            </button>
         </div>

         <div style={{ flex: 1, overflowY: 'auto' }}>
            {state.financeCategories?.filter(c => c.type === activeTab).map(cat => (
               <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '4px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <div style={{ background: cat.type === 'income' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '12px' }}>
                        {cat.type === 'income' ? <ArrowUpCircle size={22} color="var(--success)"/> : <ArrowDownCircle size={22} color="var(--danger)"/>}
                     </div>
                     <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{cat.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mã: {cat.id}</span>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-ghost" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px' }} onClick={() => { setForm(cat); setShowForm(true); }}><Edit size={16} /></button>
                    <button className="btn btn-ghost" style={{ background: 'rgba(218,54,51,0.05)', color: 'var(--danger)', padding: '10px' }} onClick={() => deleteCategory(cat.id)}><Trash2 size={16} /></button>
                  </div>
               </div>
            ))}
            {state.financeCategories?.filter(c => c.type === activeTab).length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <ListTree size={40} style={{ opacity: 0.2, marginBottom: '12px' }}/>
                    <p>Chưa có danh mục nào được khởi tạo.</p>
                </div>
            )}
         </div>
       </div>
    </div>
  );
};

export default FinanceCategories;
