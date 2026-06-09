import { BsDatabaseExclamation } from "react-icons/bs"

export default function EmptyState({ text = "Belum ada data" }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-8 py-12 text-center text-sm text-gray-600">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-gray-500 shadow-sm">
                <BsDatabaseExclamation />
            </div>
            <p>{text}</p>
        </div>
    )
}
