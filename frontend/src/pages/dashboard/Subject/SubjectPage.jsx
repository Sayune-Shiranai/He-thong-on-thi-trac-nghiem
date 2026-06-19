import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./subjectPage.css";
import { subjectService } from '../../../services/examService';

export default function SubjectPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let ignore = false;

    const loadSubjects = async () => {
      const res = await subjectService.GetPagedSubjects({
        page,
        limit,
        keyword,
      });

      if (!ignore) {
        setSubjects(res.data || []);
        setTotalPages(res.totalPages);
      }
    };

    loadSubjects();

    

    return () => {
      ignore = true;
    };
  }, [page, keyword]);

  const handleCreate = () => {
    navigate("/dashboard/subject/create");
  }

  const handleUpdate = (id) => {
    navigate(`/dashboard/subject/update/${id}`);
  };


  const handleDelete = async (id) => { 
    if (!window.confirm("Xóa môn học này?")) return; 
    await subjectService.DeleteSubject(id); 
    const res = await subjectService.GetPagedSubjects({
      page: 1,
      limit,
      keyword,
    });

    setSubjects(res.data || []);
    setTotalPages(res.totalPages);
  };

  return (
    <div className="main-page">
      <div className="page-header-box container-fluid">
        <div className="page-title">
          <div className="row">
            <div className="col-6">
              <h4>Danh sách môn học</h4>
            </div>
            {/* <div className="col-6">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">Quản trị hệ thống</li>
                <li className="breadcrumb-item active">Giáo viên</li>
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
                <button className="btn btn-success" onClick={handleCreate} title="Thêm mới">
                  Thêm mới
                </button>
              </div>
            </div>
          </div>

          <div className="card-body p-2">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Id</th>
                    <th>Môn học</th>
                    {/* <th>Trạng thái kiểm duyệt</th> */}
                    <th width="120">Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects?.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    subjects.map((s, i) => (
                      <tr key={s.id}>
                        <td className="text-center">{(page - 1) * limit + i + 1}</td>
                        <td>
                          {s.name}
                        </td>

                        <td className="text-center text-nowrap">
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => handleUpdate(s.id)}
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(s.id)}
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </>
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