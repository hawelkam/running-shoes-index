"use client";

import Search, { SearchProps } from "antd/es/input/Search";
import { useRouter } from "next/navigation";

const SearchInput = () => {
  const router = useRouter();

  const onSearch: SearchProps["onSearch"] = (value, event) => {
    event?.preventDefault();
    router.push(`/shoes/search?query="${value}"`);
  };

  return (
    <Search
      placeholder="input search text"
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
    />
  );
};

export default SearchInput;
