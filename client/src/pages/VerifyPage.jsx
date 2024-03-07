import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const VerifyPage = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(3);
  let verifyUserCalled = false;

  const verifyUser = async (token) => {
    if (!verifyUserCalled) {
      verifyUserCalled = true;
      try {
        const { data } = await axios.get(`/api/v1/user/verify-user/${token}`);
        toast.success(data.message);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Internal Server Error");
        }
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const token = window.location.pathname.split("/").pop();
    verifyUser(token);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (count === 0) {
        navigate("/sign-in");
      }
    };
  }, [count, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bgTwo text-textThree ">
      <div>{`Redirecting you to the Login Page in ${count} seconds`}</div>
      <Spinner />
    </div>
  );
};

export default VerifyPage;
