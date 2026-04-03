import React from 'react';
import { PackageOpen, ShoppingCart, Calculator, BarChart3, ArrowRight, ArrowDown } from 'lucide-react';

export default function SystemArchitecture() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '32px', position: 'relative' }}>
      <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
         <BarChart3 size={20} color="var(--primary)" /> Sơ Đồ Kiến Trúc Hệ Sinh Thái Poppy POS
      </h3>

      <div style={{ marginTop: '40px', padding: '24px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', position: 'relative', overflow: 'hidden' }}>
         <svg style={{ position: 'absolute', top: 0, right: 0, opacity: 0.05, width: '300px', height: '300px' }} viewBox="0 0 100 100">
             <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="white" />
         </svg>
         
         <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800, background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
               MINDMAP LUỒNG DỮ LIỆU & THAO TÁC HỆ THỐNG
            </h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Sơ đồ luân chuyển Dữ Liệu Tồn Kho, Doanh Thu và Kế Toán ERP</p>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
            
            {/* TẦNG 1: Đối tác & Mua hàng */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', width: '100%' }}>
               <div style={{ padding: '16px 20px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '12px', textAlign: 'center', width: '200px' }}>
                  <PackageOpen size={24} color="#f43f5e" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#f43f5e' }}>NHÀ CUNG CẤP</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Cung cấp NVL & Cấp Nợ</div>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, background: '#334155', padding: '4px 8px', borderRadius: '4px', zIndex: 2 }}>Tạo Phiếu PO</div>
                  <ArrowRight size={20} style={{ margin: '4px 0', marginLeft: '-15px', marginRight: '-15px', zIndex: 1 }} />
               </div>

               <div style={{ padding: '16px 20px', background: 'rgba(244, 63, 94, 0.2)', border: '2px solid rgba(244, 63, 94, 0.5)', borderRadius: '12px', textAlign: 'center', width: '240px', boxShadow: '0 0 15px rgba(244,63,94,0.3)' }}>
                  <PackageOpen size={24} color="#f43f5e" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#f8fafc' }}>KHO NVL & VẬT TƯ</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>Ghi nhận Tồn Kho & Update Cost</div>
               </div>
            </div>

            {/* Mũi tên dọc trung tâm (Từ Kho xuống Bán hàng) */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', paddingRight: 'calc(50% - 240px/2)' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', height: '60px', position: 'relative' }}>
                  <div style={{ width: '2px', height: '100%', borderLeft: 'dashed 2px rgba(255,255,255,0.2)' }}></div>
                  <div style={{ fontSize: '11px', fontWeight: 600, background: '#1e293b', padding: '4px 8px', borderRadius: '4px', position: 'absolute', top: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>Trừ hao NVL (BOM)</div>
                  <ArrowDown size={20} style={{ marginTop: '-10px', marginLeft: '-2px' }} />
               </div>
            </div>

            {/* TẦNG 2: Bán Hàng */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', width: '100%' }}>
               <div style={{ padding: '16px 20px', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '12px', textAlign: 'center', width: '200px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
                     <span style={{ fontSize: '11px', padding: '2px 6px', background: '#eab308', borderRadius: '4px', color:'black', fontWeight:600 }}>Quầy</span>
                     <span style={{ fontSize: '11px', padding: '2px 6px', background: '#ea580c', borderRadius: '4px', color:'white', fontWeight:600 }}>Shopee</span>
                     <span style={{ fontSize: '11px', padding: '2px 6px', background: '#16a34a', borderRadius: '4px', color:'white', fontWeight:600 }}>Grab</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#38bdf8' }}>KÊNH BÁN HÀNG</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Nguồn phát sinh giao dịch</div>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, background: '#334155', padding: '4px 8px', borderRadius: '4px', zIndex: 2 }}>Tạo Đơn (Order)</div>
                  <ArrowRight size={20} style={{ margin: '4px 0', marginLeft: '-15px', marginRight: '-15px', zIndex: 1 }} />
               </div>

               <div style={{ padding: '16px 20px', background: 'rgba(14, 165, 233, 0.2)', border: '2px solid rgba(14, 165, 233, 0.5)', borderRadius: '12px', textAlign: 'center', width: '240px', boxShadow: '0 0 15px rgba(14,165,233,0.3)' }}>
                  <ShoppingCart size={24} color="#38bdf8" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#f8fafc' }}>HỆ THỐNG POS</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>Ghi nhận Doanh Thu & Giá Vốn</div>
               </div>
            </div>

            {/* Mũi tên dọc trung tâm (Từ Kho & POS xuống Sổ Quỹ) */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', paddingRight: 'calc(50% - 240px/2)' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', height: '60px', position: 'relative' }}>
                  <div style={{ width: '2px', height: '100%', borderLeft: 'dashed 2px rgba(255,255,255,0.2)' }}></div>
                  <div style={{ fontSize: '11px', fontWeight: 600, background: '#1e293b', padding: '4px 8px', borderRadius: '4px', position: 'absolute', top: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>Kết chuyển Kế toán</div>
                  <ArrowDown size={20} style={{ marginTop: '-10px', marginLeft: '-2px' }} />
               </div>
            </div>

            {/* TẦNG 3: Kế Toán & Dòng Tiền */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', width: '100%' }}>
               <div style={{ padding: '16px 20px', background: 'rgba(34, 197, 94, 0.2)', border: '2px solid rgba(34, 197, 94, 0.5)', borderRadius: '12px', textAlign: 'center', width: '300px', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}>
                  <Calculator size={24} color="#4ade80" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#f8fafc' }}>KẾ TOÁN & SỔ QUỸ KÉP</div>
                  <div style={{ fontSize: '11px', color: '#bbf7d0', marginTop: '4px' }}>Quản lý Ví Ngân Hàng, Tiền Mặt & Số Dư</div>
               </div>
            </div>

            <div style={{ height: '40px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '2px', height: '100%', borderLeft: 'solid 2px rgba(255,255,255,0.2)' }}></div>
            </div>

            {/* TẦNG 4: Đầu ra Báo Cáo */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
               <div style={{ padding: '12px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '12px', textAlign: 'center', width: '160px' }}>
                  <BarChart3 size={20} color="#eab308" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#fde047' }}>BÁO CÁO K.Q.K.D</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>Tổng hợp P&L & Lãi Lỗ</div>
               </div>
               <div style={{ padding: '12px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '12px', textAlign: 'center', width: '160px' }}>
                  <PackageOpen size={20} color="#eab308" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#fde047' }}>PHÂN TÍCH TỒN</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>Biến động vốn lưu động</div>
               </div>
               <div style={{ padding: '12px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '12px', textAlign: 'center', width: '160px' }}>
                  <Calculator size={20} color="#eab308" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#fde047' }}>BÁO CÁO CÔNG NỢ</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>Phải thu & Phải trả</div>
               </div>
            </div>

         </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', margin: '32px 0', fontSize: '14px', lineHeight: 1.6 }}>
        Sơ đồ trên thể hiện luồng luân chuyển dữ liệu lõi giữa 4 phân hệ lớn: Vận hành Kho, Bán Hàng POS, Kế Toán Dòng Tiền, và Phân Tích Báo Cáo. Hệ thống tuân thủ nguyên lý ERP, bất kỳ thay đổi nào từ Kho và Bán hàng đều tự động đồng bộ sang Kế Toán.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', position: 'relative' }}>
        
        {/* Phân hệ KHO */}
        <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '16px', padding: '20px' }}>
           <h4 style={{ color: '#e11d48', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
             <PackageOpen size={18} /> Quản Lý Kho & Cung Ứng
           </h4>
           <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-primary)', fontSize: '13px', lineHeight: 2 }}>
             <li><b>Nhà Cung Cấp:</b> Quản lý đối tác</li>
             <li><b>Phiếu Nhập (PO):</b> Nhập kho, định giá lô hàng</li>
             <li><b>Nguyên Liệu:</b> Quản lý Tồn kho & giá vốn</li>
             <li><b>Kiểm kê (Mới):</b> Sinh bút toán hao hụt tự động</li>
           </ul>
        </div>

        {/* Phân hệ BÁN HÀNG */}
        <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '16px', padding: '20px' }}>
           <h4 style={{ color: '#0284c7', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
             <ShoppingCart size={18} /> Hệ Thống Bán Hàng (POS)
           </h4>
           <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-primary)', fontSize: '13px', lineHeight: 2 }}>
             <li><b>Menu Sản Phẩm:</b> Quản lý mặt hàng</li>
             <li><b>Công Thức (BOM):</b> Mối nối tự động hóa trừ kho</li>
             <li><b>Phân Bổ Kênh:</b> Shopee, Grab, Quầy</li>
             <li><b>Đơn Hàng (POS):</b> Ghi doanh thu, tạo công nợ</li>
           </ul>
        </div>

        {/* Phân hệ KẾ TOÁN */}
        <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '16px', padding: '20px' }}>
           <h4 style={{ color: '#16a34a', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Calculator size={18} /> Sổ Quỹ & Kế Toán
           </h4>
           <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-primary)', fontSize: '13px', lineHeight: 2 }}>
             <li><b>Ví Tiền:</b> Ngân hàng, Tiền mặt thực tế</li>
             <li><b>Sổ Nhật Ký (TXN):</b> Lưu vết thu/chi kép</li>
             <li><b>Công Nợ:</b> Phải thu Khách, Phải trả NCC</li>
             <li><b>Bút toán Hạch Toán:</b> Dữ liệu kế toán ảo không tác động tiền mặt</li>
           </ul>
        </div>

        {/* Phân hệ BÁO CÁO */}
        <div style={{ background: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: '16px', padding: '20px' }}>
           <h4 style={{ color: '#ca8a04', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
             <BarChart3 size={18} /> Báo Cáo Tài Chính
           </h4>
           <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-primary)', fontSize: '13px', lineHeight: 2 }}>
             <li><b>Bảng Cân Đối:</b> Cân Asset (Kho, Tiền) & Liability</li>
             <li><b>P&L (KQKD):</b> Lọc từ Dòng tiền, COGS để ra Lợi Nhuận</li>
             <li><b>Báo Cáo Margin:</b> Thu thập từ Đơn POS</li>
             <li><b>Báo Cáo Tồn:</b> Cảnh báo mâm kho tự động</li>
           </ul>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
         <h5 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Nguyên Lý Vận Hành Lõi (Data Flow)</h5>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ padding: '4px 8px', background: 'var(--primary)', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>Luồng Khấu Trừ Kho:</span>
                Đơn Hàng POS <ArrowRight size={14} /> Chạy qua Công Thức <ArrowRight size={14} /> Trừ Tồn Kho tự động <ArrowRight size={14} /> Trả về Chi phí vốn (COGS).
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ padding: '4px 8px', background: '#16a34a', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>Luồng Dòng Tiền:</span>
                Nhập hàng / Bán hàng / Thu nợ <ArrowRight size={14} /> Ghi 1 Phiếu vào Sổ Nhật Ký Giao Dịch <ArrowRight size={14} /> Thay đổi Số dư Ví Tiền thực tế.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ padding: '4px 8px', background: '#e11d48', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>Luồng Kế Toán Đóng:</span>
                Nhân viên Sửa Kho thủ công do hao hụt <ArrowRight size={14} /> Hệ thống tự sinh Phiếu Hạch Toán ảo <ArrowRight size={14} /> Trừ Lợi Nhuận trên P&L (Nhưng không trừ Tiền Mặt).
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ padding: '4px 8px', background: '#d97706', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>Luồng Cách Ly Công Nợ:</span>
                Đơn Hàng đã bị Hủy hoặc Xóa Mềm <ArrowRight size={14} /> Bị Hệ thống từ chối lọc <ArrowRight size={14} /> Gạch tên khỏi Sổ Cảnh Báo Vay Nợ.
            </div>
         </div>
    </div>
    </div>
    </div>
  );
}
