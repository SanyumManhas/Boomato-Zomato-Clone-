import { useState } from 'react';
import './Login.css'
import icon1 from './pics/burger-icon.webp';
import icon2 from './pics/pizza.jpg';
import icon3 from './pics/noodles.webp';
import icon4 from './pics/chicken.webp';
import icon5 from './pics/pasta.jpg';
import loginIcon from './pics/loginIcon.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Register()
{

    const [name,setname] = useState();
    const [email,setemail] = useState();
    const [phone,setphone] = useState();
    const [pass,setpass] = useState();
    const [passc,setpassc] = useState();
    const [error,seterror] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) {
          setphone(value);
          seterror(value.length === 10 ? "" : "Phone number must be 10 digits");
        }
      };


    const handleregister = async (e)=>{
        e.preventDefault();
        try{
            if(pass === passc)
            { 
                let apidata = {name,email,phone,pass};
                let response = await axios.post("http://localhost:9000/api/register", apidata);
                toast.success(response.data);
            }
            else
            {
                toast.warn("Passwords doesnt match")
            }
        }
        catch(e)
        {
            toast.error("Server error" + e.message)
        }
       
    }

    
    return(
        <div className="login-container">
            <div className="login-bg">
                <div className="login-form">
                    <h2>Register</h2>
                    <div className="login-icon-container">
                        <div className="login-icon"><img src={icon1} height="100%"/></div>
                        <div className="login-icon"><img src={icon2} height="100%"/></div>
                        <div className="login-icon"><img src={icon3} height="100%"/></div>
                        <div className="login-icon"><img src={icon4} height="100%"/></div>
                        <div className="login-icon"><img src={icon5} height="100%"/></div>
                    </div>
                    <form onSubmit={handleregister}>
                        <input type="text" placeholder="username" required=" " onChange={(e)=>setname(e.target.value)}/>
                        <input type="text" placeholder="email"  required=" " onChange={(e)=>setemail(e.target.value)}/>
                        <input type="text" placeholder="phone"  required=" " onChange={handleChange}/>
                        <input type="password" placeholder="password" required=" " onChange={(e)=>setpass(e.target.value)}/>
                        <input type="password" placeholder="confirm password" required=" " onChange={(e)=>setpassc(e.target.value)}/>
                        <button type="submit"><b>Register</b></button>
                    </form>
                </div>
            </div>
        </div>
    )
}