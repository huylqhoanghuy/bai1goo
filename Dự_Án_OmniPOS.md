# 🍗 DỰ ÁN XÓM GÀ Ủ MUỐI POPPY (OmniPOS)

Đây là tài liệu tổng hợp toàn bộ tính năng và cấu trúc của dự án phần mềm tĩnh tiền Xóm Gà POPPY mà chúng ta đã và đang phát triển.

## 🌟 1. CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN (FEATURES)

### 🛒 Bán Hàng Đa Kênh (POS Omnichannel)
- Bán trực tiếp tại quầy, qua ứng dụng ShopeeFood, GrabFood.
- **Tự động Gánh Phí:** Hệ thống tự động trừ % chiết khấu của từng ứng dụng giao đa (Grab 30%, Shopee 25%) để tính chính xác *Doanh thu thực nhận*, phục vụ làm báo cáo cực kỳ sát thực tế.

### 📦 Quản Lý Kho & Vật Tư (Inventory & Recursion Recipe)
- **Cơ chế Đa Đơn Vị Tính:** Hệ thống tự quy đổi từ Đơn vị khi Mua (Lồng, Thùng) sang Đơn vị Khấu trừ khi Bán (Con, Túi, Cốc).
- **Công Thức Khấu Trừ Đệ Quy Tuyệt Đối:** Việc bán 1 con Gà sẽ quét thấu cả nguyên liệu con: Tự trừ 2 Cốc nước chấm, trong đó 1 Cốc sẽ tiếp tục trừ tự động 0.1 Chai sốt và 1 Vỏ hộp bằng Nhựa. Tính toán không xót 1 giọt vật tư.
- **Quản lý Nhập Hàng:** Nhập theo Hóa Đơn, có Quản lý Công Nợ, tự động chia mức giá vốn trung bình khi nhập đợt hàng mới.

### 👩‍🍳 Nhà Bếp Kỹ Thuật Số (Kitchen Display System - KDS)
- Đơn hàng chốt xong ở quầy lập tức chuyển thông tin lên Cửa hình KDS của Bếp.
- Đầu bếp bấm trạng thái để đổi màu giao diện (*Đang chờ -> Đang chuẩn bị -> Đã xong*), đồng thời thu ngân sẽ nắm bắt được ngay trạng thái món.

### ⚙️ Cài Đặt Giao Diện Sáng/Tối (Dark/Light Mode)
- Config module hệ thống thay đổi màu giao diện cho phù hợp mắt nhìn.
- Hệ màu Glassmorphism cao cấp, viền bo hiện đại.

### ☁️ Đồng Bộ Thông Minh Lên Đám Mây (Firebase Cloud)
- Mã nguồn trang bị **Debounce Sync** chờ thao tác dứt điểm 2.5 giây mới tiến hành sao lưu dữ liệu lên mạng (chống tắc nghẽn).
- Kiến trúc **Anti-Limit Firestore** (Chia cắt các mảng `products`, `ingredients` thành từng File nhỏ nhằm triệt tiêu giới hạn 1MB của Google).
- Hỗ trợ cả 2 chế độ: **Đồng bộ Tự Động** và **Đồng bộ Bằng Tay**.

### 🚀 Tích hợp Trí Tuệ Nhân Tạo & MCP Server
- Tích hợp công cụ dòng lệnh NotebookLM-MCP để kết nối cơ sở dữ liệu làm việc nội bộ với Google Notebook, mở ra con đường cài đặt các AI nội bộ (Claude) truy cập kho kiến thức cá nhân của cửa hàng.

### 🌐 Tự Động Online Web Bán Hàng (CI/CD GitHub Pages)
- Toàn bộ thay đổi của Cấu hình mã sẽ tự động Build (Nặn khuôn biên dịch) bằng con bot GitHub Actions, và ngay lập tức trang web Online chính thức (`https://(...).github.io/bai1goo/`) được Update lên với Version mới nhất. Không phải thao tác môi trường khó nhọc.


### 📊 3. HỆ THỐNG QUẢN TRỊ TÀI CHÍNH & CÔNG NỢ (Finance & Debt Suite) - Mới [V34-V39]
- **Sổ Quỹ Nhật Ký Chung:** Ghi lại mọi biến động dòng tiền (Thu/Chi/Chuyển ví). Hỗ trợ In phiếu Thu/Chi chuyên nghiệp.
- **Quản Lý Công Nợ Thông Minh:** 
    - Tự động quét và cảnh báo các khoản nợ Nhà cung cấp (Payable) và nợ từ các Sàn/Khách hàng (Receivable).
    - **Liên thông dữ liệu:** Thanh toán nợ trực tiếp từ Sổ quỹ sẽ tự động cập nhật trạng thái đơn hàng bên POS và Nhập kho.
- **Bộ Lọc Đa Năng:** Tìm kiếm và lọc dữ liệu theo Ngày, Đối tác, Kênh bán hoặc Loại hình thu chi một cách đồng bộ.
- **Giao Diện Thích Ứng (Responsive):** Toàn bộ module kế toán được tối ưu cho cả máy tính và điện thoại, đảm bảo quản lý dòng tiền mọi lúc mọi nơi.
- **Báo cáo P&L (Lợi nhuận):** Tự động tính toán Doanh thu - Giá vốn - Chi phí vận hành để đưa ra con số Lãi ròng thực tế.

## 📂 4. CẤU TRÚC CODE CHÍNH (ARCHITECTURE)
Dự án được viết bằng **React.js 18 + Vite**, dùng thư viện CSS Thuần (`index.css` / `App.css`) với thiết kế Giao diện trong mờ (Glassmorphism). 

- `App.jsx` & `main.jsx`: Xương sống của bộ định tuyến, bao bọc dự án bằng `DataProvider` và gắn bộ Sidebar hiển thị Menu.
- `DataContext.jsx`: Bộ Não Máng Giữ Trạng Thái (Global Context API + `useReducer`). Mọi hoạt động trừ tiền, khấu kho, tính lãi... đều tập trung ở đây. Nó cũng điều phối tín hiệu sang Firebase.
- Các File trong `/pages/`: 
  - `POS.jsx`: Màn hình giao dịch chốt đơn.
  - `Inventory.jsx`: Quản lý thẻ kho và công thức pha chế.
  - `Dashboard.jsx` & `Finance.jsx`: Cung cấp thông số phân tích biểu đồ Tài Chính.

---
## 🤖 5. ANTIGRAVITY KIT INTEGRATION (Trạng thái: Đã tích hợp)
Dự án đã được cấu hình chuẩn **Antigravity Kit Enterprise**, cho phép các AI Agent tự vận hành và hỗ trợ kinh doanh:
- **Hệ thống Workflows (`.agents/workflows/`):** Chứa các kịch bản tự động hóa cho Kiểm toán tài chính (Accounting Audit) và Tối ưu kho (Inventory Management).
- **Cấu hình Agent (`.antigravity/`):** Định danh và phân quyền cho trợ lý ảo truy cập sâu vào dữ liệu hạch toán.
- **Dữ liệu AI-Ready:** Tự động tạo Snapshot và Snapshot Sync để đảm bảo AI luôn có dữ liệu mới nhất.

---
*Tài liệu tự động được sinh ra bởi AI Assistant (Antigravity).*
