# Kế hoạch Phát triển: Giao diện Quản lý Công việc (Cập nhật)

Đây là kế hoạch chi tiết được cập nhật dựa trên mã nguồn hiện tại của dự án. Các mục được đánh dấu `[x]` là đã hoàn thành và có thể xác minh trong code. Các mục `[ ]` là các tính năng chưa được triển khai.

---

### **Giai đoạn 1: Nền tảng và Giao diện Cốt lõi (Đã hoàn thành)**

_Mục tiêu: Xây dựng giao diện trực quan, cho phép người dùng xem và quản lý công việc._

- [x] **1. Thiết lập Dự án và Cấu trúc**
  - [x] Khởi tạo dự án với Vite, React, TypeScript.
  - [x] Cấu trúc thư mục rõ ràng: `components`, `features`, `hooks`, `layouts`, `stores`.
  - [x] Cài đặt các thư viện cần thiết: `zustand`, `@dnd-kit`, `recharts`.
- [x] **2. Xây dựng Giao diện Lưới (Grid View)**
  - [x] Triển khai layout Masonry (`react-masonry-css`) trong `TaskView.tsx`.
  - [x] Tạo component `TaskCard.tsx` để hiển thị thông tin chi tiết công việc.
- [x] **3. Thiết kế Chi tiết cho `TaskCard`**
  - [x] Hiển thị đầy đủ: Tiêu đề, Mô tả, Tags, Deadline, Thanh tiến độ.
  - [x] Các nút hành động (Hoàn thành, Sửa, Xóa) được hiển thị khi hover.
- [x] **4. Triển khai Logic Màu sắc và Trạng thái**
  - [x] Áp dụng màu sắc ưu tiên cho viền thẻ.
  - [x] Logic thay đổi màu deadline khi sắp đến hạn.

---

### **Giai đoạn 2: Chức năng Tương tác Cốt lõi (Đã hoàn thành)**

_Mục tiêu: Cung cấp các chức năng CRUD và tương tác nâng cao._

- [x] **1. Quản lý Trạng thái với Zustand**
  - [x] Thiết lập `taskStore.ts` để quản lý toàn bộ trạng thái liên quan đến công việc, modal, và cài đặt.
- [x] **2. Triển khai Chức năng CRUD cho Công việc**
  - [x] `TaskModal.tsx` và `TaskForm.tsx` cho phép **Tạo** và **Chỉnh sửa** công việc.
  - [x] Logic **Xóa** và **Hoàn thành** công việc được xử lý trong `taskStore`.
- [x] **3. Triển khai Tương tác Nâng cao**
  - [x] `Tooltip` (`react-tooltip`) hiển thị thông tin chi tiết cho tags.
  - [x] Hiệu ứng `rippleEffect` khi click đã được triển khai trong `utils/rippleEffect.ts`.
- [x] **4. Triển khai Chức năng Kéo-Thả (Drag & Drop)**
  - [x] Tích hợp `@dnd-kit/core` và `@dnd-kit/sortable` trong `TaskView.tsx` để sắp xếp lại các công việc.

---

### **Giai đoạn 3: Tích hợp Lịch và AI (Cơ bản hoàn thành)**

_Mục tiêu: Mở rộng chức năng với các tính năng thông minh và chế độ xem lịch._

- [x] **1. Xây dựng Giao diện Lịch (`CalendarView`)**
  - [x] Component `CalendarView.tsx` đã được tạo để hiển thị công việc theo tuần.
  - [x] Đánh dấu ngày hiện tại và hiển thị các công việc.
- [ ] **2. Tương tác trên Lịch**
  - [x] Click để mở rộng xem chi tiết công việc.
  - [x] Nút điều hướng (tuần trước, tuần sau, hôm nay) đã có.
  - [ ] **Cần làm:** Kéo-thả công việc giữa các ngày trong lịch để thay đổi deadline. _(Tính năng này đang tạm hoãn)_.
- [x] **3. Xây dựng Khu vực Nhập liệu Thông minh (`SmartInput`)**
  - [x] Component `SmartInput.tsx` đã được tạo.
  - [x] Tích hợp logic gọi API (hiện tại là giả lập trong `utils/api.ts`) để phân tích văn bản.
