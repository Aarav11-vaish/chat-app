import React, { useState } from "react";
import { authStore } from "../authStore";
import { MessageSquare, User, Mail, Eye , Lock, EyeOff, Loader2, Loader} from "lucide-react";
import Rightsidepattern from "../Rightsidepattern"; // Assuming you have a RightSidePattern component
function Signup() {
  const [showpassword, setShowPassword] = useState(false); // Corrected useState destructuring
  const [formdata, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "", // Added fullName to avoid undefined error
  });

  const { sighnup, issignup } = authStore();

  const validateForm = () => {
    // validation logic (optional)
  };

  const handleforminput = (e) => {
    e.preventDefault();
    // form submission logic
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Enter your details to create an account
              </p>
            </div>
          </div>

          <form onSubmit={handleforminput} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  value={formdata.fullName}
                  onChange={(e) =>
                    setFormData({ ...formdata, fullName: e.target.value })
                  }
                />
              </div>
            </div>
              <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formdata.email}
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
                  <Lock className="size-5 text-base-content/40" />
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
                  onClick={() => setShowPassword(!showpassword)}
                >
                  {showpassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={issignup}>
              {issignup ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60 mt-4">
            already have an account?
</p>
            <a href="/login" className="text-primary font-medium hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
       <Rightsidepattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}

export default Signup;
