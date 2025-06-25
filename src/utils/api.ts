import type { Task } from '../stores/taskStore';

// --- LOGIC GIẢ LẬP ---
const getMockedTask = (text: string): Omit<Task, 'id'> => {
  console.log("Đang sử dụng logic giả lập (mock) để phân tích.");
  let title = text;
  let deadline = new Date();
  const tags: string[] = [];
  let priority: 'high' | 'medium' | 'low' = 'medium';

  if (text.toLowerCase().includes('ngày mai')) {
    deadline.setDate(deadline.getDate() + 1);
  }
  const tagMatches = text.match(/#(\w+)/g);
  if (tagMatches) {
    tagMatches.forEach(tag => tags.push(tag.replace('#', '')));
  }
  if (text.includes('!high')) priority = 'high';
  if (text.includes('!low')) priority = 'low';
  title = text.replace(/ngày mai/i, '').replace(/#\w+/g, '').replace(/!(high|medium|low)/g, '').trim();

  return {
    title: title || 'Công việc mới (giả lập)',
    description: `Mô tả được tạo bởi AI giả lập cho: "${text}"`,
    tags,
    priority,
    deadline: deadline.toISOString().split('T')[0],
    progress: 0,
    completedAt: null,
  };
};
// --- KẾT THÚC LOGIC GIẢ LẬP ---


const createSystemPrompt = () => {
  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  return `Bạn là một trợ lý cá nhân thông minh và chuyên nghiệp, được tích hợp trong một ứng dụng To-do. Hôm nay là ${today}.
Nhiệm vụ của bạn là phân tích yêu cầu của người dùng, làm giàu thông tin và chuyển đổi nó thành một đối tượng JSON có cấu trúc.

**QUY TẮC VÀ KHẢ NĂNG:**
1.  **Sửa lỗi & Thêm dấu:** Tự động sửa lỗi chính tả và thêm dấu tiếng Việt cho văn bản đầu vào. Ví dụ: "di choi voi ban" -> "Đi chơi với bạn".
2.  **Tạo mô tả thông minh:** Dựa vào tiêu đề, hãy tạo một trường "description" ngắn gọn, hữu ích, gợi ý mục tiêu hoặc các bước tiếp theo. KHÔNG được để trống mô tả trừ khi không thể suy luận.
3.  **Suy luận ngữ cảnh:** Phân tích các từ khóa về thời gian (ví dụ: 'ngày mai', 'thứ 6 tới', 'cuối tuần'), độ ưu tiên ('!gấp', '!cao', '!bình thường'), và thẻ ('#côngviệc', '#cá nhân').
4.  **Định dạng JSON nghiêm ngặt:** LUÔN LUÔN chỉ trả về một đối tượng JSON hợp lệ. KHÔNG trả về bất kỳ văn bản giải thích, markdown hay ghi chú nào khác.

**ĐỊNH DẠNG JSON BẮT BUỘC:**
{
  "title": "string (đã sửa lỗi và thêm dấu)",
  "description": "string (mô tả thông minh, không để trống)",
  "tags": ["string"],
  "priority": "'high' | 'medium' | 'low'",
  "deadline": "string (định dạng YYYY-MM-DD)"
}

**VÍ DỤ:**
-   Người dùng nhập: "lam bai tap toan chieu mai !gap #truonghoc"
-   Bạn trả về:
    {
      "title": "Làm bài tập toán chiều mai",
      "description": "Hoàn thành các bài tập toán được giao để chuẩn bị cho buổi học tiếp theo.",
      "tags": ["truonghoc"],
      "priority": "high",
      "deadline": "${new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}"
    }
`;
};


/**
 * Gửi văn bản đến API OpenAI hoặc sử dụng logic giả lập.
 */
export const getSmartTask = async (
  text: string,
  apiKey: string,
  apiUrl: string,
  modelName: string
): Promise<Omit<Task, 'id'>> => {
  // Nếu không có URL hoặc API Key, sử dụng logic giả lập
  if (!apiUrl || !apiKey) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getMockedTask(text));
      }, 1000); // Giả lập độ trễ mạng 1 giây
    });
  }

  // Nếu có URL và Key, thực hiện lệnh gọi API thật
  const payload = {
    model: modelName,
    messages: [
      { role: 'system', content: createSystemPrompt() }, // Tạo prompt động với ngày hiện tại
      { role: 'user', content: text },
    ],
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Cố gắng đọc lỗi từ API, nếu không được thì trả về lỗi chung
    try {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Lỗi API: ${response.statusText}`);
    } catch (e) {
      throw new Error(`Lỗi mạng hoặc không thể phân tích phản hồi lỗi: ${response.statusText}`);
    }
  }

  const result = await response.json();
  const content = result.choices[0]?.message?.content;

  if (!content) {
    throw new Error('Không nhận được nội dung hợp lệ từ AI.');
  }

  try {
    const taskData = JSON.parse(content);
    return {
      title: taskData.title || 'Công việc chưa có tiêu đề',
      description: taskData.description || '',
      tags: taskData.tags || [],
      priority: taskData.priority || 'medium',
      deadline: taskData.deadline || new Date().toISOString().split('T')[0],
      progress: 0,
      completedAt: null,
    };
  } catch (e) {
    throw new Error('AI đã trả về một định dạng JSON không hợp lệ.');
  }
};