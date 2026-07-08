import React from "react";

function SearchBar({
  searchTerm,
  onSearchChange,
  onSearch,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={onSearchChange}
        />

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

SearchBar.defaultProps = {
  searchTerm: "",
  onSearchChange: () => {},
  onSearch: () => {},
};

export default SearchBar;