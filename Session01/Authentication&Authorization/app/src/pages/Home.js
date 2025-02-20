import React, { useEffect } from "react";
const Home = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
  }, []);
  return (
    <div>
      <h1>HOME PAGE</h1>
    </div>
  );
};
export default Home;
