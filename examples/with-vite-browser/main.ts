/// <reference types="vite/client" />

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start();
}

fetch(window.location.origin + "/api/health")
  .then((res) => res.json())
  .then((json) => {
    const $app = document.getElementById("app");
    if ($app) {
      $app.textContent = JSON.stringify(json, null, 2);
    }
  });
