import React, { useMemo, useState } from 'react';
import { FileText, TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, BarChart3, Calendar, Download, Globe, Info } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const BusinessReports = () => {
  const { state } = useData();
  const [filterDate, setFilterDate] = useState({ start: '', end: '' });
  const [filterChannel, setFilterChannel] = useState('all');

  const plData = useMemo(() => {
    try {
      if (!state) return {};
      
      const start = filterDate.start ? new Date(filterDate.start).setHours(0,0,0,0) : 0;
      const end = filterDate.end ? new Date(filterDate.end).setHours(23,59,59,999) : Infinity;

      const posOrders = state.posOrders || [];
      const transactions = state.transactions || [];
      const salesChannels = state.salesChannels || [];
      const products = state.products || [];
      const ingredients = state.ingredients || [];

      const filteredOrders = posOrders.filter(o => {
        const d = new Date(o.date).getTime();
        const matchDate = d >= start && d <= end && o.status !== 'Cancelled';
        const matchChannel = filterChannel === 'all' || o.channelName === filterChannel;
        return matchDate && matchChannel;
      });

      const filteredTrans = transactions.filter(t => {
        const d = new Date(t.date).getTime();
        const matchDate = d >= start && d <= end && !t.note?.includes('[LUÂN CHUYỂN]');
        let matchChannel = true;
        if (filterChannel !== 'all') {
           matchChannel = t.note?.includes(filterChannel) || t.relatedId?.includes(filterChannel);
        }
        return matchDate && matchChannel;
      });

      const getProductCost = (recipe) => {
        if (!recipe || !Array.isArray(recipe)) return 0;
        return recipe.reduce((sum, item) => {
          const sub = products.find(p => p.id === item.ingredientId);
          if (sub) {
            const subQty = item.unitMode === 'divide' ? (1/item.qty) : item.qty;
            return sum + (getProductCost(sub.recipe) * subQty);
          }
          const ing = ingredients.find(i => i.id === item.ingredientId);
          if (ing) {
            let bQty = item.qty || 0;
            if (item.unitMode === 'buy') bQty = (item.qty || 0) * (ing.conversionRate || 1);
            if (item.unitMode === 'divide') bQty = 1 / (item.qty || 1);
            return sum + (bQty * (ing.cost || 0));
          }
          return sum;
        }, 0);
      };

      const revenuePOS = filteredOrders.reduce((sum, o) => sum + (Number(o.netAmount) || 0), 0);
      const revenueOther = filteredTrans.filter(t => t.type === 'Thu' && t.categoryId !== 'FC1').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      const totalRevenue = revenuePOS + revenueOther;

      const totalCOGS = filteredOrders.reduce((sum, o) => {
        const orderCost = (o.items || []).reduce((iSum, item) => {
          if (!item.product) return iSum;
          const unitCost = getProductCost(item.product.recipe);
          return iSum + (unitCost * (item.quantity || 0));
        }, 0);
        return sum + orderCost;
      }, 0);

      const opex = filteredTrans.filter(t => t.type === 'Chi' && t.categoryId !== 'FC4').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const grossProfit = totalRevenue - totalCOGS;
      const netProfit = grossProfit - opex;

      return {
        revenuePOS,
        revenueOther,
        totalRevenue,
        totalCOGS,
        grossProfit,
        opex,
        netProfit,
        grossMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
        netMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
      };
    } catch (err) {
      console.error("P&L Calculation Error:", err);
      return {};
    }
  }, [state, filterDate, filterChannel]);

  if (!plData || Object.keys(plData).length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu báo cáo hoặc có lỗi xảy ra...</div>;
  }

  const chartData = {
    labels: ['Doanh Thu', 'Giá Vốn', 'Lợi Nhuận Gộp', 'Chi Phí VH', 'Lợi Nhuận Ròng'],
    datasets: [{
      label: 'Số tiền (VNĐ)',
      data: [
        plData.totalRevenue || 0, 
        plData.totalCOGS || 0, 
        plData.grossProfit || 0, 
        plData.opex || 0, 
        plData.netProfit || 0
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.5)', 
        'rgba(239, 68, 68, 0.5)', 
        'rgba(16, 185, 129, 0.5)', 
        'rgba(249, 115, 22, 0.5)', 
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: ['#3b82f6', '#ef4444', '#10b981', '#f97316', '#22c55e'],
      borderWidth: 1
    }]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BarChart3 color="var(--primary)" /> Báo Cáo P&L Đa Kênh (V10)
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Phân tích hiệu quả kinh doanh theo kênh bán hàng và thời gian.</p>
        </div>
        <button className="btn btn-ghost" style={{ border: '1px solid var(--surface-border)' }}><Download size={18}/> Xuất Excel</button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
         <div style={{ display: 'flex', flexWrap:'wrap', gap: '20px', marginBottom: '24px', alignItems: 'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
               <Calendar size={18} color="var(--primary)" />
               <input type="date" className="form-control" style={{ width:'150px' }} value={filterDate.start} onChange={e => setFilterDate({...filterDate, start: e.target.value})} />
               <span>-</span>
               <input type="date" className="form-control" style={{ width:'150px' }} value={filterDate.end} onChange={e => setFilterDate({...filterDate, end: e.target.value})} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
               <Globe size={18} color="var(--primary)" />
               <select className="form-control" value={filterChannel} onChange={e => setFilterChannel(e.target.value)} style={{ width: '180px' }}>
                  <option value="all">Tất cả Kênh</option>
                  {(state.salesChannels || []).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
               </select>
            </div>
            <button className="btn btn-ghost" onClick={() => { setFilterDate({start:'', end:''}); setFilterChannel('all'); }}>Đặt lại</button>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '32px' }}>
            <div>
               <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="var(--success)" /> Kết quả kinh doanh: {filterChannel === 'all' ? 'Toàn bộ' : filterChannel}
               </h4>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid var(--surface-border)', fontWeight: 600 }}>
                     <span>I. TỔNG DOANH THU THUẦN</span>
                     <span>{(plData.totalRevenue || 0).toLocaleString()} đ</span>
                  </div>
                  <div style={{ paddingLeft: '20px', color:'var(--text-secondary)', fontSize: '0.9rem', display:'flex', justifyContent:'space-between' }}>
                     <span>- Từ kênh {filterChannel === 'all' ? 'bán hàng' : filterChannel}</span>
                     <span>{(plData.revenuePOS || 0).toLocaleString()} đ</span>
                  </div>
                  <div style={{ paddingLeft: '20px', color:'var(--text-secondary)', fontSize: '0.9rem', display:'flex', justifyContent:'space-between', paddingBottom: '8px' }}>
                     <span>- Các khoản thu liên quan kênh</span>
                     <span>{(plData.revenueOther || 0).toLocaleString()} đ</span>
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid var(--surface-border)', color: 'var(--danger)', fontWeight: 600 }}>
                     <span>II. GIÁ VỐN HÀNG BÁN (COGS)</span>
                     <span>- {(plData.totalCOGS || 0).toLocaleString()} đ</span>
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', padding:'16px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontWeight: 700, marginTop: '8px' }}>
                     <span>III. LỢI NHUẬN GỘP (I - II)</span>
                     <span style={{ color: 'var(--success)' }}>{(plData.grossProfit || 0).toLocaleString()} đ</span>
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', padding:'12px', borderBottom:'1px solid var(--surface-border)', color: 'var(--warning)', fontWeight: 600, marginTop: '16px' }}>
                     <span>IV. CHI PHÍ VẬN HÀNH (OPEX)</span>
                     <span>- {(plData.opex || 0).toLocaleString()} đ</span>
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', padding:'20px 12px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 800, marginTop: '24px', fontSize: '1.2rem' }}>
                     <span>V. LỢI NHUẬN RÒNG (III - IV)</span>
                     <span>{(plData.netProfit || 0).toLocaleString()} đ</span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                     Biên lợi nhuận ròng {filterChannel !== 'all' ? `kênh ${filterChannel}` : ''}: {(plData.netMargin || 0).toFixed(1)}%
                  </div>
               </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
               <div style={{ height: '300px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <h5 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>Cấu trúc dòng tiền ({filterChannel})</h5>
                  <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
               </div>
               
               <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--primary-border)', background: 'rgba(59, 130, 246, 0.05)' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Info size={20}/> Phân tích hiệu quả kênh
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                     {filterChannel === 'all' 
                        ? "Hệ thống đang hiển thị bức tranh tài chính tổng thể của cả cửa hàng bao gồm tất cả các kênh và danh mục thu chi khác."
                        : `Kênh ${filterChannel} hiện đang có biên lợi nhuận ròng ${(plData.netMargin || 0).toFixed(1)}%. Hãy so sánh với các kênh khác để điều chỉnh chiến lược giá phù hợp.`}
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BusinessReports;
