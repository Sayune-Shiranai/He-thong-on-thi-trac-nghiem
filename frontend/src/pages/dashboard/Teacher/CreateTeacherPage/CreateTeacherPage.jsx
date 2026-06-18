import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { teacherService } from "../../../../services/examService";
import { userService } from "../../../../services/examService";
import { gradeService } from "../../../../services/examService";
import { subjectService } from "../../../../services/examService";
import "./CreateTeacherPage.css";

const CreateTeacherPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    user_id: "",
    grade_id: "",
    subject_id: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await userService.GetAllUserRoleTeacher();
        const gradeRes = await gradeService.GetAllGrades();
        const subjectRes = await subjectService.GetAllSubjects();

        setUsers(userRes.data);
        setGrades(gradeRes.data);
        setSubjects(subjectRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await teacherService.CreateTeacher(formData);
      navigate("/dashboard/teacher");
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  return (
    <div className="page-header-box container mt-4">
      <div className="page-title">
          <div className="row">
            <div className="col-6">
             <h4>Tạo phân công giáo viên</h4>
            </div>
          </div>
      </div>
      <div className="card p-2">
        <div className="card-body p-2">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Giáo viên</label>
              <select
                name="user_id"
                value={formData.user_id}
                className="form-control"
                onChange={handleChange}
              >
                <option value="">-- Chọn giáo viên --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Lớp</label>
              <select
                name="grade_id"
                value={formData.grade_id}
                className="form-control"
                onChange={handleChange}
              >
                <option value="">-- Chọn lớp --</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>{grade.grade}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Môn học</label>
              <select
                name="subject_id"
                value={formData.subject_id}
                className="form-control"
                onChange={handleChange}
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            
            <button className="btn btn-primary">
              Thêm mới
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeacherPage;
