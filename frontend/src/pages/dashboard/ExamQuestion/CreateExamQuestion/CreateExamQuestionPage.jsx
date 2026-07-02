import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionBank from "../QuestionBank/QuestionBankPage";
import CreateQuestion from "../CreateQuestion/CreateQuestionPage";
import RandomQuestion from "../RandomQuestion/RandomQuestionPage";
import ExamQuestionList from "../ExamQuestionList/ExamQuestionListPage";

import { examService } from "../../../../services/examService";
import { questionService } from "../../../../services/examService";

export default function CreateExamQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState("");
  const [exam, setExam] = useState({});
  const [examQuestions, setExamQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  const loadExamQuestions = async () => {
      const res = await examService.GetExamById(id);
      const questionRes = await questionService.GetAllQuestionGradeSubjectByExam(id);

      setExam(res.data);
      setQuestions(questionRes.data);
      setExamQuestions(res.data.Questions || []);
  };

  useEffect(() => {
      loadExamQuestions();
  }, [id]);

  const handleCompleteExam = async () => {
    try {
      await examService.UpdateExam(id, {
        status: "completed"
      });

      navigate("/dashboard/exam")

    } catch (err) {
      console.log(err);
    }
  };

    return (
        <div className="container-fluid">
            <div className="card p-4">
                <h3>Quản lý câu hỏi đề thi {exam.title}</h3>
                <div className="row mb-4">
                    <div className="col-md-4">
                        <button
                            className="btn btn-primary w-100"
                            onClick={() => setMode("bank")}
                        >
                            Sử dụng kho câu hỏi
                            <small className="fw-normal ms-2">
                                ({questions.length} câu hỏi)
                            </small>
                        </button>
                    </div>

                    <div className="col-md-4">
                        <button
                            className="btn btn-success w-100"
                            onClick={() => setMode("create")}
                        >
                            Tạo câu hỏi
                        </button>
                    </div>

                    <div className="col-md-4">
                        <button
                            className="btn btn-warning w-100"
                            onClick={() => setMode("random")}
                        >
                            Random câu hỏi
                            <small className="fw-normal ms-2">
                                ({questions.length} câu hỏi)
                            </small>
                        </button>
                    </div>

                </div>

                {mode === "bank" && (
                    <QuestionBank
                        examId={id}
                        reload={loadExamQuestions}
                    />
                )}

                {mode === "create" && (
                    <CreateQuestion
                        examId={id}
                        reload={loadExamQuestions}
                    />
                )}

                {mode === "random" && (
                    <RandomQuestion
                        examId={id}
                        reload={loadExamQuestions}
                    />
                )}

                <ExamQuestionList
                    examId={id}
                    questions={examQuestions}
                    reload={loadExamQuestions}
                />

                <button 
                    className="btn btn-success mt-3"
                    onClick={handleCompleteExam}
                >
                Hoàn thành tạo đề thi
                </button>
            </div>
            
        </div>
    );
}