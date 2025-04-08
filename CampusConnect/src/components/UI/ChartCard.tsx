import React from "react";

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, actions }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                {actions && <div>{actions}</div>}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
};

export default ChartCard;
