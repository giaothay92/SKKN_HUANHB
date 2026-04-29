import { GoogleGenAI } from "@google/genai";
import { ReportData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';

const cleanText = (text: string) => {
  return text
    .replace(/^```markdown\n/, '')
    .replace(/^```\n/, '')
    .replace(/\n```$/, '')
    .replace(/^(Chào bạn|Dưới đây là|Sau đây là|Tôi xin gửi|Đây là).*?:?\n?/gi, '')
    .trim();
};

const getBaseContext = (data: Partial<ReportData>) => `
    Bạn là một chuyên gia giáo dục cao cấp tại Việt Nam, chuyên hướng dẫn viết Sáng kiến kinh nghiệm (SKKN) đạt giải cao.
    
    BỐI CẢNH QUẢN LÝ (CẬP NHẬT TỪ 01/07/2025):
    - Hệ thống chính quyền chỉ còn 2 cấp: Cấp Xã (địa phương) và Cấp Tỉnh. 
    - CẤP HUYỆN ĐÃ BỊ XÓA BỎ HOÀN TOÀN. 
    - Mầm non, Tiểu học, THCS: Thuộc sự quản lý của UBND cấp Xã. Các kiến nghị cần gửi về UBND cấp Xã.
    - THPT: Thuộc sự quản lý trực tiếp của Sở GD&ĐT cấp Tỉnh.
    - Trong văn bản, khi đề cập đến địa phương, chỉ nhắc đến Xã hoặc Tỉnh, tuyệt đối không dùng từ "Huyện" hay "Phòng GD&ĐT huyện".

    QUY TẮC ĐỊNH DẠNG TOÁN HỌC & KHOA HỌC (QUAN TRỌNG):
    1. Toán đơn giản: Ưu tiên dùng Unicode trực tiếp (Ví dụ: x², x³, 10%, ±, ≠, ≥, ≤, ÷).
    2. Toán phức tạp: Chỉ dùng định dạng LaTeX được bao quanh bởi cặp dấu đô la và BẮT BUỘC có khoảng trắng ở hai đầu nội dung bên trong (Ví dụ: " $ \frac{a}{b} $ ", " $ \sqrt{x} $ ") cho phân số, căn thức, hệ phương trình, tích phân.
    3. Hình học:
       - Góc 1 ký tự: Dùng mũ nhỏ và tuân thủ khoảng trắng (Ví dụ: $ \hat{A} $).
       - Góc 3 ký tự: Dùng mũ lớn và tuân thủ khoảng trắng (Ví dụ: $ \widehat{ABC} $).
       - Các ký hiệu khác (đường thẳng, tam giác, đồng dạng...) phải chuẩn xác về mặt sư phạm và luôn có khoảng trắng trong dấu $.
    
    THÔNG TIN ĐỀ TÀI:
    - Chủ đề: "${data.title}".
    ${data.focus ? `- Trọng tâm: ${data.focus}.` : ''}
    ${data.target ? `- Đối tượng/Phạm vi: ${data.target}.` : ''}
    ${data.region ? `- Đơn vị: ${data.region}.` : ''}
    ${data.year ? `- Năm học: ${data.year}.` : ''}
    
    YÊU CẦU NỘI DUNG:
    - Văn phong trang trọng, mang tính nghiên cứu thực tiễn, chuẩn mực sư phạm.
    - TUYỆT ĐỐI KHÔNG có lời dẫn hay kết luận của AI.
    - Trình bày rõ ràng bằng Markdown.
`;

export const generatePart1 = async (data: Partial<ReportData>): Promise<string> => {
  const prompt = `
    ${getBaseContext(data)}
    Hãy viết **I. PHẦN MỞ ĐẦU** cho báo cáo SKKN này.
    
    Yêu cầu các tiểu mục (dùng ##):
    1. Lý do chọn đề tài (Nêu bật tính cấp thiết, khó khăn trong giảng dạy tại đơn vị).
    2. Mục tiêu nghiên cứu.
    3. Đối tượng và phạm vi nghiên cứu.
    4. Phương pháp nghiên cứu.
  `;
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });
  return cleanText(response.text || '');
};

export const generatePart2A = async (data: Partial<ReportData>, prevContext: string): Promise<string> => {
  const prompt = `
    ${getBaseContext(data)}
    
    Nội dung trước đó: """${prevContext.substring(0, 500)}..."""

    Hãy viết mục: **II. NỘI DUNG - PHẦN 1: CƠ SỞ LÝ LUẬN VÀ THỰC TRẠNG**.
    1. Cơ sở lý luận: Các lý thuyết sư phạm liên quan đến "${data.focus || 'đề tài'}".
    2. Thực trạng: Phân tích thuận lợi, khó khăn tại địa phương (Xã/Tỉnh).
    3. Bảng số liệu khảo sát đầu năm (Dùng Markdown table).
  `;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });
  return cleanText(response.text || '');
};

export const generatePart2B = async (data: Partial<ReportData>, prevContextPart2A: string): Promise<string> => {
  const prompt = `
    ${getBaseContext(data)}
    
    Bối cảnh thực trạng: """${prevContextPart2A.substring(0, 500)}..."""
    
    Hãy viết mục quan trọng nhất: **PHẦN 2: CÁC GIẢI PHÁP THỰC HIỆN**.
    Đề xuất ít nhất 3 giải pháp cụ thể, sáng tạo. 
    
    LƯU Ý: Nếu đề tài liên quan đến Toán học/Hình học, hãy đưa vào các ví dụ minh họa cụ thể sử dụng đúng quy tắc định dạng: Unicode cho mũ đơn giản, LaTeX cho công thức phức tạp với khoảng trắng cách lề (ví dụ: $ \hat{A} $ cho góc 1 chữ, $ \widehat{ABC} $ cho góc 3 chữ).
  `;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });
  return cleanText(response.text || '');
};

export const generatePart2C = async (data: Partial<ReportData>, prevContextPart2B: string): Promise<string> => {
  const prompt = `
    ${getBaseContext(data)}
    
    Giải pháp đã nêu: """${prevContextPart2B.substring(0, 500)}..."""

    Hãy viết mục: **PHẦN 3: KẾT QUẢ ĐẠT ĐƯỢC**.
    1. Phân tích sự chuyển biến của học sinh.
    2. Bảng số liệu đối chứng TRƯỚC và SAU khi áp dụng giải pháp.
  `;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });
  return cleanText(response.text || '');
};

export const generatePart34 = async (data: Partial<ReportData>): Promise<string> => {
  const prompt = `
    ${getBaseContext(data)}
    
    Hãy viết **III. KẾT LUẬN VÀ KIẾN NGHỊ** cùng **IV. TÀI LIỆU THAM KHẢO**.
    
    LƯU Ý QUAN TRỌNG VỀ KIẾN NGHỊ: 
    - Nếu là cấp Mầm non, Tiểu học, THCS: Kiến nghị gửi đến UBND cấp Xã.
    - Nếu là cấp THPT: Kiến nghị gửi đến Sở GD&ĐT cấp Tỉnh.
    - TUYỆT ĐỐI KHÔNG nhắc đến cấp Huyện hay Phòng GD&ĐT huyện.
  `;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });
  return cleanText(response.text || '');
};