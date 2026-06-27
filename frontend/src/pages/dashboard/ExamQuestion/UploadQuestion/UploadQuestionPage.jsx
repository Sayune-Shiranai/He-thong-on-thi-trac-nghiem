import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examService, questionService } from "../../../../services/examService";

export default function UploadQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState({});
  const [file, setFile] = useState(null);
  const [questionCount, setQuestionCount] = useState("");
  const [answers, setAnswers] = useState([]);

  const loadExam = async () => {
    try {
      const res = await examService.GetExamById(id);
      setExam(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadExam();
  }, [id]);

  const handleCreateAnswers = () => {
    if (!questionCount || Number(questionCount) <= 0) {
      alert("Vui lòng nhập số lượng câu hỏi.");
      return;
    }

    const list = [];

    for (let i = 1; i <= Number(questionCount); i++) {
      list.push({
        question: i,
        answer: ""
      });
    }

    setAnswers(list);
  };

  const handleSelectAnswer = (index, answer) => {
    const list = [...answers];
    list[index].answer = answer;
    setAnswers(list);
  };

  const handleCompleteExam = async () => {
    try {
      if (!file) {
        alert("Vui lòng chọn file đề thi.");
        return;
      }

      if (Number(questionCount) <= 0) {
        alert("Vui lòng nhập số lượng câu hỏi.");
        return;
      }

      if (answers.length !== Number(questionCount)) {
        alert("Vui lòng nhấn 'Thêm đáp án'.");
        return;
      }

      const unanswered = answers.find(a => a.answer === "");

      if (unanswered) {
        alert(`Vui lòng chọn đáp án đúng cho câu ${unanswered.question}.`);
        return;
      }

      const formData = new FormData();

      formData.append("content_img", file);
      formData.append("exam_id", id);
      formData.append("answer_count", questionCount);
      formData.append(
        "correct_answers",
        JSON.stringify(answers.map(x => x.answer))
      );

      await questionService.UploadQuestionImage(formData);

      await examService.UpdateExam(id, {
        status: "completed"
      });

      alert("Upload đề thi thành công.");

      navigate("/dashboard/exam");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra.");
    }
  };


  return (
    <div className="container-fluid">

      <div className="card p-4">

        <h3>
          Quản lý câu hỏi đề thi: {exam.title}
        </h3>

        <div className="mb-3">
          <label className="form-label">
            Tệp tin đề thi
          </label>

          <input
            type="file"
            className="form-control"
            accept=".png,.jpg"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="row align-items-end mb-4">
          <div className="col-md-10 pe-0">
            <label className="form-label">
              Số lượng câu hỏi
            </label>

            <input
              type="number"
              className="form-control"
              min={1}
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
            />
          </div>

          <div className="col-md-2 p-0">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleCreateAnswers}
            >
              Thêm đáp án
            </button>
          </div>

        </div>

        {answers.map((item, index) => (

          <div
            key={index}
            className="d-flex align-items-center mb-3 gap-2"
          >

            <strong style={{ width: 70 }}>
              Câu {item.question}
            </strong>

            {["A", "B", "C", "D"].map((option) => (

              <button
                key={option}
                type="button"
                className={
                  item.answer === option
                    ? "btn btn-success"
                    : "btn btn-outline-secondary"
                }
                onClick={() =>
                  handleSelectAnswer(index, option)
                }
              >
                {option}
              </button>

            ))}

            <span className="ms-3 text-success fw-bold">
              {item.answer && `Đáp án đúng: ${item.answer}`}
            </span>
          </div>
        ))}
        <hr />

        <button
          className="btn btn-success"
          onClick={handleCompleteExam}
        >
          Hoàn thành tạo đề thi
        </button>

      </div>

    </div>
  );
}