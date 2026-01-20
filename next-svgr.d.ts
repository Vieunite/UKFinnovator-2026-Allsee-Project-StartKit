declare module 'next-svgr' {
    import { NextConfig } from 'next';
    export default function withSvgr(config: NextConfig): NextConfig;
}
