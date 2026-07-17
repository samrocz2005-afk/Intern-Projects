import { Input } from "antd";

const SearchBar = ({ search, setSearch }) => {
  return (
    <Input
      placeholder="Search by Name or Email..."
      value={search}
      allowClear
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: 300,
        marginRight: 15,
      }}
    />
  );
};

export default SearchBar;