import React, { useState, useMemo } from 'react';
import { BarChart3, PieChart as PieIcon, TrendingUp, Info, Globe, Percent, DollarSign, Settings } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Finance = () => {
  const { state } = useData();
  const [showAnalysisModal, setShowAnalysisModal] = useState(null); 
  
  // V10 Filters
  const [selectedChannel, setSelectedChannel] = useState(state.salesChannels[0]); // CH1 - Offline
  const [opexPerDish, setOpexPerDish] = useState(5000); // Chi phí vận hành ước tính trên mỗi đơn/món

  // Profit Analysis Logic (Recursive Cost + Channel Fees)
  const productMetrics = useMemo(() => {
    const getCost = (recipe) => {
      if (!recipe) return 0;
      return recipe.reduce((sum, item) => {
        const subProd = state.products.find(p => p.id === item.ingredientId);
        if (subProd) {
          const subQty = item.unitMode === 'divide' ? (1/item.qty) : item.qty;
          return sum + (getCost(subProd.recipe) * subQty);
        }
        const ing = state.ingredients.find(i => i.id === item.ingredientId);
        if (ing) {
          let baseQty = item.qty;
          if (item.unitMode === 'buy') baseQty = item.qty * (ing.conversionRate || 1);
          if (item.unitMode === 'divide') baseQty = 1/item.qty;
          return sum + (baseQty * (ing.cost || 0));
        }
        return sum;
      }, 0);
    };

    return state.products.map(p => {
      const cogs = getCost(p.recipe);
      // Net Revenue after Channel Fee
      const channelFee = p.price * (selectedChannel?.discountRate || 0) / 100;
      const netRevenue = p.price - channelFee;
      
      const grossProfit = netRevenue - cogs;
      const netProfit = grossProfit - opexPerDish;
      
      const grossMargin = p.price > 0 ? (grossProfit / p.price) * 100 : 0;
      const netMargin = p.price > 0 ? (netProfit / p.price) * 100 : 0;
      
      return { ...p, cogs, channelFee, netRevenue, grossProfit, netProfit, grossMargin, netMargin };
    }).sort((a, b) => b.netProfit - a.netProfit);
  }, [state.products, state.ingredients, selectedChannel, opexPerDish]);

  const renderCostChart = (product) => {
    const categoriesCosts = {};
    const extractInfo = (recipe, mult) => {
       recipe?.forEach(item => {
          const sub = state.products.find(p => p.id === item.ingredientId);
          if (sub) {
            extractInfo(sub.recipe, mult * (item.unitMode === 'divide' ? (1/item.qty) : item.qty));
          } else {
            const ing = state.ingredients.find(i => i.id === item.ingredientId);
            if (ing) {
              let bQty = item.qty;
              if (item.unitMode === 'buy') bQty = item.qty * (ing.conversionRate || 1);
              if (item.unitMode === 'divide') bQty = 1/item.qty;
              const cost = bQty * mult * (ing.cost || 0);
              categoriesCosts[ing.category] = (categoriesCosts[ing.category] || 0) + cost;
            }
          }
       });
    };
    extractInfo(product.recipe, 1);
    
    const data = {
      labels: [...Object.keys(categoriesCosts), 'Phí Sàn', 'CP Vận Hành', 'Lợi Nhuận Net'],
      datasets: [{
        data: [...Object.values(categoriesCosts), product.channelFee, opexPerDish, Math.max(0, product.netProfit)],
        backgroundColor: [
          '#2ea043', '#3b82f6', '#f97316', '#eab308', '#a855f7', '#ec4899', '#10b981', 
          'rgba(239, 68, 68, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(34, 197, 94, 0.9)'
        ],
        borderWidth: 0,
      }]
    };
    return <Pie data={data} options={{ plugins: { legend: { position: 'right', labels: { color: '#8b949e', font: { size: 10 } } } } }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp color="var(--primary)" /> Phân Tích Lợi Nhuận Đa Kênh (V10)
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mô phỏng lợi nhuận thực tế sau khi trừ phí sàn và chi phí vận hành (OPEX).</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe size={20} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>Kênh bán hàng:</span>
            <select className="form-control" style={{ width: '200px' }} value={selectedChannel?.id} onChange={e => setSelectedChannel(state.salesChannels.find(c => c.id === e.target.value))}>
               {state.salesChannels.map(c => <option key={c.id} value={c.id}>{c.name} ({c.discountRate}%)</option>)}
            </select>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Settings size={20} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>Định mức CPVH/món:</span>
            <input type="number" className="form-control" style={{ width: '120px' }} value={opexPerDish} onChange={e => setOpexPerDish(Number(e.target.value))} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(Điện, nước, lương, mặt bằng...)</span>
         </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--surface-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                     <th style={{ padding: '12px' }}>Sản Phẩm</th>
                     <th style={{ padding: '12px', textAlign: 'right' }}>Giá Niêm Yết</th>
                     <th style={{ padding: '12px', textAlign: 'right' }}>Giá Vốn (COGS)</th>
                     <th style={{ padding: '12px', textAlign: 'right' }}>Phí Sàn ({selectedChannel?.discountRate}%)</th>
                     <th style={{ padding: '12px', textAlign: 'right' }}>Lợi Nhuận Gross</th>
                     <th style={{ padding: '12px', textAlign: 'right', background: 'rgba(255,255,255,0.02)' }}>Lợi Nhuận NET</th>
                     <th style={{ padding: '12px', textAlign: 'center' }}>Chi Tiết</th>
                  </tr>
               </thead>
               <tbody>
                  {productMetrics.map(p => (
                     <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="hover-row">
                        <td style={{ padding: '12px', fontWeight: 600 }}>{p.name}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>{p.price.toLocaleString()} đ</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-secondary)' }}>{p.cogs.toLocaleString()} đ</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: 'var(--warning)' }}>-{p.channelFee.toLocaleString()} đ</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: 'var(--success)' }}>{p.grossProfit.toLocaleString()} đ</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: p.netProfit > 0 ? 'var(--primary)' : 'var(--danger)', background: 'rgba(255,255,255,0.02)' }}>
                           {p.netProfit.toLocaleString()} đ
                           <div style={{ fontSize: '0.65rem', fontWeight: 400, opacity: 0.8 }}>Margin: {p.netMargin.toFixed(1)}%</div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                           <button className="btn btn-ghost" onClick={() => setShowAnalysisModal(p)} style={{ padding: '4px 8px' }}><PieIcon size={16}/></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {showAnalysisModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '640px', padding: '32px', textAlign:'center' }}>
             <h3 style={{ margin: 0, marginBottom: '8px' }}>Mô Phỏng Tài Chính: {showAnalysisModal.name}</h3>
             <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'24px' }}>
                Kênh bán: <strong>{selectedChannel?.name}</strong> | CPVH định mức: <strong>{opexPerDish.toLocaleString()} đ</strong>
             </p>
             
             <div style={{ height:'300px', display:'flex', justifyContent:'center', marginBottom:'32px' }}>
                {renderCostChart(showAnalysisModal)}
             </div>

             <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'12px', textAlign:'left' }}>
                <div style={{ padding:'12px', background:'rgba(255,255,255,0.02)', borderRadius:'8px' }}>
                   <p style={{ margin:0, fontSize:'0.7rem', color:'var(--text-secondary)' }}>Giá bán</p>
                   <h5 style={{ margin:0 }}>{showAnalysisModal.price.toLocaleString()} đ</h5>
                </div>
                <div style={{ padding:'12px', background:'rgba(255,255,255,0.02)', borderRadius:'8px' }}>
                   <p style={{ margin:0, fontSize:'0.7rem', color:'var(--text-secondary)' }}>Giá vốn</p>
                   <h5 style={{ margin:0, color:'var(--danger)' }}>{showAnalysisModal.cogs.toLocaleString()} đ</h5>
                </div>
                <div style={{ padding:'12px', background:'rgba(255,255,255,0.02)', borderRadius:'8px' }}>
                   <p style={{ margin:0, fontSize:'0.7rem', color:'var(--text-secondary)' }}>Phí sàn</p>
                   <h5 style={{ margin:0, color:'var(--warning)' }}>{showAnalysisModal.channelFee.toLocaleString()} đ</h5>
                </div>
                <div style={{ padding:'12px', background:'var(--primary)', borderRadius:'8px' }}>
                   <p style={{ margin:0, fontSize:'0.7rem', color:'rgba(255,255,255,0.8)' }}>Lợi nhuận NET</p>
                   <h5 style={{ margin:0, color:'white' }}>{showAnalysisModal.netProfit.toLocaleString()} đ</h5>
                </div>
             </div>

             <button className="btn btn-primary" style={{ marginTop:'28px', width:'100%' }} onClick={() => setShowAnalysisModal(null)}>Đóng phân tích</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
