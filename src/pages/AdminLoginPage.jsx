import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MkdSDK from "../utils/MkdSDK";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";
import SnackBar from "../components/SnackBar";
const AdminLoginPage = () => {
  const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
    role: yup.string().required(),
  })
  .required();


  const { dispatch } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // 
  const [showToast, setShowToast] = React.useState(false);
  // 
  const onSubmit = async (data) => {
    let sdk = new MkdSDK();
    //TODO
    try {
      const response = await sdk.login(data.email, data.password);
    console.log("Response from login API: ", response);
    if (response.error === false && response.role === "admin") {
      const user = {
        id: response.user_id,
        email: data.email,
        role: response.role,
        token: response.token
      };
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      navigate("/admin/dashboard");
      setShowToast(true);
    } else {
      console.error("Error: Response from API is not valid");
    }

    } catch (err) {
      setError("email", {
        type: "manual",
        message: err.message,
      });
      setError("password", {
        type: "manual",
        message: err.message,
      });
    }
    // 
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8 "
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.email?.message ? "border-red-500" : ""
            }`}
          />
          <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="******************"
            {...register("password")}
            className={`shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
              errors.password?.message ? "border-red-500" : ""
            }`}
          />
          <p className="text-red-500 text-xs italic">
            {errors.password?.message}
          </p>
        </div>
        <div className="mb-6">
  <label
    className="block text-gray-700 text-sm font-bold mb-2"
    htmlFor="role"
  >
    Role
  </label>
  <input
    type="text"
    placeholder="Role"
    {...register("role")}
    className={`"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
      errors.role?.message ? "border-red-500" : ""
    }`}
  />
  <p className="text-red-500 text-xs italic">{errors.role?.message}</p>
</div>

        <div className="flex items-center justify-between">
          <input
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            value="Sign In"
          />
        </div>
      </form>
      {showToast && (
        <SnackBar
          message="Login successful!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default AdminLoginPage;
