import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { useDispatch } from "react-redux";
import { authorizeUser } from "../redux/userReducer";

const Spinner = () => {
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authorizeUser());
  }, []);

  useEffect(() => {
    let timeoutId;

    timeoutId = setTimeout(() => {
      setRedirect(true);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [redirect]);

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <ImSpinner3 className="animate-spin text-4xl" />
      <p className="ml-2">Sign in to continue...</p>
    </div>
  );
};

export default Spinner;
