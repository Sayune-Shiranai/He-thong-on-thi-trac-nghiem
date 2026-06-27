import { examService } from "../../../../services/examService";

export default function ExamQuestionList({
  examId,
  questions,
  reload
}) {

  const handleDelete = async (questionId) => {
    await examService.DeleteQuestionByExam(examId, questionId);
    reload();
  };

  return (
    <div className="card p-3 mt-4">
      <h4>Danh sách câu hỏi của đề</h4>

      {questions.length === 0 ? (
        <p>Chưa có câu hỏi</p>
      ) : (
        questions.map((q, index) => {
            const answers = [
                { key: "A", value: q.option_a },
                { key: "B", value: q.option_b },
                { key: "C", value: q.option_c },
                { key: "D", value: q.option_d },
            ];

          return (
            <div
                key={q.id}
                className="border rounded p-3 mb-3 position-relative"
                >

                <button
                    className="btn btn-link text-danger position-absolute top-0 end-0 m-3 p-0"
                    onClick={() => handleDelete(q.id)}
                    title="Xóa khỏi đề thi"
                >
                    <i className="fa-solid fa-trash fs-5"></i>
                </button>

                <h5>Câu {index + 1}</h5>

                <p>{q.content}</p>

                {answers.map((answer) => (
                <div
                    key={answer.key}
                    className={`border rounded p-2 mb-2 ${
                    q.correct_answer === answer.key
                        ? "bg-success text-white border-success"
                        : "bg-light"
                    }`}
                >
                    <strong>{answer.key}.</strong> {answer.value}
                </div>
                ))}

                {/* <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleDelete(q.id)}
                >
                    Xóa khỏi đề
                </button> */}
            </div>
          );
        })
      )}
    </div>
  );
}