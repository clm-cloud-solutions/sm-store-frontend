export default async function handler(req, res) {
  const startTime = Date.now();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Check dependency: Store Backend
  if (apiUrl) {
    try {
      const backendHealth = await fetch(`${apiUrl}/api/health`, {
        signal: AbortSignal.timeout(5000),
        headers: { "Accept": "application/json" },
      });
      if (!backendHealth.ok) {
        return res.status(503).json({
          status: "error",
          service: "store-frontend",
          message: "Dependency failure: Backend API returned " + backendHealth.status,
          dependency: { service: "store-backend", url: apiUrl, status: "down" },
          responseTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      const isTimeout = err.name === "TimeoutError" || err.code === "ABORT_ERR";
      return res.status(503).json({
        status: "error",
        service: "store-frontend",
        message: isTimeout ? "Dependency failure: Backend API timed out" : "Dependency failure: Backend API unreachable",
        dependency: { service: "store-backend", url: apiUrl, status: isTimeout ? "timeout" : "unreachable", detail: err.message },
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    }
  }

  res.status(200).json({
    status: "ok",
    service: "store-frontend",
    dependencies: { backend: apiUrl ? "connected" : "not configured" },
    responseTime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
