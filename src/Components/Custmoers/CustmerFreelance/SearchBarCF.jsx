// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
//import css file
import "../../Custmoers/SearchBar.css"; 

const SearchBarCf = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const searchRef = useRef(null);

  const items = [
    // handle api
    "Apple iPhone 15",
    "Samsung Galaxy S24",
    "Google Pixel 8",
    "MacBook Pro M3",
    "Dell XPS 13",
    "iPad Air",
    "Surface Pro 9",
    "AirPods Pro",
    "Sony WH-1000XM5",
    "Nintendo Switch",
    "PlayStation 5",
    "Xbox Series X"
  ];

  useEffect(() => {
    if (searchTerm) {
      const filtered = items.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredItems([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => setSearchTerm(e.target.value);
  const handleItemClick = (item) => {
    setSearchTerm(item);
    setIsOpen(false);
  };
  const handleInputFocus = () => {
    if (searchTerm && filteredItems.length > 0) setIsOpen(true);
  };
  const clearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="search-bar-container  dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm" ref={searchRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder="Search for products..."
        className="search-input w-full px-4 py-2 text-gray-800 dark:text-gray-200 bg-transparent border-none outline-none placeholder-gray-500 dark:placeholder-gray-400"
      />
      {searchTerm && (
        <button className="clear-btn text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" onClick={clearSearch}>
          ✕
        </button>
      )}

      {isOpen && (
        <div className="dropdown absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-b-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className="dropdown-item px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => handleItemClick(item)}
              >
                {item}
              </div>
            ))
          ) : (
            <div className="dropdown-item no-result px-4 py-2 text-gray-500 dark:text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBarCf;
