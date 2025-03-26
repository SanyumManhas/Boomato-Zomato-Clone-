import './User.css';
import { Link, useParams } from 'react-router-dom';
import default_user from './pics/default_user.png'
import { useContext, useEffect, useState } from 'react';
import { themeContext } from '../App';
import load from './pics/load.gif'
export default function User()
{
    const params = useParams();
    const uname = params.uid;
    const phone = params.phone;
    const cont = useContext(themeContext);
    const theme = cont.theme;
    const settheme = cont.settheme;
    const[loading,setloading] =useState(true)

    useEffect(()=>{
        setloading(false)
    },[uname])

    return(
        <>
        {
            loading?
            <>
                    <div className="loader-div">
                        <img src={load} width="200px"/>
                    </div>
                    </>:<div className="user" style={{backgroundColor: theme? 'black': 'white'}}>
            
            <div className="user-content">
                <div className="grey-bg">
                    <img src={default_user} height="200"/> 
                    <div className='user-info'>
                        <p>{uname}</p>
                        <p>{phone}</p>
                    </div>
                </div>
            </div>

            <div className="user-settings">
                
                    <div className="setting">
                        <Link to={`/orders/${uname}/${phone}`}><p>Order history</p> </Link>
                    </div>
               
                <div className="setting" onClick={()=>{settheme(!theme);}}>
                    <p>Theme</p>
                </div>
                <div className="setting">
                    <Link to="/Home?val=0">
                        <p>Logout</p>
                    </Link>
                </div>

            </div>
        </div>
        }
        </>
    )
}