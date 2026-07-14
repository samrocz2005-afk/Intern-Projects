import { Input } from "antd";

const SearchBar = ({ search, setSearch }) => {
  return (
    <Input
      placeholder="Search by Name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: 250,
        marginRight: 15,
      }}
    />
  );
};

export default SearchBar;