import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Briefcase, 
  TrendingUp, 
  Wallet, 
  FileText, 
  Building2, 
  ShoppingBag, 
  DollarSign, 
  PieChart, 
  AlertCircle,
  Scale,
  Activity,
  ArrowRightLeft,
  BookOpen,
  Calendar,
  RefreshCcw,
  ChevronDown
} from 'lucide-react';
import { useFinancialStatements } from '../hooks/useFinancialStatements';
import SmartDateFilter from '../components/SmartDateFilter';

export default function FinancialStatements() {
  const { state } = useData();
  const { 
    activeTab, setActiveTab, 
    period, setPeriod, 
    filterDate, setFilterDate,
    isRefreshing, handleRefresh, 
    statements 
  } = useFinancialStatements(state);

  const {
    totalCash, totalInventoryValue, totalAssets, totalLiabilities, ownersEquity,
    totalGrossRevenue, totalNetRevenue, totalCOGS, cogsByCategory, grossProfit, operatingExpenses, netProfit,
    totalPlatformCommission, totalPlatformVAT, totalPlatformTNCN, platformFee,
    cashInflows, cashOutflows, operationsCashInflows, equityInflows, netCashFlow, filteredTransactions = []
  } = statements;




  // Helpers
  const formatVND = (val) => {
    if (val === undefined || val === null || isNaN(val)) return '0đ';
    const amount = Math.round(Math.abs(val)).toLocaleString('vi-VN') + 'đ';
    return val < 0 ? `- ${amount}` : amount;
  };

  const safeDiv = (num, den) => (den === 0 || isNaN(den) || !den) ? 0 : (num / den);

  // Chỉ tiêu tài chính KPI calculations
  const metrics = {
     currentRatio: safeDiv(totalAssets, totalLiabilities),
     quickRatio: safeDiv(totalCash, totalLiabilities),
     debtRatio: safeDiv(totalLiabilities, totalAssets),
     equityRatio: safeDiv(ownersEquity, totalAssets),
     inventoryRatio: safeDiv(totalInventoryValue, totalAssets),
     inventoryTurnover: safeDiv(totalCOGS, totalInventoryValue),
     assetTurnover: safeDiv(totalNetRevenue, totalAssets),
     ros: safeDiv(netProfit, totalNetRevenue),
     roa: safeDiv(netProfit, totalAssets),
     roe: safeDiv(netProfit, ownersEquity),
     cogsRatio: safeDiv(totalCOGS, totalNetRevenue),
     opexRatio: safeDiv(operatingExpenses, totalNetRevenue),
     platformRatio: safeDiv(totalPlatformCommission, totalGrossRevenue)
  };
  return (
    <div className="bctc-container" style={{ padding: '0 0 40px 0', maxWidth: '1000px', margin: '0 auto', opacity: isRefreshing ? 0.6 : 1, transition: '0.3s' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
         <div>
           <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.5px' }}>
              <Briefcase size={32} color="var(--primary)" /> Báo Cáo Tài Chính (BCTC)
           </h2>
           <p className="hide-on-landscape" style={{ margin: '8px 0 0 0', fontSize: '15px', color: 'var(--text-secondary)' }}>
             Hệ thống Realtime truy xuất tự động dữ liệu từ Kênh Bán Hàng & Các Trọng Điểm Quỹ.
           </p>
         </div>

         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <SmartDateFilter 
                   filterDate={filterDate}
                   setFilterDate={setFilterDate}
                   datePreset={period}
                   setDatePreset={setPeriod}
                   align="right"
                />
            </div>
            
            <button onClick={handleRefresh} className="btn btn-primary table-feature-btn">
              <RefreshCcw size={16} className={isRefreshing ? 'spin-anim' : ''} />
              <span className="hide-on-mobile">Đồng Bộ Dữ Liệu</span>
            </button>
         </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="bctc-tabs" style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '2px solid var(--surface-border)', paddingBottom: '16px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button 
          onClick={() => setActiveTab('balance')}
          style={{ flex: 1, minWidth: '180px', background: activeTab === 'balance' ? 'var(--primary)' : 'var(--surface-color)', color: activeTab === 'balance' ? '#fff' : 'var(--text-primary)', border: 'none', padding: '16px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', boxShadow: activeTab === 'balance' ? '0 10px 15px -3px rgba(249, 115, 22, 0.3)' : 'none' }}>
          <Scale size={20} /> Cân Đối Kế Toán
        </button>
        <button 
          onClick={() => setActiveTab('income')}
          style={{ flex: 1, minWidth: '180px', background: activeTab === 'income' ? 'var(--primary)' : 'var(--surface-color)', color: activeTab === 'income' ? '#fff' : 'var(--text-primary)', border: 'none', padding: '16px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', boxShadow: activeTab === 'income' ? '0 10px 15px -3px rgba(249, 115, 22, 0.3)' : 'none' }}>
          <Activity size={20} /> KQKD (P&L)
        </button>
        <button 
          onClick={() => setActiveTab('cashflow')}
          style={{ flex: 1, minWidth: '180px', background: activeTab === 'cashflow' ? 'var(--primary)' : 'var(--surface-color)', color: activeTab === 'cashflow' ? '#fff' : 'var(--text-primary)', border: 'none', padding: '16px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', boxShadow: activeTab === 'cashflow' ? '0 10px 15px -3px rgba(249, 115, 22, 0.3)' : 'none' }}>
          <ArrowRightLeft size={20} /> Lưu Chuyển Tiền Tệ
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          style={{ flex: 1, minWidth: '180px', background: activeTab === 'notes' ? 'var(--primary)' : 'var(--surface-color)', color: activeTab === 'notes' ? '#fff' : 'var(--text-primary)', border: 'none', padding: '16px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', boxShadow: activeTab === 'notes' ? '0 10px 15px -3px rgba(249, 115, 22, 0.3)' : 'none' }}>
          <BookOpen size={20} /> Thuyết Minh
        </button>
        <button 
          onClick={() => setActiveTab('indicators')}
          style={{ flex: 1, minWidth: '180px', background: activeTab === 'indicators' ? 'var(--primary)' : 'var(--surface-color)', color: activeTab === 'indicators' ? '#fff' : 'var(--text-primary)', border: 'none', padding: '16px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', boxShadow: activeTab === 'indicators' ? '0 10px 15px -3px rgba(249, 115, 22, 0.3)' : 'none' }}>
          <PieChart size={20} /> Chỉ Tiêu BCTC
        </button>
      </div>

      {/* TAB CONTENT: BALANCE SHEET */}
      {activeTab === 'balance' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
          <div className="bctc-panel" style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <h3 className="bctc-panel-title" style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 800, textAlign: 'center', color: 'var(--text-primary)' }}>BẢNG CÂN ĐỐI KẾ TOÁN (BALANCE SHEET)</h3>
               
               <div className="dashboard-chart-grid-2" style={{ gap: '40px' }}>
                  {/* CỘT TÀI SẢN */}
                  <div>
                     <div className="bctc-row" style={{ borderBottom: '3px solid #0284c7', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0284c7' }}>I. TÀI SẢN (ASSETS)</h4>
                     </div>
                     
                     <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>1. Tiền Mặt & Ngân Hàng khả dụng</span>
                        <span style={{ fontWeight: 600 }}>{formatVND(totalCash)}</span>
                     </div>
                     <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>2. Giá trị Hàng Tồn Kho (Kho nguyên liệu)</span>
                        <span style={{ fontWeight: 600 }}>{formatVND(totalInventoryValue)}</span>
                     </div>
                     <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>3. Tài Sản Lưu Động Khác</span>
                        <span style={{ fontWeight: 600 }}>{formatVND(0)}</span>
                     </div>

                     <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '12px 16px', background: '#f0f9ff', borderRadius: '8px', fontWeight: 800, color: '#0284c7' }}>
                        <span>TỔNG TÀI SẢN</span>
                        <span>{formatVND(totalAssets)}</span>
                     </div>
                  </div>

                  {/* CỘT NGUỒN VỐN */}
                  <div>
                     <div className="bctc-row" style={{ borderBottom: '3px solid #dc2626', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#dc2626' }}>II. NGUỒN VỐN (LIABILITIES & EQUITY)</h4>
                     </div>

                     <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>1. Nợ Công Phải Trả (A/P NCC)</span>
                        <span style={{ fontWeight: 600, color: '#dc2626' }}>{formatVND(totalLiabilities)}</span>
                     </div>
                     <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>2. Nợ Vay (Ngân Hàng)</span>
                        <span style={{ fontWeight: 600 }}>{formatVND(0)}</span>
                     </div>
                     <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--surface-border)', paddingTop: '8px', marginTop: '8px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>3. Vốn Chủ Sở Hữu (Tài Sản Thuần)</span>
                        <span style={{ fontWeight: 700, color: '#16a34a' }}>{formatVND(ownersEquity)}</span>
                     </div>

                     <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '12px 16px', background: '#fef2f2', borderRadius: '8px', fontWeight: 800, color: '#dc2626' }}>
                        <span>TỔNG NGUỒN VỐN</span>
                        <span>{formatVND(totalLiabilities + ownersEquity)}</span>
                     </div>
                  </div>
               </div>
           </div>
        </div>
      )}

      {/* TAB CONTENT: INCOME STATEMENT */}
      {activeTab === 'income' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
           <div className="bctc-panel" style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <h3 className="bctc-panel-title" style={{ margin: '0 0 32px 0', fontSize: '20px', fontWeight: 800, textAlign: 'center', color: 'var(--text-primary)' }}>BÁO CÁO KẾT QUẢ HOẠT ĐỘNG KINH DOANH (P&L)</h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {/* DOANH THU */}
                  <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                     <span style={{ fontWeight: 700 }}>1. Doanh Thu Bán Hàng (Gross Revenue)</span>
                     <span style={{ fontWeight: 700, color: '#16a34a' }}>{formatVND(totalGrossRevenue)}</span>
                  </div>
                  
                  {/* CÁC KHOẢN GIẢM TRỪ */}
                  <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', color: 'var(--text-secondary)' }}>
                     <span>- Chiết khấu Nền tảng / Sàn Dịch vụ</span>
                     <span>- {formatVND(totalPlatformCommission)}</span>
                  </div>
                  <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', color: 'var(--text-secondary)' }}>
                     <span>- Thuế GTGT nộp hộ (3%)</span>
                     <span>- {formatVND(totalPlatformVAT)}</span>
                  </div>
                  <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', borderBottom: '1px dashed #f1f5f9', color: 'var(--text-secondary)' }}>
                     <span>- Thuế TNCN nộp hộ (1.5%)</span>
                     <span>- {formatVND(totalPlatformTNCN)}</span>
                  </div>

                  <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--surface-border)' }}>
                     <span style={{ fontWeight: 800, color: '#0ea5e9' }}>2. DOANH THU THUẦN (Net Revenue)</span>
                     <span style={{ fontWeight: 800 }}>{formatVND(totalNetRevenue)}</span>
                  </div>

                  {/* GIÁ VỐN */}
                  <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                     <span style={{ fontWeight: 700 }}>3. Giá Vốn Hàng Bán (COGS)</span>
                     <span style={{ fontWeight: 700, color: '#ef4444' }}>- {formatVND(totalCOGS)}</span>
                  </div>
                  {cogsByCategory && Object.keys(cogsByCategory).length > 0 && (
                     <div style={{ paddingBottom: '8px', background: '#f8fafc', borderRadius: '4px', margin: '4px 0 12px 0' }}>
                        {Object.entries(cogsByCategory).map(([cat, amount]) => (
                           <div key={cat} className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', color: 'var(--text-secondary)' }}>
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                 <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8', marginRight: '8px' }}/>
                                 {cat}
                              </span>
                              <span style={{ fontFamily: 'monospace' }}>{formatVND(amount)}</span>
                           </div>
                        ))}
                     </div>
                  )}
                  
                  {/* LỢI NHUẬN GỘP */}
                  <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--surface-border)' }}>
                     <span style={{ fontWeight: 800, color: '#ea580c' }}>4. LỢI NHUẬN GỘP (Gross Profit)</span>
                     <span style={{ fontWeight: 800 }}>{formatVND(grossProfit)}</span>
                  </div>

                  {/* CHI PHÍ HOẠT ĐỘNG */}
                  <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                     <span style={{ fontWeight: 700 }}>5. Chi Phí Hoạt Động Cố Định (OPEX)</span>
                     <span style={{ fontWeight: 700, color: '#ef4444' }}>- {formatVND(operatingExpenses)}</span>
                  </div>

                  {/* LỢI NHUẬN RÒNG */}
                  <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f0fdf4', borderRadius: '12px', marginTop: '16px', border: '1px solid #bcf0da' }}>
                     <span style={{ fontWeight: 800, color: '#16a34a' }}>6. LỢI NHUẬN RÒNG (NET PROFIT)</span>
                     <span style={{ fontWeight: 800, color: '#16a34a' }}>{formatVND(netProfit)}</span>
                  </div>
               </div>
           </div>
        </div>
      )}

      {/* TAB CONTENT: CASH FLOW */}
      {activeTab === 'cashflow' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
           <div className="bctc-panel" style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <h3 className="bctc-panel-title" style={{ margin: '0 0 32px 0', fontSize: '20px', fontWeight: 800, textAlign: 'center', color: 'var(--text-primary)' }}>BÁO CÁO LƯU CHUYỂN TIỀN TỆ (CASH FLOW)</h3>
               
               <div className="bctc-row" style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, color: '#16a34a' }}>I. DÒNG TIỀN VÀO (CASH INFLOWS)</div>
                  <div style={{ fontWeight: 800 }}>{formatVND(cashInflows)}</div>
               </div>
               <div className="bctc-sub-row" style={{ borderBottom: '1px dashed #f1f5f9', display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', color: 'var(--text-secondary)' }}>
                  <span>- Tiền thu từ HĐ bán hàng (Operations)</span>
                  <span>{formatVND(operationsCashInflows)}</span>
               </div>
               {equityInflows > 0 && (
                   <div className="bctc-sub-row" style={{ borderBottom: '1px dashed #f1f5f9', display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', color: 'var(--text-secondary)' }}>
                      <span>- Tiền góp vốn chủ sở hữu (Financing)</span>
                      <span>{formatVND(equityInflows)}</span>
                   </div>
               )}
               <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', color: 'var(--text-secondary)' }}>
                  <span>- Tiền thu nhập khác</span>
                  <span>{formatVND(Math.max(0, cashInflows - operationsCashInflows - equityInflows))}</span>
               </div>

               <div className="bctc-row" style={{ paddingTop: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, color: '#ef4444' }}>II. DÒNG TIỀN RA (CASH OUTFLOWS)</div>
                  <div style={{ fontWeight: 800 }}>{formatVND(cashOutflows)}</div>
               </div>
               <div className="bctc-sub-row" style={{ borderBottom: '1px dashed #f1f5f9', display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', color: 'var(--text-secondary)' }}>
                  <span>- Tiền chi trả kho NVL / Nhà cung cấp</span>
                  <span>{formatVND(filteredTransactions.filter(t=>t.type==='Chi' && t.note?.includes('nhập kho')).reduce((sum,t)=>sum+t.amount,0) || 0)}</span>
               </div>
               <div className="bctc-sub-row" style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '24px', color: 'var(--text-secondary)' }}>
                  <span>- Tiền chi phí hoạt động KDXD</span>
                  <span>{formatVND(operatingExpenses)}</span>
               </div>

               <div className="bctc-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: netCashFlow >= 0 ? '#f0fdf4' : '#fef2f2', borderRadius: '12px', marginTop: '16px', border: '1px solid', borderColor: netCashFlow >= 0 ? '#bcf0da' : '#fecaca' }}>
                  <span style={{ fontWeight: 800, color: netCashFlow >= 0 ? '#16a34a' : '#ef4444' }}>III. LƯU CHUYỂN TIỀN TỆ THUẦN</span>
                  <span style={{ fontWeight: 800, color: netCashFlow >= 0 ? '#16a34a' : '#ef4444' }}>{formatVND(netCashFlow)}</span>
               </div>
           </div>
        </div>
      )}

      {/* TAB CONTENT: FINANCIAL NOTES */}
      {activeTab === 'notes' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
           <div className="bctc-panel" style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <h3 className="bctc-panel-title" style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800, textAlign: 'center', color: '#1e293b', textTransform: 'uppercase' }}>BÁO CÁO CỔ ĐÔNG & CHỈ ĐẠO ĐIỀU HÀNH</h3>
               <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>Trích xuất theo chuẩn VAS/IFRS - Cảnh báo Real-time từ Trí Tuệ Nhân Tạo</p>
               
               <div style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                  <p style={{ fontSize: '16px', marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}><strong>Kính Gửi Hội Đồng Quản Trị & Ban Lãnh Đạo,</strong><br/>
                  Bản Thuyết Minh Báo Cáo Tài Chính (Financial Notes) dưới đây được trích xuất theo chuẩn kế toán quản trị chuyên sâu. Dữ liệu được tính toán tự động dựa trên giao dịch thực tế trên hệ thống Poppy POS.<br/>Để đảm bảo tính minh bạch và ra quyết định thần tốc, báo cáo sức khỏe doanh nghiệp được phân tích rạch ròi theo <strong>4 Trụ cột Vận Hành (C-Level Perspectives)</strong>. Yêu cầu các thành viên HĐQT đọc kỹ và thực thi chéo chỉ đạo liên quan.</p>

                  {/* 1. GÓC ĐỘ CFO (Tài Chính & Dòng Tiền) */}
                  <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '12px', marginBottom: '24px', borderLeft: '4px solid #0284c7', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                     <h4 style={{ margin: '0 0 16px 0', color: '#0284c7', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontWeight: 800 }}>1. Góc độ Giám Đốc Tài Chính (CFO): Cấu Trúc Vốn & Thanh Khoản</h4>
                     <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li style={{ marginBottom: '16px' }}>
                           <strong style={{ fontSize: '16px' }}>Hệ số Thanh toán Hiện hành (Current Ratio):</strong> <span style={{ fontSize: '18px', fontWeight: 800, color: totalLiabilities > 0 && (totalAssets/totalLiabilities) > 1.5 ? '#16a34a' : '#ef4444' }}>{(totalLiabilities > 0 ? (totalAssets / totalLiabilities) : (totalAssets > 0 ? 999 : 0)).toFixed(2)} lần.</span>
                           <span style={{ display: 'block', fontSize: '13px', color: '#475569', marginTop: '4px' }}><strong>[Công thức]:</strong> Tổng Tài Sản Lưu Động ({formatVND(totalAssets)}) ÷ Tổng Nợ Phải Trả Ngắn Hạn ({formatVND(totalLiabilities)})</span>
                           <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginTop: '8px', border: '1px solid #bae6fd' }}>
                               👉 <strong>Thuyết minh Phân tích:</strong> Hệ số này đo lường khả năng dùng tiền mặt và hàng tồn kho để trả ngay các khoản nợ nhà cung cấp đang treo. Mốc an toàn lý tưởng của ngành F&B là <strong>&gt; 1.5 lần</strong>. {
                                 totalAssets > (totalLiabilities * 1.5) 
                                 ? 'Hiện tại, doanh nghiệp đang có cấu trúc vốn cực kỳ an toàn. Lượng tiền và hàng hóa dồi dào, hoàn toàn miễn nhiễm với rủi ro vỡ nợ ngắn hạn. Có thể xem xét dùng tiền nhàn rỗi để nhập lô lớn lấy chiết khấu.' 
                                 : 'CẢNH BÁO: Hệ số đang dưới mức an toàn! Doanh nghiệp đang đối mặt với rủi ro mất thanh khoản. Tiền mặt không đủ để trả nợ nhà cung cấp. Yêu cầu GIẢM NGAY việc nhập hàng mới và đốc thúc bán hàng để thu tiền mặt.'
                               }
                           </div>
                        </li>
                        <li style={{ marginBottom: '16px' }}>
                           <strong style={{ fontSize: '16px' }}>Tỷ suất Sinh lời trên Vốn Chủ Sở Hữu (ROE):</strong> <span style={{ fontSize: '18px', fontWeight: 800, color: ownersEquity > 0 && (netProfit/ownersEquity) >= 0.15 ? '#16a34a' : '#f59e0b' }}>{ownersEquity > 0 ? ((netProfit / ownersEquity) * 100).toFixed(2) : 0}%.</span>
                           <span style={{ display: 'block', fontSize: '13px', color: '#475569', marginTop: '4px' }}><strong>[Công thức]:</strong> Lợi Nhuận Ròng ({formatVND(netProfit)}) ÷ Vốn Chủ Sở Hữu ({formatVND(ownersEquity)})</span>
                           <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginTop: '8px', border: '1px solid #bae6fd' }}>
                               👉 <strong>Thuyết minh Phân tích:</strong> Thể hiện 100 đồng vốn cổ đông bỏ vào quán đang đẻ ra bao nhiêu đồng tiền lãi. {
                                 ownersEquity > 0 && (netProfit/ownersEquity) >= 0.15 
                                 ? 'Hiệu quả sử dụng vốn của HĐQT đang RẤT TỐT (vượt xa mức lãi suất ngân hàng). Đề xuất giữ lại phần lợi nhuận chưa phân phối này (Retained Earnings) để tái đầu tư hoặc mở rộng quy mô (Scale-up) thay vì chia cổ tức tức thì.' 
                                 : 'Hiệu suất sinh lời đang nằm ở mức thấp (dưới kênh đầu tư rủi ro thấp). Tuyệt đối KHÔNG gọi thêm vốn mới hay mở rộng mặt bằng lúc này. Phải tập trung tối ưu hóa lợi nhuận trên mặt bằng hiện tại trước.'
                               }
                           </div>
                        </li>
                        <li>
                           <strong style={{ fontSize: '16px' }}>Đo lường Sức khỏe Ngân quỹ (Net Cash Flow):</strong> {netCashFlow >= 0 ? <span style={{color: '#16a34a', fontWeight:800, fontSize: '18px'}}>THẶNG DƯ {formatVND(netCashFlow)}</span> : <span style={{color: '#ef4444', fontWeight:800, fontSize: '18px'}}>BỊ BÀO MÒN {formatVND(netCashFlow)}</span>}
                           <span style={{ display: 'block', fontSize: '13px', color: '#475569', marginTop: '4px' }}><strong>[Công thức]:</strong> Tổng Dòng Tiền Vào ({formatVND(cashInflows)}) - Tổng Dòng Tiền Ra từ vận hành/nhập hàng ({formatVND(cashOutflows)})</span>
                           <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginTop: '8px', border: '1px solid #bae6fd' }}>
                               👉 <strong>Thuyết minh Phân tích:</strong> Lợi nhuận P&L chỉ là con số trên giấy, Cash Flow mới là máu của doanh nghiệp (Cash is King). {
                                 netCashFlow >= 0 
                                 ? 'Tuyệt vời. Dòng tiền thuần đang DƯƠNG. Máy tạo tiền từ Core Business đang vận hành trơn tru đủ tự nuôi hệ thống mà không cần bơm thêm máu từ bên ngoài.' 
                                 : 'CỰC KỲ NGUY HIỂM. Máu (tiền mặt) đang chảy ra khỏi doanh nghiệp nhanh hơn tốc độ bơm vào! Lợi nhuận có thể đang bị chôn vùi dưới dạng Hàng Tồn Kho hoặc Công Nợ Phải Thu. CFO cần siết chặt lệnh xuất kho và khóa chặt van chi tiêu rác (Burn-rate).'
                               }
                           </div>
                        </li>
                     </ul>
                  </div>

                  {/* 2. GÓC ĐỘ CMO (Doanh Thu & Kênh Bán) */}
                  <div style={{ background: '#fdf4ff', padding: '24px', borderRadius: '12px', marginBottom: '24px', borderLeft: '4px solid #d946ef', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                     <h4 style={{ margin: '0 0 16px 0', color: '#c026d3', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontWeight: 800 }}>2. Góc độ Giám Đốc Thương Mại (CMO): Biên Lợi Nhuận & Phí Sàn</h4>
                     <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li style={{ marginBottom: '16px' }}>
                           <strong style={{ fontSize: '16px' }}>Biên Lợi Nhuận Gộp (Gross Margin Ratio):</strong> <span style={{ fontSize: '18px', fontWeight: 800, color: totalNetRevenue > 0 && (grossProfit/totalNetRevenue) >= 0.5 ? '#16a34a' : '#ef4444' }}>{totalNetRevenue > 0 ? ((grossProfit/totalNetRevenue)*100).toFixed(2) : 0}%.</span>
                           <span style={{ display: 'block', fontSize: '13px', color: '#475569', marginTop: '4px' }}><strong>[Công thức]:</strong> Lợi Nhuận Gộp (Doanh thu - Giá Vốn: {formatVND(grossProfit)}) ÷ Doanh thu thuần ({formatVND(totalNetRevenue)})</span>
                           <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginTop: '8px', border: '1px solid #f5d0fe' }}>
                               👉 <strong>Thuyết minh Phân tích:</strong> Biên gộp là bộ đệm sinh tử để trang trải mọi chi phí tĩnh (Mặt bằng, nhân sự). Tiêu chuẩn ngành F&B bắt buộc Gross Margin phải từ <strong>50% - 70%</strong>. {
                                 totalNetRevenue > 0 && (grossProfit/totalNetRevenue) < 0.5 
                                 ? 'BÁO ĐỘNG ĐỎ! Biên gộp đang DƯỚI 50%. Có 3 nguyên nhân: (1) Giá cost nguyên liệu đầu vào đang quá đắt do quản trị Supplier kém. (2) Món ăn định giá sai (đang bán quá rẻ bù lỗ). (3) Quán đang vung tay chạy quá nhiều chương trình khuyến mãi/giảm giá trên món. YÊU CẦU CMO & BẾP TRƯỞNG LẬP TỨC NGỒI LẠI ĐIỀU CHỈNH PRICING!' 
                                 : 'Biên gộp khỏe, cấu trúc giá bán (Pricing Strategy) so với Food Cost đang được set-up chuẩn xác. Có biên độ linh hoạt để có thể dùng ngân sách chạy quảng cáo Marketing.'
                               }
                           </div>
                        </li>
                        <li>
                           <strong style={{ fontSize: '16px' }}>Tỷ lệ Ăn Mòn Nền Tảng (Platform Dependency Ratio):</strong> <span style={{ fontSize: '18px', fontWeight: 800, color: '#c026d3' }}>{totalGrossRevenue > 0 ? ((platformFee/totalGrossRevenue)*100).toFixed(2) : 0}%.</span>
                           <span style={{ display: 'block', fontSize: '13px', color: '#475569', marginTop: '4px' }}><strong>[Công thức]:</strong> Tổng Phí Dịch vụ & Thuế nộp hộ (Grab/Shopee: {formatVND(platformFee)}) ÷ Doanh thu gốc chưa chiết khấu ({formatVND(totalGrossRevenue)})</span>
                           <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginTop: '8px', border: '1px solid #f5d0fe' }}>
                               👉 <strong>Thuyết minh Phân tích:</strong> Đo lường hệ thống đang bị mất máu bao nhiêu % để "nuôi" các nền tảng thương mại điện tử. {
                                 totalGrossRevenue > 0 && (platformFee/totalGrossRevenue) >= 0.2 
                                 ? 'Chi phí duy trì kênh Online đang bòn rút TRÊN 20% tổng GTV! Mức độ lệ thuộc nền tảng quá cao. Chỉ đạo tối thượng cho CMO: Phải tung chiến dịch Local Marketing kéo tập khách đó qua Zalo, số Hotline hoặc chèn thư ngỏ (Bounce-back cards) vào túi hàng để chuyển họ thành khách mua Offline (Direct Orders).' 
                                 : 'Mức độ ảnh hưởng của nền tảng nằm trong giới hạn kiểm soát. Phân bổ đa kênh (Omnichannel) đang hoạt động ổn định và hài hòa giữa Online/Offline.'
                               }
                           </div>
                        </li>
                     </ul>
                  </div>

                  {/* 3. GÓC ĐỘ COO (Vận hành & Chi phí ẩn) */}
                  <div style={{ background: '#f0fdf4', padding: '24px', borderRadius: '12px', marginBottom: '24px', borderLeft: '4px solid #16a34a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                     <h4 style={{ margin: '0 0 16px 0', color: '#16a34a', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontWeight: 800 }}>3. Góc độ Giám Đốc Vận Hành (COO): Kiểm Soát Chi Phí Định Mức</h4>
                     <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li style={{ marginBottom: '16px' }}>
                           <strong style={{ fontSize: '16px' }}>Tỷ Trọng Gánh Nặng Định Phí (OPEX Burden Ratio):</strong> <span style={{ fontSize: '18px', fontWeight: 800, color: totalNetRevenue > 0 && (operatingExpenses/totalNetRevenue) > 0.3 ? '#ef4444' : '#16a34a' }}>{totalNetRevenue > 0 ? ((operatingExpenses/totalNetRevenue)*100).toFixed(2) : 0}%.</span>
                           <span style={{ display: 'block', fontSize: '13px', color: '#475569', marginTop: '4px' }}><strong>[Công thức]:</strong> Tổng Định Phí Hoạt Động (Tiền thuê mặt bằng, điện nước, nhân viên: {formatVND(operatingExpenses)}) ÷ Doanh thu thuần ({formatVND(totalNetRevenue)})</span>
                           <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginTop: '8px', border: '1px solid #bbf7d0' }}>
                               👉 <strong>Thuyết minh Phân tích:</strong> Định phí là "sát thủ tàng hình". Mốc tối đa cho phép là <strong>&lt; 30%</strong>. Chỉ số này phản ánh năng lực tối ưu quản trị tại cửa hàng của Cửa hàng trưởng / COO. {
                                 totalNetRevenue > 0 && (operatingExpenses/totalNetRevenue) > 0.3 
                                 ? 'NGUY HIỂM KÉP! OPEX ĐANG NUỐT RÉT LỢI NHUẬN GỘP. Chi phí cố định quá phình to so với sức kiếm tiền hiện hành. Chỉ đạo cấp tốc: COO lập tức kiểm tra lại bill điện chiếu sáng/điều hòa, xem xét cắt giảm giờ công nhân viên part-time ở các khung giờ thấp điểm chết (Idle hours), thương lượng lại giá mặt bằng/bảo vệ!' 
                                 : 'Định mức vận hành đang được thiết lập tinh gọn. Hệ thống Back-office đang không gây áp lực lên đôi vai của lực lượng Sales.'
                               }
                           </div>
                        </li>
                        <li>
                           <strong style={{ fontSize: '16px' }}>Biên Lợi Nhuận Ròng Hoạt Động (Net Profit Margin):</strong> <span style={{ fontSize: '18px', fontWeight: 800, color: totalNetRevenue > 0 && (netProfit/totalNetRevenue) > 0.1 ? '#16a34a' : '#f59e0b' }}>{totalNetRevenue > 0 ? ((netProfit/totalNetRevenue)*100).toFixed(2) : 0}%.</span>
                           <span style={{ display: 'block', fontSize: '13px', color: '#475569', marginTop: '4px' }}><strong>[Công thức]:</strong> Lãi ròng ({formatVND(netProfit)}) ÷ Doanh thu thuần ({formatVND(totalNetRevenue)})</span>
                           <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginTop: '8px', border: '1px solid #bbf7d0' }}>
                               👉 <strong>Thuyết minh Phân tích:</strong> Chốt chặn cuối cùng (Bottom Line). Sau khi thu 100 đồng vào túi, trả tiền gà, tiền lương, phí Grab, chủ đầu tư ĐƯỢC MANG VỀ RỜ đúng bao nhiêu đồng. Mốc vàng của F&B là <strong>&gt; 15%</strong>.  {
                                 totalNetRevenue > 0 && (netProfit/totalNetRevenue) < 0.1 
                                 ? 'Biết ròng QUÁ MỎNG (Dưới 10%). Nếu có thêm bất kỳ biến cố rủi ro hỏng hóc nguyên liệu nào, công ty sẽ rơi ngay vào vòng xoáy thua lỗ (Break-even trap). Phải nâng giá trị trung bình đơn (AOV) bằng cách Up-sale!' 
                                 : 'Biên ròng lý tưởng. Cấu trúc Unit-Economics của quán đã được chứng minh sinh lời vững vàng.'
                               }
                           </div>
                        </li>
                     </ul>
                  </div>

                  {/* 4. GÓC ĐỘ SUPPLY CHAIN (Bếp Trưởng & Kho) */}
                  <div style={{ background: '#fffbeb', padding: '24px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #f59e0b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                     <h4 style={{ margin: '0 0 16px 0', color: '#d97706', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontWeight: 800 }}>4. Góc độ Bếp Trưởng (Head Chef): Chuỗi Cung Cứng & Hàng Tồn (Inventory Rate)</h4>
                     <p style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
                        <strong>Tỷ trọng Vốn Chôn Chết trong Kho Lạnh: </strong>
                        <span style={{ fontWeight: 800, fontSize: '18px', color: totalAssets > 0 && (totalInventoryValue/totalAssets) > 0.25 ? '#ef4444' : '#16a34a' }}>{totalAssets > 0 ? ((totalInventoryValue/totalAssets)*100).toFixed(2) : 0}% </span> 
                        tổng tài sản cố định.
                     </p>
                     <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}><strong>[Công thức]:</strong> Tổng Giá Trị Kho Theo Định Mức ({formatVND(totalInventoryValue)}) ÷ Tổng Tài Sản ({formatVND(totalAssets)})</p>
                     
                     <div style={{ padding: '16px', background: '#fff', borderRadius: '8px', border: '1px solid #fde68a' }}>
                        <strong style={{ fontSize: '15px', color: '#b45309' }}>[Phân tích rủi ro hư hỏng Supply Chain của Ngành F&B]: Mức tồn kho tối ưu lý tưởng dao động từ 15% - 25%</strong>
                        <ul style={{ margin: '12px 0 0 0', paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                           <li style={{ marginBottom: '8px' }}><strong>Trạng thái Dưới 15%:</strong> Dấu hiệu đứt gãy cung ứng. Nguy cơ cháy hàng vào giờ cao điểm rất lớn. Phải trữ sẵn thêm nguyên liệu cơ bản có date xa.</li>
                           <li style={{ marginBottom: '8px' }}><strong>Trạng thái Từ 15% - 25%:</strong> {totalAssets > 0 && (totalInventoryValue/totalAssets) >= 0.15 && (totalInventoryValue/totalAssets) <= 0.25 ? <span style={{color:'#16a34a', fontWeight: 700}}>CHUẨN VỰC. Bếp trưởng đang gối đầu (Just-In-Time) nhập hàng một cách kỷ luật. Không mất tiền điện nuôi tủ đông dư thừa.</span> : 'Vùng An Toàn Vàng.'}</li>
                           <li><strong>Trạng thái Trên 25%:</strong> {totalAssets > 0 && (totalInventoryValue/totalAssets) > 0.25 ? <span style={{color:'#ef4444', fontWeight: 700}}>RÚT RUỘT KẾT QUẢ KINH DOANH. Dòng tiền đang đông cứng thành rau quả thịt trong tủ lạnh. Đối mặt rủi ro hết HSD (Spoilage Cost) cực cao. Mệnh lệnh cho Bếp Trưởng: KHÓA lệnh mua hàng tạm thời, tổ chức rà soát kho, tung ra các thực đơn Món Ngon Ngày Mai để đẩy nốt lượng nguyên liệu tồn đọng trong vòng 48h!</span> : 'Nguy cơ ôm hàng quá đà gây ứ đọng vốn và hao hụt tự nhiên.'}</li>
                        </ul>
                     </div>
                  </div>

                  <p style={{ marginTop: '32px', textAlign: 'center', fontStyle: 'italic', fontSize: '13px', color: 'var(--text-secondary)' }}>Bản Thuyết Minh Tự Động này được trích xuất theo nguyên lý Unit-Economics Realtime.<br/>Tuyệt đối Không Chia Sẻ (Confidential) dữ liệu này ra bên ngoài HĐQT và Cán Bộ Điều Hành.</p>
               </div>
           </div>
        </div>
      )}

      {/* TAB CONTENT: FINANCIAL INDICATORS */}
      {activeTab === 'indicators' && (
        <div style={{ animation: 'fadeIn 0.3s' }}>
           <div className="bctc-panel" style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid var(--surface-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <h3 className="bctc-panel-title" style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800, textAlign: 'center', color: 'var(--text-primary)', textTransform: 'uppercase' }}>CÁC CHỈ TIÊU PHÂN TÍCH BÁO CÁO TÀI CHÍNH</h3>
               <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>Hệ thống trích xuất và tính toán tự động dựa trên số liệu kinh doanh hiện hành</p>
               
                                                                           <div className="table-responsive" style={{ overflowX: 'auto', paddingBottom: '16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px', textAlign: 'left', minWidth: '940px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                               <th style={{ padding: '12px 10px', width: '40px', borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 800, color: '#334155' }}>STT</th>
                               <th style={{ padding: '12px 10px', borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0', fontWeight: 800, color: '#334155' }}>Chỉ tiêu & Cách tính</th>
                               <th style={{ padding: '12px 10px', width: '200px', borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 800, color: '#334155' }}>Kết Quả</th>
                               <th style={{ padding: '12px 10px', width: '100px', borderBottom: '2px solid #cbd5e1', borderRight: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 800, color: '#0284c7' }}>Khuyến Nghị</th>
                               <th style={{ padding: '12px 10px', borderBottom: '2px solid #cbd5e1', fontWeight: 800, color: '#334155' }}>Ý Nghĩa Báo Cáo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* NHÓM I */}
                            <tr style={{ background: '#f1f5f9' }}>
                               <td style={{ padding: '10px', textAlign: 'center', fontWeight: 800, borderBottom: '1px solid #e2e8f0' }}>I</td>
                               <td colSpan="4" style={{ padding: '10px', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Khả Năng Thanh Toán Đo Lường Rủi Ro</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>1</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Thanh toán hiện thời (Current Ratio)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Tổng Tài Sản / Tổng Nợ</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.currentRatio >= 1.5 ? 'var(--success)' : (metrics.currentRatio < 1 ? 'var(--danger)' : 'var(--warning)') }}>{metrics.currentRatio === 0 && totalLiabilities === 0 ? "Tuyệt đối an toàn" : metrics.currentRatio.toFixed(2)}</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#64748b', border: '1px solid #e2e8f0' }}>
                                       <span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalAssets)}</span><span style={{ margin: '0 4px', color: '#94a3b8' }}>/</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalLiabilities)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&gt;= 1.5 lần</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Theo dõi khả năng lấy Tài sản hiện có bán rã trả nợ tức thì.</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>2</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Thanh toán nhanh (Quick Ratio)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Tiền Mặt / Tổng Nợ</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.quickRatio >= 1 ? 'var(--success)' : 'var(--danger)' }}>{metrics.quickRatio === 0 && totalLiabilities === 0 ? "Tuyệt đối an toàn" : metrics.quickRatio.toFixed(2)}</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#64748b', border: '1px solid #e2e8f0' }}>
                                       <span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalCash)}</span><span style={{ margin: '0 4px', color: '#94a3b8' }}>/</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalLiabilities)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&gt;= 1.0 lần</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Mức độ thanh khoản cao nhất (chỉ dùng Tiền để trả nợ).</td>
                            </tr>

                            {/* NHÓM II */}
                            <tr style={{ background: '#f1f5f9' }}>
                               <td style={{ padding: '10px', textAlign: 'center', fontWeight: 800, borderBottom: '1px solid #e2e8f0' }}>II</td>
                               <td colSpan="4" style={{ padding: '10px', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Cơ Cấu Tài Sản Máy Móc</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>1</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Hệ số Nợ Vay (Debt Ratio)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Tổng Nợ / Tổng Tài Sản</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.debtRatio > 0.5 ? 'var(--danger)' : 'var(--text-primary)' }}>{(metrics.debtRatio * 100).toFixed(2)}%</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#fee2e2', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#991b1b', border: '1px solid #fca5a5' }}>
                                       <span style={{ fontWeight: 500 }}>{formatVND(totalLiabilities)}</span><span style={{ margin: '0 4px', color: '#f87171' }}>/</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalAssets)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&lt; 50%</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Tỷ trọng mua sắm nợ. Càng cao càng áp lực trả nợ.</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>2</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Hệ số Vốn Tự Cấp (Equity)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Vốn Chủ / Tổng Tài Sản</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px' }}>{(metrics.equityRatio * 100).toFixed(2)}%</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#dcfce7', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#166534', border: '1px solid #86efac' }}>
                                       <span style={{ fontWeight: 500 }}>{formatVND(ownersEquity)}</span><span style={{ margin: '0 4px', color: '#4ade80' }}>/</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalAssets)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&gt;= 50%</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Mức độ tự chủ kinh tế vững bền.</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>3</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Đọng Vốn Tồn Kho</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Tồn Kho / Tổng Tài Sản</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.inventoryRatio > 0.25 ? 'var(--danger)' : 'var(--text-primary)' }}>{(metrics.inventoryRatio * 100).toFixed(2)}%</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#fef9c3', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#854d0e', border: '1px solid #fde047' }}>
                                       <span style={{ fontWeight: 500 }}>{formatVND(totalInventoryValue)}</span><span style={{ margin: '0 4px', color: '#eab308' }}>/</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalAssets)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>15-25%</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Tỷ lệ càng cao vốn ngâm càng hẹp.</td>
                            </tr>

                            {/* NHÓM III */}
                            <tr style={{ background: '#f1f5f9' }}>
                               <td style={{ padding: '10px', textAlign: 'center', fontWeight: 800, borderBottom: '1px solid #e2e8f0' }}>III</td>
                               <td colSpan="4" style={{ padding: '10px', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Hiệu Suất Vận Hành Tối Ưu Nguồn Thu</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>1</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Tốc độ đẩy hàng (Vòng quay kho)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Giá Vốn / Tồn Kho</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px' }}>{metrics.inventoryTurnover.toFixed(2)} chu kỳ</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#64748b', border: '1px solid #e2e8f0' }}>
                                       <span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalCOGS)}</span><span style={{ margin: '0 4px', color: '#94a3b8' }}>/</span><span style={{ color: '#eab308', fontWeight: 500 }}>{formatVND(totalInventoryValue)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&gt; 4 lần</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Luân chuyển hàng nhanh tránh thiu ôi.</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>2</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Vắt Sức Tài Sản (Asset Turnover)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Doanh Thu / Tổng Tài Sản</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px' }}>{metrics.assetTurnover.toFixed(2)} vòng</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#64748b', border: '1px solid #e2e8f0' }}>
                                       <span style={{ color: '#0284c7', fontWeight: 500 }}>{formatVND(totalNetRevenue)}</span><span style={{ margin: '0 4px', color: '#94a3b8' }}>/</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalAssets)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&gt; 1.5 lần</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Năng suất ra tiền so với máy móc chi phí cố định.</td>
                            </tr>

                            {/* NHÓM IV */}
                            <tr style={{ background: '#f1f5f9' }}>
                               <td style={{ padding: '10px', textAlign: 'center', fontWeight: 800, borderBottom: '1px solid #e2e8f0' }}>IV</td>
                               <td colSpan="4" style={{ padding: '10px', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Đo Lường Tỷ Suất Sinh Lời Cuối Năm</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>1</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Lợi Nhuận Ròng Thuần (ROS)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Lợi Nhuận Ròng / Doanh Thu</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.ros >= 0.15 ? 'var(--success)' : (metrics.ros < 0 ? 'var(--danger)' : 'var(--text-primary)') }}>{(metrics.ros * 100).toFixed(2)}%</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#faf5ff', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#7e22ce', border: '1px solid #e9d5ff' }}>
                                       <span style={{ fontWeight: 500 }}>{formatVND(netProfit)}</span><span style={{ margin: '0 4px', color: '#c084fc' }}>/</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalNetRevenue)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&gt; 15%</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Thực lãi cầm về ví cá nhân. Dưới ngưỡng là đuối.</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>2</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Sinh Lãi Của Tài Sản (ROA)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Lợi Nhuận / Tổng Tài Sản</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.roa >= 0.1 ? 'var(--success)' : (metrics.roa < 0 ? 'var(--danger)' : 'var(--text-primary)') }}>{(metrics.roa * 100).toFixed(2)}%</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#faf5ff', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#7e22ce', border: '1px solid #e9d5ff' }}>
                                       <span style={{ fontWeight: 500 }}>{formatVND(netProfit)}</span><span style={{ margin: '0 4px', color: '#c084fc' }}>/</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalAssets)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&gt; 10%</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Máy móc có sinh ra được lãi để bù mòn khấu hao?</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>3</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Lần Nữ Cổ Đông Quán (ROE)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Lợi Nhuận / Vốn Chủ Cổ Đông</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.roe >= 0.15 ? 'var(--success)' : (metrics.roe < 0 ? 'var(--danger)' : 'var(--text-primary)') }}>{(metrics.roe * 100).toFixed(2)}%</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#faf5ff', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#7e22ce', border: '1px solid #e9d5ff' }}>
                                       <span style={{ fontWeight: 500 }}>{formatVND(netProfit)}</span><span style={{ margin: '0 4px', color: '#c084fc' }}>/</span><span style={{ color: '#22c55e', fontWeight: 500 }}>{formatVND(ownersEquity)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&gt; 15%</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>100đ tiền túi ném vô quán đẻ hơn hay gửi Bank hơn?</td>
                            </tr>

                            {/* NHÓM V */}
                            <tr style={{ background: '#f1f5f9' }}>
                               <td style={{ padding: '10px', textAlign: 'center', fontWeight: 800, borderBottom: '1px solid #e2e8f0' }}>V</td>
                               <td colSpan="4" style={{ padding: '10px', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Kiểm Soát Các Gói Cước Chi Phí Vận Hành</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>1</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Nuốt Cốt Nguyên Liệu (COGS Margin)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Hàng Nhập (Giá gốc) / Doanh Thu</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.cogsRatio > 0.4 ? 'var(--danger)' : 'var(--success)' }}>{(metrics.cogsRatio * 100).toFixed(2)}%</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#fee2e2', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#991b1b', border: '1px solid #fca5a5' }}>
                                       <span style={{ fontWeight: 500 }}>{formatVND(totalCOGS)}</span><span style={{ margin: '0 4px', color: '#f87171' }}>/</span><span style={{ color: '#0284c7', fontWeight: 500 }}>{formatVND(totalNetRevenue)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&lt; 40%</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Tỉ lệ tiền pha chế mua cốt so với bán. Vượt là báo mộng.</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>2</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Rút Máu Vận Hành Khác (OPEX)</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Tổng Chi Phí Vận Hành / Doanh Thu</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.opexRatio > 0.3 ? 'var(--warning)' : 'var(--success)' }}>{(metrics.opexRatio * 100).toFixed(2)}%</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#fee2e2', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#991b1b', border: '1px solid #fca5a5' }}>
                                       <span style={{ fontWeight: 500 }}>{formatVND(operatingExpenses)}</span><span style={{ margin: '0 4px', color: '#f87171' }}>/</span><span style={{ color: '#0284c7', fontWeight: 500 }}>{formatVND(totalNetRevenue)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&lt; 30%</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Kiểm tra xem Lương Lậu hay Mặt Bằng có ngốn lố tay?</td>
                            </tr>
                            <tr style={{ background: '#fff', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background='#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background='#fff'}>
                               <td style={{ padding: '12px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>3</td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                   <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Cống Nạp Hoa Hồng Sàn Công Nghệ</div>
                                   <div style={{ fontSize: '12px', color: '#64748b' }}>Phép tính: <strong style={{ color: '#475569' }}>Tiền Chiết Khấu / Doanh Thu Gốc</strong></div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>
                                   <div style={{ fontWeight: 800, fontSize: '15px', color: metrics.platformRatio > 0.25 ? 'var(--warning)' : 'var(--text-primary)' }}>{(metrics.platformRatio * 100).toFixed(2)}%</div>
                                   <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', background: '#fee2e2', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#991b1b', border: '1px solid #fca5a5' }}>
                                       <span style={{ fontWeight: 500 }}>{formatVND(totalPlatformCommission)}</span><span style={{ margin: '0 4px', color: '#f87171' }}>/</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{formatVND(totalGrossRevenue)}</span>
                                   </div>
                               </td>
                               <td style={{ padding: '12px 10px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff' }}>&lt; 25%</td>
                               <td style={{ padding: '12px 10px', fontSize: '12px', color: '#475569', lineHeight: '1.4', borderBottom: '1px solid #e2e8f0' }}>Shoppe, Grab vặt trụi nếu &gt;25%, bán ngập mặt chả dư.</td>
                            </tr>
                        </tbody>
                    </table>
               </div>

           </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin-anim { animation: spin 0.6s linear infinite; }
      `}</style>
    </div>
  );
}
