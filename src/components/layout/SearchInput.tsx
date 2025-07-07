"use client";

import Search, { SearchProps } from "antd/es/input/Search";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  onSearchComplete?: () => void;
}

const SearchInput = ({ onSearchComplete }: SearchInputProps = {}) => {
  const router = useRouter();

  const onSearch: SearchProps["onSearch"] = (value, event) => {
    event?.preventDefault();
    if (value.trim()) {
      router.push(`/shoes/search?query=${encodeURIComponent(value.trim())}`);
      onSearchComplete?.();
    }
  };

  return (
    <Search
      placeholder="Search shoes..."
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
      style={{ width: "100%" }}
    />
  );
};

export default SearchInput;
