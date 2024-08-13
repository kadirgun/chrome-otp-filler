import { useAccountContext } from "@/pages/options/contexts/account";
import { Box, Modal, ScrollArea } from "@mantine/core";
import { memo } from "react";
import { HistoryTimeline } from "@/pages/options/components/historyTimeline";

export const AccountHistoryModal = memo(() => {
  const { account, updateUI } = useAccountContext();

  const onClose = () => {
    updateUI((draft) => {
      draft.isHistoryModalOpen = false;
    });
  };

  return (
    <Modal centered title="Account history" opened={true} onClose={onClose}>
      <Box>
        <ScrollArea h={500}>
          <HistoryTimeline history={account.history} />
        </ScrollArea>
      </Box>
    </Modal>
  );
});
