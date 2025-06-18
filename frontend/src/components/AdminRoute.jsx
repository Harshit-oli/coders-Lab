import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Loader } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const AdminRoute = () => {
    const {authUser,isCheckingAuth}=useAuthStore();

    if(isCheckingAuth){
        return <div className='flex items-center justify-center h-screen'><Loader className='size-10 animate-spin'/></div>
    }
    if(!authUser || authUser.role !=="ADMIN"){
        return <Navigate to="/"/>
    }
  return <Outlet/>
//    <Outlet /> nested (child) route ko render karega
// Yaani jo bhi route tumne AdminRoute ke andar likha hai usko.
}

export default AdminRoute
