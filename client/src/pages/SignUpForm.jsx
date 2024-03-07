import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authorizeUser, userSelector } from "../redux/userReducer";

const SignUpForm = () => {
  const { loggedInUser } = useSelector(userSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(authorizeUser());
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("/api/v1/user/sign-up", formData);
      if (data.success) {
        if (data.firstTime) {
          toast.success(data.message);
          return;
        }
        toast.success(data.message);
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        navigate("/user/posts");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong !");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isTermsAccepted = () => formData.termsAccepted;

  return (
    <div className="parentContainer bg-gradient-to-tr from-[#212529] to-[#6C757D] w-screen min-h-screen flex flex-col justify-around items-center ">
      <div className="w-full p-4 md:p-0 md:w-2/3 lg:w-1/3 ">
        <h2 className="text-3xl font-semibold mb-4">Sign Up or Sign In </h2>
        <div className="mb-4">
          <label htmlFor="identifier" className="block mb-1">
            Email or Username
          </label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Enter your email or username"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
        <div className="mb-4">
          <label htmlFor="termsAccepted" className="flex items-center">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="mr-2 h-6 w-6 rounded border-gray-300 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
            />
            <span className="text-lg transition-all duration-300 ease-in-out">
              I accept the terms and conditions
            </span>
          </label>
        </div>

        <div className="w-full flex justify-center items-center">
          <button
            className={`bg-[#cb4154] transition-all duration-200 ease-in-out text-white px-4 py-2 rounded-md ${
              !isTermsAccepted() && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!isTermsAccepted()}
          >
            Sign Up
          </button>
        </div>
        <div>
          <Link to={"/reset-password"}>Forgotten Password ?</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
