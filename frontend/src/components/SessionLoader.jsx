export default function SessionLoader({ message = "Comprobando sesión..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white fixed inset-0 z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner simple y limpio */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        
        {/* Mensaje */}
        <p className="text-gray-600 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}