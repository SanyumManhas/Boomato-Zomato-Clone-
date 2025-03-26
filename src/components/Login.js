import { useState } from 'react';
import './Login.css'
import icon1 from './pics/burger-icon.webp';
import icon2 from './pics/pizza.jpg';
import icon3 from './pics/noodles.webp';
import icon4 from './pics/chicken.webp';
import icon5 from './pics/pasta.jpg';
import loginIcon from './pics/loginIcon.png'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast } from 'react-toastify';

export default function Login()
{
    const nav = useNavigate();

    const [name,setname] = useState();
    const [pass,setpass] = useState();


    const handlelogin = async (e)=>{
        e.preventDefault();
        try{
            let api = {name,pass};
            let response = await axios.post("http://localhost:9000/api/login", api);
            if(response.data.found)
            {
                nav(`/Home?val=1&uid=${response.data.uid}&phone=${response.data.phone}`);
            }
            else
            {
                toast.warn("Incorrect username or password")
            }
        }
        catch(e)
        {
            toast.error("server error" + e.message)
        }
      
    }

    return(
        <div className="login-container">
            <div className="login-bg">
                <div className="login-form">
                    <h2>Login</h2>
                    <div className="login-icon-container">
                        <div className="login-icon"><img src={icon1} height="100%"/></div>
                        <div className="login-icon"><img src={icon2} height="100%"/></div>
                        <div className="login-icon"><img src={icon3} height="100%"/></div>
                        <div className="login-icon"><img src={icon4} height="100%"/></div>
                        <div className="login-icon"><img src={icon5} height="100%"/></div>
                    </div>
                    <form onSubmit={handlelogin}>
                        <input type="text" placeholder="username" required=" " onChange={(e)=>setname(e.target.value)}/>
                        <input type="password" placeholder="password" required=" " onChange={(e)=>setpass(e.target.value)}/>
                        <button type="submit"><img src={loginIcon} height="100%"/></button>
                        <Link to="/register"><p>New User?</p></Link>
                    </form>
               </div>
            </div>
        </div>
    )
}