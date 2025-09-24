import React, { useContext } from "react";
import { SearchContext } from "../Home/SearchContext";

const dummyData = [
  { type: "Job", title: "Frontend Developer" },
  { type: "Company", title: "Expertz Trust Finfra" },
  { type: "Job", title: "React Developer" },
];

const SearchResults = () => {
  const { query } = useContext(SearchContext);

  const results = dummyData.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#fff1ed] rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-[#caa057]">
        Search results for: "{query}"
      </h2>
      {results.length > 0 ? (
        results.map((item, idx) => (
          <div key={idx} className="bg-white shadow rounded p-4 mb-2 border border-gray-200">
            <p className="font-medium text-gray-800">{item.title}</p>
            <p className="text-sm text-gray-500">{item.type}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;