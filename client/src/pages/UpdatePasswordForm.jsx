import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdatePasswordForm = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const token = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token);
    try {
      const { data } = await axios.post(
        `/api/v1/user/update-password/${token}`,
        {
          password,
        }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      navigate("/");
    } catch (error) {
      toast.error("Internal server error");
    }
  };
  return (
    <div className="formOuterContainer bg-gradient-to-tr from-[#212529] to-[#6C757D] w-screen min-h-screen flex flex-col justify-around items-center ">
      <form
        className="formContainer flex flex-col gap-2 justify-between h-fit w-3/4 md:w-1/2 lg:w-1/3  p-2  "
        onSubmit={handleSubmit}
      >
        <h1 className="text-center p-1 text-lg font-semibold text-textOne">
          Update your Password
        </h1>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block mb-1">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 py-8 text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex justify-around mt-5">
          <button
            type="submit"
            className="bg-[#cb4154] transition-all duration-200 ease-in-out text-white px-4 py-2 rounded-md"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;
