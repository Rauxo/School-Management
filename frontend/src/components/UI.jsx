import React from 'react';

export const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 ${className}`}>
        {title && <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{title}</h3>}
        {children}
    </div>
);

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline: "border border-slate-200 text-slate-600 hover:bg-slate-50"
    };
    return (
        <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
