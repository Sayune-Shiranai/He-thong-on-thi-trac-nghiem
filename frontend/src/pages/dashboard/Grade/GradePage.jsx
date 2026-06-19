import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./GradePage.css";
import { gradeService } from '../../../services/examService';

export default function GradePage() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let ignore = false;

    const loadGrades = async () => {
      const res = await gradeService.GetPagedGrades({
        page,
        limit,
        keyword,
      });

      if (!ignore) {
        setGrades(res.data || []);
        setTotalPages(res.totalPages);
      }
    };

    loadGrades();

    

    return () => {
      ignore = true;
    };
  }, [page, keyword]);

  const handleCreate = () => {
    navigate("/dashboard/grade/create");
  }

  const handleUpdate = (id) => {
    navigate(`/dashboard/grade/update/${id}`);
  };


  const handleDelete = async (id) => { 
    if (!window.confirm("Xóa lớp này?")) return; 
    await gradeService.DeleteGrade(id); 
    const res = await gradeService.GetPagedGrades({
      page: 1,
      limit,
      keyword,
    });

    setGrades(res.data || []);
    setTotalPages(res.totalPages);
  };

  return (
    <div className="main-page">
      <div className="page-header-box container-fluid">
        <div className="page-title">
          <div className="row">
            <div className="col-6">
              <h4>Danh sách lớp</h4>
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
                    <th>Lớp</th>
                    {/* <th>Trạng thái kiểm duyệt</th> */}
                    <th width="120">Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  {grades?.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    grades.map((g, i) => (
                      <tr key={g.id}>
                        <td className="text-center">{(page - 1) * limit + i + 1}</td>
                        <td>
                          {g.grade}
                        </td>
                        <td className="text-center text-nowrap">
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => handleUpdate(g.id)}
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(g.id)}
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