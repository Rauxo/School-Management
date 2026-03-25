import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import { useGetStudentFeesQuery } from '@/api/services/studentDataApi';
import DataTable from '@/components/common/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CreditCard, Download } from 'lucide-react';
import paymentService from '@/api/services/paymentService';
import toast from 'react-hot-toast';

const StudentFees = () => {
    const { data: fees, isLoading, refetch } = useGetStudentFeesQuery();

    const handlePay = async (feeId) => {
        try {
            const { order } = await paymentService.createOrder(feeId);
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                name: "InstiManage Fees",
                description: "Online Fee Payment",
                order_id: order.id,
                handler: async (response) => {
                    try {
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            feeId
                        });
                        toast.success('Payment successful!');
                        refetch();
                    } catch (err) { toast.error('Verification failed'); }
                },
                theme: { color: "#3b82f6" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) { toast.error('Failed to initiate payment'); }
    };

    const columns = [
        { header: 'Fee Description', accessor: 'title' },
        { header: 'Amount', cell: (row) => <span className="font-bold">₹{row.amount?.toLocaleString()}</span> },
        { header: 'Due Date', cell: (row) => new Date(row.dueDate).toLocaleDateString() },
        { 
            header: 'Status', 
            cell: (row) => <Badge variant={row.status === 'paid' ? 'success' : 'destructive'}>{row.status}</Badge> 
        },
        {
            header: 'Action',
            cell: (row) => (
                row.status === 'pending' ? (
                    <Button size="sm" onClick={() => handlePay(row._id)} className="gap-2">
                        <CreditCard size={14} /> Pay Now
                    </Button>
                ) : (
                    <Button variant="ghost" size="sm" className="gap-2 text-slate-400">
                        <Download size={14} /> Receipt
                    </Button>
                )
            )
        }
    ];

    return (
        <StudentLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Fee Ledger</h1>
                <p className="text-slate-500 text-sm italic font-medium">Review your invoices and manage online payments securely.</p>
            </div>

            <DataTable columns={columns} data={fees || []} isLoading={isLoading} />
        </StudentLayout>
    );
};

export default StudentFees;
