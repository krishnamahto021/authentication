import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/user/reset-password", {
        email,
      });
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
    <div className="formOuterContainer bg-gradient-to-tr from-[#212529] to-[#6C757D] w-screen min-h-screen flex flex-col justify-around items-center">
      <form
        className="formContainer  flex flex-col gap-2 justify-between h-fit w-3/4 md:w-1/2 lg:w-1/3  p-2 shadow-sm shadow-[#495057] "
        onSubmit={handleSubmit}
      >
        <h1 className="text-center p-1 text-lg font-semibold text-textOne">
          Reset your Password
        </h1>
        <div className="flex flex-col gap-2 justify-between">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            className="p-1 rounded-sm focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
        </div>

        <div className="flex justify-around mt-5">
          <button
            type="submit"
            className="bg-[#cb4154] transition-all duration-200 ease-in-out text-white px-4 py-2 rounded-md"
          >
            Send Reset Link
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
