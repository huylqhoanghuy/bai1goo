---
description: Lưu Kiến Thức (Save to Skill)
---
# Lưu Giữ Tri Thức (Save to Skill)

Workflow này được kích hoạt khi Người Dùng yêu cầu chốt cứng một quy luật, định lý hoặc một phần cấu trúc code/UI vừa trao đổi thành một đạo luật vĩnh viễn cho hệ thống AI.

**Các bước AI cần thực hiện khi kích hoạt Cờ này:**
1. Hãy quét lại lịch sử chat ngay phía trên để nhận diện **"Quy tắc/Giải pháp"** tuyệt vời nhất vừa được chốt.
2. Phân tích xem Quy tắc đó thuộc về Lĩnh vực nào (Ví dụ: `omnipos-architecture` cho rule về cấu trúc gốc, data, api; `frontend-design` cho rule về React/CSS/UI; hoặc các thư mục tương tự).
3. Đọc (view_file) file `SKILL.md` của Lĩnh vực đó.
4. Viết bổ sung (replace/write) quy tắc mới vào cuối tệp hoặc vào chuyên mục phù hợp.
5. Chạy command `git add` và `git commit` để đẩy tài liệu thiết kế mới lên kho lưu trữ.
6. Báo cáo bằng tiếng Việt cho người dùng: "Done! Đạo luật đã được ghi ấn vào skill [Tên Skill]."
