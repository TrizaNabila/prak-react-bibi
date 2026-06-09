export default function LoadingSpinner({ text = "Loading..." }) {
    return (
        <div className="flex items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-8 text-sm text-gray-600 shadow-sm">
            <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-t-hijau border-gray-300"></div>
            <span>{text}</span>
        </div>
    )
}
