import { useEffect, useState } from 'react'
import './Order.css'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {toast } from 'react-toastify';

export default function OrderHistory()
{
    const [ordered,setordered] = useState([]);
    const params = useParams();
    const uname = params.uname;

    
    useEffect(()=>{
        async function fetchdata()
        {
            try{
                const orderhistory =  await axios.get(`http://localhost:9000/api/orderhistory?uid=${uname}`);
                setordered(orderhistory.data)
            }
            catch(e)
            {
                toast.error("Server error" + e.message)
            }
           
        }
       
        fetchdata();
    },[params,uname])


    return(
        <>
            <h2>Order History</h2>    
            <hr/>    
            <div className="order-container">
                    {
                        ordered.map((item,i)=>{
                            return(
                                <div className="order-restaurant" key={`${i}`}>
                                    <div className="order-heading">
                                        {item.category}<br/>
                                    </div>
                                    {
                                        item.items.map((fd,i)=>{
                                            return(
                                                <div className="order-item" key={`${i}`}>
                                                    <p id="left">{fd.name}</p><p id="right">{fd.price * fd.count}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })

                    }
            </div>
        </>
    )
}