import React, { useRef, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {Accounts} from 'meteor/accounts-base';
import '../styles/register.css';
import {AiOutlineEye , AiOutlineEyeInvisible} from 'react-icons/ai'

export const Register = () =>{

    const [username, setUsername] = useState("");
    const [fname , setFname] = useState("");
    const [pass, setPass] = useState("");   
    const [eye , setEye] = useState(true);
    const [errorText , setErrorText] = useState(false);

    let showPassword = useRef('');
    showPassword.current.type = eye ? 'password' : 'text';

    const nav = useNavigate();

    const handleRegister = (e) =>{
        e.preventDefault();

        Accounts.createUser({username:username,password:pass,profile:{fullName:fname}}, (err)=>{
            if(err){
                setErrorText(true);                
            }else{  
                setErrorText(false);
                nav('/main');
            }
        });
    }

    return(
        <form onSubmit={(e)=>handleRegister(e)} className = "register" >
            <div>
                <h1>Register</h1>
                {
                    errorText ? <span className="error-text">Username is already taken</span>: <></> 
                }
                <input type="text" name="fullName" placeholder="Full Name" onChange={(e)=>setFname(e.target.value)} required />
                <input type="text" name="username" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} required />
                <span style = {{position:"relative",display:"flex", alignItems:'center'}}>
                    <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={(e)=>setPass(e.target.value)} 
                    ref = {showPassword}
                    required
                    />
                    {
                        eye ? 
                        <AiOutlineEye onMouseEnter={()=>setEye(!eye)} className="eye-icon" /> 
                        : 
                        <AiOutlineEyeInvisible onMouseLeave={()=>setEye(!eye)} className="eye-icon" />
                    }
                </span>
                
                <button type="submit" className="register-btn">Create Account</button>
                <Link to = "/login" className="back-to-login-btn">Back to Login</Link>
            </div>
        </form>
    )
}

export default Register