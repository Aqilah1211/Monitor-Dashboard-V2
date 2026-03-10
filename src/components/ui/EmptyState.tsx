import { ReactNode } from 'react';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  // Judul pesan kosong
  title: string;
  
  // Deskripsi/pesan detail
  message: string;
  
  // Ikon custom (opsional)
  icon?: ReactNode;
  
  // Tombol aksi (opsional)
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  title,
  message,
  icon,
  actionButton
}: EmptyStateProps) {
  // Default icon jika tidak diberikan
  const displayIcon = icon || (
    <InboxIcon className="w-16 h-16 mx-auto text-slate-300" strokeWidth={1.5} />
  );

  return (
    <div className="flex items-center justify-center min-h-[400px] px-4 py-8 sm:py-16">
      <div className="text-center max-w-md w-full">
        {/* Ikon */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          {displayIcon}
        </div>

        {/* Judul */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3">
          {title}
        </h3>

        {/* Pesan */}
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 leading-relaxed">
          {message}
        </p>

        {/* Tombol Aksi (opsional) */}
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {actionButton.text}
          </button>
        )}
      </div>
    </div>
  );
}
