import React,{useState} from 'react'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"   //react hook form zod ko clearly samaj nhi pata hai to yha par vo @hookform/resolver ka use karta hai 
import { Link } from 'react-router-dom'
import {z} from "zod"  //we us zod for validation we use zod for validation 
import {
    Code,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail
} from "lucide-react"  
// yha lucide-react jo hai react ke icons ki ek library hai jha se hum icons get kar sakte hai
import AuthImagePattern from "../components/AuthImagePattern"
import { useAuthStore } from '../store/useAuthStore'

const LoginSchema=z.object({
  email:z.string().email("enter a valid email"),
  password:z.string().min(6,"Password must be atleast of 6 character"),
})

const LoginPage = () => {

  const [showPassword,setShowPassword]=useState(false);

  const {isLoggingIn,login}=useAuthStore();

  const {
    register,
    handleSubmit,
    formState:{errors},
  }=useForm({
    resolver:zodResolver(LoginSchema),
  })

  const onSubmit=async (data)=>{
   try {
     await login(data);
    console.log(data);
   } catch (error) {
    console.error(error);
   }
  }
  return (
    <div className='h-screen grid lg:grid-cols-2'>
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Login to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
             disabled={isLoggingIn}
            >
              {
                           isLoggingIn ? (
                           <>
                           <Loader2 className='h-5 w-5 animate-spin'/>
                           Loading...
                           </>) : (
                             "Sign In"
                           )
                          }
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-base-content/60">
              Dont't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                 Signup
              </Link>
            </p>
          </div>
        </div>
      </div>

       {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your journey with us. Don't have an account? create one now."
        }
      />
    </div>
  )
}

export default LoginPage
