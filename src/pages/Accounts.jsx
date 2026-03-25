import React, { useState } from 'react';
import { CreditCard, Plus, Edit, Trash2, Wallet, X, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const Accounts = () => {
  const { state, dispatch } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', type: 'bank', initialBalance: '', balance: 0 });

  const saveAccount = (e) => {
    e.preventDefault();
    if (form.id) {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: { ...form, balance: Number(form.balance) || 0 } });
    } else {
      dispatch({ type: 'ADD_ACCOUNT', payload: { ...form, initialBalance: Number(form.initialBalance) || 0 } });
    }
    setShowForm(false);
  };

  const deleteAccount = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CreditCard color="var(--primary)" /> Quản Lý Tài Khoản & Ví
            </h2>
            <p style={{ margin: 0, marginTop: '4px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Thêm, sửa, xóa các tài khoản ngân hàng, ví điện tử và quỹ tiền mặt của cửa hàng.
            </p>
         </div>
         <button className="btn btn-primary" onClick={() => { setForm({ id: '', name: '', type: 'bank', initialBalance: '', balance: 0 }); setShowForm(true); }}>
            <Plus size={18} /> Thêm Tài Khoản
         </button>
      </div>

      {showForm && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', background: 'var(--bg-color)' }}>
             <div style={{ padding: '20px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{form.id ? 'Cập Nhật Tài Khoản' : 'Thêm Tài Khoản Mới'}</h3>
                <button className="btn btn-ghost" onClick={() => setShowForm(false)} style={{ padding: '8px' }}><X size={20}/></button>
             </div>
             
             <form onSubmit={saveAccount} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                   <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Tên tài khoản / Ngân hàng:</label>
                   <input required style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: 'white', padding: '12px', borderRadius: '8px', width: '100%', outline: 'none' }} 
                          value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ví dụ: MB Bank - 1234..." />
                </div>

                <div>
                   <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Loại tài khoản:</label>
                   <select style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: 'white', padding: '12px', borderRadius: '8px', width: '100%', outline: 'none' }} 
                           value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                      <option value="bank">Ngân hàng (Chuyển khoản)</option>
                      <option value="cash">Tiền mặt (Két tiền)</option>
                      <option value="e-wallet">Ví điện tử (Momo, ZaloPay...)</option>
                   </select>
                </div>

                {!form.id ? (
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Số dư khởi tạo (đ):</label>
                    <input required type="number" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: 'var(--primary)', padding: '12px', borderRadius: '8px', width: '100%', outline: 'none', fontSize: '1.2rem', fontWeight: 'bold' }} 
                           value={form.initialBalance} onChange={e => setForm({...form, initialBalance: e.target.value, balance: e.target.value})} placeholder="0" />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Số dư hiện tại (đ):</label>
                    <input required type="number" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: 'var(--primary)', padding: '12px', borderRadius: '8px', width: '100%', outline: 'none', fontSize: '1.2rem', fontWeight: 'bold' }} 
                           value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} />
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '8px', color: 'var(--warning)', fontSize: '0.8rem' }}>
                   <AlertCircle size={18}/> 
                   <span>Lưu ý: Thay đổi số dư tại đây sẽ không sinh phiếu thu/chi đối soát. Hãy cân nhắc!</span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '1.1rem', marginTop: '8px' }}>
                  {form.id ? 'Cập Nhật Thiết Lập' : 'Tạo Tài Khoản'}
                </button>
             </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
         {state.accounts?.map(acc => (
           <div key={acc.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.05 }}>
                <Wallet size={120} />
             </div>
             
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ background: acc.type === 'bank' ? 'rgba(59, 130, 246, 0.2)' : acc.type === 'cash' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(168, 85, 247, 0.2)', padding: '10px', borderRadius: '12px' }}>
                   <CreditCard size={24} color={acc.type === 'bank' ? 'var(--primary)' : acc.type === 'cash' ? 'var(--success)' : '#a855f7'}/>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                   <button className="btn btn-ghost" style={{ padding: '8px' }} onClick={() => { setForm(acc); setShowForm(true); }}><Edit size={16}/></button>
                   <button className="btn btn-ghost" style={{ padding: '8px', color: 'var(--danger)' }} onClick={() => deleteAccount(acc.id)}><Trash2 size={16}/></button>
                </div>
             </div>
             
             <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{acc.name}</h3>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {acc.type === 'bank' ? 'Tài Khoản Ngân Hàng' : acc.type === 'cash' ? 'Quỹ Tiền Mặt' : 'Ví Điện Tử'}
             </span>
             
             <div style={{ marginTop: '24px' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Số dư hiện khả dụng:</p>
                <h2 style={{ margin: '4px 0', fontSize: '2rem', color: acc.balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                   {acc.balance.toLocaleString()} đ
                </h2>
             </div>
             
             <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>ID: {acc.id}</span>
                <span>Khởi tạo: {acc.initialBalance?.toLocaleString()} đ</span>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Accounts;
