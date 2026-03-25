import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import StatCard from '@/components/common/StatCard';
import { Users, UserCheck, CreditCard, DollarSign, TrendingUp } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { useGetAdminStatsQuery } from '@/api/services/dashboardApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  const chartData = [
    { name: 'Mon', income: 4000, students: 240 },
    { name: 'Tue', income: 3000, students: 139 },
    { name: 'Wed', income: 2000, students: 980 },
    { name: 'Thu', income: 2780, students: 3908 },
    { name: 'Fri', income: 1890, students: 4800 },
    { name: 'Sat', income: 2390, students: 3800 },
    { name: 'Sun', income: 3490, students: 4300 },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Administrator Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={isLoading ? "..." : (stats?.totalStudents || 0)} 
          icon={Users} 
          trend="up" trendValue={12}
        />
        <StatCard 
          title="Total Staff" 
          value={isLoading ? "..." : (stats?.totalStaff || 0)} 
          icon={UserCheck} 
          color="purple"
        />
        <StatCard 
          title="Fees Collected" 
          value={isLoading ? "..." : `₹${stats?.totalFeesCollected?.toLocaleString() || 0}`} 
          icon={DollarSign} 
          color="success"
          trend="up" trendValue={8}
        />
        <StatCard 
          title="Pending Dues" 
          value={isLoading ? "..." : `₹${stats?.pendingDues?.toLocaleString() || 0}`} 
          icon={CreditCard} 
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Income Overview</CardTitle>
              <TrendingUp className="size-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#64748b" tickFormatter={(v) => `₹${v}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                     <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#94a3b8" />
                     <Tooltip 
                       cursor={{fill: '#f8fafc'}}
                       contentStyle={{ borderRadius: '12px', border: 'none' }}
                     />
                     <Bar dataKey="students" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={20} />
                   </BarChart>
                 </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
