import "./QuestionListPage.css"

export default function QuestionListPage({ exam }) {
  const questions = exam?.Questions ?? [];

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
            </div>
          );
        })
      )}
    </div>
  );
}