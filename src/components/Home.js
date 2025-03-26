import { Link } from "react-router-dom";
import "./Home.css";
import user from "./pics/default_user.png";
import searchicon from "./pics/search.png";
import { useContext, useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import restaurant1 from "./pics/restaurant1.jpg";
import restaurant2 from "./pics/restaurant2.webp";
import restaurant3 from "./pics/restaurant3.jpg";
import bowl from './pics/bowl.webp'
import greyicon from './pics/greyicon.png'
import carticon from './pics/carticon.png'
import { useSearchParams } from "react-router-dom";
import { themeContext } from "../App";
import Cart from "./Cart";
import axios from "axios";
import {toast } from 'react-toastify';
import load from './pics/load.gif'



export default function Home() {
    const cont = useContext(themeContext);
    const theme = cont.theme;
    
    const [params] = useSearchParams();
    const val = params.get('val');
    const uid = params.get('uid');
    const phone = params.get('phone');
    


    const show = cont.show;
    const setshow = cont.setshow;
    const[loading,setloading] = useState(true)


    useEffect(()=>{
        setisloggedin(val);
    },[])


    const [visible, setVisible] = useState(false);
    const [isloggedin, setisloggedin] = useState(0);

    const [data,setdata] = useState([]);

    
    const [selectedCategories, setselectedCategories] = useState([]);
    const [filteredData, setfilteredData] = useState([]);
    const [filtername, setfiltername] = useState();
    const [categories,setcategories] = useState([]);

    useEffect(()=>{
        var arr = data.filter((item)=>item.name === filtername)
        if(arr.length > 0)
        {
            setfilteredData(arr[0].name);
        }
        else
        {
            setfilteredData([]);
        }
       
    },[filtername, data]);

    useEffect(()=>{

        async function fetchData()
        {
            try{
                setloading(true)
                const result = await axios.get("http://localhost:9000/api/home");
                setdata(result.data);
                setcategories([...new Set(result.data.map(item=> item.category))])
            }
            catch(e)
            {
                toast.error("Error fetching restaurants!" + e.message)
            }
            finally{
                setloading(false)
            }
            
        }

        fetchData();
    },[]);

    

    const filterCategory = (cat)=>
    {
        if(!selectedCategories.includes(cat)){
            setselectedCategories([...selectedCategories,cat])
        }
        else{
            setselectedCategories(selectedCategories.filter((item)=>item !== cat))
        }
    }

    const handleblur = () => {
        setVisible(false);
    };

    
    return (
        <>
        {loading?
        <>
        <div className="loader-div">
            <img src={load} width="200px"/>
        </div>
        </>
        :<div className="home-main" style={{backgroundColor:theme? 'black': 'white'}}>
            <div className="header">
                <div className="tint">
                    <div className="nav">
                        <p className="heading">Boomato</p>
                        <div className="circle-container">
                            <div className="circle" onClick={() => setVisible(true)}>
                                <input
                                    className={`${visible ? "search-input" : ""}`}
                                    type="text"
                                    placeholder="Search for Restaurants"
                                    name="rest-name"
                                    onBlur={handleblur}
                                    onChange={(e)=>setfiltername(e.target.value)}
                                />
                                <img src={searchicon} height="70%" />
                            </div>
                            {isloggedin === '1'?
                            <Link to={`/user/${uid}/${phone}`}>
                                <div className="circle">
                                    <img src={user} height="100%" />
                                </div>
                            </Link>: 
                            <Link to="/login">
                            <div className="circle">
                                Login
                            </div></Link>}
                        </div>
                    </div>

                    <div className="carousel-container-parent">

                        <div className="carousel-container">
                            <p>Popular Places Nearby</p>
                            <Carousel>
                                <Carousel.Item>
                                    <img src={restaurant1} alt="Image One" />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img src={restaurant2} alt="Image One" />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img src={restaurant3} alt="Image One" />
                                </Carousel.Item>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
            <div className="category-container">
               {categories.map((item,i)=>{return(
                <div className="category" key={`${i}`}>
                    <div className="category-content"  onClick={()=>{filterCategory(item);}} style={{borderWidth:selectedCategories.includes(item)? 2: 0, borderStyle:'solid', borderColor:'blue'}}>
                        <span><img src={bowl} height="30"/> {item}</span>
                    </div>
                </div>
               )}) }
            </div>


            <hr className="hr-text" data-content="Explore"/>

            <div className="rest-list">
                {data.filter((item)=> selectedCategories.length === 0 || selectedCategories.includes(item.category)).filter((item)=>filteredData.length === 0 || filteredData.includes(item.name)).map((item,i)=>{return<div className="rest-item" key={`${i}`}>
                    <div className="rest-bg" >
                        <Link to={`/Rest?restname=${item.name}&uid=${uid}`}>
                            <div className="rest-content">
                            <p>{item.name}</p>
                            <div className="rest-rating">
                                <p>{item.rating} #</p>
                            </div>
                            <div className="rest-distance">
                                <img src={greyicon} height="15px"/> Just {item.dist} km away
                            </div>
                            </div>
                        </Link>
                    </div>
                </div>})
                }   
            </div>
            {isloggedin === '1'?
            <div className="cart-button" onClick={()=>setshow(true)}>
                <img src={carticon} height="90%"/>
            </div>:null}
            <Cart uid= {uid}/>
        </div>}
        </>
    );
}
