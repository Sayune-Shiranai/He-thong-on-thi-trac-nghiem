import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examService } from "../../../../services/examService";
import { gradeService } from "../../../../services/examService";
import { subjectService } from "../../../../services/examService";
import "./CreateExamPage.css";

const CreateExamPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [createType, setCreateType] = useState("manual");
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    grade_id: "",
    subject_id: ""
  });

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const gradeRes = await gradeService.GetAllGrades();
        const subjectRes = await subjectService.GetAllSubjects();

        setGrades(gradeRes.data);
        setSubjects(subjectRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExam();
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
      const res = await examService.CreateExam(formData);
      const exam_id = res.data.id;

      if (createType === "manual") {
        navigate(`/dashboard/exam/${exam_id}/question`);
      } else {
        navigate(`/dashboard/exam/${exam_id}/upload`);
      }
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
             <h4>Tạo đề thi</h4>
            </div>
          </div>
      </div>
      <div className="card p-2">
        <div className="card-body p-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Tên đề thi</label>
                <input
                    className="form-control"
                    name="title"
                    placeholder="Tên đề thi"
                    onChange={handleChange}
                />
            </div>

            <div className="mb-3">
              <label className="form-label">Khối</label>
              <select
                name="grade_id"
                value={formData.grade_id}
                className="form-control"
                onChange={handleChange}
              >
                <option value="">-- Chọn khối --</option>
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

            <div className="mb-3 d-flex">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="createType"
                        id="manual"
                        value="manual"
                        checked={createType === "manual"}
                        onChange={(e) => setCreateType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="manual">
                        Đề nhập tay từng câu một
                    </label>
                </div>

                <div className="form-check ms-5">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="createType"
                        id="import"
                        value="import"
                        checked={createType === "import"}
                        onChange={(e) => setCreateType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="import">
                        Import file đề thi lên
                    </label>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            
            <button className="btn btn-primary">
              Bước tiếp theo
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExamPage;
