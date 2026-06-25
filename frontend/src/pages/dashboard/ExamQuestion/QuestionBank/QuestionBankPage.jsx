import { useEffect, useState } from "react";
import { questionService } from "../../../../services/examService";

const QuestionBank = ({ examId, reload }) => {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const res = await questionService.GetPagedQuestions({
      page: 1,
      limit: 100
    });

    setQuestions(res.data);
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