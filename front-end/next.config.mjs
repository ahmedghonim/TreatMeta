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
        destination: `http://127.0.0.1:8000/api/:path*`,
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
