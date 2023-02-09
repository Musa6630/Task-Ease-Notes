import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = (props) => {
  let navigate=useNavigate();

  const [credentials, setcredentials]= useState({email:"", password: ""});
  
    const handlesubmit=async(e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password})
          });
          const json=await response.json();
          console.log(json)

          if(json.success){
            //
            localStorage.setItem('auth-token', json.authToken);
            props.showAlert("Account Successfully logged in","success");
            navigate("/");

          }
          else{
            props.showAlert("Invalid Credentials","danger")
          }
    }
    const onChange = (e)=>{
      setcredentials({...credentials, [e.target.name]: e.target.value})
  }
  return (
    <div className="container center_div mt-3">
      <h2>Login to Continue in TaskEase</h2>
      <form onSubmit={ handlesubmit }>
        <div className="mb-3">
          <label htmlfor="exampleInputEmail1"  className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"  
            id="email"
            name="email"
            onChange={onChange}
            value={credentials.email}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlhtmlfor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            value={credentials.password}
            onChange={onChange}
            id="password"
            name="password"
          />
        </div>
        <button type="submit" className="btn btn-primary" >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
