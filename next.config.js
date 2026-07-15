/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // On Kubernetes the browser talks same-origin and Next proxies /api/* to the
  // backend Service (BACKEND_URL env, evaluated at `next start`). afterFiles:
  // the app's own pages/api/* routes (e.g. /api/health) keep precedence.
  // On Vercel BACKEND_URL is unset, so behavior there is unchanged.
  async rewrites() {
    const backend = process.env.BACKEND_URL;
    if (!backend) return [];
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
  },
};
module.exports = nextConfig;
// Deployment test - 2026-04-14T16:54:54Z
