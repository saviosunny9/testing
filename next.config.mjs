/** @type {import('next').NextConfig} */
const staticExport = process.env.STATIC_EXPORT === '1';

const nextConfig = {
  reactStrictMode: true,
  // `STATIC_EXPORT=1 npm run build` writes a static site to out/. The placeholder prefix is
  // rewritten to relative URLs by scripts/relativize-export.mjs so it can be hosted from any sub-path.
  ...(staticExport ? { output: 'export', assetPrefix: '/__asset_prefix__' } : {}),
};

export default nextConfig;
