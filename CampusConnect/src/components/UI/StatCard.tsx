import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: "blue" | "green" | "purple" | "red" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    color,
}) => {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        purple: "bg-purple-500",
        red: "bg-red-500",
        orange: "bg-orange-500",
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <h2 className="text-white text-2xl font-bold mt-1">
                        {value}
                    </h2>

                    {trend && (
                        <div className="flex items-center mt-2">
                            <span
                                className={`text-sm ${
                                    trend.isPositive
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                {trend.isPositive ? "+" : ""}
                                {trend.value}%
                            </span>
                            <span className="text-gray-400 text-xs ml-1">
                                depuis le mois dernier
                            </span>
                        </div>
                    )}
                </div>

                <div
                    className={`${colorClasses[color]} h-12 w-12 rounded-full flex items-center justify-center`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
