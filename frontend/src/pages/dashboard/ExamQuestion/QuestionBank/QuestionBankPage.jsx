import { useEffect, useState } from "react";
import { questionService } from "../../../../services/examService";

const QuestionBank = ({ examId, reload }) => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (examId) {
      loadQuestions();
    }
  }, [examId]);

  const loadQuestions = async () => {
    const res = await questionService.GetAllQuestionGradeSubjectByExam(examId);

    setQuestions(res.data || []);
  };

  const handleCheck = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(x => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleAdd = async () => {
    try {
      await questionService.UseQuestionBank({
          exam_id: examId,
          question_ids: selected
        });

      await reload();

      setSelected([]);
    } catch(err) {
      console.log(err);
    }
  };

  return (
  <>
    <h4>Kho câu hỏi</h4>
    <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Câu hỏi</th>
          <th>Đáp án A</th>
          <th>Đáp án B</th>
          <th>Đáp án C</th>
          <th>Đáp án D</th>
          <th>Đáp án đúng</th>
        </tr>
      </thead>

      <tbody>
        {questions.map(q => (
          <tr key={q.id}>
            <td>
              <input
                type="checkbox"
                onChange={() => handleCheck(q.id)}
              />
            </td>
            <td>{q.content}</td>
            <td>{q.option_a}</td>
            <td>{q.option_b}</td>
            <td>{q.option_c}</td>
            <td>{q.option_d}</td>
            <td>{q.correct_answer}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <button
      className="btn btn-success"
      onClick={handleAdd}
    >
      Thêm vào đề thi
    </button>
  </>
  );
};

export default QuestionBank;