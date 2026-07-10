import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

const { Search: SearchInput } = Input;

function SearchBar({ city, setCity, onSearch }) {
  return (
    <SearchInput
      size="large"
      placeholder="Enter city name..."
      value={city}
      enterButton={<SearchOutlined />}
      onChange={(e) => setCity(e.target.value)}
      onSearch={onSearch}
      allowClear
    />
  );
}

export default SearchBar;