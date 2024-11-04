import nextra from "nextra";
/** @type {import('next').NextConfig} */
const nextConfig = {
  // stope type checking
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://${process.env.NEXT_PUBLIC_BASE_API_URL}/:path*`,
      },
    ];
  },
};

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  latex: true,
});
export default withNextra(nextConfig);
