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


## 📂 2. CẤU TRÚC CODE CHÍNH (ARCHITECTURE)
Dự án được viết bằng **React.js 18 + Vite**, dùng thư viện CSS Thuần (`index.css` / `App.css`) với thiết kế Giao diện trong mờ (Glassmorphism). 

- `App.jsx` & `main.jsx`: Xương sống của bộ định tuyến, bao bọc dự án bằng `DataProvider` và gắn bộ Sidebar hiển thị Menu.
- `DataContext.jsx`: Bộ Não Máng Giữ Trạng Thái (Global Context API + `useReducer`). Mọi hoạt động trừ tiền, khấu kho, tính lãi... đều tập trung ở đây. Nó cũng điều phối tín hiệu sang Firebase.
- Các File trong `/pages/`: 
  - `POS.jsx`: Màn hình giao dịch chốt đơn.
  - `Inventory.jsx`: Quản lý thẻ kho và công thức pha chế.
  - `Dashboard.jsx` & `Finance.jsx`: Cung cấp thông số phân tích biểu đồ Tài Chính.

---
*Tài liệu tự động được sinh ra bởi AI Assistant. Lưu trữ tại máy tính người dùng phục vụ cho việc đối chiếu và lên kế hoạch phát triển phiên bản V4.*
