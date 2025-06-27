# Giao diện Quản lý Công việc Thông minh

Đây là một ứng dụng quản lý công việc hiện đại, được xây dựng bằng React, TypeScript và Vite. Ứng dụng cung cấp một giao diện trực quan, thông minh và có khả năng tùy biến cao để giúp bạn quản lý công việc hàng ngày một cách hiệu quả.

 <!-- Bạn có thể thay thế URL này bằng ảnh chụp màn hình thực tế của ứng dụng -->

## ✨ Tính năng nổi bật

- **Quản lý công việc CRUD:** Dễ dàng tạo, xem, cập nhật và xóa công việc.
- **Nhiều chế độ xem:**
  - **Grid View:** Dạng lưới Masonry linh hoạt.
  - **Calendar View:** Xem công việc theo lịch tuần.
- **Kéo và Thả:** Sắp xếp lại các công việc một cách trực quan.
- **Nhập liệu thông minh:** Sử dụng xử lý ngôn ngữ tự nhiên (giả lập) để tự động điền thông tin khi tạo công việc.
- **Chế độ Tập trung (Focus Mode):** Làm nổi bật công việc đang thực hiện và làm mờ các công việc khác.
- **Đồng hồ Pomodoro:** Tích hợp sẵn đồng hồ Pomodoro để quản lý thời gian tập trung.
- **Thống kê và Động lực:** Theo dõi tiến độ với biểu đồ và nhận huy hiệu ảo.
- **Tùy chỉnh giao diện:** Hỗ trợ chế độ Sáng/Tối (Light/Dark mode).

## 🚀 Bắt đầu

### Yêu cầu

- [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)

### Cài đặt

1.  **Clone repository về máy:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Cài đặt các dependencies:**
    Sử dụng npm:
    ```bash
    npm install
    ```
    Hoặc sử dụng yarn:
    ```bash
    yarn install
    ```

### Chạy ứng dụng

Để khởi động server phát triển, chạy lệnh sau:

```bash
npm run dev
```

Ứng dụng sẽ có sẵn tại địa chỉ `http://localhost:5173` (hoặc một cổng khác nếu cổng 5173 đã được sử dụng).

## 📖 Hướng dẫn sử dụng

- **Tạo công việc:**
  - Sử dụng ô "Nhập liệu thông minh" ở đầu trang. Gõ nội dung công việc và nhấn Enter.
  - Bạn có thể sử dụng ngôn ngữ tự nhiên, ví dụ: "Thiết kế giao diện cho trang chủ vào ngày mai lúc 3 giờ chiều #dựán @côngty P1" để hệ thống tự nhận diện deadline, tags, và độ ưu tiên.
  - Hoặc nhấn vào nút "Thêm công việc" để mở modal và điền đầy đủ thông tin.
- **Thay đổi chế độ xem:**
  - Nhấn vào các icon Lưới (Grid) hoặc Lịch (Calendar) ở phần header để chuyển đổi qua lại.
- **Sử dụng Pomodoro:**
  - Nhấn vào icon đồng hồ ở góc trên bên phải để bật/tắt đồng hồ Pomodoro.
- **Chế độ Tập trung:**
  - Di chuột vào một thẻ công việc và nhấn vào icon "Focus" để kích hoạt. Toàn bộ giao diện sẽ làm mờ, chỉ để lại công việc bạn đang tập trung. Nhấp ra ngoài để thoát.
- **Chuyển đổi Theme:**
  - Nhấn vào icon Mặt trời/Mặt trăng để chuyển đổi giữa chế độ Sáng và Tối.

## 📜 Các script có sẵn

- `npm run dev`: Chạy ứng dụng ở chế độ phát triển.
- `npm run build`: Build ứng dụng cho môi trường production.
- `npm run lint`: Chạy ESLint để kiểm tra lỗi và định dạng mã nguồn.
- `npm run preview`: Xem trước bản build production.
