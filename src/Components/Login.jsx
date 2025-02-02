import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  
  const handleLogin = async (e) => {
    e.preventDefault(); 
    

    
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {

      
      const response = await fetch("http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/auth/login", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), 
      });

      if (!response.ok) {
        
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to authenticate");
      }

      
      const data = await response.json();

      
      if (data.data.accessToken) {
       
        localStorage.setItem("authToken", data.data.accessToken);

       
        navigate('/Home/Movie');
      } else {
        
        setError("Invalid email or password.");
      }
    } catch (error) {
      setLoading(false); 
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };
 
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  return (
    <div className="d-flex min-vh-100">
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
        <form className="container w-75" onSubmit={handleLogin}> 
          <div className="mb-3 fs-2">Login to Your account</div>

          
          <div className="mb-3">
            <label htmlFor="Email" className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              id="Email"
              placeholder="abcd@gmail.com"
              value={email}
              onChange={handleEmailChange}
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
                          onChange={handlePasswordChange}
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

          
          {error && <div className="alert alert-danger">{error}</div>}

          
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-outline-primary w-100"
              disabled={loading} 
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          
          <div className="text-center">
            Don&apos;t Have An Account?{" "}
            <a onClick={() => navigate('/Signup')} className="text-primary">
              Register Here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
