import React from "react";

interface ButtonProps {
    label: string;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-yellow-200 hover:bg-yellow-300 active:bg-yellow-300 text-white font-semibold py-5 w-full rounded-lg shadow-md transition duration-300"
        >
            {label}
        </button>
    );
};

export default Button;

