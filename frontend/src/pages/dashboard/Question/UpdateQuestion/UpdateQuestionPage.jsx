import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { questionService } from "../../../../services/examService";
import { gradeService } from "../../../../services/examService";
import { subjectService } from "../../../../services/examService";
import "./UpdateQuestionPage.css";

const UpdateQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    grade_id: "",
    subject_id: "",
    content: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: ""
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionRes = await questionService.GetQuestionById(id);
        const gradeRes = await gradeService.GetAllGrades();
        const subjectRes = await subjectService.GetAllSubjects();

        const question = questionRes.data

        setFormData({
          grade_id: question.grade_id,
          subject_id: question.subject_id,
          content: question.content,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          correct_answer: question.correct_answer,
        });

        setGrades(gradeRes.data);
        setSubjects(subjectRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await questionService.UpdateQuestion(id, formData);
      navigate("/dashboard/question");
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
             <h4>Chỉnh sửa câu hỏi</h4>
            </div>
          </div>
      </div>
      <div className="card p-2">
        <div className="card-body p-2">
          <form onSubmit={handleSubmit}>
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

            <div className="mb-3">
              <label className="form-label">Câu hỏi</label>
              <input
                type="text"
                className="form-control"
                name="content"
                value={formData.content}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
                <label className="form-label">Đáp án A</label>
                <div className="input-group">
                    <div className="input-group-text">
                        <input
                            type="radio"
                            name="correct_answer"
                            value="A"
                            checked={formData.correct_answer === "A"}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        name="option_a"
                        value={formData.option_a}
                        onChange={handleChange}
                        placeholder="Nhập đáp án A"
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Đáp án B</label>
                <div className="input-group">
                    <div className="input-group-text">
                        <input
                            type="radio"
                            name="correct_answer"
                            value="B"
                            checked={formData.correct_answer === "B"}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        name="option_b"
                        value={formData.option_b}
                        onChange={handleChange}
                        placeholder="Nhập đáp án B"
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Đáp án C</label>
                <div className="input-group">
                    <div className="input-group-text">
                        <input
                            type="radio"
                            name="correct_answer"
                            value="C"
                            checked={formData.correct_answer === "C"}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        name="option_c"
                        value={formData.option_c}
                        onChange={handleChange}
                        placeholder="Nhập đáp án C"
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Đáp án D</label>
                <div className="input-group">
                    <div className="input-group-text">
                        <input
                            type="radio"
                            name="correct_answer"
                            value="D"
                            checked={formData.correct_answer === "D"}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        name="option_d"
                        value={formData.option_d}
                        onChange={handleChange}
                        placeholder="Nhập đáp án D"
                    />
                </div>
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

export default UpdateQuestionPage;
