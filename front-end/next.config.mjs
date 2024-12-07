import nextra from "nextra";
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // stope type checking
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/:path*`,
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
