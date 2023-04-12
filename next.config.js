/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MY_SECRET_URL: process.env.NEXT_PUBLIC_MY_SECRET_URL,
  },
}

module.exports = nextConfig
