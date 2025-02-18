import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users",
        formData
      );
      setMessage(response.data.message);
      setFormData({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container pt-3">
      <div className="row">
        <div className="col-6">
          <h1>Danh sách người dùng</h1>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-4">
          <h1>Đăng ký người dùng</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Tên:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Mật khẩu:</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-success mt-3" type="submit">
              Đăng ký
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
