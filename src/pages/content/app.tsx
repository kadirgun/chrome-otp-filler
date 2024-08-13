import { MantineProvider, ScrollArea } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Controller } from "./controller";

const queryClient = new QueryClient();

const getRootElement = () => document.querySelector("otp-filler")!.shadowRoot!.querySelector("#root")! as HTMLElement;

function isDarkTheme() {
  const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor || "rgb(255, 255, 255)";
  const rgb = bodyBackgroundColor.match(/\d+/g)!.map(Number);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

  const bodyColor = window.getComputedStyle(document.body).color || "rgb(0, 0, 0)";
  const rgb2 = bodyColor.match(/\d+/g)!.map(Number);
  const colorBrightness = (rgb2[0] * 299 + rgb2[1] * 587 + rgb2[2] * 114) / 1000;

  return brightness < 128 && colorBrightness > 128;
}

const getScale = () => {
  const fontSize = getComputedStyle(document.documentElement, null).getPropertyValue("font-size").replace("px", "");

  if (!fontSize) {
    return 1;
  }

  return 16 / parseFloat(fontSize);
};

export const App = () => {
  const color = isDarkTheme() ? "dark" : "light";
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        defaultColorScheme={color}
        getRootElement={getRootElement}
        cssVariablesSelector="#root"
        theme={{
          scale: getScale(),
          components: {
            Portal: {
              defaultProps: {
                target: getRootElement(),
              },
            },
            Tooltip: {
              defaultProps: {
                zIndex: 16777271,
              },
            },
            Combobox: {
              defaultProps: {
                zIndex: 16777271,
              },
            },
            Popover: {
              defaultProps: {
                zIndex: 16777271,
              },
            },
            Modal: {
              defaultProps: {
                zIndex: 16777271,
                trapFocus: false,
                scrollAreaComponent: ScrollArea.Autosize,
              },
            },
          },
        }}
      >
        <ModalsProvider>
          <Notifications zIndex={16777272} />
          <Controller />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
