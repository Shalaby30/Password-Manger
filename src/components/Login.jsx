import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { account } from "../appwriteConfig";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        if (session) {
          navigate("/home");
        }
      } catch (error) {
        console.log("No active session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await account.createEmailPasswordSession(email, password);
      console.log("Login successful:", response);
      navigate("/home");
    } catch (error) {
      setError(error.message);
      console.log("Login error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200 ease-in-out">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-4 transition-all duration-200 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <LockIcon className="w-6 h-6 mr-2" /> Password Manager
            </h1>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="you@example.com"
                className="dark:bg-gray-700 py-2 px-3 border rounded-md border-gray-300 w-full dark:text-white dark:border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  placeholder="********"
                  className="dark:bg-gray-700 py-2 px-3 border rounded-md border-gray-300 w-full dark:text-white dark:border-gray-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="text-center">
              <Link
                to="/signup"
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Don't have an account? Register
              </Link>
            </div>
            <div className="text-center mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}