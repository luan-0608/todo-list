### **Kế hoạch Phát triển: Giao diện Quản lý Công việc Thông minh**

Dưới đây là danh sách công việc chi tiết được phân chia theo các giai đoạn phát triển, từ việc xây dựng nền tảng (MVP) cho đến các tính năng nâng cao và hoàn thiện.

---

### **Giai đoạn 1: Nền tảng và Giao diện Cốt lõi (MVP)**

_Mục tiêu: Xây dựng giao diện trực quan cơ bản, cho phép người dùng xem các công việc._

- [x] **1. Thiết lập Dự án và Cấu trúc Thư mục**
  - [x] Khởi tạo dự án (Vite, Next.js, etc.).
  - [x] Cấu trúc thư mục cho components, styles, assets.
  - [x] Cài đặt các thư viện cần thiết (framework UI, state management).
- [x] **2. Xây dựng Giao diện Lưới (Grid View)**
  - [x] Triển khai layout **Masonry** cho danh sách công việc.
  - [x] Tạo component `TaskCard` (Thẻ công việc) với cấu trúc HTML/CSS cơ bản.
- [x] **3. Thiết kế Chi tiết cho `TaskCard` (Giao diện tĩnh)**
  - [x] Hiển thị **Tiêu đề** (font, size, ellipsis).
  - [x] Hiển thị **Mô tả** (giới hạn 3 dòng).
  - [x] Hiển thị **Tags** với màu nền pastel.
  - [x] Hiển thị **Deadline** với icon đồng hồ.
  - [x] Thêm **Thanh tiến độ** (gradient tĩnh).
  - [x] Thiết kế các **Nút hành động** (Hoàn thành, Sửa, Xóa) và chỉ hiển thị khi hover.
- [x] **4. Triển khai Logic Màu sắc và Trạng thái**
  - [x] Áp dụng màu sắc ưu tiên cho thẻ: Đỏ, Cam, Xanh, Xám.
  - [x] Thêm viền/hiệu ứng sáng tương ứng.
  - [x] Logic thay đổi màu deadline khi sắp đến hạn.

---

### **Giai đoạn 2: Chức năng Tương tác Cốt lõi**

_Mục tiêu: Làm cho giao diện có thể tương tác được, cho phép người dùng quản lý công việc (CRUD)._

- [x] **1. Quản lý Trạng thái (State Management)**
  - [x] Thiết lập state management (Redux, Zustand, Context API) để quản lý danh sách công việc.
  - [x] Tạo mock data để phát triển giao diện.
- [x] **2. Triển khai Chức năng CRUD cho Công việc**
  - [x] Form/Modal để **Tạo** công việc mới.
  - [x] Chức năng **Chỉnh sửa** công việc (mở modal với dữ liệu hiện có).
  - [x] Chức năng **Xóa** công việc (với hộp thoại xác nhận).
  - [x] Chức năng **Hoàn thành** công việc (cập nhật trạng thái và thanh tiến độ).
- [x] **3. Triển khai Tương tác Nâng cao trên Thẻ**
  - [x] Nút "Xem thêm" cho mô tả dài.
  - [x] Tooltip hiển thị tất cả tags khi hover vào "+ n".
  - [x] Animation cho thanh tiến độ khi cập nhật.
  - [x] Animation cho nút hoàn thành khi click.
- [x] **4. Triển khai Chức năng Kéo-Thả (Drag & Drop)**
  - [x] Tích hợp thư viện kéo-thả (dnd-kit, react-beautiful-dnd).
  - [x] Thêm điểm kéo (handle) trên thẻ.
  - [x] Hiệu ứng nổi (elevation) và vùng sáng khi kéo.
  - [x] Cập nhật lại trạng thái/thứ tự công việc sau khi thả.

---

### **Giai đoạn 3: Tích hợp Lịch và AI**

_Mục tiêu: Mở rộng chức năng với các tính năng thông minh và chế độ xem lịch._

- [x] **1. Xây dựng Giao diện Lịch Tuần**
  - [x] Tạo layout 7 cột cho các ngày trong tuần.
  - [x] Header hiển thị tên ngày và ngày.
  - [x] Đánh dấu ngày hiện tại (viền gradient, nền nhẹ).
  - [x] Hiển thị các công việc dưới dạng thu gọn trong lịch.
- [x] **2. Triển khai Tương tác trên Lịch**
  - [x] Click để mở rộng xem chi tiết công việc.
  - [ ] Kéo-thả công việc giữa các ngày trong lịch để thay đổi deadline. (_Tạm hoãn do lỗi kỹ thuật_)
  - [x] Nút điều hướng (tuần trước, tuần sau, hôm nay).
- [x] **3. Xây dựng Khu vực Nhập liệu Thông minh**
  - [x] Tạo component `SmartInput` (textarea tự mở rộng).
  - [x] Placeholder và gợi ý cú pháp thông minh.
