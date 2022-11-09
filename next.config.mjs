/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({ test: /\.ya?ml$/, use: 'raw-loader' });

    return config;
  }
};

export default nextConfig;
