import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./container/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
    return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENTID}>
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='*' element={<Home/>}/>
        </Routes>
    </GoogleOAuthProvider>
     );
}
 
export default App;