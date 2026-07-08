import React from "react";

function Header({
  favoriteCount,
  onShowFavorites,
  showFavorites,
}) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">
          🎬 Movie Search App
        </h1>

        <button
          className="favorite-header-btn"
          onClick={onShowFavorites}
        >
          {showFavorites ? "Home" : "❤️ Favorites"}
        </button>
      </div>
    </header>
  );
}

export default Header;