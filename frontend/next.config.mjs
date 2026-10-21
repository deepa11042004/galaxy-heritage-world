// Uploaded images are stored by the API and served from its /media/uploads folder.
// Computed at build/start time, so set API_INTERNAL_URL (or NEXT_PUBLIC_API_URL) before `next build`.
const configured = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || '';
const API_ORIGIN = (configured.startsWith('http') ? configured : 'http://127.0.0.1:4000/api/v1').replace(/\/api\/v1\/?$/, '');

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'galaxyheritageworld.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  async rewrites() {
    return [
      // The browser talks to the API through this site (same origin), so login cookies work on any host.
      { source: '/api/v1/:path*', destination: `${API_ORIGIN}/api/v1/:path*` },
      {
        source: '/media/uploads/:path*',
        destination: `${API_ORIGIN}/media/uploads/:path*`,
      },
      {
        source: '/media/galaxy-heritage-world/homepage/images/Neelam-goa.jpg',
        destination: '/media/galaxy-heritage-world/homepage/images/neelam-goa.jpg',
      },
      {
        source: '/media/galaxy-heritage-world/homepage/images/Divan-Clarks-Inn-Goa.jpg',
        destination: '/media/galaxy-heritage-world/homepage/images/divan-clarks-inn-goa.jpg',
      },
      {
        source: '/media/galaxy-heritage-world/homepage/images/Untitled-1024-x-674-px.png',
        destination: '/media/galaxy-heritage-world/homepage/images/untitled-1024-x-674-px.png',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/domestic-destinations',
        destination: '/destinations?type=DOMESTIC',
        permanent: true,
      },
      {
        source: '/international-destinations',
        destination: '/destinations?type=INTERNATIONAL',
        permanent: true,
      },
      {
        source: '/internal-excahnge',
        destination: '/destinations?type=INTERNATIONAL',
        permanent: true,
      },
      {
        source: '/get-in-touch',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/activities',
        destination: '/day-activities',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/membership',
        permanent: true,
      },
      // The old Blue / White / Red packages were replaced by the Galaxy Heritage Club membership.
      {
        source: '/vacation-packages',
        destination: '/membership',
        permanent: true,
      },
      {
        source: '/complaint-board',
        destination: '/reviews-and-complaints',
        permanent: true,
      },
      {
        source: '/galaxy-holiday-world-complaints-escalation-matrix',
        destination: '/reviews-and-complaints#escalation',
        permanent: true,
      },
      {
        source: '/ghw-review-and-complaints-faq-by-customers',
        destination: '/reviews-and-complaints#faqs',
        permanent: true,
      },
      {
        source: '/member-login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/member',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/crm',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/uttarakhand',
        destination: '/destinations/uttarakhand',
        permanent: true,
      },
      {
        source: '/himachal-pradesh',
        destination: '/destinations/himachal-pradesh',
        permanent: true,
      },
      {
        source: '/south-india',
        destination: '/destinations/south-india',
        permanent: true,
      },
      {
        source: '/rajasthan',
        destination: '/destinations/rajasthan',
        permanent: true,
      },
      {
        source: '/goa',
        destination: '/destinations/goa',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
