'use client';
import { useEffect, useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const AuthContainer = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const router = useRouter();
  const { isAuthenticated, userId } = useAuth();

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  useEffect(() => {
    if (isAuthenticated && userId) {
      const pendingInvitation = localStorage.getItem('pendingInvitation');
      if (pendingInvitation) {
        localStorage.removeItem('pendingInvitation');
        router.push(`/join/${pendingInvitation}`);
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, userId, router]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={isSignIn ? "signin" : "signup"}
          initial={{ opacity: 0, x: isSignIn ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isSignIn ? 20 : -20 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {isSignIn ? (
            <SignInForm onToggleForm={toggleForm} />
          ) : (
            <SignUpForm onToggleForm={toggleForm} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthContainer;