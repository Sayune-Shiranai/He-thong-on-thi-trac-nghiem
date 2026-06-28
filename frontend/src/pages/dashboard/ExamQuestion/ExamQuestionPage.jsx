import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { examService } from "../../../services/examService";

import QuestionList from "./QuestionList/QuestionListPage";
// import UploadQuestion from "./UploadQuestionList/UploadQuestionListPage";

export default function ExamQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);

  const loadExam = async () => {
    try {
      setLoading(true);

      const res = await examService.GetExamById(id);

      setExam(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExam();
  }, [id]);

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="card p-5 text-center">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          Không tìm thấy đề thi.
        </div>
      </div>
    );
  }

  const questions = exam?.questions || [];

  return (
    <div className="container-fluid">
      <div className="card p-4">
        
      
        <div className="card-body border-bottom border-black mx-4 p-2 d-flex align-items-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary btn-sm"
            style={{ top: "10px", left: "10px" }}
          >
            ← Trở về
          </button>

          <h4 className="mb-1 text-center flex-grow-1">Đề thi {exam.title}</h4>
        </div>
        <div className="card-body">
          <QuestionList exam={exam} />
        </div>
      </div>

    </div>
  );
}