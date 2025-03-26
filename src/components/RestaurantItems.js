import {Carousel} from "react-bootstrap";
import one from './pics/restaurant1.jpg';
import two from './pics/restaurant2.webp';
import three from './pics/restaurant3.jpg';
import ratingStar from './pics/ratingStar.jpg';
import carticon from './pics/carticon.png'
import './Rest.css'
import { themeContext } from "../App";
import { useContext, useEffect, useState } from "react";
import Cart from "./Cart";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {toast } from 'react-toastify';
import { createClient } from 'pexels';
import load from './pics/load.gif'


export default function RestaurantItems()
{
    const [searchparam] = useSearchParams();
    const restname = searchparam.get('restname');
    const uid = searchparam.get('uid');

    const cont = useContext(themeContext);
    const theme = cont.theme;
    const setshow = cont.setshow;
    const itemcount = cont.itemcount;
    const setitemcount = cont.setitemcount;


    const [menuItems, setmenuItems] = useState([]);
    
    const [rendercount, setrendercount] = useState(0);
    const [restaurantName, setrestaurantName] = useState("");
    const [restaurantLocation, setrestaurantLocation] = useState("");
    const [restaurantComment, setrestaurantComment] = useState("");
    const [restaurantRating, setrestaurantRating] = useState("");
    const [loading,setloading] = useState(true)

    useEffect(()=>{
        async function fetchData()
        {
            try{
                setloading(true)
                const apimenuitems = await axios.get(`http://localhost:9000/api/getitems?restname=${restname}`);
                if(apimenuitems)
                {
                    setrestaurantName(apimenuitems.data.name);
                    setrestaurantLocation(apimenuitems.data.location);
                    setrestaurantComment(apimenuitems.data.comment);
                    setrestaurantRating(apimenuitems.data.rating);
                    setmenuItems(apimenuitems.data.items);
                }
                else
                {
                    toast.warn("Restaurant data not found!");
                }
            }
            catch(e)
            {
                toast.error("Server error" + e.message)
            }
            finally{
                setloading(false)
            }
          
        }

        fetchData();
    },[])




    useEffect(()=>{
        setrendercount(rendercount + 1);
    },[itemcount])

    const [refresh,setrefresh] = useState(false);


    const handleReduceCount = (title,id,price)=>
    {
        let ind = itemcount.findIndex((itm)=>itm.id === id && itm.restaurant === restaurantName);
        if(ind !== -1)
        {
                if(itemcount[ind].count === 1){
                    itemcount.splice(ind,1);
                    setrefresh(!refresh)
                }
                else {
                    let newcnt = itemcount[ind].count - 1;
                    price = price*newcnt
                    itemcount.splice(ind,1);
                    setitemcount([...itemcount,{restaurant:restaurantName,id:id, name:title,count: newcnt,price:price}]);
                    
                }
        }
    }

    const handleIncreaseCount = (title,id,price)=>{
        let ind = itemcount.findIndex((itm)=>itm.id === id && itm.restaurant === restaurantName)
        if(ind === -1)
        {
            setitemcount([...itemcount, {restaurant:restaurantName,id:id, name:title,count:1,price:price}]);
           
        }
        else{
            let newcnt = itemcount[ind].count + 1;
            price = price*newcnt
            itemcount.splice(ind,1);
            setitemcount([...itemcount,{restaurant:restaurantName,id:id, name:title,count: newcnt,price:price}]);
      
        }
    }

    return(
       <>
        {loading?
        <>
        <div className="loader-div">
            <img src={load} width="200px"/>
        </div>
        </>:
         <div className="rest-main" >
         <div className="restaurant-content" style={{backgroundColor:theme? 'black': 'white', color:theme? 'white': 'black'}}>
             <div className="rest-carousel-container">
                 <Carousel>
                     <Carousel.Item>
                         <img src={one} height="200"/>
                     </Carousel.Item>
                     <Carousel.Item>
                         <img src={two} height="200"/>
                     </Carousel.Item>
                     <Carousel.Item>
                         <img src={three} height="200"/>
                     </Carousel.Item>
                 </Carousel>
             </div>

             <div className="rest-info">
                 <div className="info-indicator"></div>
                 <div className="rest-name">
                     <h1>{restaurantName}</h1>
                     <div className="sub-heading "><p>{restaurantLocation}</p> <div className="grey-dot"></div> <p>{restaurantComment}</p></div>
                 </div>
                 <div className="rating-contain">
                 <div className="rest-info-rating">
                     {restaurantRating}
                 </div>
                 </div>
             </div>
             <div className="menu-items">
                     {menuItems.map((item,i)=>{
                         let index = itemcount.findIndex((itm)=> itm.id === i && itm.restaurant === restaurantName);
                        return( <div className="menu-item" key={`${i}`}>
                          <div className="item">
                             <div className="item-content">
                                 <p id="title" style={{color:theme?'white':'black'}}>{item.title}</p>
                                 <div id="attrs"><div className="veg-sign" style={{backgroundColor: item.veg?'green':'red'}}><div className="white-dot"></div></div> 
                                {Array.from({length:restaurantRating}).map((e,i)=>(
                                 <img src={ratingStar} height='20' key={`${i}`}/>
                                ))}
                                 </div>
                                 <p id="price">get one for ${item.price}</p>
                                 <p id="desc">{item.desc}</p>
                             </div>
                             <div className="item-img">
                                 <img src={item.image} alt={item.title} onError={(e) => console.error("Image error:", e)} />
                                
                                 <div className="item-counter">
                                     <button className="counter-btn" onClick={()=>handleReduceCount(item.title,i,item.price)}>-</button>
                                         {index !== -1? itemcount[index].count: 0}
                                     <button className="counter-btn" onClick={()=>handleIncreaseCount(item.title,i,item.price)}>+</button>
                                 </div>
                             </div>
                         </div>
                     </div>)
                     })}
             </div>
         </div>
         <div className="cart-button" onClick={()=>setshow(true)}>
            { rendercount > 1? <div className="red-dot"></div>:null}
             <img src={carticon} height="90%"/>
         </div>
         <Cart uid = {uid}/>
     </div>
        
        }
        </>
       
    )
}
