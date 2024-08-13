import type { OTPAccount } from "@/types";
import { Table, Text } from "@mantine/core";
import { capital } from "case";
import { memo } from "react";

export type AccountInfoTableProps = {
  account: OTPAccount;
  show?: (keyof OTPAccount)[];
};

const defaultFields: (keyof OTPAccount)[] = ["issuer", "algorithm", "period", "digits"];

export const AccountInfoTable = memo(({ account, show = defaultFields }: AccountInfoTableProps) => {
  return (
    <Table>
      <Table.Tbody>
        {show.map((key) => (
          <Table.Tr key={key}>
            <Table.Th>{capital(key)}</Table.Th>
            <Table.Td>
              <Text lineClamp={1}>{account[key].toString()}</Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
});
