export default function GenericTable({ columns, data, renderRow }) {
    return (
        <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-2xl shadow-lg">
            <thead className="text-white bg-emerald-600"> {/* Changed bg-hijau to bg-emerald-600 for consistency with other components */}
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
                {data.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50"> {/* Added item.id for better keying if available */}
                        {renderRow(item, index)}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}