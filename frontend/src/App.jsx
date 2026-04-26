import {
 BrowserRouter,
 Routes,
 Route
} from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {

 return (

   <BrowserRouter>

      <Routes element={<ProtectedRoute />}>

         <Route
           path="/"
           element={<RegisterPage />}
         />

         <Route
           path="/login"
           element={<LoginPage />}
         />
         
        <Route
            path="/dashboard" element={<DashboardPage />}
        />

      </Routes>


   </BrowserRouter>

 );

}

export default App;