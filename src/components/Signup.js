import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  let navigate=useNavigate();
  const [credentials, setcredentials] = useState({ name:" ",email: "", password: "" , cpassword:""});
  const handlesubmit = async (e) => {
    e.preventDefault();
    const {name,email, password}=credentials;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name,email,password}),
    });
    const json = await response.json();
    console.log(json);
    if(json.success){
      //
      localStorage.setItem("token", json.authtoken);
      navigate("/");
      props.showAlert("Successfully Created User","success")
    }
    else{
      props.showAlert("Invalid details given","danger")
    }
    
  };
  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h2>Create an account to Continue in TaskEase</h2>
      <form onSubmit={handlesubmit}>
        <div class="mb-3">
          <label for="name" class="form-label">
            Name
          </label>
          <input
            type="name"
            class="form-control"
            id="name"
            name="name"
            aria-describedby="emailHelp"
            onChange={onChange}
          />
        </div>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            name="email"
            aria-describedby="emailHelp"
            onChange={onChange}
          />
        </div>
        <div class="mb-3">
          <label for="Password" class="form-label">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            id="Password"
            name="password"
            minLength={5}
            required
            onChange={onChange}
          />
        </div>
        <div class="mb-3">
          <label for="Password" class="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            class="form-control"
            id="cPassword"
            name="cpassword"
            onChange={onChange}
          />
        </div>

        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
