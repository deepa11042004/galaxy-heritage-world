/** The stay categories shown on /stays. The slugs are also stored on hotels (hotels.stay_types), so keep them in sync
 *  with STAY_TYPE_SLUGS in backend/src/shared/index.ts. */
export interface StayType {
  slug: string;
  tag: string;
  name: string;
  tagline: string;
  image: string;
}

const IMG = (slug: string) => `/media/stays/${slug}.jpg`;

export const STAY_TYPES: StayType[] = [
  { slug: 'villas', tag: 'Private Stay', name: 'Villas', tagline: 'Exclusive Luxury', image: IMG('villas') },
  { slug: 'treehouses', tag: 'Unique Stay', name: 'Treehouses', tagline: 'Stay Above the Forest', image: IMG('treehouses') },
  { slug: 'domes', tag: 'Unique Stay', name: 'Domes', tagline: 'Sleep Under the Stars', image: IMG('domes') },
  { slug: 'igloos', tag: 'Snow Experience', name: 'Igloos', tagline: 'Arctic Adventure', image: IMG('igloos') },
  { slug: 'cabins', tag: 'Mountain Retreat', name: 'Cabins', tagline: 'Cozy Escapes', image: IMG('cabins') },
  { slug: 'tenthouses', tag: 'Unique Stay', name: 'Tenthouses', tagline: 'Glamorous Camping', image: IMG('tenthouses') },
  { slug: 'hotels', tag: 'Classic Stay', name: 'Hotels', tagline: 'Comfort & Convenience', image: IMG('hotels') },
  { slug: 'resorts', tag: 'Leisure', name: 'Resorts', tagline: 'Relax & Recharge', image: IMG('resorts') },
  { slug: 'apartments', tag: 'Urban Stay', name: 'Apartments', tagline: 'Feel at Home', image: IMG('apartments') },
  { slug: 'vacation-homes', tag: 'Entire Home', name: 'Vacation Homes', tagline: 'Perfect for Groups', image: IMG('vacation-homes') },
  { slug: 'beach-houses', tag: 'Coastal', name: 'Beach Houses', tagline: 'Steps from the Ocean', image: IMG('beach-houses') },
  { slug: 'glass-cabins', tag: 'Nature Escape', name: 'Glass Cabins', tagline: 'Panoramic Views', image: IMG('glass-cabins') },
  { slug: 'houseboats', tag: 'Water Stay', name: 'Houseboats', tagline: 'Live on the Water', image: IMG('houseboats') },
  { slug: 'overwater-bungalows', tag: 'Luxury', name: 'Overwater Bungalows', tagline: 'Ocean Paradise', image: IMG('overwater-bungalows') },
  { slug: 'glamping', tag: 'Outdoor Luxury', name: 'Glamping', tagline: 'Nature Meets Comfort', image: IMG('glamping') },
  { slug: 'eco-lodges', tag: 'Sustainable', name: 'Eco Lodges', tagline: 'Green Getaways', image: IMG('eco-lodges') },
  // Galaxy Heritage World's own Madhavgarh Farms photo
  { slug: 'farm-stays', tag: 'Countryside', name: 'Farm Stays', tagline: 'Rural Living', image: '/media/day-outings/madhavgarh-farms-1536x864-1.webp' },
  { slug: 'desert-camps', tag: 'Adventure', name: 'Desert Camps', tagline: 'Desert Nights', image: IMG('desert-camps') },
  { slug: 'cave-hotels', tag: 'Historic', name: 'Cave Hotels', tagline: 'Stay Underground', image: IMG('cave-hotels') },
  { slug: 'heritage-homes', tag: 'Historic Stay', name: 'Heritage Homes', tagline: 'Timeless Elegance', image: IMG('heritage-homes') },
  { slug: 'castles', tag: 'Royal Experience', name: 'Castles', tagline: 'Live Like Royalty', image: IMG('castles') },
  { slug: 'tiny-homes', tag: 'Minimal Living', name: 'Tiny Homes', tagline: 'Small Space, Big Adventure', image: IMG('tiny-homes') },
  { slug: 'floating-villas', tag: 'Luxury Water Stay', name: 'Floating Villas', tagline: 'Float in Style', image: IMG('floating-villas') },
  { slug: 'wellness-retreats', tag: 'Relaxation', name: 'Wellness Retreats', tagline: 'Mind & Body Escape', image: IMG('wellness-retreats') },
];

export const getStayType = (slug: string) => STAY_TYPES.find((s) => s.slug === slug);
