import React,{useState,useEffect} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import {examService} from '../../services/examService';
import {formatDuration} from '../../utils/helpers';
import './DashboardPage.css';

const MOCK_EXAMS=[
  {id:'1',title:'Lập trình JavaScript Cơ bản',description:'Kiểm tra kiến thức JS: closures, promises, event loop và nhiều hơn nữa.',duration:30,questionCount:20,difficulty:'medium',category:'Lập trình',passingScore:70},
  {id:'2',title:'React & Frontend Hiện đại',description:'Hooks, context, hiệu suất và các mẫu component trong React.',duration:45,questionCount:30,difficulty:'hard',category:'Lập trình',passingScore:65},
  {id:'3',title:'Cấu trúc Dữ liệu Cơ bản',description:'Mảng, danh sách liên kết, cây, đồ thị — nền tảng khoa học máy tính.',duration:60,questionCount:25,difficulty:'easy',category:'Lý thuyết',passingScore:60},
  {id:'4',title:'SQL & Thiết kế Cơ sở dữ liệu',description:'Join, index, chuẩn hoá và tối ưu câu truy vấn.',duration:40,questionCount:22,difficulty:'medium',category:'Cơ sở dữ liệu',passingScore:70},
  {id:'5',title:'Thiết kế Hệ thống',description:'Khả năng mở rộng, cân bằng tải, bộ nhớ đệm và hệ thống phân tán.',duration:90,questionCount:40,difficulty:'hard',category:'Kiến trúc',passingScore:65},
  {id:'6',title:'HTML & CSS Cơ bản',description:'HTML ngữ nghĩa, Flexbox, Grid, animation và trợ năng.',duration:25,questionCount:15,difficulty:'easy',category:'Lập trình',passingScore:75},
];

const DIFF_LABEL={easy:'Dễ',medium:'Trung bình',hard:'Khó'};

function ExamCard({exam,onStart}){
  const diffBadge={easy:'badge-success',medium:'badge-warning',hard:'badge-danger'}[exam.difficulty]||'badge-neutral';
  return(
    <div className="exam-card card animate-fadeIn">
      <div className="exam-card-header">
        <span className={`badge ${diffBadge}`}>{DIFF_LABEL[exam.difficulty]||'Tiêu chuẩn'}</span>
        {exam.category&&<span className="badge badge-neutral">{exam.category}</span>}
      </div>
      <h3 className="exam-card-title">{exam.title}</h3>
      <p className="exam-card-desc">{exam.description||'Chưa có mô tả.'}</p>
      <div className="exam-card-meta">
        <span className="meta-item">⏱ {formatDuration(exam.duration)}</span>
        <span className="meta-item">❓ {exam.questionCount} câu hỏi</span>
        {exam.passingScore&&<span className="meta-item">Đạt: {exam.passingScore}%</span>}
      </div>
      <div className="exam-card-footer">
        {exam.dueDate&&<span className="exam-due">Sắp hết hạn</span>}
        <button className="btn btn-primary btn-sm" onClick={()=>onStart(exam.id)}>Vào thi →</button>
      </div>
    </div>
  );
}

export default function DashboardPage(){
  const {user}=useAuth();
  const navigate=useNavigate();
  const [exams,setExams]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('all');

  useEffect(()=>{
    examService.getAll({status:'published'})
      .then(d=>setExams(Array.isArray(d)?d:d.exams||[]))
      .catch(()=>setExams(MOCK_EXAMS))
      .finally(()=>setLoading(false));
  },[]);

  const filtered=exams.filter(e=>{
    const ms=e.title.toLowerCase().includes(search.toLowerCase());
    const mf=filter==='all'||e.category===filter||e.difficulty===filter;
    return ms&&mf;
  });

  const categories=[...new Set(exams.map(e=>e.category).filter(Boolean))];

  const filterLabels={all:'Tất cả',easy:'Dễ',medium:'Trung bình',hard:'Khó'};

  return(
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Xin chào, {user?.name?.split(' ').pop()} 👋</h1>
          <p className="dashboard-subtitle">{exams.length} đề thi đang có — chọn một để bắt đầu</p>
        </div>
        <Link to="/history" className="btn btn-secondary btn-sm">Xem kết quả của tôi</Link>
      </div>

      <div className="dashboard-filters">
        <input type="search" className="form-input search-input" placeholder="Tìm kiếm đề thi…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <div className="filter-chips">
          {['all','easy','medium','hard',...categories].map(f=>(
            <button key={f} className={`filter-chip ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {filterLabels[f]||f}
            </button>
          ))}
        </div>
      </div>

      {loading
        ?<div className="loading-screen"><div className="spinner"/><span>Đang tải đề thi…</span></div>
        :filtered.length===0
          ?<div className="empty-state"><div className="empty-icon">📋</div><h3>Không tìm thấy đề thi</h3><p>{search?'Thử từ khoá khác.':'Hiện chưa có đề thi nào.'}</p></div>
          :<div className="exam-grid stagger">{filtered.map(e=><ExamCard key={e.id} exam={e} onStart={id=>navigate(`/exam/${id}`)}/>)}</div>
      }
    </div>
  );
}
