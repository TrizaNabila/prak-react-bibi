export default function ErrorPage({ code, description, image }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
      
      {/* Kode Error */}
      <h1 className="text-7xl font-extrabold text-gray-800">
        {code}
      </h1>

      {/* Deskripsi */}
      <p className="mt-3 text-lg text-gray-500">
        {description}
      </p>

      {/* Gambar */}
      {image && (
        <img
          src={image}
          alt="error"
          className="w-80 mt-6"
        />
      )}

      {/* Tombol balik */}
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-2 bg-hijau text-white rounded-lg shadow hover:opacity-90"
      >
        Go Back
      </button>
    </div>
  );
}