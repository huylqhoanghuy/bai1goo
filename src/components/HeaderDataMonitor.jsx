import React, { useState, useEffect } from 'react';
import { Database, Cloud, Zap } from 'lucide-react';
import { StorageService } from '../services/api/storage';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../context/AuthContext';

export default function HeaderDataMonitor() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [localSizeKB, setLocalSizeKB] = useState(0);

  // Chỉ hiển thị cho ADMIN
  if (user?.role !== 'ADMIN') return null;

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
       StorageService.getAll().then(data => {
          if (!isMounted) return;
          const sizeBytes = JSON.stringify(data).length;
          setLocalSizeKB((sizeBytes / 1024).toFixed(1));
       });
    }, 100);
    return () => { isMounted = false; };
  }, [settings?.lastCloudSyncTime, settings?.lastWebhookSync]);

  const cloudSize = settings?.lastCloudSyncSize ? (settings.lastCloudSyncSize / 1024).toFixed(1) : 0;
  const webhookSize = settings?.lastWebhookSyncSize ? (settings.lastWebhookSyncSize / 1024).toFixed(1) : 0;

  const isCloudSynced = cloudSize && Math.abs(parseFloat(localSizeKB) - parseFloat(cloudSize)) < 10;
  
  return (
    <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-color)', border: '1px solid var(--surface-border)', padding: '4px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
       <style>
         {`
           @keyframes pulseData {
             0%, 100% { opacity: 1; transform: scale(1); }
             50% { opacity: 0.7; transform: scale(0.95); }
           }
           @keyframes floatCloud {
             0%, 100% { transform: translateY(0px) scale(1.05); }
             50% { transform: translateY(-2px) scale(1); }
           }
           @keyframes flashZap {
             0%, 100% { opacity: 1; transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 2px rgba(250, 204, 21, 0.5)); }
             10% { opacity: 0.5; filter: drop-shadow(0 0 0px transparent); }
             20% { opacity: 1; filter: drop-shadow(0 0 4px rgba(250, 204, 21, 0.8)); transform: rotate(5deg) scale(1.1); }
             30% { opacity: 0.8; transform: rotate(0deg) scale(1); }
           }
           .anim-data { animation: pulseData 3s ease-in-out infinite; }
           .anim-cloud { animation: floatCloud 4s ease-in-out infinite; }
           .anim-zap { animation: flashZap 5s infinite; }
         `}
       </style>
       
       {/* Máy bộ: Đổi thành Database cho dễ hiểu đĩa quay/nhấp nháy */}
       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '8px', background: '#F8FAFC', color: '#475569' }} title="Dung lượng trạm Máy Bộ (Local)">
         <Database size={14} className="anim-data" color="#64748B" /> {localSizeKB} KB
       </div>

       {/* Đám mây Firebase: Thêm hiệu ứng trôi nổi nhẹ */}
       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '8px', background: isCloudSynced ? '#F0FDF4' : '#F0F9FF', color: isCloudSynced ? '#15803D' : '#0369A1' }} title="Dung lượng trên Đám Mây Firebase">
         <Cloud size={14} className="anim-cloud" color={isCloudSynced ? "#15803D" : "#0284C7"} /> 
         {cloudSize ? `${cloudSize} KB` : 'Đang đo...'}
       </div>

       {/* Kho lưu trữ 3 (Webhook): Tia sét chớp loé */}
       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '8px', background: '#FEFCE8', color: '#B45309' }} title="Dung lượng Đám Mây 2 (Dropbox/Make)">
         <Zap size={14} className={webhookSize ? "anim-zap" : ""} color={webhookSize ? "#EAB308" : "#94A3B8"} /> 
         {webhookSize ? `${webhookSize} KB` : 'Off'}
       </div>
    </div>
  );
}
