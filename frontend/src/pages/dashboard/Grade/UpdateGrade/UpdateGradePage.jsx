import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gradeService } from "../../../../services/examService";
import "./UpdateGradePage.css";

const UpdateGradePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    grade: ""
  });

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const gradeRes = await gradeService.GetGradeById(id);
        const grade = gradeRes.data;
        
        setFormData({
          grade: grade.grade
        });

      } catch (error) {
        console.error(error);
      }
    };

    fetchGrade();
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
      await gradeService.UpdateGrade(id, formData);
      navigate("/dashboard/grade");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-header-box container mt-4">
      <div className="page-title">
          <div className="row">
            <div className="col-6">
             <h4>Chỉnh sửa lớp
              </h4>
            </div>
          </div>
      </div>
      <div className="card p-2">
        <div className="card-body p-2">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Tên lớp</label>
              <input
                type="text"
                className="form-control"
                name="grade"
                value={formData.grade}
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

export default UpdateGradePage;
