import "./UploadQuestionListPage.css"

export default function UploadQuestionListPage({ exam }) {
    const questions = exam?.Questions ?? [];

    if (questions.length === 0) {
        return (
        <div className="alert alert-warning">
            Chưa có câu hỏi.
        </div>
        );
    }

  return (
    <div className="row">
        <div className="col-lg-8">
            <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                    <img
                        src={questions[0].content_img}
                        alt="Đề thi"
                        className="img-fluid rounded border exam_img"
                    />
                </div>
            </div>
        </div>

        <div className="col-lg-4">
            <div className="card shadow-sm mb-3">
                <div className="card-body">
                {questions.map((q, index) => (
                    <div
                        key={q.id}
                        className="mb-3 pb-3 border-bottom border-wheat"
                    >
                        <div className="fw-bold mb-2">
                            Câu {index + 1}
                        </div>

                        <div className="d-flex justify-content-between">
                            {["A", "B", "C", "D"].map((item) => {
                                const active = q.correct_answer === item;
                                return (
                                    <div
                                        key={item}
                                        className={`border rounded py-2 mx-1 w-25 text-center 
                                            ${
                                                active
                                                ? "bg-success text-white fw-bold"
                                                : "bg-light"
                                            }`}
                                        // style={{
                                        //     width: "23%"
                                        // }}
                                    >
                                        {item}
                                    </div>
                                );
                            })}
                        </div>
                        {/* {index !== questions.length - 1 && <hr />} */}
                    </div>
                ))}
                </div>
            </div>
        </div>
    </div>
  );
}