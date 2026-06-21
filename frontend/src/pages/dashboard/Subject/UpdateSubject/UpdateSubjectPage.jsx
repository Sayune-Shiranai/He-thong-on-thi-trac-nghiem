import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subjectService } from "../../../../services/examService";
import "./UpdateSubjectPage.css";

const UpdateSubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: ""
  });

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const subjectRes = await subjectService.GetSubjectById(id);
        const subject = subjectRes.data;
        
        setFormData({
          name: subject.name
        });

      } catch (error) {
        console.error(error);
      }
    };

    fetchSubject();
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
      await subjectService.UpdateSubject(id, formData);
      navigate("/dashboard/subject");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-header-box container mt-4">
      <div className="page-title">
          <div className="row">
            <div className="col-6">
             <h4>Chỉnh sửa môn học
              </h4>
            </div>
          </div>
      </div>
      <div className="card p-2">
        <div className="card-body p-2">
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Tên môn học</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
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

export default UpdateSubjectPage;
