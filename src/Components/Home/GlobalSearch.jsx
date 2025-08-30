import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../Home/SearchContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const GlobalSearch = () => {
  const { query, setQuery } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate("/search");
    }
  };

  return (
    <div className="flex items-center bg-white border border-yellow-600 rounded px-3 py-1 w-full">
      <MagnifyingGlassIcon className="h-5 w-5 text-yellow-600 mr-2" />
      <input
        type="text"
        placeholder="Search jobs, companies..."
        className="w-full outline-none text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
      />
    </div>
  );
};

export default GlobalSearch;
