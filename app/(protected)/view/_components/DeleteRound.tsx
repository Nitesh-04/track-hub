import React, { useState } from 'react';
import { Trash } from 'lucide-react';

interface DeleteRoundButtonProps {
  onDelete: () => void;
}

export default function DeleteRoundButton({ onDelete }: DeleteRoundButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="p-0 hover:bg-transparent"
      >
        <Trash className="w-4 h-4 ml-4 text-red-500" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 animate-in fade-in duration-200 md:ml-20">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Are you absolutely sure?
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                This will permanently delete the round.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}