import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examService } from "../../../../services/examService";
import "./UpdateExamPage.css";

const UpdateExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: ""
  });

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examRes = await examService.GetExamById(id);
        const exam = examRes.data;
        
        setFormData({
          title: exam.title
        });

      } catch (error) {
        console.error(error);
      }
    };

    fetchExam();
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
      await examService.UpdateExam(id, formData);
      navigate("/dashboard/exam");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-header-box container mt-4">
      <div className="page-title">
          <div className="row">
            <div className="col-6">
             <h4>Chỉnh sửa đề thi
              </h4>
            </div>
          </div>
      </div>
      <div className="card p-2">
        <div className="card-body p-2">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Tên đề thi</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary">
              Cập nhật
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateExamPage;
