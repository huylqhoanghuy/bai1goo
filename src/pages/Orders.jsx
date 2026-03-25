import React, { useState } from 'react';
import { ClipboardList, Search, Trash2, CheckCircle, Clock, XCircle, Eye, ChevronDown, ChevronUp, UploadCloud, Globe, CheckCircle2, FileText, Plus } from 'lucide-react';
import { useData } from '../context/DataContext';

const Orders = () => {
  const { state, dispatch } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importConfig, setImportConfig] = useState({ channel: 'Shopee', content: '' });

  // Mock data for detected files
  const detectedFiles = [
    { name: 'Shopeefood_Income_Details_Merchant_20-03-2026.csv', channel: 'Shopee' },
    { name: 'Grab_Report.csv', channel: 'Grab' }
  ];

  const handleImportSales = () => {
    if (!importConfig.content) return alert("Vui lòng nhập hoặc chọn dữ liệu báo cáo!");
    dispatch({ type: 'IMPORT_DAILY_SALES', payload: { channel: importConfig.channel, rawData: importConfig.content } });
    setShowImportModal(false);
    setImportConfig({ channel: 'Shopee', content: '' });
    alert("Import dữ liệu thành công! Đơn hàng mới đã được cập nhật vào danh sách.");
  };

  const orders = [...(state.posOrders || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      o.id.toLowerCase().includes(q) || 
      o.orderCode?.toLowerCase().includes(q) || 
      o.customerName?.toLowerCase().includes(q) || 
      o.channelName?.toLowerCase().includes(q);
      
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchChannel = filterChannel === 'all' || (
      o.channelName && (
        o.channelName.toLowerCase().includes(filterChannel.toLowerCase()) || 
        filterChannel.toLowerCase().includes(o.channelName.toLowerCase())
      )
    );
    
    // Ensure accurate date comparison by normalizing both to start of day
    const itemDate = new Date(o.date);
    itemDate.setHours(0,0,0,0);
    
    const start = startDate ? new Date(startDate).setHours(0,0,0,0) : null;
    const end = endDate ? new Date(endDate).setHours(23,59,59,999) : null;
    const matchDate = (!start || itemDate >= start) && (!end || itemDate <= end);

    return matchSearch && matchStatus && matchChannel && matchDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Success':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(46, 160, 67, 0.2)', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 'bold' }}>Thành Công</span>;
      case 'Pending':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(249, 115, 22, 0.2)', color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 'bold' }}>Chờ Ship</span>;
      case 'Cancelled':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(218, 54, 51, 0.2)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 'bold' }}>Đã Hủy</span>;
      default:
        return <span style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{status}</span>;
    }
  };

  const updateStatus = (orderId, status) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  };

  const deleteOrder = (orderId) => {
    if (confirm('Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này? Hệ thống sẽ hoàn lại kho nếu đơn chưa bị hủy.')) {
      dispatch({ type: 'DELETE_POS_ORDER', payload: orderId });
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ClipboardList color="var(--primary)" /> Danh Sách Đơn Hàng (Kinh Doanh)
          </h2>
          <p style={{ margin: 0, marginTop: '4px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Quản lý trạng thái giao hàng, hủy đơn và truy vết dòng tiền từ các kênh Shopee, Grab.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
           <button className="btn btn-primary" onClick={() => setShowImportModal(true)} style={{ background: 'var(--warning)', borderColor: 'var(--warning)', color: 'black' }}>
              <UploadCloud size={18} /> Import Báo Cáo Sàn
           </button>
        </div>
      </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '8px 16px', borderRadius: '8px', minWidth: '250px', border: '1px solid var(--surface-border)', height: '42px' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              placeholder="Mã đơn / Kênh bán..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Từ:</span>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ background:'rgba(0,0,0,0.3)', color:'white', border:'1px solid var(--surface-border)', padding:'8px', borderRadius:'6px', outline:'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Đến:</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ background:'rgba(0,0,0,0.3)', color:'white', border:'1px solid var(--surface-border)', padding:'8px', borderRadius:'6px', outline:'none' }} />
          </div>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background:'rgba(0,0,0,0.3)', color:'white', border:'1px solid var(--surface-border)', padding:'8px', borderRadius:'6px', outline:'none' }}>
            <option value="all">-- Tất cả Trạng thái --</option>
            <option value="Pending">Chờ Ship</option>
            <option value="Success">Thành Công</option>
            <option value="Cancelled">Đã Hủy</option>
          </select>

          <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)} style={{ background:'rgba(0,0,0,0.3)', color:'white', border:'1px solid var(--surface-border)', padding:'8px', borderRadius:'6px', outline:'none' }}>
            <option value="all">-- Tất cả Kênh --</option>
            {state.salesChannels?.map(ch => <option key={ch.id} value={ch.name}>{ch.name}</option>)}
          </select>

          <button className="btn btn-ghost" onClick={() => { setStartDate(''); setEndDate(''); setFilterStatus('all'); setFilterChannel('all'); setSearchQuery(''); }} style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>Xóa Lọc</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Thời Gian</th>
                <th style={{ padding: '12px' }}>Khách Hàng</th>
                <th style={{ padding: '12px' }}>Kênh Bán</th>
                <th style={{ padding: '12px' }}>Thực Thu (Ví)</th>
                <th style={{ padding: '12px' }}>Trạng Thái</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Chưa có đơn hàng nào được ghi nhận.</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }} onClick={() => toggleExpand(order.id)}>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>{new Date(order.date).toLocaleString('vi-VN')}</td>
                      <td style={{ padding: '12px' }}>
                        <strong style={{ display: 'block' }}>{order.id}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.customerName || 'Khách vãng lai'} - {order.customerPhone || ''}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.85rem' }}>{order.channelName}</span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--success)', fontWeight: 'bold' }}>
                        {(order.netAmount + (Number(order.extraFee) || 0)).toLocaleString('vi-VN')} đ
                      </td>
                      <td style={{ padding: '12px' }}>{getStatusBadge(order.status)}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }} onClick={e => e.stopPropagation()}>
                          <button className="btn btn-ghost" title="Thành công" style={{ color: 'var(--success)' }} onClick={() => updateStatus(order.id, 'Success')}><CheckCircle size={18}/></button>
                          <button className="btn btn-ghost" title="Chờ ship" style={{ color: 'var(--warning)' }} onClick={() => updateStatus(order.id, 'Pending')}><Clock size={18}/></button>
                          <button className="btn btn-ghost" title="Hủy đơn" style={{ color: 'var(--danger)' }} onClick={() => updateStatus(order.id, 'Cancelled')}><XCircle size={18}/></button>
                          <div style={{ width: '1px', background: 'var(--surface-border)', margin: '0 4px' }} />
                          <button className="btn btn-ghost" title="Xóa" onClick={() => deleteOrder(order.id)}><Trash2 size={18}/></button>
                          <button className="btn btn-ghost">
                            {expandedOrderId === order.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr>
                        <td colSpan="6" style={{ padding: '0' }}>
                          <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--surface-border)' }}>
                            <h4 style={{ margin: 0, marginBottom: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Chi Tiết Đồ Ăn Trong Đơn:</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                              {order.items.map((item, idx) => (
                                <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between' }}>
                                  <span>{item.product.name}</span>
                                  <strong style={{ color: 'var(--primary)' }}>x{item.quantity}</strong>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                                <div>
                                  Tổng bill gốc: {order.totalAmount.toLocaleString('vi-VN')} đ | Phí sàn: -{order.discountAmount.toLocaleString('vi-VN')} đ
                                </div>
                                {Number(order.extraFee) > 0 && (
                                  <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                    + Phí phát sinh: {Number(order.extraFee).toLocaleString('vi-VN')} đ ({order.extraFeeNote || 'Không có ghi chú'})
                                  </div>
                                )}
                              </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showImportModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300 }}>
           <div className="glass-panel" style={{ width: '600px', padding: '32px' }}>
              <h3 style={{ margin: 0, marginBottom: '24px', display:'flex', alignItems:'center', gap:'12px' }}>
                 <UploadCloud color="var(--primary)"/> Import Doanh Thu Từ Sàn (Kinh Doanh)
              </h3>

              <div style={{ background:'rgba(59, 130, 246, 0.05)', padding:'16px', borderRadius:'12px', border:'1px solid var(--primary-border)', marginBottom:'24px' }}>
                 <h5 style={{ margin:'0 0 12px 0', display:'flex', alignItems:'center', gap:'8px' }}><Globe size={18}/> Phát hiện file trong thư mục /import:</h5>
                 <div style={{ display:'grid', gap:'8px' }}>
                    {detectedFiles.map(file => (
                       <div key={file.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px', background:'rgba(255,255,255,0.03)', borderRadius:'8px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                             <FileText size={20} color="var(--primary)"/>
                             <div>
                                <div style={{ fontSize:'0.9rem', fontWeight:600 }}>{file.name}</div>
                                <div style={{ fontSize:'0.7rem', color:'var(--text-secondary)' }}>Loại: {file.channel} CSV Report</div>
                             </div>
                          </div>
                          <button 
                            className="btn btn-ghost" 
                            style={{ fontSize:'0.8rem', color:'var(--primary)' }}
                            onClick={() => {
                                let content = "";
                                if (file.channel === 'Shopee') {
                                    content = `STT,Mã Đơn Hàng,ID cửa hàng,Tên cửa hàng,Thời gian hoàn thành/ huỷ đơn,Giá trị đơn hàng,Khuyến mại từ quán,Phí dịch vụ,Phí vận chuyển trả cho quán,Chiết khấu,Thuế khấu trừ,Thực thu\n1,20036-391900410,10387503,Xóm Gà Ủ Muối Poppy - Văn Phú Victoria,20/03/2026 11:27:28,"109,000",0,0,0,"26,760","4,905","77,336"\n2,20036-395038331,10387503,Xóm Gà Ủ Muối Poppy - Văn Phú Victoria,20/03/2026 11:38:29,"79,000",0,0,0,"19,395","3,555","56,051"\n3,20036-585679131,10387503,Xóm Gà Ủ Muối Poppy - Văn Phú Victoria,20/03/2026 16:52:02,"79,000",0,0,0,"19,395","3,555","56,051"\n4,20036-604631634,10387503,Xóm Gà Ủ Muối Poppy - Văn Phú Victoria,20/03/2026 17:02:53,"160,900",0,0,0,"39,501","7,241","114,159"\n5,20036-706180339,10387503,Xóm Gà Ủ Muối Poppy - Văn Phú Victoria,20/03/2026 20:17:57,"108,900",0,0,0,"26,735","4,901","77,265"`;
                                } else {
                                    content = `Tên người bán;Merchant ID;Tên cửa hàng;Mã số cửa hàng;Cập nhật vào;Ngày tạo;Danh mục;Tài khoản nhận / Nguồn tiền;Danh mục con;Trạng thái;Mã giao dịch;Mã giao dịch đã được liên kết;Mã giao dịch đối tác 1;Mã giao dịch đối tác 2;Mã đơn hàng dài;Mã đơn hàng ngắn ;Mã đặt hàng;Kênh đặt hàng;Loại đơn hàng;Mã máy giao dịch;Kênh thanh toán ;Loại ưu đãi;Phí dịch vụ Grab (%);Hệ số điểm;Điểm đã nhận;Mã giao dịch ;Ngày chuyển khoản;Số tiền;Thuế đơn hàng;Phí đồ gói mang về;Phí dành cho quán chưa là thành viên;Phí dịch vụ của quán;Ưu đãi;Giảm giá (Quán tài trợ);Giảm phí giao hàng (Quán tài trợ);Phí giao hàng (Quán online trên Grab);Phí giao hàng  (Được giao bởi quán);Phí giao hàng GrabExpress ;Doanh thu ròng;MDR ròng;Thuế MDR;Phí cho Grab;Chiết khấu giao hàng;Chiết khấu từ các kênh bán hàng;Chiết khấu đơn hàng;Chiết khấu cho GrabFood / GrabMart ;GrabKitchen Commission;Các khoản chiết khấu khác cho GrabKitchen;Thuế tại nguồn;VAT Amount;PIT Amount;Tổng cộng;Thuế trên tiền chiết khấu cho GrabFood / GrabMart, Điều chỉnh, Quảng cáo;Thuế trên MDR (%);Chiết khấu giao hàng (%);Chiết khấu từ các kênh bán hàng (%);Chiết khấu đơn hàng (%);Thuế trên tổng chiết khấu cho GrabKitchen;Lý do hủy;Hủy bởi ;Lý do hoàn tiền ;Mô tả;Nhóm sự cố;Bí danh sự cố;Mặt hàng bị ảnh hưởng;Liên kết khiếu nại;Tình trạng kháng nghị\nXÓM GÀ Ủ MUỐI POPPY VĂN PHÚ VICTORIA HÀ ĐÔNG;7518bef0-1b9c-4c38-aa42-7efc976edd01;XÓM GÀ Ủ MUỐI POPPY VĂN PHÚ VICTORIA HÀ ĐÔNG;4e6ab81a-6344-455a-9c25-55614c9f743a;23 Mar 2026 11:04 PM;23 Mar 2026 10:33 PM;Payment ;;;Transferred;2603231393tuVND00001000X2018PFPS;;;;001164397971-C74CTABJDFBFV2;GF-572;A-94N4IGCWWGEHAV;GrabFood app & web;;;;;;;;SVNOA4OWPBBY;24 Mar 2026 5:59 AM;79000;0;0;;;;0;0;;0;0;79000;;;;0;-19385;;0;0;0;0;-2370;-1185;56060;-1436;;;;;0;;;;;;;;;\nXÓM GÀ Ủ MUỐI POPPY VĂN PHÚ VICTORIA HÀ ĐÔNG;7518bef0-1b9c-4c38-aa42-7efc976edd01;XÓM GÀ Ủ MUỐI POPPY VĂN PHÚ VICTORIA HÀ ĐÔNG;4e6ab81a-6344-455a-9c25-55614c9f743a;23 Mar 2026 6:47 PM;23 Mar 2026 6:28 PM;Payment ;;;Transferred;2603231393tuVND00009000JWU049GZ7;;;;001662023840-C74CNXX2VX2XNN;GF-102;A-94ME39UGX7B9AV;GrabFood app & web;;;;;;;;SVNOA4OWPBBY;24 Mar 2026 5:59 AM;162900;0;0;;;;0;0;;0;0;162900;;;;0;-39972;;0;0;0;0;-4887;-2444;115597;-2961;;;;;0;;;;;;;;;`;
                                }
                                setImportConfig({ channel: file.channel, content: content });
                            }}
                          >
                             {importConfig.content.includes(file.name.slice(0,10)) ? 'Đã chọn' : 'Chọn file'}
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

              <div style={{ marginBottom:'24px' }}>
                 <label style={{ fontSize:'0.85rem', fontWeight:600, display:'block', marginBottom:'8px' }}>Hoặc dán nội dung CSV vào đây:</label>
                 <textarea 
                    className="form-control" 
                    style={{ minHeight:'120px', fontSize:'0.8rem', fontFamily:'monospace' }} 
                    placeholder="Mã đơn, Doanh thu, Thực thu..."
                    value={importConfig.content}
                    onChange={e => setImportConfig({...importConfig, content: e.target.value})}
                 />
              </div>

              <div style={{ display:'flex', gap:'12px' }}>
                 <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => setShowImportModal(false)}>Đóng</button>
                 <button className="btn btn-primary" style={{ flex:1, gap:'8px' }} onClick={handleImportSales}>
                    <CheckCircle2 size={18}/> Thực Hiện Import
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Orders;
