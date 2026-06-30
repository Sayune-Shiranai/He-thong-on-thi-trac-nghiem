import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { gradeService } from "../../../../services/examService";
import './CreateGradePage.css'

const initialState = {
  success: false,
  errors: {},
  formData: {
    name: "",
  },
};

const CreateGradePage = () => {
    const navigate = useNavigate();

    async function gradeAction(prevState, formData) {
        const grade = formData.get("grade")?.trim() || "";

        const errors = {};
        if (!grade || grade.trim() === "") {
            errors.grade = "Tên khối không được để trống!";
        }

        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                errors,
                formData: { grade },
            };
        }

        try {
            await gradeService.CreateGrade({ grade });

            navigate("/dashboard/grade");

            return {
                success: true,
                errors: {},
                formData: {},
            };
        } catch (err) {
        return {
            success: false,
            errors: {
                general:
                    err?.response?.data?.message ||
                    err.message ||
                    "Không kết nối được server",
            },
            formData: { grade },
        };
        }
    }

    const [state, submit] = useActionState(
        gradeAction,
        initialState
    );


    return (
        <div className="page-header-box container mt-4">
            <div className="page-title">
                <div className="row">
                    <div className="col-6">
                        <h4>Thêm khối</h4>
                    </div>
                </div>
            </div>
        <div className="card p-2">
            <div className="card-body p-2"></div>
                <form action={submit}>
                    {state.errors?.general && (
                    <div className="alert alert-danger">
                        {state.errors.general}
                    </div>
                    )}
                    <div className="mb-3">
                        <label className="form-label">Tên khối</label>
                        <input
                            className={`form-control ${state.errors?.grade ? "is-invalid" : ""}`}
                            name="grade"
                            placeholder="Tên khối"
                            defaultValue={state.formData?.grade || ""}
                        />
                        {state.errors?.grade && (
                            <div className="invalid-feedback">{state.errors.grade}</div>
                        )}
                    </div>

                    <button className="btn btn-primary">
                    Thêm mới
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGradePage;