- [x] **4. Tích hợp AI - Nhận dạng Ngôn ngữ Tự nhiên (NLP)**
  - [x] Tích hợp logic gọi API (hiện tại là giả lập bằng hàm parse cục bộ).
  - [x] Phân tích và gạch chân các từ khóa về thời gian, ưu tiên (giả lập).
  - [x] Tự động điền các trường deadline, priority từ văn bản.
- [x] **5. Triển khai Chức năng Phân tích của AI**
  - [x] Nút "AI phân tích" với logic xử lý.
  - [x] API call đến backend AI để nhận đề xuất (giả lập).
  - [x] Hiển thị các đề xuất cho người dùng (tự động tạo task).

---

### **Giai đoạn 4: Cá nhân hóa và Trải nghiệm Người dùng**

_Mục tiêu: Nâng cao trải nghiệm người dùng với các tính năng tùy chỉnh và tạo động lực._

- [ ] **1. Phát triển Chế độ Focus**
  - [x] Logic làm mờ các task không quan trọng.
  - [x] Hiệu ứng spotlight cho task đang tập trung.
  - [x] Tích hợp đồng hồ Pomodoro.
    - [ ] **Cập nhật:** Bổ sung nút bật/tắt để người dùng có thể tùy ý ẩn/hiện đồng hồ.
- [ ] **2. Xây dựng Hệ thống Thống kê và Động lực**
  -   [x] Tạo Dashboard mini với biểu đồ hoàn thành.
  -   [ ] ~~Triển khai Streak calendar.~~
    - [ ] **Cập nhật:** Xóa bỏ tính năng lịch streak để tập trung vào các chức năng cốt lõi hơn.
  -   [x] Thiết kế hệ thống Huy hiệu ảo và thông báo khích lệ.
- [x] **3. Triển khai Tùy chỉnh Giao diện**
  - [x] Chế độ Sáng/Tối (Light/Dark Mode).
  -   [x] Tùy chọn màu chủ đạo.
  -   [x] Phát triển hệ thống theme.
- [x] **4. Hoàn thiện Animation và Hiệu ứng**
  - [x] Hiệu ứng gợn sóng (ripple effect) khi click.
  - [x] Transition mượt mà giữa các trạng thái.

---

### **Giai đoạn 5: Tính năng Nâng cao và Responsive**

_Mục tiêu: Hoàn thiện sản phẩm với các tính năng chuyên sâu và đảm bảo hoạt động trên mọi thiết bị._

- [ ] **1. Xây dựng các Chế độ Xem Khác**
  - [ ] **List View**: Hiển thị dạng bảng, cho phép sắp xếp.
  - [ ] **Mindmap View**: Tích hợp thư viện biểu đồ, cho phép zoom và tương tác.
- [ ] **2. Tích hợp và Đồng bộ hóa**
  - [ ] API để đồng bộ với Google Calendar/Outlook.
  - [ ] Chức năng Import/Export dữ liệu (CSV, JSON).
  - [ ] Thiết lập backup tự động.
- [ ] **3. Responsive Design**
  - [ ] Tối ưu hóa cho **Di động** (card stack, bottom sheet, thao tác vuốt).
  - [ ] Tối ưu hóa cho **Tablet** (split view, hỗ trợ bút cảm ứng).
- [ ] **4. Cải thiện UX Nâng cao**
  - [ ] Triển khai hệ thống **Phím tắt** (hotkeys).
  - [ ] Xây dựng **Command Palette** (VD: Ctrl+K).
  - [ ] Xây dựng trung tâm quản lý thông báo chi tiết.

---

### **Giai đoạn 6: Hoàn thiện và Triển khai**

_Mục tiêu: Kiểm thử toàn diện, tối ưu hóa hiệu năng và chuẩn bị cho việc phát hành._

- [ ] **1. Kiểm thử (Testing)**
  - [ ] Viết Unit Test cho các component quan trọng.
  - [ ] Viết Integration Test cho các luồng chức năng chính.
  - [ ] Kiểm thử End-to-End (E2E) với Cypress hoặc Playwright.
  - [ ] Kiểm thử thủ công trên nhiều trình duyệt và thiết bị.
- [ ] **2. Tối ưu hóa Hiệu năng**
  - [ ] Tối ưu hóa tốc độ tải trang (code splitting, lazy loading).
  - [ ] Đảm bảo animation mượt mà (sử dụng `requestAnimationFrame`).
  - [ ] Tối ưu hóa việc render lại của component.
- [ ] **3. Tài liệu hóa (Documentation)**
  - [ ] Viết tài liệu hướng dẫn sử dụng.
  - [ ] Ghi chú mã nguồn (code comments).
- [ ] **4. Chuẩn bị Triển khai (Deployment)**
  - [ ] Cấu hình môi trường production.
  - [ ] Xây dựng quy trình CI/CD.
  - [ ] Triển khai lên nền tảng hosting (Vercel, Netlify, etc.).
