import { PrismaClient, DestinationType, HotelCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Galaxy Heritage World database with verified source data...');

  // 1. Roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full system control and configuration' },
    { name: 'ADMIN', description: 'Platform and content administration' },
    { name: 'EDITOR', description: 'Content and editorial publishing' },
    { name: 'SALES', description: 'Lead qualification and enquiry management' },
    { name: 'SUPPORT', description: 'Customer service, FAQs, and complaints handling' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    });
  }

  // 2. Admin User
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@galaxyheritageworld.com';
  const rawPass = process.env.SEED_ADMIN_PASSWORD || 'Admin@Galaxy2026!';
  const hashedPassword = await bcrypt.hash(rawPass, 10);

  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
      name: 'GHW Administrator',
    },
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      name: 'GHW Administrator',
      phone: '1800-843-6114',
      isActive: true,
    },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: admin.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: admin.id,
        roleId: superAdminRole.id,
      },
    });
  }

  // 3. Site Settings
  const settings = [
    { key: 'company_name', val: 'Galaxy Heritage World', group: 'general' },
    { key: 'legal_name', val: 'Galaxy Heritage World Hospitality Pvt. Ltd.', group: 'general' },
    { key: 'cin', val: 'U74999DL2022PTC407515', group: 'general' },
    { key: 'toll_free', val: '1800-843-6114', group: 'contact' },
    { key: 'support_email', val: 'info@galaxyheritageworld.com', group: 'contact' },
    { key: 'address', val: 'Lower Ground, C-33, Ram Nagar, Kaushambi, Ghaziabad, Uttar Pradesh 201012', group: 'contact' },
    { key: 'tagline', val: 'Most Trusted Travel Company', group: 'general' },
    { key: 'payment_url', val: 'https://payments.cashfree.com/forms/ghwhospitality', group: 'finance' },
    { key: 'stat_satisfied_customers', val: '5490+', group: 'stats' },
    { key: 'stat_locations', val: '101+', group: 'stats' },
    { key: 'stat_hotels_resorts', val: '1000+', group: 'stats' },
    { key: 'stat_exchange_options', val: '5000+', group: 'stats' },
    { key: 'instagram_url', val: 'https://www.instagram.com/galaxyheritageworld/', group: 'social' },
    { key: 'facebook_url', val: 'https://facebook.com/galaxyheritageworld', group: 'social' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { settingKey: s.key },
      update: { settingVal: s.val, groupName: s.group },
      create: { settingKey: s.key, settingVal: s.val, groupName: s.group, isPublic: true },
    });
  }

  // 4. Destinations
  const destinationsData = [
    {
      slug: 'uttarakhand',
      name: 'Uttarakhand',
      region: 'North India',
      tagline: 'Land of the Gods, Serene Hilltowns & Himalayan Horizons',
      description:
        'From the misty ridge lines of Mussoorie and peaceful pine forests of Lansdowne to the holy banks of Rishikesh and sparkling lakes of Nainital, Uttarakhand provides an unmatched haven for rejuvenating leisure retreats.',
      heroImageUrl: '/media/galaxy-heritage-world/destinations/images/Mussoorie-Uttarakhand2.webp',
      type: DestinationType.DOMESTIC,
      bestTimeToVisit: 'March to June & September to November',
      featured: true,
      highlights: ['Mussoorie Gun Hill & Mall Road', 'Lansdowne Pine Trails & Bhulla Lake', 'Rishikesh Ganga Aarti & Yoga', 'Nainital Naini Lake Boating'],
    },
    {
      slug: 'himachal-pradesh',
      name: 'Himachal Pradesh',
      region: 'North India',
      tagline: 'Snow-Capped Peaks, Pine Valleys & Vibrant Hill Culture',
      description:
        'Experience Himachal Pradesh with luxury stays in Manali, historic colonial architecture in Shimla, and tranquil apple orchard valleys. Unwind with majestic mountain views, clean alpine air, and bespoke hospitality.',
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/GettyImages-149353949_high.jpg',
      type: DestinationType.DOMESTIC,
      bestTimeToVisit: 'October to June',
      featured: true,
      highlights: ['Solang Valley & Rohtang Pass', 'Shimla Mall Road & Ridge', 'Jakhoo Temple Ropeway', 'Naggar Castle & Art Gallery'],
    },
    {
      slug: 'rajasthan',
      name: 'Rajasthan',
      region: 'West India',
      tagline: 'Royal Forts, Desert Sunsets & Imperial Heritage',
      description:
        'Immerse yourself in Rajasthan’s regal legacy with opulent palaces in Jaipur, romantic lake views in Udaipur, golden sand dunes in Jaisalmer, and majestic hill forts in Jodhpur.',
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/rajasthan-tgv.jpg',
      type: DestinationType.DOMESTIC,
      bestTimeToVisit: 'October to March',
      featured: true,
      highlights: ['Jaipur Amber Fort & City Palace', 'Udaipur Lake Pichola Boat Cruise', 'Jodhpur Mehrangarh Fort', 'Sam Sand Dunes Camel Safari'],
    },
    {
      slug: 'south-india',
      name: 'South India',
      region: 'South India',
      tagline: 'Emerald Tea Plantations, Backwaters & Coastal Bliss',
      description:
        'Discover the captivating beauty of South India across Munnar’s mist-laden tea gardens, Thekkady’s spice plantations, Kovalam’s golden coastlines, and Ooty’s tranquil Nilgiri mountain breeze.',
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/qu01tygrmdvpmnvdc5su.webp',
      type: DestinationType.DOMESTIC,
      bestTimeToVisit: 'September to March',
      featured: true,
      highlights: ['Munnar Tea Gardens & Mattupetty Dam', 'Thekkady Periyar Wildlife Sanctuary', 'Alleppey Houseboat Backwater Cruise', 'Ooty Botanical Gardens'],
    },
    {
      slug: 'goa',
      name: 'Goa',
      region: 'West Coast',
      tagline: 'Golden Beaches, Portuguese Heritage & Vibrant Coastal Evenings',
      description:
        'Relax across Goa’s sun-kissed beaches, charming Portuguese architecture, riverside sunset cruises, and premier 5-star beachfront resorts designed for family togetherness and pure relaxation.',
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/novotel.jpg',
      type: DestinationType.DOMESTIC,
      bestTimeToVisit: 'November to April',
      featured: true,
      highlights: ['Calangute & Baga Beach Water Sports', 'Old Goa Basilica of Bom Jesus', 'Mandovi River Sunset Cruise', 'Spice Plantation Tour & Authentic Goan Feasts'],
    },
    {
      slug: 'madhya-pradesh',
      name: 'Madhya Pradesh',
      region: 'Central India',
      tagline: 'Heart of Incredible India — Temples, Forts & Wildlife',
      description:
        'Explore the UNESCO World Heritage erotic temples of Khajuraho, the mediaeval palaces of Orchha by the Betwa river, and vibrant culinary culture in Indore and Bhopal.',
      heroImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      type: DestinationType.DOMESTIC,
      bestTimeToVisit: 'October to March',
      featured: false,
      highlights: ['Khajuraho UNESCO Temple Complex', 'Orchha Palace & Chhatris', 'Bhopal Upper Lake', 'Indore Sarafa Night Market'],
    },
    {
      slug: 'punjab',
      name: 'Punjab',
      region: 'North India',
      tagline: 'Golden Reverence, Patriotic Fervor & Hearty Hospitality',
      description:
        'Witness the spiritual grandeur of the Golden Temple in Amritsar, the patriotic Wagah Border ceremony, and experience genuine Punjabi warmth and rich culinary traditions.',
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/hinnamritsar.jpg',
      type: DestinationType.DOMESTIC,
      bestTimeToVisit: 'October to March',
      featured: false,
      highlights: ['Golden Temple Sanctum Visit', 'Wagah Border Beating Retreat Ceremony', 'Jallianwala Bagh Memorial', 'Gobindgarh Fort Light & Sound Show'],
    },
    {
      slug: 'international-exchange',
      name: 'International Exchange Destinations',
      region: 'International',
      tagline: 'Over 5,000 Verified Partner Resorts Across 100+ Countries',
      description:
        'Through Galaxy Heritage World’s vacation exchange affiliations, members unlock seamless holiday exchange opportunities across Bali, Dubai, Thailand, Singapore, Europe, and the Maldives.',
      heroImageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      type: DestinationType.INTERNATIONAL,
      bestTimeToVisit: 'Year-Round Depending on Destination',
      featured: true,
      highlights: ['Bali Tropical Island Resorts', 'Dubai Desert & City Luxury', 'Phuket & Krabi Beachfront Escapes', 'Swiss Alpine & European Cultural Stays'],
    },
  ];

  const destinationMap = new Map();
  for (const d of destinationsData) {
    const dest = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        region: d.region,
        tagline: d.tagline,
        description: d.description,
        heroImageUrl: d.heroImageUrl,
        type: d.type,
        bestTimeToVisit: d.bestTimeToVisit,
        highlights: d.highlights,
        featured: d.featured,
        isPublished: true,
      },
      create: {
        slug: d.slug,
        name: d.name,
        region: d.region,
        tagline: d.tagline,
        description: d.description,
        heroImageUrl: d.heroImageUrl,
        type: d.type,
        bestTimeToVisit: d.bestTimeToVisit,
        highlights: d.highlights,
        featured: d.featured,
        isPublished: true,
      },
    });
    destinationMap.set(d.slug, dest.id);
  }

  // 5. Associated Hotels & Resorts
  const hotelsData = [
    {
      slug: 'novotel-goa',
      name: 'Novotel Goa Candolim',
      destinationSlug: 'goa',
      locationName: 'Candolim, Goa',
      state: 'Goa',
      ratingStars: 5,
      category: HotelCategory.ASSOCIATED,
      imageUrl: '/media/galaxy-heritage-world/homepage/images/novotel.jpg',
      amenities: ['Outdoor Swimming Pool', 'Spa & Wellness Sanctuary', 'Multi-Cuisine Dining', 'Kids Play Zone', 'Beach Shuttle', 'Fitness Centre'],
      description:
        'Located in close proximity to the energetic Candolim beach, Novotel Goa offers upscale resort accommodations with lush tropical surroundings, refreshing swimming pools, and world-class dining.',
      featured: true,
    },
    {
      slug: 'holiday-inn-amritsar',
      name: 'Holiday Inn Amritsar',
      destinationSlug: 'punjab',
      locationName: 'Ranjit Avenue, Amritsar',
      state: 'Punjab',
      ratingStars: 5,
      category: HotelCategory.ASSOCIATED,
      imageUrl: '/media/galaxy-heritage-world/homepage/images/hinnamritsar.jpg',
      amenities: ['Rooftop Pool', '24/7 Dining Restaurant', 'Fitness Center', 'Luxury Suites', 'Business Lounge'],
      description:
        'Holiday Inn Amritsar provides premium comfort with quick access to the Golden Temple and airport, featuring spacious contemporary rooms, authentic Punjabi dining, and warm hospitality.',
      featured: true,
    },
    {
      slug: 'ramada-jaipur',
      name: 'Ramada by Wyndham Jaipur',
      destinationSlug: 'rajasthan',
      locationName: 'Raja Park, Jaipur',
      state: 'Rajasthan',
      ratingStars: 4,
      category: HotelCategory.ASSOCIATED,
      imageUrl: '/media/galaxy-heritage-world/homepage/images/Untitled-1024-x-674-px.png',
      amenities: ['Rooftop Swimming Pool', 'Multi-Cuisine Restaurant', 'Ayurvedic Spa', 'Banqueting', 'Wi-Fi'],
      description:
        'Set in the heart of the Pink City, Ramada Jaipur blends traditional Rajasthani elegance with contemporary luxury amenities, making it the perfect gateway for exploring Jaipur forts and bazaars.',
      featured: true,
    },
    {
      slug: 'park-regis-goa',
      name: 'Park Regis Goa',
      destinationSlug: 'goa',
      locationName: 'Arpora, Goa',
      state: 'Goa',
      ratingStars: 5,
      category: HotelCategory.ASSOCIATED,
      imageUrl: '/media/galaxy-heritage-world/homepage/images/Neelam-goa.jpg',
      amenities: ['Resort Pool', 'Fine Dining', 'Poolside Bar', 'Spa & Massage', 'Concierge Desk'],
      description:
        'A tranquil 5-star haven situated near Baga and Anjuna, Park Regis Goa features lavish guest suites, expansive swimming lagoons, and gourmet international gastronomy.',
      featured: true,
    },
    {
      slug: 'divan-clarks-inn-goa',
      name: 'Divan Clarks Inn Goa',
      destinationSlug: 'goa',
      locationName: 'Calangute, Goa',
      state: 'Goa',
      ratingStars: 4,
      category: HotelCategory.ASSOCIATED,
      imageUrl: '/media/galaxy-heritage-world/homepage/images/Divan-Clarks-Inn-Goa.jpg',
      amenities: ['Swimming Pool', 'Buffet Restaurant', 'Wi-Fi', 'Travel Desk Assistance', 'Air Conditioning'],
      description:
        'Offering calm coastal comfort with swift access to North Goa’s lively markets and beaches, Divan Clarks Inn guarantees relaxing family stays with attentive customer service.',
      featured: true,
    },
    {
      slug: 'the-itc-grand-goa',
      name: 'The ITC Grand Goa Resort & Spa',
      destinationSlug: 'goa',
      locationName: 'Arossim Beach, South Goa',
      state: 'Goa',
      ratingStars: 5,
      category: HotelCategory.ASSOCIATED,
      imageUrl: '/media/galaxy-heritage-world/homepage/images/hdopp.jpg',
      amenities: ['Multi-Level Swimming Pools', 'Direct Beach Access', 'Kaya Kalp Spa', 'Fine Dining Pavilions', 'Lush Tropical Lawns'],
      description:
        'Nestled amidst 45 acres of serene landscape in South Goa, this regal resort recreates Indo-Portuguese village architecture with direct beachside luxury and legendary hospitality.',
      featured: true,
    },
    {
      slug: 'first-view-resort-lansdowne',
      name: 'First View Resort Lansdowne',
      destinationSlug: 'uttarakhand',
      locationName: 'Lansdowne, Pauri Garhwal',
      state: 'Uttarakhand',
      ratingStars: 4,
      category: HotelCategory.ASSOCIATED,
      imageUrl: '/media/galaxy-heritage-world/destinations/images/Mussoorie-Uttarakhand2.webp',
      amenities: ['Mountain Valley Views', 'Bonfire & Barbecue', 'Multi-Cuisine Dining', 'Nature Walk Trails'],
      description:
        'Perched amidst untouched pine and oak forests in Lansdowne, First View Resort delivers pristine panoramic vistas of the Garhwal Himalayas and undisturbed tranquility.',
      featured: false,
    },
    {
      slug: 'clarks-khajuraho',
      name: 'Clarks Khajuraho',
      destinationSlug: 'madhya-pradesh',
      locationName: 'Khajuraho, Madhya Pradesh',
      state: 'Madhya Pradesh',
      ratingStars: 5,
      category: HotelCategory.ASSOCIATED,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
      amenities: ['Expansive Gardens', 'Swimming Pool', 'Cricket Ground', 'Ayurvedic Wellness', 'Restaurant & Bar'],
      description:
        'Sprawled across 18 acres of landscaped greenery, Clarks Khajuraho offers an idyllic sanctuary near the ancient temples with heritage-inspired hospitality.',
      featured: false,
    },
    {
      slug: 'the-manali-inn',
      name: 'The Manali Inn',
      destinationSlug: 'himachal-pradesh',
      locationName: 'Rangri, Manali',
      state: 'Himachal Pradesh',
      ratingStars: 4,
      category: HotelCategory.ASSOCIATED,
      imageUrl: '/media/galaxy-heritage-world/homepage/images/GettyImages-149353949_high.jpg',
      amenities: ['Beas River Views', 'Kawa Health Club & Spa', 'Discotheque', 'Multi-Cuisine Restaurant', 'Kids Gaming Room'],
      description:
        'Overlooking the snow-capped Himalayan peaks and river Beas, The Manali Inn is a premier leisure property offering cozy wood-finished rooms, rejuvenation, and mountain adventures.',
      featured: false,
    },
  ];

  for (const h of hotelsData) {
    const destinationId = destinationMap.get(h.destinationSlug) || null;
    await prisma.hotel.upsert({
      where: { slug: h.slug },
      update: {
        name: h.name,
        destinationId,
        locationName: h.locationName,
        state: h.state,
        ratingStars: h.ratingStars,
        category: h.category,
        imageUrl: h.imageUrl,
        amenities: h.amenities,
        description: h.description,
        featured: h.featured,
        isPublished: true,
      },
      create: {
        slug: h.slug,
        name: h.name,
        destinationId,
        locationName: h.locationName,
        state: h.state,
        ratingStars: h.ratingStars,
        category: h.category,
        imageUrl: h.imageUrl,
        amenities: h.amenities,
        description: h.description,
        featured: h.featured,
        isPublished: true,
      },
    });
  }

  // 6. Vacation Packages
  const packagesData = [
    {
      slug: 'royal-rajasthan-grandeur',
      title: 'Royal Rajasthan: Forts, Palaces & Desert Romance',
      subtitle: '6 Days / 5 Nights across Jaipur, Jodhpur & Udaipur',
      locationLabel: 'Rajasthan (Jaipur, Jodhpur, Udaipur)',
      destinationSlug: 'rajasthan',
      durationDays: 6,
      durationNights: 5,
      priceStarting: 24999,
      priceLabel: 'Starting from ₹24,999 / person',
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/rajasthan-tgv.jpg',
      overview:
        'Walk through royal corridors, witness desert sunsets, and marvel at marble palaces in Rajasthan. Includes luxury 4/5-star accommodation, daily buffet breakfast, private chauffeur-driven transfers, and guided fort explorations.',
      inclusions: [
        '5 Nights in handpicked 4-star / 5-star Heritage Properties',
        'Daily buffet breakfast & traditional welcome drinks',
        'Private AC vehicle for all transfers and city sightseeing',
        'Guided tour of Amber Fort, City Palace, and Mehrangarh Fort',
        'Sunset boat ride on Lake Pichola, Udaipur',
        '24/7 dedicated GHW travel desk support',
      ],
      exclusions: ['Monument entry tickets and camera fees', 'Airfare/Train tickets (can be booked via Travel Desk)', 'Personal expenses and laundry'],
      highlights: ['Amber Fort Elephant/Jeep Safari', 'Mehrangarh Fort Panoramic Views', 'Lake Pichola Sunset Cruise', 'Local Handicraft Bazaar Excursions'],
      featured: true,
    },
    {
      slug: 'goa-sunkissed-coastal-escape',
      title: 'Goa Coastal Serenity & Sunset Splendor',
      subtitle: '5 Days / 4 Nights of Tropical Beach Bliss',
      locationLabel: 'North & South Goa',
      destinationSlug: 'goa',
      durationDays: 5,
      durationNights: 4,
      priceStarting: 18499,
      priceLabel: 'Starting from ₹18,499 / person',
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/novotel.jpg',
      overview:
        'Savor golden shores, Portuguese architecture, and romantic river sunset cruises in Goa. Stay in premier associated resorts like Novotel Goa or Park Regis with seamless airport transfers.',
      inclusions: [
        '4 Nights at premium 4/5-star beach resort',
        'Daily buffet breakfast and welcome refresher',
        'Airport / Thivim railway station pick-up & drop',
        'Mandovi river evening cruise with cultural performance',
        'Full day North & South Goa guided sightseeing tour',
      ],
      exclusions: ['Water sports charges', 'Personal bar and meals not mentioned', 'GST as applicable'],
      highlights: ['Calangute & Candolim Beach Strolls', 'Old Goa Heritage Churches', 'River Mandovi Sunset Cruise', 'Spice Plantation Buffet Lunch'],
      featured: true,
    },
    {
      slug: 'himalayan-highlands-manali-shimla',
      title: 'Himalayan Highlands: Manali & Shimla Delight',
      subtitle: '6 Days / 5 Nights across Snow Peaks and Pine Valleys',
      locationLabel: 'Himachal Pradesh (Manali & Shimla)',
      destinationSlug: 'himachal-pradesh',
      durationDays: 6,
      durationNights: 5,
      priceStarting: 22499,
      priceLabel: 'Starting from ₹22,499 / person',
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/GettyImages-149353949_high.jpg',
      overview:
        'Escape to the Himalayas with scenic apple valleys, snow adventure points at Solang, and heritage colonial strolls on the Shimla Mall Road. Curated specifically for families and couples seeking tranquility.',
      inclusions: [
        '3 Nights Manali + 2 Nights Shimla in luxury mountain resort',
        'Daily breakfast and dinner (MAP meal plan)',
        'Private vehicle for sightseeing throughout the tour',
        'Full day Solang Valley & Atal Tunnel excursion',
        'Kufri excursion and Ridge Mall Road walking tour',
      ],
      exclusions: ['Adventure activities fees (skiing, paragliding)', 'Rohtang Pass permit charges if applicable', 'Train/Flight fare'],
      highlights: ['Solang Valley Snow Activities', 'Hadimba Temple & Vashisht Hot Springs', 'Shimla Ridge & Christ Church Walk', 'Kufri Nature Park'],
      featured: true,
    },
    {
      slug: 'kerala-backwaters-tea-gardens',
      title: 'Emerald Kerala: Munnar, Thekkady & Backwaters',
      subtitle: '6 Days / 5 Nights in God’s Own Country',
      locationLabel: 'Kerala (Munnar, Thekkady, Alleppey)',
      destinationSlug: 'south-india',
      durationDays: 6,
      durationNights: 5,
      priceStarting: 26999,
      priceLabel: 'Starting from ₹26,999 / person',
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/qu01tygrmdvpmnvdc5su.webp',
      overview:
        'Rejuvenate with aromatic tea plantations in Munnar, spice tours and boat safaris in Thekkady, and a private houseboat backwater cruise in Alleppey.',
      inclusions: [
        '2 Nights Munnar + 1 Night Thekkady + 1 Night Alleppey Houseboat + 1 Night Cochin',
        'All meals on private Alleppey houseboat',
        'Daily buffet breakfast at all hill resorts',
        'All transfers and sightseeing by private air-conditioned vehicle',
        'Spice plantation guided walk',
      ],
      exclusions: ['Kathakali or Kalaripayattu show entrance', 'Personal wellness therapies', 'Optional tips and porter charges'],
      highlights: ['Munnar Eravikulam National Park (Nilgiri Tahr)', 'Mattupetty Dam Speedboating', 'Periyar Lake Boat Safari', 'Alleppey Sunset Houseboat Drift'],
      featured: true,
    },
  ];

  for (const p of packagesData) {
    const destinationId = destinationMap.get(p.destinationSlug) || null;
    await prisma.package.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        subtitle: p.subtitle,
        locationLabel: p.locationLabel,
        destinationId,
        durationDays: p.durationDays,
        durationNights: p.durationNights,
        priceStarting: p.priceStarting,
        priceLabel: p.priceLabel,
        heroImageUrl: p.heroImageUrl,
        overview: p.overview,
        inclusions: p.inclusions,
        exclusions: p.exclusions,
        highlights: p.highlights,
        featured: p.featured,
        isPublished: true,
      },
      create: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        locationLabel: p.locationLabel,
        destinationId,
        durationDays: p.durationDays,
        durationNights: p.durationNights,
        priceStarting: p.priceStarting,
        priceLabel: p.priceLabel,
        heroImageUrl: p.heroImageUrl,
        overview: p.overview,
        inclusions: p.inclusions,
        exclusions: p.exclusions,
        highlights: p.highlights,
        featured: p.featured,
        isPublished: true,
      },
    });
  }

  // 7. Curated Itineraries
  const itinerariesData = [
    {
      slug: 'goa-coastal-escape',
      title: 'Goa Sunkissed Shores & Beach Serenity',
      badgeText: 'Coastal Luxury',
      locationLabel: 'Goa, India',
      destinationSlug: 'goa',
      durationDays: 5,
      durationNights: 4,
      heroImageUrl: '/media/galaxy-heritage-world/homepage/images/novotel.jpg',
      summary:
        'Immerse yourself in golden sands, Portuguese architecture, vibrant beach shacks, spice plantations, and romantic Mandovi river sunset cruises.',
      overview:
        'Carefully balanced between leisure relaxation and coastal discovery. Enjoy luxury resort accommodations, guided church walks, private cab transfers, and quiet sun-dappled afternoons.',
      inclusions: ['4 Nights 5-Star Stay', 'Daily Breakfast Buffet', 'Airport Transfers', 'Mandovi Sunset Cruise', 'Full Day Sightseeing'],
      days: [
        { dayNumber: 1, title: 'Arrival & Welcome in Tropical Goa', description: 'Arrive at Goa Airport or Thivim Station. Private transfer to your luxury resort. Enjoy the evening pool or a sunset stroll along Candolim beach.', meals: 'Welcome Drink', stayLocation: 'Novotel Goa / Park Regis' },
        { dayNumber: 2, title: 'North Goa Heritage & Coastal Charms', description: 'Visit historic Fort Aguada overlooking the Arabian Sea, followed by time at Calangute and Anjuna beaches. Enjoy authentic Goan seafood.', meals: 'Breakfast', stayLocation: 'Resort' },
        { dayNumber: 3, title: 'Old Goa Churches & Mandovi River Cruise', description: 'Explore Basilica of Bom Jesus, Se Cathedral, and Latin Quarter Fontainhas. In the evening, embark on a luxury sunset cruise on river Mandovi with live folk dance.', meals: 'Breakfast', stayLocation: 'Resort' },
        { dayNumber: 4, title: 'South Goa Serenity & Spice Plantation', description: 'Drive south to Colva and Benaulim. Tour an organic spice plantation with an aromatic traditional buffet lunch. Evening free for personal leisure.', meals: 'Breakfast & Traditional Lunch', stayLocation: 'Resort' },
        { dayNumber: 5, title: 'Morning Beach Breeze & Departure', description: 'Enjoy a leisurely breakfast and souvenir shopping before your private transfer to the airport for your onward journey.', meals: 'Breakfast', stayLocation: 'Check-out' },
      ],
    },
    {
      slug: 'bali-island-paradise',
      title: 'Bali Tropical Temples & Island Romance',
      badgeText: 'Island of Gods',
      locationLabel: 'Bali, Indonesia',
      destinationSlug: 'international-exchange',
      durationDays: 6,
      durationNights: 5,
      heroImageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      summary:
        'Experience the magic of Bali with lush Ubud rice terraces, clifftop Uluwatu sunsets, sacred temples, Nusa Penida island speedboat tours, and private pool villas.',
      overview:
        'An international vacation exchange favorite. Experience Balinese warmth, stunning cliffside sunsets, spiritual water temples, and private tropical relaxation.',
      inclusions: ['5 Nights Villa Stay', 'Daily Breakfast', 'Nusa Penida Speedboat', 'Uluwatu Kecak Dance', 'Private Chauffeur'],
      days: [
        { dayNumber: 1, title: 'Welcome to Denpasar & Ubud Transfer', description: 'Warm greeting at Ngurah Rai International Airport. Transfer to your resort amidst Ubud lush rainforest.', meals: 'Breakfast', stayLocation: 'Ubud Resort' },
        { dayNumber: 2, title: 'Tegalalang Rice Terraces & Sacred Water Temple', description: 'Stroll the emerald steps of Tegalalang, visit Tirta Empul holy spring, and sample Luwak coffee at a mountain plantation.', meals: 'Breakfast', stayLocation: 'Ubud Resort' },
        { dayNumber: 3, title: 'Nusa Penida Island Excursion', description: 'Speedboat to Nusa Penida to witness Kelingking T-Rex Beach, Broken Beach, and Angel’s Billabong natural pool.', meals: 'Breakfast & Lunch', stayLocation: 'Seminyak Villa' },
        { dayNumber: 4, title: 'Clifftop Uluwatu Temple & Kecak Sunset Dance', description: 'Witness Uluwatu’s dramatic cliff temple overlooking ocean waves and experience the traditional Kecak fire dance as the sun sets.', meals: 'Breakfast', stayLocation: 'Seminyak Villa' },
        { dayNumber: 5, title: 'Seminyak Beach Day & Balinese Spa', description: 'Day at leisure for beachside dining, shopping in boutique districts, and an indulgent 2-hour Balinese herbal massage.', meals: 'Breakfast', stayLocation: 'Seminyak Villa' },
        { dayNumber: 6, title: 'Farewell Bali', description: 'Private transfer to Denpasar Airport for departure back home with memories of a lifetime.', meals: 'Breakfast', stayLocation: 'Check-out' },
      ],
    },
    {
      slug: 'kashmir-paradise-valley',
      title: 'Kashmir Valley of Serenity & Alpine Meadows',
      badgeText: 'Heaven On Earth',
      locationLabel: 'Srinagar, Gulmarg & Pahalgam',
      destinationSlug: 'himachal-pradesh',
      durationDays: 6,
      durationNights: 5,
      heroImageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      summary:
        'Drift on Dal Lake in heritage cedar houseboats, ride the world-highest Gulmarg Gondola over snow peaks, and stroll through Pahalgam pine valleys.',
      overview:
        'A magical journey through Srinagar Mughal Gardens, Gulmarg snowy ski slopes, and the Lidder river in Pahalgam. Complete with authentic Kashmiri Wazwan experiences.',
      inclusions: ['1 Night Houseboat + 4 Nights Hotel', 'Breakfast & Dinner', 'Shikara Ride', 'Gulmarg Transfers', 'Private Heating'],
      days: [
        { dayNumber: 1, title: 'Arrival in Srinagar & Dal Lake Shikara Ride', description: 'Arrive at Srinagar Sheikh-ul-Alam Airport. Check-in to traditional carved cedar wood houseboat on Dal Lake. Enjoy a serene sunset Shikara ride.', meals: 'Dinner', stayLocation: 'Dal Lake Heritage Houseboat' },
        { dayNumber: 2, title: 'Mughal Gardens & Shankaracharya Temple', description: 'Explore Nishat Bagh (Garden of Bliss) and Shalimar Bagh (Abode of Love), built during the Mughal era, followed by hill temple panoramic view.', meals: 'Breakfast & Dinner', stayLocation: 'Srinagar Luxury Hotel' },
        { dayNumber: 3, title: 'Gulmarg Meadow of Flowers & Gondola Ride', description: 'Scenic drive to Gulmarg. Take the world-famous Gulmarg Gondola Cable Car to Phase 1/Phase 2 for snow views.', meals: 'Breakfast & Dinner', stayLocation: 'Gulmarg / Srinagar' },
        { dayNumber: 4, title: 'Pahalgam Valley of Shepherds & Lidder River', description: 'Journey through saffron fields of Pampore to Pahalgam. Stroll along the roaring Lidder River and pine forests.', meals: 'Breakfast & Dinner', stayLocation: 'Pahalgam Resort' },
        { dayNumber: 5, title: 'Betaab Valley & Aru Exploration', description: 'Visit scenic Betaab Valley and Chandanwari meadows. Evening return to Srinagar for Kashmiri walnut wood and pashmina shopping.', meals: 'Breakfast & Dinner', stayLocation: 'Srinagar Hotel' },
        { dayNumber: 6, title: 'Departure with Cherished Memories', description: 'Transfer to Srinagar Airport after breakfast with pleasant memories of paradise on earth.', meals: 'Breakfast', stayLocation: 'Check-out' },
      ],
    },
  ];

  for (const it of itinerariesData) {
    const destinationId = destinationMap.get(it.destinationSlug) || null;
    const createdIt = await prisma.itinerary.upsert({
      where: { slug: it.slug },
      update: {
        title: it.title,
        badgeText: it.badgeText,
        locationLabel: it.locationLabel,
        destinationId,
        durationDays: it.durationDays,
        durationNights: it.durationNights,
        heroImageUrl: it.heroImageUrl,
        summary: it.summary,
        overview: it.overview,
        inclusions: it.inclusions,
        featured: true,
        isPublished: true,
      },
      create: {
        slug: it.slug,
        title: it.title,
        badgeText: it.badgeText,
        locationLabel: it.locationLabel,
        destinationId,
        durationDays: it.durationDays,
        durationNights: it.durationNights,
        heroImageUrl: it.heroImageUrl,
        summary: it.summary,
        overview: it.overview,
        inclusions: it.inclusions,
        featured: true,
        isPublished: true,
      },
    });

    // Replace itinerary days
    await prisma.itineraryDay.deleteMany({ where: { itineraryId: createdIt.id } });
    for (const d of it.days) {
      await prisma.itineraryDay.create({
        data: {
          itineraryId: createdIt.id,
          dayNumber: d.dayNumber,
          title: d.title,
          description: d.description,
          meals: d.meals,
          stayLocation: d.stayLocation,
        },
      });
    }
  }

  // 8. Day Outings & Activities
  const activitiesData = [
    {
      slug: 'adventure-island-outing',
      title: 'Adventure Island Family Day Outing',
      category: 'Amusement & Adventure Theme Park',
      locationLabel: 'Rohini, Delhi NCR',
      durationLabel: 'Full Day (11:00 AM - 7:00 PM)',
      imageUrl: '/media/galaxy-heritage-world/day-activities/images/adventure-island-1536x864.jpg',
      description:
        'A high-energy day outing for families and friends featuring thrill rides, rollercoasters, wave pools, carnival games, and delicious multi-cuisine buffet dining.',
      highlights: ['Unlimited Access to 25+ Thrill Rides', 'Metro Walk Lake Boating', 'Rain Dance & Music DJ', 'Special Children Fun Zone'],
      inclusions: ['Entry Pass to All Major Rides', 'Welcome Drink on Arrival', 'Lavish Buffet Lunch', 'Evening Tea & Snacks'],
      featured: true,
    },
    {
      slug: 'madhavgarh-farms-rural-experience',
      title: 'Madhavgarh Farms Cultural & Rural Retreat',
      category: 'Heritage Farm & Adventure Outing',
      locationLabel: 'Sohna Road, Gurugram, NCR',
      durationLabel: 'Full Day (9:00 AM - 5:00 PM)',
      imageUrl: '/media/galaxy-heritage-world/day-activities/images/madhavgarh-farms-1536x864.jpg',
      description:
        'Step back into authentic village life with 50+ traditional rural activities, mud baths, camel & bullock cart rides, zip lines, pottery workshops, and freshly cooked farm meals.',
      highlights: ['Camel Cart & Tractor Rides', 'Mud Bath & Tubewell Splash', 'Zipline, Rope Course & Archery', 'Traditional Rajasthani/Haryanvi Buffet'],
      inclusions: ['Farm Entry & All Activities', 'Welcome Breakfast & Tea', 'Pure Desi Ghee Buffet Lunch', 'Evening High Tea'],
      featured: true,
    },
    {
      slug: 'drizzling-land-water-park',
      title: 'Drizzling Land Water & Adventure Park',
      category: 'Water Park & Family Entertainment',
      locationLabel: 'Delhi-Meerut Highway, Ghaziabad',
      durationLabel: 'Full Day (10:00 AM - 6:00 PM)',
      imageUrl: '/media/galaxy-heritage-world/day-activities/images/drizzling-land-1536x864-1.jpg',
      description:
        'The largest water park on the Delhi-Meerut Expressway. Beat the heat with giant wave pools, thrilling water slides, rain dance floor, and amusement park rides.',
      highlights: ['Giant Wave Pool & Rain Dance', 'Multi-Lane Water Slides', 'Revolving Tower & Rollercoaster', 'Family Pool for Toddlers'],
      inclusions: ['Water Park & Amusement Entry', 'Changing Room & Locker Facility Access', 'Buffet Lunch Pass'],
      featured: true,
    },
    {
      slug: 'atlantic-water-world-extravaganza',
      title: 'Atlantic Water World Waterfront Carnival',
      category: 'Water Park & Leisure Splash',
      locationLabel: 'Kalindi Kunj, South Delhi',
      durationLabel: 'Full Day (11:00 AM - 6:30 PM)',
      imageUrl: '/media/galaxy-heritage-world/day-activities/images/atlantic-water-world-1536x864.jpg',
      description:
        'Located adjacent to the Yamuna river, Atlantic Water World provides spectacular water slides, lazy rivers, high-speed pendulum slides, and delectable food stalls.',
      highlights: ['Storm Eye & Tornado Slide', 'Lazy River Float', 'Aqua Dance Floor with DJ', 'Gourmet Cafeteria'],
      inclusions: ['Park Entry', 'Unlimited Water Rides', 'Costume & Locker Assistance'],
      featured: false,
    },
  ];

  for (const act of activitiesData) {
    await prisma.activity.upsert({
      where: { slug: act.slug },
      update: {
        title: act.title,
        category: act.category,
        locationLabel: act.locationLabel,
        durationLabel: act.durationLabel,
        imageUrl: act.imageUrl,
        description: act.description,
        highlights: act.highlights,
        inclusions: act.inclusions,
        featured: act.featured,
        isPublished: true,
      },
      create: {
        slug: act.slug,
        title: act.title,
        category: act.category,
        locationLabel: act.locationLabel,
        durationLabel: act.durationLabel,
        imageUrl: act.imageUrl,
        description: act.description,
        highlights: act.highlights,
        inclusions: act.inclusions,
        featured: act.featured,
        isPublished: true,
      },
    });
  }

  // 9. Verified FAQs
  const faqsData = [
    {
      question: 'What is Galaxy Heritage World vacation ownership?',
      answer:
        'Galaxy Heritage World vacation ownership is a modern holiday membership designed for families to lock in inflation-free holiday accommodation across handpicked luxury domestic hotels, hillside retreats, beach resorts, and over 5,000 international exchange properties worldwide.',
      category: 'Membership',
      sortOrder: 1,
    },
    {
      question: 'How do I book flights, cabs, or hotel stays through the Travel Desk?',
      answer:
        'Members can submit their travel requirements directly via our online Travel Desk portal, call our toll-free helpline at 1800-843-6114, or email traveldesk@galaxyheritageworld.com. Our dedicated travel executives curate flight routes, arrange verified hotel bookings, and organize private airport transfers.',
      category: 'Travel Desk',
      sortOrder: 2,
    },
    {
      question: 'How can I redeem a Galaxy Heritage World holiday or gift voucher?',
      answer:
        'To redeem your promotional or gift voucher, visit the /redeem-voucher page, enter your unique voucher code along with your preferred destination and travel dates. Our verification desk confirms voucher validity within 24–48 business hours and assists with room reservations.',
      category: 'Vouchers',
      sortOrder: 3,
    },
    {
      question: 'What is the Grievance Redressal Mechanism & Complaints Escalation Matrix?',
      answer:
        'Galaxy Heritage World adheres to a transparent 3-tier customer grievance redressal policy: Level 1 (Customer Care Helpline at 1800-843-6114, resolution within 48 hours), Level 2 (Grievance Officer via grievance@galaxyheritageworld.com, resolution within 7 working days), and Level 3 (Management Escalation Board). Full details are published on our /reviews-and-complaints page.',
      category: 'Customer Service',
      sortOrder: 4,
    },
    {
      question: 'Are there any hidden costs or unexpected booking fees?',
      answer:
        'No. Galaxy Heritage World operates under a strict transparent pricing policy. All room rates, utility charges (where applicable), and government taxes are clearly outlined before booking confirmation.',
      category: 'Pricing & Policies',
      sortOrder: 5,
    },
  ];

  for (const f of faqsData) {
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (existing) {
      await prisma.faq.update({ where: { id: existing.id }, data: f });
    } else {
      await prisma.faq.create({ data: f });
    }
  }

  // 10. Testimonials
  const testimonialsData = [
    {
      customerName: 'Rajesh & Meenakshi Sharma',
      customerLocation: 'New Delhi',
      rating: 5,
      tripTitle: 'Unforgettable Family Holiday in Goa',
      comment:
        'We booked our 5-day Goa family vacation through Galaxy Heritage World. From the airport pick-up to our stay at Novotel Goa Candolim, everything was seamlessly managed. The kids loved the pool, and our sunset cruise on river Mandovi was breathtaking!',
      isVerified: true,
      isPublished: true,
    },
    {
      customerName: 'Col. Amitav Mukherjee (Retd.)',
      customerLocation: 'Kolkata',
      rating: 5,
      tripTitle: 'Peaceful Retreat in Lansdowne',
      comment:
        'I have been a vacation ownership member for two years. Our holiday at First View Resort Lansdowne was calm, scenic, and exceptionally well hosted. The customer support team assisted with every inquiry courteously.',
      isVerified: true,
      isPublished: true,
    },
    {
      customerName: 'Sunil & Sunita Gupta',
      customerLocation: 'Lucknow',
      rating: 5,
      tripTitle: 'Hassle-Free Manali Mountain Vacation',
      comment:
        'Planning high-altitude trips can get stressful, but the GHW Travel Desk arranged comfortable cab transfers and clean, warm resort rooms at The Manali Inn. Genuine hospitality and transparent pricing!',
      isVerified: true,
      isPublished: true,
    },
  ];

  for (const t of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({ where: { customerName: t.customerName } });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.testimonial.create({ data: t });
    }
  }

  // 11. Initial Sample Enquiries for Admin CRM
  const sampleEnquiries = [
    {
      referenceNumber: 'GHW-ENQ-1001',
      name: 'Vikas Malhotra',
      email: 'vikas.m@example.com',
      phone: '+91 98101 23456',
      city: 'Delhi',
      destinationInterest: 'Goa Coastal Serenity',
      packageInterest: 'Goa Coastal Serenity & Sunset Splendor',
      travelDates: 'November 2026',
      travelersCount: 4,
      message: 'Looking for 2 luxury rooms near Candolim with airport pickup.',
      status: 'NEW' as const,
      consent: true,
    },
    {
      referenceNumber: 'GHW-ENQ-1002',
      name: 'Pooja Bhatia',
      email: 'pooja.b@example.com',
      phone: '+91 98765 43210',
      city: 'Chandigarh',
      destinationInterest: 'Uttarakhand (Mussoorie)',
      packageInterest: 'Royal Rajasthan: Forts, Palaces & Desert Romance',
      travelDates: 'December 2026',
      travelersCount: 2,
      message: 'Need pricing details for honeymoon package with private car.',
      status: 'CONTACTED' as const,
      consent: true,
    },
  ];

  for (const enq of sampleEnquiries) {
    await prisma.enquiry.upsert({
      where: { referenceNumber: enq.referenceNumber },
      update: {},
      create: enq,
    });
  }

  console.log('Database seeded successfully with verified authentic Galaxy Heritage World content!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
