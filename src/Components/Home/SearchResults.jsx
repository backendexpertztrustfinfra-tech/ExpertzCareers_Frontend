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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Search results for: "{query}"</h2>
      {results.length > 0 ? (
        results.map((item, idx) => (
          <div key={idx} className="bg-white shadow rounded p-4 mb-2">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-500">{item.type}</p>
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
