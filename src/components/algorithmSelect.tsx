import { algorithms } from "@/utils/constants";
import { Select, type SelectProps } from "@mantine/core";
import { memo } from "react";

export const AlgorithmSelect = memo((props: Omit<SelectProps, "data">) => {
  return <Select {...props} defaultValue="SHA1" data={[...algorithms]} />;
});
