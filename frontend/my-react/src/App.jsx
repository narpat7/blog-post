import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './components/home.jsx';
import MainNavigation from './components/MainNavigation.jsx';
import FitnessContentEditor from './pages/add.jsx';
import ShowArticles from './pages/articles.jsx';
import ShowArticle from './pages/article.jsx';
import EditFitnessArticle from './pages/edit.jsx';
import Profile from './components/profile.jsx';
import Login from './pages/login.jsx';
import AboutUs from './pages/aboutUs.jsx';
import FAQ from './pages/FAQ.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';

const router = createBrowserRouter([
  {path:"/",element:<MainNavigation/>,children:[
    {path:"/",element:<Home/>},
    {path:"/aboutus",element:<AboutUs/>},
    {path:"/faq",element:<FAQ/>},
    {
  path: "/add",
  element: (
    <ProtectedRoute>
      <FitnessContentEditor />
    </ProtectedRoute>
  )
},

    {path:"/articles",element:<ShowArticles/>},
    {path:"/article/:id",element:<ShowArticle/>},
    {
      path: "/edit/:id",
      element: (
        <ProtectedRoute>
          <EditFitnessArticle />
        </ProtectedRoute>
      )
    },
{
  path: "/owner/health/fitness/with/choudhary/fitness/profile/user",
  element: (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  )
},

    {path:"/login",element:<Login/>},
    {path:"/forgot-password",element:<ForgotPassword/>}
  ]},
]);

function App() {
  const [count, setCount] = useState(0)

  return (
    <RouterProvider router={router} />
  )
}

export default App
