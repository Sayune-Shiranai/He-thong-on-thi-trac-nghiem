import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { roleService } from "../../../../services/examService";
import './CreateRolePage.css'

const initialState = {
  success: false,
  errors: {},
  formData: {
    name: "",
  },
};

const CreateRolePage = () => {
    const navigate = useNavigate();

    async function roleAction(prevState, formData) {
        const name = formData.get("name")?.trim() || "";

        const errors = {};
        if (!name || name.trim() === "") {
            errors.name = "Tên vai trò không được để trống!";
        }

        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                errors,
                formData: { name },
            };
        }

        try {
            await roleService.CreateRole({ name });

            navigate("/dashboard/role");

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
            formData: { name },
        };
        }
    }

    const [state, submit] = useActionState(
        roleAction,
        initialState
    );


    return (
        <div className="page-header-box container mt-4">
            <div className="page-title">
                <div className="row">
                    <div className="col-6">
                        <h4>Thêm vai trò</h4>
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
                        <label className="form-label">Tên vai trò</label>
                        <input
                            className={`form-control ${state.errors?.name ? "is-invalid" : ""}`}
                            name="name"
                            placeholder="Tên vai trò"
                            defaultValue={state.formData?.name || ""}
                        />
                        {state.errors?.name && (
                            <div className="invalid-feedback">{state.errors.name}</div>
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

export default CreateRolePage;
