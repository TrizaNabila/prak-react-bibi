import { LuFilter } from "react-icons/lu";

export default function PageHeader() {
    return (
        <div id="pageheader-container" className="p-4 mt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* SISI KIRI: Judul & Breadcrumb */}
                <div id="pageheader-left" className="flex flex-col">
                    <span id="page-title" className="text-3xl font-bold text-gray-800">
                        Dashboard
                    </span>
                    <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-1 text-sm">
                        <span className="text-gray-400">Home</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-400">Home Detail</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-400 font-bold text-hijau">Home Very Detail</span>
                    </div>
                </div>

                <div id="header-filter" className="flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-gray-50">
                    <div className="flex items-center px-3 text-gray-400 border-r border-gray-100 mr-2">
                        <LuFilter size={16} />
                    </div>
                    <div className="flex space-x-1">
                        <button className="px-4 py-1.5 text-xs font-bold bg-hijau text-white rounded-xl shadow-md transition-all">
                            Daily
                        </button>
                        <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
                            Weekly
                        </button>
                        <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
                            Monthly
                        </button>
                    </div>
                </div>
            </div>
            

            <div className="w-full h-[1px] bg-gray-200/50 mt-6"></div>
        </div>
    );
}