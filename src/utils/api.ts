import type { Task } from "../stores/taskStore";

// --- PROMPT CREATION ---
const createSystemPrompt = () => {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      "deadline": "${new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0]}"
    }
`;
};

// --- API CALL LOGIC ---
const fetchFromApi = async (
  text: string,
  apiKey: string,
  apiUrl: string,
  modelName: string
): Promise<Omit<Task, "id" | "createdAt">> => {
  const payload = {
    model: modelName,
    messages: [
      { role: "system", content: createSystemPrompt() },
      { role: "user", content: text },
    ],
    temperature: 0.7,
    top_p: 1,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.error?.message || `Lỗi API: ${response.statusText}`;
      console.error("API Error Details:", errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Không nhận được nội dung hợp lệ từ AI.");
    }

    const taskData = JSON.parse(content);
    return {
      title: taskData.title || "Công việc chưa có tiêu đề",
      description: taskData.description || "",
      tags: taskData.tags || [],
      priority: taskData.priority || "medium",
      deadline: taskData.deadline || new Date().toISOString().split("T")[0],
      completedAt: null,
    };
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      console.error("JSON Parsing Error:", error);
      throw new Error("AI đã trả về một định dạng JSON không hợp lệ.");
    }
    console.error("API Fetch Error:", error);
    throw new Error(
      error.message || "Đã xảy ra lỗi khi kết nối đến dịch vụ AI."
    );
  }
};

// --- MOCK LOGIC ---
const getMockedTask = (text: string): Omit<Task, "id" | "createdAt"> => {
  console.log("Đang sử dụng logic giả lập (mock) để phân tích.");
  // ... (giữ nguyên logic giả lập của bạn ở đây nếu cần)
  return {
    title: `(Mock) ${text}`,
    description: `Mô tả giả lập cho: "${text}"`,
    tags: ["mock"],
    priority: "medium",
    deadline: new Date().toISOString().split("T")[0],
    completedAt: null,
  };
};

/**
 * Phân tích văn bản để tạo một công việc thông minh, sử dụng API thật hoặc logic giả lập.
 */
export const getSmartTask = async (
  text: string,
  apiKey: string,
  apiUrl: string,
  modelName: string
): Promise<Omit<Task, "id" | "createdAt">> => {
  if (!apiUrl || !apiKey) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockedTask(text)), 500); // Giả lập độ trễ
    });
  }
  return fetchFromApi(text, apiKey, apiUrl, modelName);
};