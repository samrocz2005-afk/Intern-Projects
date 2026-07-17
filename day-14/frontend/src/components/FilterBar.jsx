import { Select } from "antd";

const { Option } = Select;

const FilterBar = ({ filter, setFilter }) => {
  return (
    <Select
      value={filter}
      onChange={(value) => setFilter(value)}
      style={{ width: 200 }}
    >
      <Option value="All">All Departments</Option>
      <Option value="CSE">CSE</Option>
      <Option value="IT">IT</Option>
      <Option value="ECE">ECE</Option>
      <Option value="EEE">EEE</Option>
      <Option value="MECH">MECH</Option>
    </Select>
  );
};

export default FilterBar;