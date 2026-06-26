import {
    examService
} from "../../../../services/examService";

export default function ExamQuestionList({
    examId,
    questions,
    reload
}) {

    const handleDelete = async (
        questionId
    ) => {

        await examService.DeleteQuestionByExam(
            examId,
            questionId
        );
        reload();
    };

    return (
        <div className="card p-3">

            <h4>
                Danh sách câu hỏi của đề
            </h4>

            {questions.length === 0 ? (
                <p>
                    Chưa có câu hỏi
                </p>
            ) : (
                questions.map(
                    (q,index)=>(
                        <div
                            key={q.id}
                            className="border rounded p-3 mb-2"
                        >

                            <div>
                                <strong>
                                    Câu {index+1}
                                </strong>
                            </div>

                            <div>
                                {q.content}
                            </div>

                            <button
                                className="btn btn-danger btn-sm mt-2"
                                onClick={() =>
                                    handleDelete(q.id)
                                }
                            >
                                Xóa khỏi đề
                            </button>

                        </div>
                    )
                )
            )}

        </div>
    );
}