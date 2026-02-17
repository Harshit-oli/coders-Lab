import React, { useEffect } from 'react'
import { Routes,Route,Navigate } from 'react-router-dom'
import HomePage from './page/HomePage'
import SignUpPage from './page/SignUpPage'
import LoginPage from './page/LoginPage'
import {Toaster} from "react-hot-toast"
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import Layout from './layout/Layout'
import AdminRoute from './components/AdminRoute'
import AddProblem from './page/AddProblem'
import ProblemPage from './page/ProblemPage'
import EditPage from "./page/EditPage"
import Profile from './page/Profile'
import ProblemsPages from './components/ProblemPages'
import ProfileEdit from './components/ProfileEdit'


const App = () => {
  const {authUser,checkAuth,isCheckingAuth}=useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    );
  }
  return (
    <div className='flex flex-col '>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={authUser ? <HomePage/> : <Navigate to={"/login"}/>}/>
        <Route path="editPage" element={authUser ? <ProfileEdit/> : <Navigate to={"/login"}/>}/>
         <Route
          path="/problems"
          element={<ProblemsPages/>}
        />
        </Route>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to={"/"}/>}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to={"/"}/>}/>
        <Route path="/problem/:id" element={authUser ? <ProblemPage/> : <Navigate to={"/login"}/>}></Route>
        <Route element={<AdminRoute/>}>
        <Route 
        path="/add-problem"
        element={authUser ? <AddProblem/>: <Navigate to={"/"}/>}/>
        <Route 
        path="/problems/:id/edit"
        element={authUser ? <EditPage/>: <Navigate to={"/"}/>}/>
        </Route>
         <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>

    </div>
  )
}

export default App
