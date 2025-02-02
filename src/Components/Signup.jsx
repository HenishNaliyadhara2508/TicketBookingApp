import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log("Error response data:", errorData);
        } catch (err) {
          console.error("Error parsing response:", err);
          errorData = { message: "An error occurred. Please try again." };
        }

        setLoading(false);

        if (response.status === 409) {
          setError(
            errorData.message ||
              "Email already exists. Please use a different email."
          );
        } else {
          setError(errorData.message || "An error occurred. Please try again.");
        }
        return;
      }

      const data = await response.json();

      setLoading(false);

      if (response.ok) {
        alert("Signup successful!");
        navigate("/");
      } else {
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error in fetch request:", error);
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLogin = () => {
    navigate("/");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-vh-100 d-flex">
      <div className="col-12 col-md-6 gradient-bg d-flex flex-column justify-content-between p-3">
        <div className="m-2">
          <img src="" alt="Cinemas" className="img-thumbnail" />
        </div>

        <div className="container fs-1">
          Welcome. <br />
          Begin your cinematic <br />
          adventure now with <br />
          our ticketing <br />
          platform!
        </div>
      </div>

      <div className="col-12 col-md-6 d-flex justify-content-center align-items-center p-3 bg-light">
        <form className="container w-75" onSubmit={handleSubmit}>
          <div className="mb-3 fs-2">Create an account</div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="FirstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="FirstName"
              placeholder="John"
              onChange={handleFirstName}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="LastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="LastName"
              placeholder="Doe"
              onChange={handleLastName}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="Email"
              placeholder="abcd@gmail.com"
              onChange={handleEmail}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="d-flex position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Enter password"
                onChange={handlePassword}
                required
              />
              <div
                className="position-absolute"
                style={{
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-outline-primary w-100"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>

          <div className="text-center">
            Already Have An Account?{" "}
            <a onClick={handleLogin} className="text-primary">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
