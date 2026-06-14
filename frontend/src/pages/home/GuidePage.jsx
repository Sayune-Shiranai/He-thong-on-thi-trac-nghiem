import React from 'react';
import './GradeListPage.css';

const STEPS = [
  { icon:'🏠', title:'Bước 1 — Tìm đề thi', desc:'Vào trang chủ, chọn "LỚP" hoặc "MÔN HỌC" trên thanh điều hướng, hoặc dùng "TÌM KIẾM NÂNG CAO" để lọc theo tên, lớp, môn và số câu hỏi.' },
  { icon:'📄', title:'Bước 2 — Xem chi tiết đề thi', desc:'Bấm "Xem đề →" trên thẻ đề thi để xem nội dung đề (PDF/ảnh) và thông tin: thời gian làm bài, số câu hỏi, môn học.' },
  { icon:'🔑', title:'Bước 3 — Đăng nhập để làm bài', desc:'Nhấn "Bắt đầu" để vào làm bài. Nếu chưa có tài khoản, hệ thống sẽ chuyển bạn sang trang đăng ký/đăng nhập. Sau khi đăng nhập, bạn sẽ được đưa trở lại đề thi.' },
  { icon:'✍️', title:'Bước 4 — Làm bài thi', desc:'Chọn đáp án A, B, C hoặc D cho từng câu hỏi ở bảng bên phải. Đồng hồ sẽ tự động đếm thời gian làm bài của bạn.' },
  { icon:'✅', title:'Bước 5 — Nộp bài', desc:'Khi hoàn thành, bấm nút "HOÀN THÀNH" (màu đỏ) để nộp bài. Hệ thống sẽ tự động chấm điểm.' },
  { icon:'📊', title:'Bước 6 — Xem kết quả', desc:'Sau khi nộp, bạn sẽ thấy điểm số, số câu đúng/sai, và bảng đáp án (xanh = đúng, đỏ = sai). Có thể bấm "THI LẠI" hoặc "QUAY LẠI" trang chủ.' },
  { icon:'📈', title:'Bước 7 — Xem lịch sử', desc:'Vào mục "History" trong menu người dùng (góc trên bên phải) để xem lại tất cả các lần thi đã hoàn thành.' },
];

const FAQS = [
  { q:'Tôi có thể xem đề thi mà không cần đăng nhập?', a:'Có. Bạn có thể xem danh sách đề và chi tiết đề thi tự do. Chỉ khi bấm "Bắt đầu" để làm bài mới cần đăng nhập.' },
  { q:'Tôi quên đăng nhập, làm sao xem lại kết quả cũ?', a:'Đăng nhập bằng đúng tài khoản đã làm bài, sau đó vào "History" trong menu góc phải.' },
];

export default function GuidePage() {
  return (
    <div className="grade-list-page">
      <h1 className="grade-list-title">Hướng dẫn sử dụng</h1>
      <p className="grade-list-sub">Các bước để tìm và làm bài thi trên ExamFlow</p>

      <div className="grade-list">
        {STEPS.map(step => (
          <div key={step.title} className="grade-item" style={{ cursor:'default' }}>
            <div style={{
              width:44, height:44, borderRadius:'50%',
              background:'var(--bg-secondary)', display:'flex',
              alignItems:'center', justifyContent:'center',
              fontSize:'1.4rem', flexShrink:0,
            }}>
              {step.icon}
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:'1rem', marginBottom:4, color:'var(--text-primary)' }}>
                {step.title}
              </div>
              <div style={{ fontSize:'0.88rem', color:'var(--text-secondary)', lineHeight:1.6 }}>
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:40 }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:400, marginBottom:16, color:'var(--text-primary)' }}>
          Câu hỏi thường gặp
        </h2>
        <div className="grade-list">
          {FAQS.map(f => (
            <div key={f.q} className="grade-item" style={{ cursor:'default', alignItems:'flex-start', flexDirection:'column', gap:6 }}>
              <strong style={{ color:'var(--text-primary)' }}>{f.q}</strong>
              <span style={{ fontSize:'0.88rem', color:'var(--text-secondary)' }}>{f.a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
