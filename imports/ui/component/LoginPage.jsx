import React, { useRef, useState } from "react";
import {Meteor} from "meteor/meteor"
import {Link , useNavigate} from 'react-router-dom';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import '../styles/login-page.css'

export const LoginPage = () =>{

    const nav = useNavigate();
    const [username , setUsername] = useState("");
    const [password , setPassword] = useState("");
    const [eye , setEye] = useState(true);
    const [errorText, setErrorText] = useState(true);

    let showPassword = useRef('');
    
    showPassword.current.type = eye ? 'password' : 'text';

    const handleLogin = (e) => {
        e.preventDefault();

        Meteor.loginWithPassword(username,password, (er)=>{
            if(er){
                setErrorText(!errorText);
                return nav("/")
            }else{
                return nav("/main");
            }
        });
        Meteor.logoutOtherClients();
    }

    return ( 
        <form onSubmit={(e)=>handleLogin(e)} className="login">
            <div>
                <h1>Chat App</h1>
                {
                    errorText ? <></>:<span className="error-text">Incorrect username or password</span>
                }
                <input type="text" name="fullName" id="" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} required />
                <span style = {{position:"relative",display:"flex", alignItems:'center'}}>
                    <input 
                    type="password" 
                    name = "password" 
                    placeholder="Password" 
                    onChange={(e)=>setPassword(e.target.value)} 
                    ref={showPassword}
                    required />
                    {
                        eye ? 
                        <AiOutlineEye onMouseEnter={()=>setEye(!eye)} className="eye-icon" /> 
                        : 
                        <AiOutlineEyeInvisible onMouseLeave={()=>setEye(!eye)} className="eye-icon" />
                    }
                </span>
                <button type="submit" className="login-btn">Log in</button>
                <Link to="/register" className="create-btn">Sign Up</Link>
            </div>
        </form>
    )
}

export default LoginPage