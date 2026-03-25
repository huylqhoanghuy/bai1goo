import React from 'react';
import { TrendingUp, ShoppingBag, Clock, DollarSign, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="glass-panel" style={{ padding: 'clamp(16px, 3vw, 24px)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-xs)', margin: 0, marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
        <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{value}</h3>
      </div>
      <div className={`icon-wrapper ${colorClass}`} style={{ padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex' }}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { state } = useData();
  const [period, setPeriod] = React.useState('month'); // today, week, month, all

  // Filter Logic
  const filterByPeriod = (data) => {
    if (period === 'all') return data;
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    
    return (data || []).filter(item => {
      const itemDate = new Date(item.date);
      if (period === 'today') return itemDate >= startOfDay;
      if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return itemDate >= weekAgo;
      }
      if (period === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return itemDate >= monthAgo;
      }
      return true;
    });
  };

  const filteredOrders = filterByPeriod(state.posOrders);
  const filteredTransactions = filterByPeriod(state.transactions);

  // Stats
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.netAmount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'Chi').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalRevenue - totalExpense;

  // Chart 1: Revenue by Channel (Doughnut)
  const channelData = filteredOrders.reduce((acc, o) => {
    acc[o.channelName] = (acc[o.channelName] || 0) + o.netAmount;
    return acc;
  }, {});
  
  const doughnutData = {
    labels: Object.keys(channelData),
    datasets: [{
      data: Object.values(channelData),
      backgroundColor: ['#f97316', '#3b82f6', '#2ea043', '#eab308', '#a855f7'],
      borderWidth: 0,
    }]
  };

  // Chart 2: Income vs Expense Trend (Bar)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const trendData = {
    labels: last7Days.map(d => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })),
    datasets: [
      {
        label: 'Doanh Thu',
        data: last7Days.map(day => filteredOrders.filter(o => o.date.startsWith(day)).reduce((sum, o) => sum + o.netAmount, 0)),
        backgroundColor: 'rgba(46, 160, 67, 0.6)',
      },
      {
        label: 'Chi Phí',
        data: last7Days.map(day => filteredTransactions.filter(t => t.type === 'Chi' && t.date.startsWith(day)).reduce((sum, t) => sum + t.amount, 0)),
        backgroundColor: 'rgba(218, 54, 51, 0.6)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#8b949e', font: { size: 10 } } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#8b949e' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b949e' } }
    }
  };

  // NEW: System-wide COGS Analysis (Pie Chart of Ingredient Categories)
  const getCOGSAnalysis = () => {
    const categoryTotals = {};
    state.products.filter(p => p.status !== 'draft').forEach(product => {
      product.recipe?.forEach(item => {
        const ingredient = state.ingredients.find(i => i.id === item.ingredientId);
        if (ingredient) {
          const cost = (item.qty || 0) * (ingredient.cost || 0);
          categoryTotals[ingredient.category] = (categoryTotals[ingredient.category] || 0) + cost;
        }
      });
    });
    
    return {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#2ea043', '#f97316', '#3b82f6', '#eab308', '#ec4899', '#8b5cf6'],
        borderWidth: 0,
      }]
    };
  };

  const cogsData = getCOGSAnalysis();

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>
      
      {/* Header with Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Báo Cáo Tài Chính Quản Trị</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Theo dõi dòng tiền, doanh thu kênh và tỷ trọng chi phí.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
          {[
            { id: 'today', name: 'Hôm nay' },
            { id: 'week', name: '7 ngày' },
            { id: 'month', name: 'Tháng này' },
            { id: 'all', name: 'Tất cả' }
          ].map(p => (
            <button 
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`btn ${period === p.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-auto-fit" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard title="Doanh Thu Thuần" value={`${totalRevenue.toLocaleString()} đ`} icon={<TrendingUp color="var(--primary)" />} colorClass="primary" />
        <StatCard title="Tổng Chi Phí" value={`${totalExpense.toLocaleString()} đ`} icon={<ShoppingBag color="var(--danger)" />} colorClass="danger" />
        <StatCard title="Lợi Nhuận" value={`${netProfit.toLocaleString()} đ`} icon={<DollarSign color="var(--success)" />} colorClass="success" />
      </div>

      {/* Chart Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', minHeight: '380px' }}>
          <h4 style={{ margin: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><PieIcon size={18} color="var(--primary)"/> Doanh Thu Theo Kênh</h4>
          <div style={{ height: '280px' }}>
             {filteredOrders.length > 0 ? <Doughnut data={doughnutData} options={chartOptions} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Chưa có dữ liệu đơn hàng</div>}
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px', minHeight: '380px' }}>
          <h4 style={{ margin: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart3 size={18} color="var(--success)"/> Diễn Biến Thu - Chi (7 ngày)</h4>
          <div style={{ height: '280px' }}>
             <Bar data={trendData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', minHeight: '380px' }}>
          <h4 style={{ margin: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><PieIcon size={18} color="var(--warning)"/> Tỷ Trọng Giá Vốn (COGS)</h4>
          <div style={{ height: '220px' }}>
             <Pie data={cogsData} options={{...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'right' } } }} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '20px', fontStyle: 'italic' }}>
            * Dựa trên công thức thực đơn và giá nhập nguyên liệu hiện tại.
          </p>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: 0, marginBottom: '20px' }}>Giao Dịch Gần Đây</h3>
        <div style={{ overflowX: 'auto' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                 <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <th style={{ padding: '12px' }}>Thời Gian</th>
                    <th style={{ padding: '12px' }}>Nội Dung</th>
                    <th style={{ padding: '12px' }}>Loại</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Số Tiền</th>
                 </tr>
              </thead>
              <tbody>
                 {filteredTransactions.slice(0, 10).map((t, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                       <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(t.date).toLocaleString('vi-VN')}</td>
                       <td style={{ padding: '12px', fontSize: '0.9rem' }}>{t.note}</td>
                       <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: t.type === 'Thu' ? 'rgba(46, 160, 67, 0.15)' : 'rgba(218, 54, 51, 0.15)', color: t.type === 'Thu' ? 'var(--success)' : 'var(--danger)' }}>{t.type}</span>
                       </td>
                       <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: t.type === 'Thu' ? 'var(--success)' : 'var(--danger)' }}>
                          {t.type === 'Thu' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')} đ
                       </td>
                    </tr>
                 ))}
                 {filteredTransactions.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Chưa có giao dịch nào được ghi nhận.</td></tr>}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
