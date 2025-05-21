"use client";

export default function Container({ children, className = "" }) {
    return (
        <div className={`w-full max-w-4xl mx-auto px-4 md:px-8 ${className}`}>
            {children}
        </div>
    );
}
