import type { Task } from "../stores/taskStore";

// --- PROMPT CREATION ---
const systemPromptTemplate = `Bạn là một trợ lý cá nhân thông minh và chuyên nghiệp, được tích hợp trong một ứng dụng To-do. Hôm nay là {today}.
Nhiệm vụ của bạn là phân tích yêu cầu của người dùng, làm giàu thông tin và chuyển đổi nó thành một đối tượng JSON có cấu trúc để quản lý công việc hiệu quả.

**QUY TẮC VÀ KHẢ NĂNG:**
1.  **Tóm tắt tiêu đề (title):** Rút gọn yêu cầu của người dùng thành một tiêu đề ngắn gọn, súc tích, chỉ giữ lại ý chính.
2.  **Tạo mô tả chi tiết (description):**
    *   Dựa vào tiêu đề, hãy tạo một mô tả chi tiết, hữu ích, mang tính gợi mở và hướng dẫn.
    *   Nếu yêu cầu là một công việc phức tạp (như nấu ăn, lên kế hoạch), hãy chia nhỏ thành các bước, liệt kê nguyên liệu, hoặc đưa ra gợi ý cụ thể.
    *   **Sử dụng Markdown:** Dùng định dạng Markdown (in đậm, in nghiêng, gạch đầu dòng * hoặc -) để mô tả dễ đọc và có cấu trúc.
3.  **Sửa lỗi & Thêm dấu:** Tự động sửa lỗi chính tả và thêm dấu tiếng Việt cho cả tiêu đề và mô tả.
4.  **Suy luận ngữ cảnh:** Phân tích các từ khóa về thời gian (ví dụ: 'ngày mai', 'thứ 6 tới'), độ ưu tiên ('!gấp', '!cao'), và thẻ ('#côngviệc').
5.  **Định dạng JSON nghiêm ngặt:** LUÔN LUÔN chỉ trả về một đối tượng JSON hợp lệ. KHÔNG trả về bất kỳ văn bản giải thích nào khác.

**ĐỊNH DẠNG JSON BẮT BUỘC:**
{
  "title": "string (ngắn gọn, súc tích)",
  "description": "string (chi tiết, sử dụng Markdown, không để trống)",
  "tags": ["string"],
  "priority": "'high' | 'medium' | 'low'",
  "deadline": "string (YYYY-MM-DD)"
}

**VÍ DỤ 1 (CÔNG VIỆC ĐƠN GIẢN):**
-   **Người dùng:** "lam bai tap toan chieu mai !gap #truonghoc"
-   **Bạn trả về:**
    {
      "title": "Làm bài tập toán",
      "description": "Hoàn thành các bài tập toán được giao để chuẩn bị cho buổi học chiều mai.",
      "tags": ["truonghoc"],
      "priority": "high",
      "deadline": "{tomorrow}"
    }

**VÍ DỤ 2 (CÔNG VIỆC PHỨC TẠP):**
-   **Người dùng:** "cuoi tuan nau lau hai san dai gia dinh #bepnuc"
-   **Bạn trả về:**
    {
      "title": "Nấu lẩu hải sản cuối tuần",
      "description": "Chuẩn bị một nồi lẩu hải sản thịnh soạn cho cả gia đình vào cuối tuần.\\n\\n**Gợi ý nguyên liệu:**\\n*   **Nước dùng:** Xương ống, nấm, ngô ngọt, gia vị lẩu.\\n*   **Hải sản:** Tôm, mực, ngao, cá (tùy chọn).\\n*   **Thịt:** Ba chỉ bò Mỹ, gầu bò.\\n*   **Rau:** Rau muống, cải thảo, nấm kim châm.\\n*   **Ăn kèm:** Mì tôm, bún, váng đậu.\\n\\n**Các bước chuẩn bị:**\\n1.  Ninh xương làm nước dùng.\\n2.  Sơ chế sạch sẽ hải sản, thịt và rau.\\n3.  Bày biện các nguyên liệu ra đĩa cho đẹp mắt.",
      "tags": ["bepnuc"],
      "priority": "medium",
      "deadline": "{weekend}"
    }
`;

const createSystemPrompt = () => {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];
  const weekend = new Date(
    new Date().setDate(new Date().getDate() + (6 - new Date().getDay() + 7) % 7)
  )
    .toISOString()
    .split("T")[0];

  return systemPromptTemplate
    .replace("{today}", today)
    .replace("{tomorrow}", tomorrow)
    .replace("{weekend}", weekend);
};

// --- API INTERFACES ---
interface ApiChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface ApiUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface ApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ApiChoice[];
  usage?: ApiUsage | null; // Đánh dấu là tùy chọn
}

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
      // Đã loại bỏ system prompt để tăng tính tương thích
      { role: "user", content: `${createSystemPrompt()} ${text}` },
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

    const result: ApiResponse = await response.json();
    const content = result.choices[0]?.message?.content;

    // Log token usage for debugging or monitoring
    // Log token usage for debugging or monitoring
    if (result.usage) {
      console.log("Token usage:", result.usage);
    } else {
      console.log("Token usage data is not available for this model.");
    }

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
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Lỗi kết nối mạng: Không thể gửi yêu cầu đến máy chủ AI. Vui lòng kiểm tra kết nối internet và cấu hình CORS của máy chủ API."
      );
    }
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