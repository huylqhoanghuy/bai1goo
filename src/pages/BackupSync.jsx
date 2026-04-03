import React, { useState, useEffect } from 'react';
import { Database, DownloadCloud, UploadCloud, AlertTriangle, Cloud, Zap, HardDrive, BarChart2 } from 'lucide-react';
import { useBackupSync } from '../hooks/useBackupSync';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { StorageService } from '../services/api/storage';

export default function BackupSync() {
  const { user } = useAuth();
  const { state, actions } = useBackupSync();
  const { settings, syncing, localCloudInt, localCloudTime, localWebhookUrl, localTitle1, localTitle2, localTitle3, fileInputRef, localBackupInt } = state;

  const {
    setLocalCloudInt,
    setLocalCloudTime,
    setLocalWebhookUrl,
    setLocalTitle1,
    setLocalTitle2,
    setLocalTitle3,
    applyAutoCloud,
    applyAutoCloudTime,
    applyCustomTitle,
    applyWebhookUrl,
    testWebhook,
    manualSync,
    handlePullCloud,
    handleBackup,
    handleRestoreClick,
    handleFileChange
  } = actions;

  const [localStats, setLocalStats] = useState({ sizeKB: 0, products: 0, orders: 0 });

  useEffect(() => {
    StorageService.getAll().then(data => {
       const sizeBytes = JSON.stringify(data).length;
       setLocalStats({
          sizeKB: (sizeBytes / 1024).toFixed(1),
          products: data.products?.length || 0,
          orders: data.posOrders?.length || 0
       });
    });
  }, [settings?.lastCloudSyncTime]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  if (!settings) return null;

  return (
    <div className="glass-panel" style={{ padding: 'clamp(16px, 3vw, 24px)', margin: '0 auto', maxWidth: 1000 }}>
      {/* Header */}
      <h2 style={{ marginBottom: 24, color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Database size={28} color="var(--primary)" /> Trung Tâm Đồng Bộ & Sao Lưu
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: 24 }}>
        Toàn bộ dữ liệu của Xóm Gà POPPY được lưu trữ siêu tốc độ tại máy tính này. Tại đây, bạn có thể thiết lập đẩy hệ thống lên Đám Mây ngầm (Google Drive, Dropbox qua Webhook) hoặc kết xuất File cứng thủ công.
      </p>

      {/* DASHBOARD GIÁM SÁT DUNG LƯỢNG */}
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
         <BarChart2 size={20} color="#64748b" /> Bộ Chỉ Huy Giám Sát Dữ Liệu
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
         {/* LOCAL */}
         <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
               <div style={{ padding: '8px', background: '#E2E8F0', borderRadius: '8px' }}><HardDrive size={18} color="#475569" /></div>
               <div style={{ fontWeight: 600, color: '#334155' }}>Ổ Đĩa Local (Web)</div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{localStats.sizeKB} KB</div>
            <div style={{ fontSize: '13px', color: '#64748B' }}>Chi tiết: {localStats.orders} Đơn hàng, {localStats.products} Món ăn</div>
         </div>

         {/* FIREBASE */}
         <div style={{ padding: '16px', background: '#F0F9FF', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
               <div style={{ padding: '8px', background: '#E0F2FE', borderRadius: '8px' }}><Cloud size={18} color="#0284C7" /></div>
               <div style={{ fontWeight: 600, color: '#0369A1' }}>Firebase Đám Mây</div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0284C7', marginBottom: '4px' }}>
               {settings.lastCloudSyncSize ? (settings.lastCloudSyncSize / 1024).toFixed(1) + ' KB' : 'Chưa rõ'}
            </div>
            <div style={{ fontSize: '13px', color: '#0ea5e9' }}>
               Cập nhật lần cuối: {settings.lastCloudSyncTime ? new Date(settings.lastCloudSyncTime).toLocaleTimeString('vi-VN') : '--:--'}
            </div>
         </div>

         {/* DROPBOX / WEBHkOOK */}
         <div style={{ padding: '16px', background: '#FEFCE8', borderRadius: '12px', border: '1px solid #FEF08A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
               <div style={{ padding: '8px', background: '#FEF9C3', borderRadius: '8px' }}><Zap size={18} color="#D97706" /></div>
               <div style={{ fontWeight: 600, color: '#B45309' }}>Kho Lưu Trữ Độc Lập</div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#D97706', marginBottom: '4px' }}>
               {settings.lastWebhookSyncSize ? (settings.lastWebhookSyncSize / 1024).toFixed(1) + ' KB' : 'Chưa rõ'}
            </div>
            <div style={{ fontSize: '13px', color: '#d97706' }}>
               Chuyến hàng cuối: {settings.lastWebhookSync ? new Date(settings.lastWebhookSync).toLocaleString('vi-VN') : 'Chưa từng gửi'}
            </div>
         </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Chế độ Developer Mode - Kéo Dữ Liệu Thực Tế */}
        {import.meta.env.DEV && (
          <div style={{ padding: 'clamp(16px, 3vw, 20px)', border: '2px solid #059669', borderRadius: '16px', background: '#ECFDF5', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px dashed #6EE7B7', paddingBottom: '16px' }}>
              <div style={{ padding: '8px', background: '#059669', borderRadius: '8px' }}>
                 <Database size={24} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#065F46', margin: 0, padding: '4px' }}>Developer Mode: Lấy Dữ Liệu Thực Tế (Prod)</h3>
                <p style={{ fontSize: '13px', color: '#047857', margin: '4px 0 0 0', paddingLeft: '4px' }}>Chức năng này chỉ xuất hiện khi chạy bằng Dev Server. Dùng để lấy toàn bộ dữ liệu đang chạy thực tế trên Online về máy mổ xẻ.</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={actions.handlePullProdCloud} disabled={syncing} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 32px', borderColor: '#059669', color: '#059669', background: 'white', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.1)' }}>
                <DownloadCloud size={32} />
                <span style={{ fontWeight: 800, fontSize: '16px' }}>{syncing ? 'Đang Clone Dữ Liệu...' : 'Kéo Dữ Liệu Từ Online Về Máy (Ghi đè Local)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Đồng Bộ Đám Mây API */}
        <div style={{ padding: 'clamp(16px, 3vw, 20px)', border: '1px solid #BAE6FD', borderRadius: '16px', background: '#F0F9FF', position: 'relative', overflow: 'hidden' }}>
          {import.meta.env.DEV && (
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '6px', background: '#EF4444', color: 'white', textAlign: 'center', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', zIndex: 10 }}>
               CẢNH BÁO MÔI TRƯỜNG DEV: BỘ ĐỒNG BỘ NÀY ĐANG TRỎ VÀO [store_data_dev]. KHÔNG ẢNH HƯỞNG ĐẾN DATA ONLINE!
             </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: import.meta.env.DEV ? '24px' : '0' }}>
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cloud size={24} color="#0284C7" />
              <input
                value={localTitle1}
                onChange={e => setLocalTitle1(e.target.value)}
                onBlur={() => applyCustomTitle('customBackupTitle1', localTitle1)}
                style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', background: 'transparent', border: '1px solid transparent', borderBottom: '1px dashed #93C5FD', outline: 'none', width: '100%', maxWidth: '400px', padding: '4px' }}
                title="Sửa tên ghi chú"
              />
            </div>
          </div>
          <p style={{ color: '#334155', fontSize: '14px', lineHeight: 1.5, marginTop: '12px' }}>
            Hệ thống ưu tiên lưu cục bộ siêu tốc dưới nền. Việc đẩy dữ liệu lên Đám Mây hỗ trợ chế độ tự động định kỳ, trong khi việc Tải dữ liệu về luôn ở chế độ <strong style={{ color: '#0284C7', fontWeight: 600 }}>Thủ công 100%</strong> để tránh vô ý ghi đè.
          </p>

          <div style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #E0F2FE', marginBottom: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#0F172A' }}>Lịch Tự Động Lưu Đè Đám Mây</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Tiến trình tự động đẩy dữ liệu cục bộ cập nhật lên Đám mây.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select className="form-input" value={localCloudInt} onChange={e => setLocalCloudInt(e.target.value)} style={{ width: '200px', background: 'white' }}>
                      <option value="none">Tắt (Thủ công)</option>
                      <option value="hourly">Mỗi giờ 1 lần</option>
                      <option value="halfday">Mỗi 12 tiếng</option>
                      <option value="daily">Mỗi ngày 1 lần</option>
                  </select>
                  <button className="btn btn-primary" onClick={applyAutoCloud} disabled={localCloudInt === settings.autoCloudSyncInterval} style={{ padding: '8px 16px', fontWeight: 600 }}>Lưu Cài Đặt</button>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #BAE6FD' }}>
                <div style={{ background: settings.lastCloudSyncTime ? '#10B981' : '#EF4444', width: '10px', height: '10px', borderRadius: '50%' }} />
                <span style={{ fontSize: '14px', color: '#64748B' }}>Lần đồng bộ ngầm gần nhất:</span>
                {settings.lastCloudSyncTime ? (
                  <strong style={{ color: '#10B981' }}>{new Date(settings.lastCloudSyncTime).toLocaleString('vi-VN')}</strong>
                ) : (
                  <strong style={{ color: '#EF4444' }}>Chưa có lần lưu tự động nào</strong>
                )}
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px dashed #BAE6FD', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
              <button className="btn btn-outline" onClick={handlePullCloud} disabled={syncing} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', borderColor: '#0284C7', color: '#0284C7', background: 'white', borderRadius: '12px' }}>
                <DownloadCloud size={32}/>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>{syncing ? 'Đang Tải...' : 'Tải Dữ Liệu Từ Đám Mây'}</span>
              </button>
              <button className="btn btn-primary" onClick={manualSync} disabled={syncing} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', borderRadius: '12px' }}>
                <UploadCloud size={32}/> 
                <span style={{ fontWeight: 600, fontSize: '15px' }}>{syncing ? 'Đang Tải...' : 'Lưu Đè Lên Đám Mây'}</span>
              </button>
            </div>
        </div>
        
        {/* Tự Động Hóa Đám Mây Webhook */}
        <div style={{ padding: 'clamp(16px, 3vw, 20px)', border: '1px solid #FEF08A', borderRadius: '16px', background: '#FEFCE8', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden' }}>
          {import.meta.env.DEV && (
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '6px', background: '#EF4444', color: 'white', textAlign: 'center', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', zIndex: 10 }}>
               CẢNH BÁO MÔI TRƯỜNG DEV: LUỒNG WEBHOOK BỊ KHÓA ĐỂ TRÁNH ĐẨY DATA NHÁP LÊN KHO CHÍNH!
             </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px dashed #FDE047', paddingBottom: '16px', marginTop: import.meta.env.DEV ? '24px' : '0' }}>
            <div style={{ padding: '8px', background: '#FEF9C3', borderRadius: '8px' }}>
               <Zap size={24} color="#D97706" />
            </div>
            <div style={{ flex: 1 }}>
              <input
                value={localTitle2}
                onChange={e => setLocalTitle2(e.target.value)}
                onBlur={() => applyCustomTitle('customBackupTitle2', localTitle2)}
                style={{ fontSize: '18px', fontWeight: 600, color: '#92400E', background: 'transparent', border: '1px solid transparent', borderBottom: '1px dashed #FCD34D', outline: 'none', width: '100%', maxWidth: '400px', padding: '4px' }}
                title="Sửa tên ghi chú"
              />
              <p style={{ fontSize: '13px', color: '#B45309', margin: '4px 0 0 0', paddingLeft: '4px' }}>Kết nối với Webhook để gửi File JSON lên kho lưu trữ ngoài.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', background: 'white', border: '1px solid #FEF08A', padding: '16px', borderRadius: '12px' }}>
             <div style={{ flex: '1 1 300px' }}>
               <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Đường dẫn Webhook (URL)</label>
               <input 
                  type="url"
                  className="form-input"
                  placeholder="https://hook.eu1.make.com/..."
                  value={localWebhookUrl}
                  onChange={(e) => setLocalWebhookUrl(e.target.value)}
                  style={{ width: '100%', background: 'white' }}
                />
             </div>
             <div style={{ display: 'flex', alignItems: 'flex-end' }}>
               <button className="btn btn-primary" onClick={applyWebhookUrl} disabled={localWebhookUrl === (settings.webhookUrl || '')}>
                 Lưu Webhook
               </button>
             </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', background: 'white', border: '1px solid #FEF08A', padding: '16px', borderRadius: '12px' }}>
             <div>
               <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#92400E' }}>Chu Kỳ Tự Động (Khi đang mở máy)</h4>
               <p style={{ margin: 0, fontSize: '13px', color: '#B45309' }}>Dữ liệu không thể gửi đi nếu máy tính bị tắt nguồn. Hãy hẹn giờ giãn cách lúc quán đang hoạt động.</p>
             </div>
             
             <div style={{ display: 'flex', gap: '8px' }}>
                <select className="form-input" value={localCloudTime} onChange={e => setLocalCloudTime(e.target.value)} style={{ width: '180px', background: 'white' }}>
                    <option value="none">Tắt (Chỉ ấn tay)</option>
                    <option value="1h">Mỗi 1 tiếng 1 lần</option>
                    <option value="2h">Mỗi 2 tiếng 1 lần</option>
                    <option value="3h">Mỗi 3 tiếng 1 lần</option>
                    <option value="4h">Mỗi 4 tiếng 1 lần</option>
                    <option value="12h">Mỗi 12 tiếng 1 lần</option>
                </select>
                <button className="btn btn-primary" onClick={applyAutoCloudTime} disabled={localCloudTime === settings.autoCloudSyncTime}>
                  Lưu Chu Kỳ
                </button>
             </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: settings.lastWebhookSync ? '#10B981' : '#EF4444', width: '10px', height: '10px', borderRadius: '50%' }} />
                <span style={{ fontSize: '14px', color: '#64748B' }}>Lần gửi gần nhất:</span>
                {settings.lastWebhookSync ? (
                  <strong style={{ color: '#10B981', fontSize: '14px' }}>{new Date(settings.lastWebhookSync).toLocaleString('vi-VN')}</strong>
                ) : (
                  <strong style={{ color: '#EF4444', fontSize: '14px' }}>Chưa từng đồng bộ</strong>
                )}
             </div>
             <button className="btn btn-outline" onClick={testWebhook} style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center', borderColor: '#4F46E5', color: '#4F46E5' }}>
                <Cloud size={16} /> Thử Bắn Dữ Liệu Ngay
             </button>
          </div>
        </div>



        {/* Khôi phục & Sao lưu File Nội Bộ */}
        <div style={{ padding: 'clamp(16px, 3vw, 20px)', border: '1px solid #FECDD3', borderRadius: '16px', background: '#FFF1F2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px dashed #FDA4AF', paddingBottom: '16px' }}>
            <div style={{ padding: '8px', background: 'white', borderRadius: '8px' }}>
               <Database size={24} color="#E11D48" />
            </div>
            <div style={{ flex: 1 }}>
              <input
                value={localTitle3}
                onChange={e => setLocalTitle3(e.target.value)}
                onBlur={() => applyCustomTitle('customBackupTitle3', localTitle3)}
                style={{ fontSize: '18px', fontWeight: 600, color: '#9F1239', background: 'transparent', border: '1px solid transparent', borderBottom: '1px dashed #FDA4AF', outline: 'none', width: '100%', maxWidth: '400px', padding: '4px' }}
                title="Sửa tên ghi chú"
              />
              <p style={{ fontSize: '13px', color: '#BE123C', margin: '4px 0 0 0', paddingLeft: '4px' }}>Tải cấu trúc hệ thống về máy tính phòng hờ đứt cáp mạng hoặc chuyển máy mới.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', background: 'white', border: '1px solid #FECDD3', padding: '16px', borderRadius: '12px' }}>
             <div>
               <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#9F1239' }}>Lịch Tự Động Tải File Backup</h4>
               <p style={{ margin: 0, fontSize: '13px', color: '#BE123C' }}>Hệ thống sẽ tự động kích hoạt tải File định kỳ (Khi đang mở máy).</p>
             </div>
             
             <div style={{ display: 'flex', gap: '8px' }}>
                <select className="form-input" value={localBackupInt} onChange={e => actions.setLocalBackupInt(e.target.value)} style={{ width: '180px', background: 'white' }}>
                    <option value="none">Tắt (Thủ công)</option>
                    <option value="hourly">Mỗi 1 giờ 1 lần</option>
                    <option value="daily">Mỗi ngày 1 lần</option>
                    <option value="weekly">Mỗi tuần 1 lần</option>
                    <option value="monthly">Mỗi tháng 1 lần</option>
                </select>
                <button className="btn btn-primary" onClick={actions.applyAutoBackup} disabled={localBackupInt === settings.autoBackupInterval}>
                  Lưu Lịch Trình
                </button>
             </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-4px', paddingLeft: '4px' }}>
              <div style={{ background: settings.lastBackupTime ? '#10B981' : '#EF4444', width: '10px', height: '10px', borderRadius: '50%' }} />
              <span style={{ fontSize: '14px', color: '#64748B' }}>Trạng thái bảo vệ:</span>
              {settings.lastBackupTime ? (
                <strong style={{ color: '#10B981', fontSize: '14px' }}>
                  Bản lưu định kỳ gần nhất: {new Date(settings.lastBackupTime).toLocaleString('vi-VN')}
                </strong>
              ) : (
                <strong style={{ color: '#EF4444', fontSize: '14px' }}>Chưa từng tự động xuất bản sao lưu nào</strong>
              )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
            <button className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', borderColor: '#E11D48', color: '#E11D48', background: 'white' }} onClick={handleBackup}>
              <DownloadCloud size={32} />
              <span style={{ fontWeight: 600 }}>Tải Bản Sao Lưu (.json)</span>
            </button>

            <button className="btn btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', borderColor: '#4C1D95', color: '#4C1D95', background: '#F5F3FF' }} onClick={handleRestoreClick}>
              <UploadCloud size={32} />
              <span style={{ fontWeight: 600 }}>Phục Hồi Dữ Liệu Lên Lại</span>
              <input type="file" accept=".json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            </button>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', background: '#FEF2F2', borderRadius: '12px', borderLeft: '4px solid #EF4444' }}>
            <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#991B1B', lineHeight: 1.5 }}>
              <strong>THẬN TRỌNG TỐI ĐA:</strong> Việc chọn <strong>"Phục Hồi"</strong> sẽ XÓA SẠCH toàn bộ đơn hàng, nhân viên và doanh thu hiện tại của máy và GHI ĐÈ bằng dữ liệu từ File JSON cũ. Tuyệt đối không bấm chơi hoặc cho nhân viên truy cập trang này.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
