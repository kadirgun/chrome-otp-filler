import type { HistoryItem, OTPAccount } from "@/types";
import { Text, Timeline } from "@mantine/core";
import {
  IconForms,
  IconCopy,
  IconSquareRoundedPlus,
  IconEdit,
  IconShield,
  IconSettings,
  IconShieldOff,
  IconInputCheck,
  IconQrcode,
} from "@tabler/icons-react";
import { capital } from "case";
import moment from "moment";
import { memo } from "react";

export type HistoryTimelineProps = {
  history: OTPAccount["history"];
};

export const HistoryTimeline = memo(({ history }: HistoryTimelineProps) => {
  const historyIcons: Record<HistoryItem["type"], React.ReactNode> = {
    fill: <IconInputCheck size={12} />,
    autofill: <IconForms size={12} />,
    copy: <IconCopy size={12} />,
    create: <IconSquareRoundedPlus size={12} />,
    edit: <IconEdit size={12} />,
    protect: <IconShield size={12} />,
    settings: <IconSettings size={12} />,
    unprotect: <IconShieldOff size={12} />,
    qrcode: <IconQrcode size={12} />,
  };

  return (
    <Timeline active={history.length} bulletSize={24} lineWidth={2}>
      {history.map((item, index) => (
        <Timeline.Item key={index} bullet={historyIcons[item.type]} title={capital(item.type)}>
          <Text c="dimmed" size="sm">
            {item.description}
          </Text>
          <Text size="xs" mt={4}>
            {moment(item.timestamp).fromNow()}
          </Text>
        </Timeline.Item>
      ))}
    </Timeline>
  );
});
