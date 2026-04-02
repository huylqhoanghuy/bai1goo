import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị UI thay thế ở lần render tiếp theo.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Có thể ghi log lỗi ở đây (Sentry, v.v...)
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', width: '100vw', background: 'var(--bg-color)', fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            background: 'var(--surface-color)', padding: '40px', borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '500px', width: '90%'
          }}>
            <div style={{ 
               width: '80px', height: '80px', background: '#FEF2F2', borderRadius: '50%',
               display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
            }}>
              <AlertTriangle size={40} color="var(--danger)" />
            </div>
            
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Gián Đoạn Phiên Vận Hành
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
              Thiết bị vừa nhận được một bản cập nhật cấu trúc dữ liệu mới từ đám mây, dẫn đến giao diện trình duyệt cần được làm mới để đồng bộ hoàn toàn.
            </p>
            
            <button 
               onClick={() => window.location.reload()}
               style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary)',
                  color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px',
                  fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
               }}
            >
              <RefreshCw size={20} />
              Đồng Bộ & Tải Lại Hệ Thống
            </button>
            <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.6 }}>
               Error Code: {this.state.error?.message || 'Unknown Context Reset'}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
