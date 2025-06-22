"use client";

import { useState, useRef, useEffect } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import Image from "next/image";

interface ShoeSelectorProps {
  shoes: SanityRunningShoe[];
  selectedShoe: SanityRunningShoe | null;
  onShoeSelect: (shoe: SanityRunningShoe | null) => void;
  placeholder: string;
}

export default function ShoeSelector({
  shoes,
  selectedShoe,
  onShoeSelect,
  placeholder,
}: ShoeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter shoes based on search term
  const filteredShoes = shoes.filter(
    (shoe) =>
      shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoe.shoeType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoe.category?.some((cat) =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleShoeSelect = (shoe: SanityRunningShoe) => {
    onShoeSelect(shoe);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onShoeSelect(null);
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const displayValue = selectedShoe ? selectedShoe.name : searchTerm;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (selectedShoe) {
              onShoeSelect(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
        />
        {selectedShoe && (
          <button
            onClick={handleClearSelection}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <svg
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredShoes.length > 0 ? (
            filteredShoes.slice(0, 50).map((shoe) => (
              <button
                key={shoe._id}
                onClick={() => handleShoeSelect(shoe)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
              >
                {shoe.image && (
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={shoe.image.url}
                      alt={shoe.name}
                      fill
                      className="object-cover rounded"
                      sizes="48px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {shoe.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {shoe.shoeType?.name}
                    {shoe.category && shoe.category.length > 0 && (
                      <span className="ml-2">• {shoe.category[0]?.name}</span>
                    )}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              No shoes found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}

      {/* Selected shoe preview */}
      {selectedShoe && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            {selectedShoe.image && (
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={selectedShoe.image.url}
                  alt={selectedShoe.name}
                  fill
                  className="object-cover rounded"
                  sizes="64px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{selectedShoe.name}</p>
              <p className="text-sm text-gray-500">
                {selectedShoe.shoeType?.name}
                {selectedShoe.category && selectedShoe.category.length > 0 && (
                  <span className="ml-2">
                    • {selectedShoe.category[0]?.name}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