- [x] **4. Tích hợp AI (Giả lập)**
  - [x] `AiSettingsModal.tsx` đã được tạo để chứa các cài đặt AI.
  - [x] Logic phân tích và đề xuất công việc từ AI được giả lập.

---

### **Giai đoạn 4: Cá nhân hóa và Trải nghiệm Người dùng (Đã hoàn thành)**

_Mục tiêu: Nâng cao trải nghiệm người dùng với các tính năng tùy chỉnh._

- [x] **1. Chế độ Focus và Pomodoro**
  - [x] Logic làm mờ các task khác khi một task được focus (`focus-mode-active` trong `App.tsx`).
  - [x] Tích hợp `PomodoroTimer.tsx` với nút bật/tắt trong `TopControls.tsx`.
- [x] **2. Hệ thống Thống kê và Động lực**
  - [x] `StatsDashboard.tsx` sử dụng `recharts` để hiển thị biểu đồ hoàn thành.
  - [x] `BadgesDisplay.tsx` hiển thị các huy hiệu ảo.
  - [ ] **Cập nhật:** Tính năng lịch streak đã được loại bỏ để tập trung vào các chức năng cốt lõi.
- [x] **3. Tùy chỉnh Giao diện**
  - [x] Chế độ Sáng/Tối được quản lý bởi `useTheme.ts` và `ThemeSwitcher.tsx`.

---

### **Giai đoạn 5: Tính năng Nâng cao và Responsive (Cần thực hiện)**

_Mục tiêu: Hoàn thiện sản phẩm với các tính năng chuyên sâu và đảm bảo hoạt động trên mọi thiết bị._

- [ ] **1. Xây dựng các Chế độ Xem Khác**
  - [ ] **List View**: Hiển thị dạng bảng, cho phép sắp xếp theo cột.
  - [ ] **Mindmap View**: Tích hợp thư viện biểu đồ, cho phép tạo sơ đồ tư duy từ công việc.
- [ ] **2. Tích hợp và Đồng bộ hóa**
  - [ ] API để đồng bộ với Google Calendar/Outlook.
  - [ ] Chức năng Import/Export dữ liệu (CSV, JSON).
- [ ] **3. Responsive Design**
  - [ ] Tối ưu hóa giao diện cho thiết bị di động (Mobile).
  - [ ] Tối ưu hóa giao diện cho máy tính bảng (Tablet).
- [ ] **4. Cải thiện UX Nâng cao**
  - [ ] Triển khai hệ thống **Phím tắt** (hotkeys).
  - [ ] Xây dựng **Command Palette** (ví dụ: Ctrl+K) để truy cập nhanh chức năng.

---

### **Giai đoạn 6: Hoàn thiện và Triển khai (Cần thực hiện)**

_Mục tiêu: Kiểm thử toàn diện, tối ưu hóa hiệu năng và chuẩn bị cho việc phát hành._

- [ ] **1. Kiểm thử (Testing)**
  - [ ] Viết Unit Test cho các store và component phức tạp.
  - [ ] Viết Integration Test cho các luồng CRUD.
  - [ ] Kiểm thử End-to-End (E2E) với Cypress hoặc Playwright.
- [ ] **2. Tối ưu hóa Hiệu năng**
  - [ ] Áp dụng code splitting cho các component lớn (ví dụ: `CalendarView`, `StatsDashboard`).
  - [ ] Tối ưu hóa việc render lại của các component khi state thay đổi.
- [ ] **3. Tài liệu hóa (Documentation)**
  - [ ] Viết tài liệu hướng dẫn sử dụng chi tiết cho người dùng cuối.
  - [ ] Hoàn thiện các bình luận trong mã nguồn (JSDoc/TSDoc).
- [ ] **4. Chuẩn bị Triển khai (Deployment)**
  - [ ] Cấu hình môi trường production trong Vite.
  - [ ] Xây dựng quy trình CI/CD tự động build và deploy.
