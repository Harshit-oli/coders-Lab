import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

const LogoutButton = ({children}) => {

    const {logout}=useAuthStore();

    async function onLogout(){
        await logout();
    }

  return (
    <button className='btn btn-primary' onClick={onLogout}>
        {children}
    </button>
  )
}

export default LogoutButton
