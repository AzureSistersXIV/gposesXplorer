import { Utilities } from "./Utilities";

// Host URL for API requests
const host = "https://naslku.synology.me/gposesXplorerAPI/";

// Main entry point: runs when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  handleInitialLoad();
});

async function handleInitialLoad() {
  Utilities.setIsNsfw();
  Utilities.initMainParts(host);

  addNavigateSuccess(() => Utilities.loadContent(host));
  Utilities.loadContent(host);
}

function addNavigateSuccess(f) {
  if (window.navigation) {
    window.navigation.removeEventListener("navigatesuccess", f);
    window.navigation.addEventListener("navigatesuccess", f);
  } else {
    // Initialize fallback with robust guard
    if (!window._navigationFallback) {
      Object.defineProperty(window, "_navigationFallback", {
        value: {
          handlers: new Set(),
          setup() {
            // Avoid double-patching
            if (history.pushState._isMonkeyPatched) return;

            // Patch pushState/replaceState
            const originalPushState = history.pushState;
            history.pushState = function (...args) {
              originalPushState.apply(this, args);
              window.document.title = args[1];
              window.dispatchEvent(
                new CustomEvent("fallbacknavigate", {
                  detail: { url: window.location.href, state: args[0] },
                })
              );
            };
            history.pushState._isMonkeyPatched = true;

            history.replaceState = function (...args) {
              originalPushState.apply(this, args);
              window.document.title = args[1];
              window.dispatchEvent(
                new CustomEvent("fallbacknavigate", {
                  detail: { url: window.location.href, state: args[0] },
                })
              );
            };
            history.replaceState._isMonkeyPatched = true;

            // Unified event handler
            const handler = () => {
              const event = {
                destination: { url: window.location.href },
                state: history.state,
              };
              window._navigationFallback.handlers.forEach((cb) => cb(event));
            };
            window.addEventListener("popstate", handler);
            window.addEventListener("hashchange", handler);
            window.addEventListener("fallbacknavigate", handler);
          },
        },
        writable: false,
        configurable: false,
      });
      window._navigationFallback.setup();
    }

    // Register handler
    window._navigationFallback.handlers.delete(f);
    window._navigationFallback.handlers.add(f);
  }
}
