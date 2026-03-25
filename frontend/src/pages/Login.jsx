import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/features/auth/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GraduationCap, Lock, Mail, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
            <div className="bg-primary size-12 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-primary/20 mb-4">
                <GraduationCap size={28} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Institute Portal</h1>
            <p className="text-slate-500 text-sm">Please sign in to access your dashboard</p>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input 
                    type="email" 
                    placeholder="name@institute.com" 
                    className="pl-10 h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-semibold text-slate-700">Password</label>
                    <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold rounded-xl" 
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-slate-400 text-xs">
            Protected by Institute Security Layer. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default Login;
