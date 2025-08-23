import React from "react";
import { authStore } from "../authStore";
import Rightsidepattern from "../Rightsidepattern";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link, Mail } from "lucide-react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import RightSidePattern from "../Rightsidepattern";

function Login() {
      const [showpassword, setshowpassword] = useState(false); // Corrected useState destructuring
      const [formdata, setFormData] = useState({
        email: "",
        password: "",
      });
    
    const { login, isLoggedIn } = authStore(); 
    const handlesubmit = async (e)=>{
e.preventDefault();
login(formdata)
    }
 return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <img src="public/tagname.png" alt="" />
                {/* <MessageSquare className="w-6 h-6 text-primary" /> */}
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handlesubmit} className="space-y-6">
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
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formdata.email}
                  // The spread operator (...formdata) copies the existing form data,
                  // so only the 'email' field is updated while keeping other fields unchanged.
                  onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showpassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formdata.password}
                  onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setshowpassword(!showpassword)}
                >
                  {showpassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggedIn}>
              {isLoggedIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <a href="/signup" className="text-primary font-medium hover:underline">
              signup
            </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <Rightsidepattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};


    export default Login;