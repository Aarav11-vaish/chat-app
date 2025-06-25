import React, { useState, useEffect } from "react";
import { authStore } from "../authStore";
import {
  MessageSquare,
  User,
  Mail,
  Eye,
  Lock,
  EyeOff,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Rightsidepattern from "../Rightsidepattern";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // ✅ For redirect

function Signup() {
  const [showpassword, setShowPassword] = useState(false);
  const [formdata, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signAuth, isSignedUp } = authStore();
  const [success, setSuccess] = useState(false); // ✅ Track local success
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedUp) {
      setSuccess(true);
      const timer = setTimeout(() => {
        navigate("/login"); // ✅ Redirect to login after 10 seconds
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isSignedUp, navigate]);

  const validateForm = () => {
    if (!formdata.fullName.trim()) return toast.error("Username is required");
    if (!formdata.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formdata.email)) return toast.error("Invalid email format");
    if (!formdata.password) return toast.error("Password is required");
    if (formdata.password.length < 6) return toast.error("Password must be at least 6 characters long");
    return true;
  };

  const handleforminput = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid === true) {
      signAuth(formdata);
    }
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
              <p className="text-base-content/60">Enter your details to create an account</p>
            </div>
          </div>

          {!success ? (
            <form onSubmit={handleforminput} className="space-y-6">
              {/* Full Name */}
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
                    onChange={(e) => setFormData({ ...formdata, fullName: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
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
                    className="input input-bordered w-full pl-10"
                    placeholder="you@example.com"
                    value={formdata.email}
                    onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
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
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••••"
                    value={formdata.password}
                    onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showpassword)}
                  >
                    {showpassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-primary w-full" disabled={isSignedUp}>
                {isSignedUp ? <Loader2 className="size-5 animate-spin" /> : "Create Account"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-green-400">Almost done!</h2>
              <p className="text-zinc-300">A verification link has been sent to your email.</p>
              <p className="text-zinc-400">Please verify your email. Redirecting you to login...</p>
              <a href="/login" className="btn btn-outline btn-primary mt-4">
                Go to Login
              </a>
            </div>
          )}
          <div className="text-center">
  <p className="text-base-content/60 mt-4">
    Already have an account?
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
