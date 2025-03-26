const express = require('express');
const  app = express();
const cors = require('cors');
const mongoose = require('mongoose');


app.use(express.json())

app.use(cors());

app.get("/",(req,res)=>{
    res.send("Server Started Successfully")
})



mongoose.connect("mongodb://127.0.0.1:27017/boomata_users").then(()=>{
    console.log("Connected to Mongodb")
}).catch((e)=>{
    console.log("Error while connecting to db" + e.message);
})

const userSchema = new mongoose.Schema({name:String, email:{type:String, unique:true},phone:{type:String, unique:true},password:String},{versionKey:false});
const userModel = mongoose.model("reguser", userSchema);

const restaurantSchema = new mongoose.Schema({name:String, location:String,comment:String,rating:Number,items:[{id:Number, title:String, veg:Boolean, price:Number, desc:String, image:String}]})
const restaurantModel = mongoose.model("restaurant", restaurantSchema);

const homeSchema = new mongoose.Schema({name:String,rating:String, dist:String, category:String});
const homeModel = mongoose.model("Home_restaurant",homeSchema);

app.get("/api/home",async (req,res)=>{
    try{
        const result = await homeModel.find({});
        res.send(result);
    }
    catch(e)
    {
        res.status(500).send("Database error")
    }
   
})

app.get("/api/getitems",async (req,res)=>{
    try{
        const result = await restaurantModel.findOne({name:req.query.restname});
        if(result)
        {
            res.send(result);
        }
        else
        {
            res.send([])
        }
    }
    catch(e)
    {
        res.status(500).send("Database error")
    }
   
})






app.post("/api/register", async (req,res)=>{
    try{
        const userdata = {name: req.body.name,email: req.body.email,phone: req.body.phone,password: req.body.pass};

        const newdoc = new userModel(userdata);
        await newdoc.save();
        res.send("user added")
    }
    catch(e)
    {
        res.status(500).send("Error Saving user")
    }
   
})

app.post("/api/login", async(req,res)=>{
    try{
        const logindata = {name:req.body.name, password:req.body.pass};
        const iscorrect = await userModel.find(logindata);
        if(iscorrect.length <= 0)
        {
            res.send({found:false})
        }
        else{
            res.send({uid:iscorrect[0].name,phone:iscorrect[0].phone,found:true})
        }
    }
    catch(e)
    {
        res.status(500).send("error logging in")
    }
    
})


const placedorderSchema = new mongoose.Schema({userid:String, orders:[{category:String, items:[{count:Number, id:Number, name:String, price:Number,restaurant:String}]}]})
const placedorderModel = mongoose.model("placedorderModel",placedorderSchema);

app.post("/api/pushorders", async(req,res)=>{
    try{
        const result = await placedorderModel.findOne({ userid: req.query.uid });
        console.log(result);
        if (result === null) {
            const newdata = new placedorderModel({ userid: req.query.uid, orders: req.body});
            newdata.save().then(()=>{
                console.log("data added")
            }).catch((e)=>{
                console.log("error saving new user" + e.message)
            })
            res.send({ success: true });
        } else {
            await placedorderModel.findOneAndUpdate(
                { userid: req.query.uid },
                { $push: { orders: req.body } },
                { new: true }
            )
            .then(() => res.send({ success: true }))
            .catch((e) => console.log("Error while updating:", e));
        }
    }
    catch(e)
    {
        res.status(500).send("Error adding order")
    }
   
   
});


app.get("/api/orderhistory",async (req,res)=>{
    try{
        const name = req.query.uid;
        const result = await placedorderModel.findOne({userid:name});
        if(result)
        {
            res.send(result.orders)
        }
        else
        {
            res.send([]);
        }
    }
    catch(e)
    {
        res.status(500).send("error fetching orders")
    } 
})

app.listen(9000, ()=>{
    console.log("Server Started Successfully")
})