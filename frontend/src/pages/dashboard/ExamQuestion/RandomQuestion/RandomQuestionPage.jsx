import { useState } from "react";
import { questionService } from "../../../../services/examService";

export default function RandomQuestion({ examId, reload }) {
    const [count, setCount] = useState(10);
    const [error, setError] = useState("");
    const handleRandom = async () => {
        setError("");
        try {
            await questionService.RandomQuestion({
                exam_id: examId,
                count: Number(count)
            });
            await reload();
        } catch(error) {
            setError(error.message);
            console.log(error);
        }
    };

    return (
        <div className="card p-3 mb-3">
            <h5>Random câu hỏi</h5>
            <input
                type="number"
                className="form-control mb-3"
                value={count}
                onChange={(e)=>
                    setCount(e.target.value)
                }
            />

            {error && <div className="alert alert-danger">{error}</div>}

            <button
                className="btn btn-warning"
                onClick={handleRandom}
            >
                Random
            </button>
        </div>
    );
}