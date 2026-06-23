import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { examService } from '../../../services/examService';
import "./ExamPage.css";

export default function ExamPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let ignore = false;

    const loadExams = async () => {
      const res = await examService.GetPagedExams({
        page,
        limit,
        keyword,
      });

      if (!ignore) {
        setExams(res.data || []);
        setTotalPages(res.totalPages);
      }
    };

    loadExams();

    return () => {
      ignore = true;
    };
  }, [page, keyword]);

  const handleCreate = () => {
    navigate("/dashboard/exam/create");
  }

  const handleUpdate = (id) => {
    navigate(`/dashboard/exam/update/${id}`);
  };


  const handleDelete = async (id) => { 
    if (!window.confirm("Xóa đề thi này?")) return; 
    await examService.DeleteExam(id); 
    const res = await examService.GetPagedExams({
      page: 1,
      limit,
      keyword,
    });

    setExams(res.data || []);
    setTotalPages(res.totalPages);
  };

  const handleApprove = async (id) => { 
    await examService.ApproveExam(id); 
    const res = await examService.GetPagedExams({ page, limit, keyword });
    setExams(res.data || []);
    setTotalPages(res.totalPages);
  }; 

  const handleReject = async (id) => { 
    await examService.RejectExam(id); 
    const res = await examService.GetPagedExams({ page, limit, keyword });
    setExams(res.data || []);
    setTotalPages(res.totalPages);
 }; 

  return (
    <div className="main-page">
      <div className="page-header-box container-fluid">
        <div className="page-title">
          <div className="row">
            <div className="col-6">
              <h4>Danh sách đề thi</h4>
            </div>
            {/* <div className="col-6">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Quản trị hệ thống</li>
                <li className="breadcrumb-item active">Người dùng</li>
              </ol>
            </div> */}
          </div>
        </div>
      </div>

      <div className="page-body-box container-fluid">
        <div className="card p-2">
          <div className="header-page-body-box card-header p-2 border-0">
            <div className="row align-items-center">
              <div className="search-box col-md-6 d-flex">
                <input
                  className="form-control me-2"
                  placeholder="Nhập từ khóa..."
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setPage(1);
                  }}
                />
                <button className="btn btn-primary text-nowrap">
                  <i className="fa-solid fa-magnifying-glass me-2"></i>
                  Tìm kiếm
                </button>
              </div>

              <div className="col-md-6 text-end">
                <button className="btn btn-success" onClick={handleCreate} title="Thêm mới">Thêm mới</button>
              </div>
            </div>
          </div>

          <div className="card-body p-2">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Id</th>
                    <th>Tên đề thi</th>
                    <th>Lớp</th>
                    <th>Môn học</th>
                    <th>Câu hỏi</th>
                    <th>Trạng thái kiểm duyệt</th>
                    <th width="120">Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  {questions?.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    questions.map((q, i) => (
                      <tr key={q.id}>
                        <td className="text-center">{(page - 1) * limit + i + 1}</td>
                        <td>{q.Grade?.grade}</td>
                        <td>{q.Subject?.name}</td>
                        <td>{q.Exams?.map(exam => exam.title).join(", ") || "-"}</td>
                        <td>{q.content}</td>
                        <td>{q.option_a}</td>
                        <td>{q.option_b}</td>
                        <td>{q.option_c}</td>
                        <td>{q.option_d}</td>
                        <td>{q.correct_answer}</td>
                        <td>
                          {q.Status?.name === "Pending" && (
                            <span className="badge bg-warning text-dark">Chờ duyệt</span>
                          )}
                          {q.Status?.name === "Approved" && (
                            <span className="badge bg-success">Đã duyệt</span>
                          )}
                          {q.Status?.name === "Rejected" && (
                            <span className="badge bg-danger">Từ chối</span>
                          )}
                        </td>
                        <td className="text-center text-nowrap">
                          {q.Status?.name === "Pending" && (
                            <>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => handleApprove(q.id)}
                              >
                                ✓
                              </button>
                              <button
                                className="btn btn-sm btn-warning text-dark"
                                onClick={() => handleReject(q.id)}
                              >
                                ✕
                              </button>
                            </>
                          )}

                          {q.Status?.name === "Rejected" && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleApprove(q.id)}
                              title="Duyệt"
                            >
                              ✓
                            </button>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => handleUpdate(q.id)}
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(q.id)}
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </>
                          )}

                          {q.Status?.name === "Approved" && (
                            <button
                              className="btn btn-sm btn-warning text-dark"
                              onClick={() => handleReject(q.id)}
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center mt-3">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}