import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/features/auth/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { GraduationCap, Lock, Mail, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import PageLayout from "@/layouts/PageLayout";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  if (user) return <Navigate to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <PageLayout>

      <div className="min-h-screen pt-28 pb-10 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">

        <div className="max-w-6xl w-full grid md:grid-cols-2 shadow-2xl">

          {/* LEFT SIDE - INFO PANEL */}
          <div className="hidden md:flex flex-col justify-center p-10 bg-blue-800 text-white">

            <div className="space-y-6 max-w-md">
              <div className="flex items-center gap-3">
                <div className="bg-white text-blue-800 p-3 rounded-xl">
                  <GraduationCap size={28} />
                </div>
                <h2 className="text-2xl font-bold">GURU GLOBAL EDUCATION</h2>
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Welcome Back 
              </h1>

              <p className="text-blue-100 text-lg">
                Access your dashboard to manage academics, track progress,
                and stay connected with your institute.
              </p>

              <ul className="space-y-2 text-sm text-blue-200">
                <li>✔ Manage Attendance</li>
                <li>✔ View Results & Exams</li>
                <li>✔ Access Study Materials</li>
              </ul>
            </div>

          </div>

          {/* RIGHT SIDE - LOGIN FORM */}
          <div className="bg-white p-8 md:p-10">

            <div className="max-w-md mx-auto space-y-6">

              {/* HEADER */}
              <div className="text-center space-y-2">
                <div className="bg-blue-600 size-12 rounded-xl flex items-center justify-center text-white mx-auto shadow-lg">
                  <GraduationCap size={26} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Sign In
                </h1>
                <p className="text-gray-500 text-sm">
                  Enter your credentials to continue
                </p>
              </div>

              {/* FORM */}
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* EMAIL */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="name@institute.com"
                          className="pl-10 h-11 bg-gray-50 border border-gray-200 focus-visible:ring-blue-200"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <label className="font-medium text-gray-700">
                          Password
                        </label>
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-11 bg-gray-50 border border-gray-200 focus-visible:ring-blue-200"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* BUTTON */}
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : "Sign In"}
                    </Button>

                  </form>
                </CardContent>
              </Card>

              {/* FOOT TEXT */}
              <p className="text-center text-gray-400 text-xs">
                Secure login system • Unauthorized access prohibited
              </p>

            </div>

          </div>

        </div>

      </div>

    </PageLayout>
  );
};

export default Login;