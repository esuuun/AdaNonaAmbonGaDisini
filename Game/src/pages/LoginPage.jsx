import axios from "axios";
import { Eye, EyeOff, Lock, Mail, User, ChevronLeft } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/AuthContext";

function LoginPage() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error messages
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Handle login form change
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
    setLoginError("");
  };

  // Handle register form change
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({ ...registerForm, [name]: value });
    setRegisterError("");
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Semua field harus diisi");
      return;
    } // For now, we'll just log the form data
    console.log("Login form submitted:", loginForm);

    toast.loading("Login...");
    try {
      // Here you would typically call an API to authenticate the user
      // If successful, you would navigate to the appropriate page
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        loginForm
      );
      console.log("Login successful:", response.data);
      toast.dismiss();
      toast.success("Login berhasil!");
      login(response.data.payload);
      navigate("/", { state: { userData: response.data } });
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError(
        error.response?.data?.message || "Login gagal. Silakan coba lagi."
      );
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Login gagal. Silakan coba lagi."
      );
    } finally {
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    }
  };

  // Handle register submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !registerForm.username ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      setRegisterError("Semua field harus diisi");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Password dan konfirmasi password tidak cocok");
      return;
    }

    // For now, we'll just log the form data
    console.log("Register form submitted:", registerForm);

    toast.loading("Registering...");
    try {
      const { username: name, email, password } = registerForm;
      console.log("Registering user:", { name, email, password });
      // Here you would typically call an API to register the user
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/create`,
        { name, email, password }
      );
      console.log("Registration successful:", response.data);
      toast.dismiss();
      toast.success("Registrasi berhasil! Silakan login.");
      setActiveTab("login");
    } catch (error) {
      console.error("Registration failed:", error);
      setRegisterError(
        error.response?.data?.message || "Registrasi gagal. Silakan coba lagi."
      );
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative">
      <div className="w-full max-w-md mx-auto bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${
              activeTab === "login"
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("login")}
          >
            LOGIN
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium text-sm transition-colors ${
              activeTab === "register"
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("register")}
          >
            REGISTER
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              Welcome Back!
            </h2>

            {loginError && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-300 rounded-md text-sm">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Masukkan email anda"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="w-full bg-slate-700 text-white pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Masukkan password anda"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors transform hover:scale-105 shadow-lg"
              >
                Login
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-400">
              <p>
                Belum punya akun?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="text-yellow-400 hover:underline"
                >
                  Daftar disini
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              Buat Akun Baru
            </h2>

            {registerError && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-300 rounded-md text-sm">
                {registerError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                    className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Masukkan username anda"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Masukkan email anda"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className="w-full bg-slate-700 text-white pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Masukkan password anda"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Konfirmasi password anda"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors transform hover:scale-105 shadow-lg"
              >
                Register
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-400">
              <p>
                Sudah punya akun?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-yellow-400 hover:underline"
                >
                  Login disini
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
