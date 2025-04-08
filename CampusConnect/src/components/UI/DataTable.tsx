import React from "react";

interface Column {
    header: string;
    accessor: string;
    cell?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    actions?: (row: any) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, actions }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                        {actions && (
                            <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-700">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-400"
                                >
                                    {column.cell
                                        ? column.cell(row[column.accessor], row)
                                        : row[column.accessor]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {actions(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
