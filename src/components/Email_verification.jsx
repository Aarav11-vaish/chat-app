import { useState, useEffect } from "react";
import { axiosInstance } from '../axios';
import { useParams, useNavigate } from "react-router-dom";
import { Loader, CheckCircle, XCircle } from "lucide-react";

function Email_verification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        await axiosInstance.get(`/verify-email/${token}`);
        setStatus("success");
        // Wait 2 seconds and then redirect
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        console.error("Email verification failed:", err);
        setStatus("error");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4 text-center">
      {status === "loading" && (
        <>
          <Loader className="h-10 w-10 animate-spin" />
          <p>Verifying your email...</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle className="h-10 w-10 text-green-500" />
          <p className="text-xl font-medium text-green-600">Email verified successfully! 🎉</p>
          <p className="text-sm text-zinc-600">Redirecting to login page...</p>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="h-10 w-10 text-red-500" />
          <p className="text-xl font-medium text-red-600">Verification failed or link expired 😢</p>
          <p className="text-sm text-zinc-600">Please sign up again or contact support.</p>
        </>
      )}
    </div>
  );
}

export default Email_verification;
