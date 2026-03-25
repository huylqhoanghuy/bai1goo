import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Settings() {
  const { state, dispatch } = useData();
  const settings = state.settings || { theme: 'dark', syncMode: 'auto' };
  const [syncing, setSyncing] = useState(false);

  const toggleTheme = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: settings.theme === 'dark' ? 'light' : 'dark' } });
  };

  const toggleSyncMode = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { syncMode: settings.syncMode === 'auto' ? 'manual' : 'auto' } });
  };

  const manualSync = async () => {
    setSyncing(true);
    try {
      const keys = Object.keys(state);
      for (const key of keys) {
        await setDoc(doc(db, 'store_data', key), { data: state[key] });
      }
      alert('Đồng bộ dữ liệu mây thành công!');
    } catch (err) {
      console.error(err);
      alert('Lỗi đồng bộ. Hãy kiểm tra kết nối mạng hoặc Console.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: 24, margin: '0 auto', maxWidth: 800 }}>
      <h2 style={{ marginBottom: 24, color: 'var(--primary)', fontSize: 24 }}>Cài Đặt Hệ Thống</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Giao Diện */}
        <div style={{ padding: 20, border: '1px solid var(--surface-border)', borderRadius: 12, background: 'rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Giao diện Sáng / Tối</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Chuyển đổi màu sắc hệ thống để bảo vệ mắt của bạn.
              </p>
            </div>
            <button className="btn btn-primary" onClick={toggleTheme} style={{ minWidth: 160 }}>
              {settings.theme === 'dark' ? 'Sáng ☀️' : 'Tối 🌙'}
            </button>
          </div>
        </div>

        {/* Đồng Bộ */}
        <div style={{ padding: 20, border: '1px solid var(--surface-border)', borderRadius: 12, background: 'rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Chế độ Đồng bộ Đám mây</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Hiện tại: <strong>{settings.syncMode === 'auto' ? 'Tự động theo thời gian thực' : 'Bấm thủ công'}</strong>
              </p>
            </div>
            <button className="btn btn-ghost" onClick={toggleSyncMode} style={{ border: '1px solid var(--surface-border)', minWidth: 160 }}>
              Đổi sang {settings.syncMode === 'auto' ? 'Thủ công' : 'Tự động'}
            </button>
          </div>

          {settings.syncMode === 'manual' && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--surface-border)' }}>
              <button className="btn btn-primary" onClick={manualSync} disabled={syncing} style={{ width: '100%', padding: 12, fontSize: 16 }}>
                {syncing ? 'Đang đồng bộ...' : '🚀 Đẩy Dữ Liệu Lên Mạng Ngay'}
              </button>
            </div>
          )}

          <div style={{ marginTop: 24, padding: 16, background: 'rgba(234, 88, 12, 0.05)', borderRadius: 8, border: '1px dashed var(--primary)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: 8, fontSize: 16 }}>Cập nhật MÃ NGUỒN lên Github</h4>
            <p style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 'bold' }}>
              Xong rồi, cập nhật code lên live đi
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
