import { useState } from "react";
import { questionService } from "../../../../services/examService";

export default function RandomQuestion({ examId, reload }) {
    const [count, setCount] = useState(10);
    const handleRandom = async () => {
        try {
            await questionService.RandomQuestion({
                exam_id: examId,
                count: Number(count)
            });
            await reload();
        } catch(err) {
            console.log(err);
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

            <button
                className="btn btn-warning"
                onClick={handleRandom}
            >
                Random
            </button>
        </div>
    );
}