# What is Fluxy?

Fluxy is a very simple store that allows Deno Fresh islands to communicate using
hooks.

# Demo

[Live Demo](https://fluxy-fresh.deno.dev/)

# Usage

## Custom Hook

```ts
// hooks/useToaster.ts
import { useStore } from "https://deno.land/x/fluxy/mod.ts";

export interface ToastState {
  show: boolean;
  type: "success" | "warning" | "error";
  message: string;
}

const defaultToastState = (): ToastState => ({
  show: false,
  type: "success",
  message: "",
});

export const useToaster = () => {
  const { state, setState, resetState } = useStore(
    "toast-notification",
    defaultToastState,
  );

  const showToast = (
    { type, message }: Pick<ToastState, "message" | "type">,
  ) => {
    if (state.value.show) {
      resetState();
    }
    setState({
      show: true,
      type,
      message,
    });
  };

  const hideToast = () => {
    resetState();
  };

  return {
    state,
    showToast,
    hideToast,
  };
};
```

## Islands

### Toast Component

```tsx
// islands/Toast.tsx
import { useMemo } from "preact/hooks";
import { useToaster } from "../hooks/useToaster.ts";

export default function Toast() {
  const { state, hideToast } = useToaster();
  const { show, type, message } = state.value;

  const icon = useMemo(() => {
    switch (type) {
      case "success": {
        return (
          <svg
            class="flex-shrink-0 h-4 w-4 text-green-500 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </svg>
        );
      }
      case "warning": {
        return (
          <svg
            class="flex-shrink-0 h-4 w-4 text-yellow-500 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
          </svg>
        );
      }
      case "error": {
        return (
          <svg
            class="flex-shrink-0 h-4 w-4 text-red-500 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
          </svg>
        );
      }
      default: {
        return <></>;
      }
    }
  }, [type]);

  return show
    ? (
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg"
        role="alert"
      >
        <div class="flex p-4 items-center gap-3">
          <div class="flex-shrink-0">
            {icon}
          </div>
          <div class="ms-3">
            <p class="text-sm text-gray-700">
              {message}
            </p>
          </div>
          <button
            type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
            onClick={hideToast}
          >
            <span class="sr-only">Close</span>
            <svg
              class="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      </div>
    )
    : <></>;
}
```

### Toaster Control

```tsx
// islands/ShowToastButton.tsx
import { faker } from "https://deno.land/x/deno_faker@v1.0.3/mod.ts";
import { useToaster } from "../hooks/useToaster.ts";

export default function ShowToastButton(props: { type: "show" | "hide" }) {
  const { showToast, hideToast } = useToaster();

  return props.type === "show"
    ? (
      <button
        class="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        onClick={() => {
          function getRandomInt(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1) + min);
          }

          const index = getRandomInt(0, 2);
          const values: ["success", "warning", "error"] = [
            "success",
            "warning",
            "error",
          ];
          showToast({
            type: values.at(index)!,
            message: faker.hacker.phrase(),
          });
        }}
      >
        Show Toast
      </button>
    )
    : (
      <button
        class="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        onClick={hideToast}
      >
        Hide Toast
      </button>
    );
}
```

# Examples

Take a look at the following files in
[this](https://github.com/woody34/fluxy-fresh) repo for a reference
implementation.

```sh
├── hooks
│   └── useToaster.ts
├── islands
│   ├── ShowToastButton.tsx
│   └── Toast.tsx
└── routes
    └── _app.tsx
```

[Code Sandbox](https://codesandbox.io/p/github/woody34/fluxy-fresh/main?import=true&layout=%257B%2522sidebarPanel%2522%253A%2522GIT%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clp9bek5n00073b6isci6hrun%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clp9bek5n00033b6iod4uzhc3%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clp9bek5n00053b6icx0pk795%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clp9bek5n00063b6iwy9fdqqq%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B60%252C40%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clp9bek5n00033b6iod4uzhc3%2522%253A%257B%2522id%2522%253A%2522clp9bek5n00033b6iod4uzhc3%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522clp9bek5n00063b6iwy9fdqqq%2522%253A%257B%2522id%2522%253A%2522clp9bek5n00063b6iwy9fdqqq%2522%252C%2522activeTabId%2522%253A%2522clp9bu9rq02bv3b6i7oxxs12d%2522%252C%2522tabs%2522%253A%255B%257B%2522type%2522%253A%2522TASK_PORT%2522%252C%2522taskId%2522%253A%2522deno%2520task%2520start%2522%252C%2522port%2522%253A8000%252C%2522id%2522%253A%2522clp9bu9rq02bv3b6i7oxxs12d%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522path%2522%253A%2522%252F%2522%257D%255D%257D%252C%2522clp9bek5n00053b6icx0pk795%2522%253A%257B%2522id%2522%253A%2522clp9bek5n00053b6icx0pk795%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clp9bek5n00043b6ie1rakkcl%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TERMINAL%2522%252C%2522shellId%2522%253A%2522clp9bek86000wegi8ggcc7xkn%2522%257D%252C%257B%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522CSB_RUN_OUTSIDE_CONTAINER%253D1%2520devcontainer%2520templates%2520apply%2520--template-id%2520%255C%2522ghcr.io%252Fdevcontainers%252Ftemplates%252Ftypescript-node%255C%2522%2520--template-args%2520%27%257B%257D%27%2520--features%2520%27%255B%255D%27%2522%252C%2522id%2522%253A%2522clp9bf0ng007d3b6ibtvaurxb%2522%252C%2522mode%2522%253A%2522permanent%2522%257D%252C%257B%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522deno%2520task%2520start%2522%252C%2522id%2522%253A%2522clp9bh16p00ii3b6i1s3pjmaa%2522%252C%2522mode%2522%253A%2522permanent%2522%257D%255D%252C%2522activeTabId%2522%253A%2522clp9bh16p00ii3b6i1s3pjmaa%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)
