# 🍗 Xóm Gà Ủ Muối POPPY - Hệ Thống OmniPOS

OmniPOS là một hệ thống quản lý bán hàng (Point of Sale) toàn diện, được thiết kế đặc biệt cho mô hình kinh doanh F&B (Cửa hàng Gà Ủ Muối), hỗ trợ đồng bộ đa thiết bị, giao diện bán hàng chuyên nghiệp và tính toán kho nguyên liệu tự động.

## 🌟 Tính Năng Nổi Bật

### 1. Bán Hàng Đa Kênh (Omnichannel POS)
- **Hỗ trợ Đa Kênh:** Bán trực tiếp (tại tiệm), qua ứng dụng bên thứ ba (ShopeeFood, GrabFood).
- **Tính Phí Tự Động:** Hệ thống tự động khấu trừ % chiết khấu của từng sàn giao dịch để lưu lại doanh thu thực nhận (Net Amount) vào hệ thống tài chính. Cắt cầu tránh thất thoát lợi nhuận mờ.

### 2. Quản Lý Kho & Công Thức Đệ Quy Tự Động (Inventory & Recipes)
- **Đa Đơn Vị Tính:** Hệ thống tự động quy đổi từ Đơn vị Nhập (VD: Lồng, Thùng) sang Đơn vị Khấu trừ Thực tế (VD: Con, Chai, Túi).
- **Trừ Kho Tự Động (Sub-Recipe Recursion):** Mỗi sản phẩm bán ra đều quét qua công thức cấu tạo nhỏ nhất để trừ tự động tài nguyên trong kho, bao gồm cả nguyên vật liệu lồng ghép (VD: Gà bán ra sẽ tự trừ 2 Cốc nước chấm, 1 Cốc tự trừ 0.1 Chai nước sốt + 1 vỏ cốc nhựa).
- **Quản lý Phiếu Nhập & Nhà Cung Cấp:** Quản lý công nợ, tính chi phí trung bình theo từng đợt nhập vật tư.

### 3. Nhà Bếp Kỹ Thuật Số (KDS - Kitchen Display System)
- Các đơn hàng được đẩy tự động từ màn hình bán hàng sang màn hình Nhà Bếp bằng kết nối thời gian thực.
- Quản lý trạng thái: *Đang chờ -> Đang làm -> Hoàn Tất*.

### 4. Báo Cáo Tài Chính Thời Gian Thực (Transactions)
- Nhanh chóng theo dõi biểu đồ Tổng thu, Tổng chi, và Cân bằng ngân sách theo từng hóa đơn cụ thể. 

### 5. Cài Đặt Không Gian & Giao Diện Sáng/Tối
- Bộ core CSS Variables hiện đại, hỗ trợ chuyển đổi màu Tối/Sáng với chế độ làm mờ nền (Glassmorphism), có khả năng lưu cục bộ (Local Preference).

### 6. Kiến Trúc "Live Sync" Đám Mây (Cloud-First Sync)
- **LocalStorage Fallback:** Tốc độ load app dưới 0.1 giây vì dữ liệu ưu tiên mồi nóng từ trình duyệt.
- **Firebase Firestore Anti-Limit:** Tránh giới hạn Document size (1MB/1 node) của mảng Collection lớn bằng việc xẻ nhánh Cây trạng thái ra lưu thành các Documents độc lập (`products`, `ingredients`, `posOrders`,...).
- **Debounced Cloud Writes:** Thuật toán chờ thông minh 2.5 giây kể từ phiên tương tác cuối cùng mới gọi Push Data, giúp App không bị Block Rendering. Thiết lập tùy biến được chế độ "Tự Động" hoặc "Thủ Công" trong màn Cài Đặt.

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

- **Frontend:** React 18, Vite, React Router DOM, ghim State qua `React Context API` & `useReducer`.
- **UI/UX Icons:** `lucide-react` và thiết kế bằng `Vanilla CSS` + Flexbox/Grid chuẩn mực.
- **Database & Sync:** Trình duyệt LocalStorage + Firebase Cloud Firestore, tự động ghép mảnh bằng `action.type === 'HYDRATE_STATE'`.
- **CI/CD:** Được cài đặt triển khai tự động miễn phí lên mạng thông qua **GitHub Actions** và **GitHub Pages** với file `deploy.yml`.

## ⚙️ Hướng Dẫn Phát Triển

1. Cài đặt các thư viện Node.js:
   ```bash
   npm install
   ```
2. Chạy máy chủ nội bộ trên máy cá nhân:
   ```bash
   npm run dev
   ```
   *Ứng dụng sẽ khả dụng ở cổng `http://localhost:5173`.*
3. (Tuỳ chọn) Đưa trang web lên môi trường online:
   - Các bản cập nhật nếu gõ `git push -u origin main` sẽ tự động kích hoạt bot của GitHub chuyển dịch (build) ra cổng Frontend.

## 🗂 Cấu Trúc Mã Nguồn Chính
- `src/App.jsx`: Bộ định tuyến chính và chứa khung Sidebar.
- `src/index.css` & `App.css`: Thiết lập toàn cục, khai báo Glassmorphism & Light/Dark Theme Variables.
- `src/context/DataContext.jsx`: Trái tim state-machine xử lý logic thanh toán, đệ quy trừ kho, và điều tốc (Debouncing) đồng bộ kho Firestore.
- `src/pages/*`: Các màn chức năng POS, Dashboard, Inventory, Finance, Settings.
- `src/firebase.js`: Cấu hình nhận diện API Key đến Google Cloud.

---
*Dự án được xây dựng dựa trên khao khát tối ưu hóa quy trình bán lẻ cho nhóm ngành Ẩm thực, tập trung tự động hóa và ngăn chặn thất thoát tiền tệ.*
