import React, { useEffect, useState } from 'react'
import { exiosInstance } from '../lib/axios'
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
    const navigate=useNavigate();
  const [change,setChange]=useState(
    {
        name:"",
        email:"",
    }
);
const [save,setSave]=useState(false);
const { authUser } = useAuthStore();

useEffect(()=>{
   if(authUser){
       setChange({ name: authUser.name || "", email: authUser.email || "" });
   }
},[authUser])
  const handleChange=async(e)=>{
    setChange((prev)=>({...prev,[e.target.name]:e.target.value}))
  }


  const handleSubmit=async(e)=>{
     e.preventDefault();
     setSave(true);
     try {
        await exiosInstance.put(`/auth/update`,
            change,
            { withCredentials: true }
        );
    alert("Problem updated successfully!");
      navigate("/");
     } catch (err) {
        console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Update failed");
     }
     finally {
      setSave(false);
    }

  }
  return (
    <div className="bg-gray-600 p-8 w-[400px] mt-20">
      
<form onSubmit={handleSubmit}>
      <div className='flex flex-col justify-center items-center'>
          <input type="text"
        name="name"
        value={change.name}
        onChange={handleChange}
        className='border border-gray-300 p-2 mb-3'
        required />

        <input type="email"
        name="email"
        value={change.email}
        onChange={handleChange}
        className='border border-gray-300 p-2'
        required />
      </div>

        <button  type="submit"
          className="btn btn-primary w-full mt-24"
          disabled={save}>{save ? "saving..." : "save changes"}</button>
</form>
    </div>
  )
}

export default ProfileEdit
