import { useContext, useState } from "react";
import { themeContext } from "../App";
import { Button, Modal } from "react-bootstrap";
import './Cart.css'
import axios from "axios";
import {toast } from 'react-toastify';


export default function Cart(params)
{
    const cont = useContext(themeContext);
    const show = cont.show;
    const setshow = cont.setshow;
    const itemcount = cont.itemcount;
    const setitemcount = cont.setitemcount;

    const uid = params.uid;
    

    const handleClose = () => {
        setshow(false);
    }
    const handleCancel = ()=>{
        setitemcount([]);
        setshow(false);
    }
    const handleOrder = () =>{ 
        //save to order history and clear cart
      
        const groupedorders = itemcount.reduce((acc,item)=>{
            const restaurant = item.restaurant;
            if(!acc[restaurant])
            {
                acc[restaurant] = []
            } 
            acc[restaurant].push(item);
            return acc;
        },{});

        const result = Object.entries(groupedorders).map(([category, items]) => ({ category, items }));
        console.log(result);
        pushOrder(result);

        setitemcount([]);
        setshow(false);
    
    }

    async function pushOrder(data)
    {
        try{
            const result = await axios.post(`http://localhost:9000/api/pushorders?uid=${uid}`,data)
            if(result)
            {
                toast.success("Order Placed!")
            }
            else{
                toast.warn("Order Failed!")
            }
        }
        catch(e)
        {
            console.log("Error occured in network" + e.message)
        }
        
    }
    return(
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Your Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table>
                    <tbody >
                        <tr >
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                        {itemcount.map((item,i)=>{
                            return(
                                <tr>
                                    <td>{item.name}</td>
                                    <td>{item.count}</td>
                                    <td>$ {item.price}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleOrder}>
                Order Now
            </Button>
            </Modal.Footer>
        </Modal>
    )
}