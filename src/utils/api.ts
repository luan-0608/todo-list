import type { Task } from "../stores/taskStore";

// --- PROMPT CREATION ---
const systemPromptTemplate = `Bạn là một trợ lý cá nhân thông minh và chuyên nghiệp, được tích hợp trong một ứng dụng To-do. Hôm nay là {today}.
Nhiệm vụ của bạn là phân tích yêu cầu của người dùng, làm giàu thông tin và chuyển đổi nó thành một đối tượng JSON có cấu trúc để quản lý công việc hiệu quả.

**QUY TẮC VÀ KHẢ NĂNG:**
1.  **Tóm tắt tiêu đề (title):** Rút gọn yêu cầu của người dùng thành một tiêu đề ngắn gọn, súc tích, chỉ giữ lại ý chính.
2.  **Tạo mô tả chi tiết (description):**
    *   Dựa vào tiêu đề, hãy tạo một mô tả chi tiết, hữu ích, mang tính gợi mở và hướng dẫn.
    *   Nếu yêu cầu là một công việc phức tạp (như nấu ăn, lên kế hoạch), hãy chia nhỏ thành các bước, liệt kê nguyên liệu, hoặc đưa ra gợi ý cụ thể trong phần mô tả.
3.  **Tạo công việc con (subtasks):**
    *   **QUAN TRỌNG:** Nếu yêu cầu của người dùng liệt kê rõ ràng các hành động hoặc các mục cần làm (ví dụ: "đi tắm biển, ăn hải sản, massage"), hãy tách chúng thành các công việc con trong mảng \`subtasks\`.
    *   Mỗi công việc con phải là một hành động cụ thể.
    *   Nếu không có công việc con rõ ràng, hãy trả về một mảng rỗng \`[]\`.
4.  **Sửa lỗi & Thêm dấu:** Tự động sửa lỗi chính tả và thêm dấu tiếng Việt cho cả tiêu đề và mô tả.
5.  **Suy luận ngữ cảnh:** Phân tích các từ khóa về thời gian (ví dụ: 'ngày mai', 'thứ 6 tới'), độ ưu tiên ('!gấp', '!cao'), và thẻ ('#côngviệc').
6.  **Định dạng JSON nghiêm ngặt:** LUÔN LUÔN chỉ trả về một đối tượng JSON hợp lệ. KHÔNG trả về bất kỳ văn bản giải thích nào khác.

**ĐỊNH DẠNG JSON BẮT BUỘC:**
{
  "title": "string (ngắn gọn, súc tích)",
  "description": "string (chi tiết, sử dụng Markdown, không để trống)",
  "tags": ["string"],
  "priority": "'high' | 'medium' | 'low'",
  "deadline": "string (YYYY-MM-DD)",
  "subtasks": [{ "title": "string", "completed": false }]
}

**VÍ DỤ 1 (CÔNG VIỆC ĐƠN GIẢN):**
-   **Người dùng:** "lam bai tap toan chieu mai !gap #truonghoc"
-   **Bạn trả về:**
    {
      "title": "Làm bài tập toán",
      "description": "Hoàn thành các bài tập toán được giao để chuẩn bị cho buổi học chiều mai.",
      "tags": ["truonghoc"],
      "priority": "high",
      "deadline": "{tomorrow}",
      "subtasks": []
    }

**VÍ DỤ 2 (CÔNG VIỆC CÓ CÔNG VIỆC CON):**
-   **Người dùng:** "Lập kế hoạch đi biển 2 ngày, cần đi tắm biển, ăn hải sản, và massage thư giãn #dulich"
-   **Bạn trả về:**
    {
      "title": "Lập kế hoạch đi biển 2 ngày",
      "description": "Tổ chức một chuyến đi biển kéo dài 2 ngày với các hoạt động thư giãn và ẩm thực.",
      "tags": ["dulich"],
      "priority": "medium",
      "deadline": "{weekend}",
      "subtasks": [
        { "title": "Đi tắm biển", "completed": false },
        { "title": "Ăn hải sản", "completed": false },
        { "title": "Massage thư giãn", "completed": false }
      ]
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

// --- UTILITY FUNCTIONS ---
const extractJsonFromString = (text: string): string | null => {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```|({[\s\S]*})/;
  const match = text.match(jsonRegex);
  if (match) {
    // Nếu có khối ```json, trả về nội dung bên trong. Nếu không, trả về đối tượng JSON đầu tiên tìm thấy.
    return match[1] || match[2];
  }
  return null;
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
    const rawContent = result.choices[0]?.message?.content;

    if (result.usage) {
      console.log("Token usage:", result.usage);
    } else {
      console.log("Token usage data is not available for this model.");
    }

    if (!rawContent) {
      throw new Error("Không nhận được nội dung hợp lệ từ AI.");
    }

    const jsonString = extractJsonFromString(rawContent);

    if (!jsonString) {
      console.error("Raw content from AI:", rawContent);
      throw new Error("Không thể trích xuất chuỗi JSON từ phản hồi của AI.");
    }

    const taskData = JSON.parse(jsonString);
    return {
      title: taskData.title || "Công việc chưa có tiêu đề",
      description: taskData.description || "",
      tags: taskData.tags || [],
      priority: taskData.priority || "medium",
      deadline: taskData.deadline || new Date().toISOString().split("T")[0],
      completedAt: null,
      subtasks: taskData.subtasks || [],
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
    subtasks: [],
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

// --- SUGGESTION PROMPT ---
const suggestionPromptTemplate = `Bạn là một chuyên gia tư vấn năng suất và lập kế hoạch.
Nhiệm vụ của bạn là nhận một công việc (gồm tiêu đề và mô tả) và đưa ra các gợi ý cụ thể, các bước thực hiện chi tiết để hoàn thành công việc đó.

**QUY TẮC:**
1.  **Phân tích công việc:** Đọc kỹ tiêu đề và mô tả để hiểu rõ mục tiêu.
2.  **Chia nhỏ công việc:** Nếu công việc lớn, hãy chia nó thành các bước nhỏ, rõ ràng, có thể hành động được.
3.  **Đưa ra lời khuyên hữu ích:** Cung cấp các mẹo, thủ thuật, hoặc các phương pháp tốt nhất liên quan đến công việc.
4.  **Sử dụng Markdown:** Định dạng câu trả lời của bạn bằng Markdown (gạch đầu dòng, in đậm) để dễ đọc.
5.  **Tập trung vào hành động:** Câu trả lời của bạn nên tập trung vào "làm thế nào để thực hiện".

**VÍ DỤ:**
-   **Công việc nhận được:**
    {
      "title": "Học React trong 1 tuần",
      "description": "Cần học những kiến thức cơ bản về React để chuẩn bị cho dự án mới."
    }
-   **Bạn trả về (văn bản thuần túy, sử dụng Markdown):**
    "Dưới đây là lộ trình gợi ý để bạn bắt đầu với React trong một tuần:\n\n**Ngày 1-2: Nền tảng JavaScript & JSX**\n*   Ôn lại các khái niệm ES6 quan trọng: \`let\`, \`const\`, arrow functions, \`map\`, \`filter\`.\n*   Tìm hiểu về JSX - cú pháp đặc biệt của React.\n\n**Ngày 3-4: Components & Props**\n*   Hiểu về Function Components và Class Components.\n*   Học cách truyền dữ liệu từ component cha xuống con bằng \`props\`.\n\n**Ngày 5-6: State & Lifecycle**\n*   Nắm vững hook \`useState\` để quản lý trạng thái.\n*   Tìm hiểu hook \`useEffect\` để xử lý các side effects (ví dụ: gọi API).\n\n**Ngày 7: Luyện tập**\n*   Xây dựng một ứng dụng To-do list đơn giản để củng cố kiến thức."

---
**CÔNG VIỆC CẦN GỢI Ý:**
{task}
`;

export const getTaskSuggestions = async (
  task: Task,
  apiKey: string,
  apiUrl: string,
  modelName: string
): Promise<string> => {
  const prompt = suggestionPromptTemplate.replace('{task}', JSON.stringify({ title: task.title, description: task.description }, null, 2));

  const payload = {
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
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
      throw new Error(`Lỗi API: ${response.statusText}`);
    }

    const result: ApiResponse = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Không nhận được gợi ý từ AI.");
    }

    return content;
  } catch (error: any) {
    console.error("Lỗi khi lấy gợi ý:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Lỗi kết nối mạng hoặc CORS: Không thể gửi yêu cầu đến máy chủ AI. Vui lòng kiểm tra kết nối internet và cấu hình CORS."
      );
    }
    if (error instanceof SyntaxError) {
      console.error("JSON Parsing Error in suggestions:", error);
      throw new Error("AI đã trả về một định dạng không hợp lệ cho gợi ý.");
    }
    throw new Error(
      error.message || "Đã xảy ra lỗi khi kết nối đến dịch vụ AI."
    );
  }
};