import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { createContext, useState,Suspense, lazy } from 'react';
import { ToastContainer} from 'react-toastify';

import load from './components/pics/load.gif'
const Home = lazy(()=>import('./components/Home'))
const Login = lazy(()=>import('./components/Login'))
const RestaurantItems = lazy(()=>import('./components/RestaurantItems'))
const User = lazy(()=>import('./components/User'))
const Cart = lazy(()=>import('./components/Cart'))
const OrderHistory = lazy(()=>import('./components/OrderHistory'))
const Register = lazy(()=>import('./components/Register'))


const themeContext = createContext();

function App() {
  const [theme,settheme] = useState(0);
  const [show,setshow] = useState(false);
  const [itemcount,setitemcount] = useState([]);

  return (
    <>
      <Suspense fallback={<div className="loader-div">
                  <img src={load} width="200px"/>
              </div>}>
      <themeContext.Provider value={{theme,settheme,show,setshow,itemcount,setitemcount}}>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/Rest" element={<RestaurantItems/>}/>
            <Route path="/user/:uid/:phone" element={<User/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/orders/:uname/:phone" element={<OrderHistory/>}/>
          </Routes>
      </BrowserRouter>
      </themeContext.Provider>
      <ToastContainer />
      </Suspense>
    </>
  );
}

export default App;
export {themeContext}