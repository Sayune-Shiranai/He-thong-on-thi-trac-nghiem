import { useState } from "react";
import { questionService } from "../../../../services/examService";

const CreateQuestion = ({ examId, reload }) => {

  const [question, setQuestion] = useState({
    content: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: ""
  });

  const handleChange = (e) => {
    setQuestion({
      ...question,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {

      try {

          await questionService.CreateQuestionWithExam({
              ...question,
              exam_id: examId
          });

          await reload();

          setQuestion({
              content: "",
              option_a: "",
              option_b: "",
              option_c: "",
              option_d: "",
              correct_answer: ""
          });

      } catch(err) {
          console.log(err);
      }
  };

  return (
    <>
      <h4>Tạo câu hỏi trắc nghiệm</h4>

      <div className="mb-3">
        <label>Câu hỏi</label>

        <textarea
            className="form-control"
            name="content"
            value={question.content}
            onChange={handleChange}
        />
      </div>

      {["A", "B", "C", "D"].map(letter => (

        <div className="mb-3" key={letter}>

          <label>Đáp án {letter}</label>

          <div className="input-group">

            <div className="input-group-text">

              <input
                type="radio"
                name="correct_answer"
                value={letter}
                checked={
                  question.correct_answer === letter
                }
                onChange={handleChange}
              />

            </div>

              <input
                  className="form-control"
                  name={`option_${letter.toLowerCase()}`}
                  value={
                      question[
                          `option_${letter.toLowerCase()}`
                      ]
                  }
                  onChange={handleChange}
              />

          </div>

        </div>

      ))}

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
      >
        Thêm vào đề thi
      </button>
    </>
  );
};

export default CreateQuestion;