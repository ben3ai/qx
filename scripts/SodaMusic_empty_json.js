/**
 * Quantumult X - script-response-body
 * Always respond with an empty JSON object: {}
 */
(() => {
  $done({
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: "{}",
  });
})();
