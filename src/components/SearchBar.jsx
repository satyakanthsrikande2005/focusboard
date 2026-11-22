import { Search, X } from "lucide-react";

function SearchBar({ value, onChange, placeholder = "Search tasks by title…" }) {
  return (
    <div className="search-bar" role="search">
      <label htmlFor="task-search" className="visually-hidden">
        Search tasks by title
      </label>
      <Search className="search-bar__icon" size={18} aria-hidden="true" />
      <input
        id="task-search"
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
