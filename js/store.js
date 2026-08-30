/**
 * Brahma Kumaris Kozhikode - Central State Store
 * Handles persistence, default dataset, dynamic tabs, media gallery,
 * events, Kozhikode center locations, and course registrations.
 */

const STORAGE_KEY = 'bk_kozhikode_site_data_v1';
const ADMIN_SESSION_KEY = 'bk_kozhikode_admin_session';

const DEFAULT_DATA = {
  settings: {
    orgName: 'Brahma Kumaris Kozhikode',
    orgNameMl: 'ബ്രഹ്മാകുമാരീസ് കോഴിക്കോട്',
    tagline: 'World Peace Through Self Transformation',
    taglineMl: 'സ്വയം പരിവർത്തനത്തിലൂടെ ലോക ശാന്തി',
    headOfficeName: 'Brahma Kumaris World Spiritual University, Mount Abu, Rajasthan',
    headOfficeUrl: 'https://brahmakumaris.com',
    headOfficeOrgUrl: 'https://brahmakumaris.org',
    keralaPortalUrl: 'https://kerala.brahmakumaris.com',
    mainCenterName: "Light Palace (Ashokapuram)",
    mainAddress: "'Light Palace', H.no: 44/284, Balan K Nair Road, Ashokapuram, PO: Eranhipalam, Kozhikode - 673006, Kerala, India",
    phonePrimary: "0495-2770568",
    phoneSecondary: "+91 9746334202",
    email: "calicut@bkivv.org",
    timingsMorning: "7:00 AM – 9:00 AM",
    timingsEvening: "5:00 PM – 8:00 PM",
    adminPin: "peace108",
    announcement: "🕊️ Join our Complimentary 7-Day Rajyoga Meditation Foundation Course — Morning & Evening Batches available at Ashokapuram Light Palace and all Kozhikode branches!",
    heroTitle: "Awaken Your Inner Peace & Divine Radiance",
    heroSubtitle: "Experience the timeless serenity of Rajyoga Meditation in Kozhikode. Connect with your true spiritual self and the Supreme Source of peace, love, and power in the divine light of Paramdham.",
    aboutText: "Brahma Kumaris Kozhikode is a spiritual sanctuary dedicated to personal transformation and world peace through the study and practice of Rajyoga Meditation. Established as an international spiritual learning movement, our centers offer all educational courses and meditation sessions completely free of charge to people of all backgrounds, faiths, and walks of life."
  },

  dailyThought: {
    date: new Date().toISOString().split('T')[0],
    title: "Soul Consciousness & Unconditional Peace",
    titleMl: "ആത്മീയ ശാന്തിയുടെ അനുഭവം",
    quote: "When you remember you are a peaceful point of spiritual light, external storms cannot shake your inner stillness. You become a lighthouse of serenity for everyone around you.",
    quoteMl: "നിങ്ങൾ ഒരു ആത്മജ്യോതിയാണെന്ന് തിരിച്ചറിയുമ്പോൾ, ബാഹ്യമായ ഒന്നിനും നിങ്ങളുടെ മനസ്സിന്റെ ശാന്തിയെ തകർക്കാനാവില്ല.",
    blessing: "May you remain free from obstacles by staying absorbed in the sweet remembrance of the Supreme Soul (Shiv Baba).",
    author: "Dadi Janki / Brahma Baba",
    audioCommentaryUrl: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Layers/Broke_For_Free_-_01_-_As_Colorless_As_Possible.mp3"
  },

  tabs: [
    { id: 'home', label: 'Home', icon: 'home', isCore: true, enabled: true, order: 1, type: 'system' },
    { id: 'about', label: 'About Us', icon: 'info', isCore: true, enabled: true, order: 2, type: 'system' },
    { id: 'meditation', label: 'Meditation Room', icon: 'sparkles', isCore: true, enabled: true, order: 3, type: 'system' },
    { id: 'course', label: '7-Day Rajyoga Course', icon: 'book-open', isCore: true, enabled: true, order: 4, type: 'system' },
    { id: 'centers', label: 'Center List', icon: 'map-pin', isCore: true, enabled: true, order: 5, type: 'system' },
    { id: 'gallery', label: 'Gallery', icon: 'image', isCore: true, enabled: true, order: 6, type: 'system' },
    { id: 'media', label: 'Media', icon: 'film', isCore: true, enabled: true, order: 7, type: 'media-dropdown' },
    { id: 'events', label: 'Events', icon: 'calendar', isCore: true, enabled: true, order: 8, type: 'events-dropdown' },
    { id: 'murali', label: 'Daily Murali', icon: 'sun', isCore: true, enabled: true, order: 9, type: 'system' },
    { id: 'contact', label: 'Contact Us', icon: 'mail', isCore: true, enabled: true, order: 10, type: 'system' }
  ],

  aboutData: {
    aboutBk: {
      heading: "About Brahma Kumaris",
      headingMl: "ബ്രഹ്മാകുമാരീസ് ലോക ആത്മീയ സർവ്വകലാശാല",
      text: "Prajapita Brahma Kumaris Ishwariya Vishwa Vidyalaya is an international socio-spiritual educational institution dedicated to moral awakening, world peace, and personal transformation through ancient Rajyoga meditation. Founded in 1936 by Prajapita Brahma (Dada Lekhraj), the university has grown into a global family active in over 140 countries.\n\nAffiliated with the United Nations as an NGO with general consultative status (ECOSOC and UNICEF), Brahma Kumaris is the largest spiritual movement led by women, upholding the divine maternal values of compassion, selfless service, emotional resilience, and moral purity.",
      image: "assets/images/light_palace_center.jpg",
      published: true
    },
    aboutKozhikode: {
      heading: "About Brahma Kumaris Kozhikode",
      headingMl: "കോഴിക്കോട് ബ്രഹ്മാകുമാരീസ് സേവനങ്ങൾ",
      text: "The Kozhikode spiritual sub-zone serves as a peaceful haven for spiritual study and Raja Yoga meditation across North Kerala. Headquartered at the Light Palace, Ashokapuram, our centers conduct daily meditation sessions, 7-day foundation courses, youth de-addiction and concentration seminars, and stress-management workshops for healthcare workers, educators, and professionals.\n\nAll meditation classes, foundational study courses, and publications are offered completely free of charge as a noble spiritual service to the community.",
      image: "assets/images/meditation_hall.jpg",
      published: true
    }
  },

  dailyMurali: {
    date: "2026-08-19",
    title: "Essence of Sweetness & Constant Remembrance",
    titleMl: "മധുരമായ ഓർമ്മയും സ്വഭാവ പരിവർത്തനവും",
    essence: "Sweet children, become conquerors of attachment by keeping your intellect connected with the one Supreme Father, Shiv Baba.",
    essenceMl: "മധുരമായ കുട്ടികളേ, ഒരേയൊരു പരമപിതാവായ ശിവബാബയുമായി ബുദ്ധിയെ ബന്ധിപ്പിച്ച് മോഹജിത്തായി മാറുക.",
    blessing: "May you be an embodiment of peace and a master sun of knowledge who radiates divine light to all souls.",
    blessingMl: "എല്ലാ ആത്മാക്കൾക്കും ദിവ്യപ്രകാശം നൽകുന്ന ശാന്തിമൂർത്തിയും ജ്ഞാനസൂര്യനുമായി ഭവിക്കട്ടെ.",
    slogan: "To remain cheerful and stable in every situation is the mark of a true Raja Yogi.",
    sloganMl: "എല്ലാ സാഹചര്യങ്ങളിലും പ്രസന്നതയും സ്ഥിരതയും കാത്തുസൂക്ഷിക്കുന്നതാണ് യഥാർത്ഥ രാജയോഗിയുടെ ലക്ഷണം.",
    fullMuraliText: "Sweet children, today Shiv Baba is reminding all easy yogis to stay in the intoxication of soul consciousness and remain free from wasteful thoughts. By remembering the Ocean of Peace at amritvela, all burdens disappear effortlessly.",
    audioUrl: "",
    videoUrl: "",
    published: true
  },

  youtubeChannels: [
    {
      id: "supreme-light-creations",
      name: "Supreme Light Creations",
      contentType: "Podcast",
      categoryLabel: "Podcast",
      channelId: "",
      playlistId: "",
      youtubeUrl: "https://youtube.com",
      instagramUrl: "",
      facebookUrl: "",
      active: true
    },
    {
      id: "bks-calicut",
      name: "BKs Calicut",
      contentType: "Latest Live",
      categoryLabel: "Latest Live",
      channelId: "",
      playlistId: "",
      youtubeUrl: "https://youtube.com",
      instagramUrl: "",
      facebookUrl: "",
      active: true
    },
    {
      id: "bk-sheeba",
      name: "BK Sheeba",
      contentType: "Latest Video",
      categoryLabel: "Latest Video",
      channelId: "",
      playlistId: "",
      youtubeUrl: "https://youtube.com",
      instagramUrl: "",
      facebookUrl: "",
      active: true
    },
    {
      id: "bk-sheeja",
      name: "BK Sheeja",
      contentType: "Latest Video",
      categoryLabel: "Latest Video",
      channelId: "",
      playlistId: "",
      youtubeUrl: "https://youtube.com",
      instagramUrl: "",
      facebookUrl: "",
      active: true
    }
  ],

  customPages: [
    {
      id: 'rajyoga-benefits',
      title: 'Science & Powers of Rajyoga',
      slug: 'rajyoga-benefits',
      subtitle: 'How meditation rewires the brain, eliminates stress, and builds the 8 divine spiritual powers',
      bannerImage: 'assets/images/paramdham_sunset.jpg',
      contentHtml: `
        <div class="custom-article-body">
          <h3>The Ancient Science of Soul Healing</h3>
          <p>Rajyoga is the union of the soul (the conscious energy of thought and feeling) with the Supreme Soul (the eternal Ocean of Peace, Love, and Purity). Unlike physical exercises, Rajyoga is practiced with gentle, open-eyed awareness, enabling practitioners to maintain divine peace during daily work, family life, and challenges.</p>
          
          <div class="powers-grid">
            <div class="power-badge"><span>1</span> <strong>Power to Withdraw</strong> - Detach from outer chaos instantly</div>
            <div class="power-badge"><span>2</span> <strong>Power to Pack Up</strong> - Discard wasteful thoughts and worries</div>
            <div class="power-badge"><span>3</span> <strong>Power to Tolerate</strong> - Remain cool like an ocean in all circumstances</div>
            <div class="power-badge"><span>4</span> <strong>Power to Accommodate</strong> - Accept all souls with love and harmony</div>
            <div class="power-badge"><span>5</span> <strong>Power of Discrimination</strong> - Clearly discern truth from falsehood</div>
            <div class="power-badge"><span>6</span> <strong>Power of Judgment</strong> - Make quick, righteous and peaceful choices</div>
            <div class="power-badge"><span>7</span> <strong>Power to Face</strong> - Overcome inner fears and tests with courage</div>
            <div class="power-badge"><span>8</span> <strong>Power to Cooperate</strong> - Harmonize united energy for global benefit</div>
          </div>
        </div>
      `,
      createdAt: '2026-08-18'
    }
  ],

  courseModules: [
    {
      day: 1,
      title: "Soul Consciousness vs Body Consciousness",
      titleMl: "ആത്മജ്ഞാനം - ഞാൻ ആരാണ്?",
      description: "Understand your true identity as a minute point of spiritual light situated between the eyebrows, having original divine qualities of peace, love, purity, and bliss.",
      summary: "Understand your true identity as a minute point of spiritual light situated between the eyebrows, having original divine qualities of peace, love, purity, and bliss.",
      keyInsight: "I am a peaceful, eternal soul, operating this physical body like a driver steers a car.",
      duration: "45 mins",
      youtubeUrl: "",
      youtubeVideoId: "",
      thumbnail: "",
      published: true
    },
    {
      day: 2,
      title: "The Supreme Soul: God the Ocean of Peace",
      titleMl: "പരമാത്മാവ് - പരമപിതാവിന്റെ സവിശേഷതകൾ",
      description: "Discover the true form, supreme residence, and benevolent role of Shiv Baba, the incorporeal Supreme Soul who never enters the cycle of birth and death.",
      summary: "Discover the true form, supreme residence, and benevolent role of Shiv Baba, the incorporeal Supreme Soul who never enters the cycle of birth and death.",
      keyInsight: "God is an incorporeal Point of Radiant Light (Jyotirlingam), the eternal Father, Mother, Teacher, and Friend of all souls.",
      duration: "45 mins",
      youtubeUrl: "",
      youtubeVideoId: "",
      thumbnail: "",
      published: true
    },
    {
      day: 3,
      title: "The Three Worlds & Paramdham (Soul World)",
      titleMl: "ത്രിമൂർത്തി ലോകങ്ങളും പരന്ധാമവും",
      description: "Explore the physical universe (Corporeal World), the Subtle Angels' realm (Vyakta Watan), and the Golden-Red silent realm of liberation (Paramdham / Nirvana).",
      summary: "Explore the physical universe (Corporeal World), the Subtle Angels' realm (Vyakta Watan), and the Golden-Red silent realm of liberation (Paramdham / Nirvana).",
      keyInsight: "Paramdham is our sweet original home where all souls rest in eternal, unbroken silence before taking bodily costumes.",
      duration: "50 mins",
      youtubeUrl: "",
      youtubeVideoId: "",
      thumbnail: "",
      published: true
    },
    {
      day: 4,
      title: "The Infallible Law of Karma",
      titleMl: "കർമ്മ സിദ്ധാന്തം - കർമ്മത്തിന്റെ നിയമം",
      description: "Learn the deep mechanics of cause and effect. Every thought, word, and action creates an impression and returns multifold to the performer.",
      summary: "Learn the deep mechanics of cause and effect. Every thought, word, and action creates an impression and returns multifold to the performer.",
      keyInsight: "Perform elevated, selfless actions rooted in soul consciousness to dissolve past accounts and create an auspicious future.",
      duration: "50 mins",
      youtubeUrl: "",
      youtubeVideoId: "",
      thumbnail: "",
      published: true
    },
    {
      day: 5,
      title: "The 8 Spiritual Powers of Rajyoga",
      titleMl: "രാജയോഗത്തിന്റെ 8 ആത്മീയ ശക്തികൾ",
      description: "Master the spiritual powers: Withdrawing, Packing Up, Tolerating, Accommodating, Discerning, Judging, Facing, and Cooperating in daily life.",
      summary: "Master the spiritual powers: Withdrawing, Packing Up, Tolerating, Accommodating, Discerning, Judging, Facing, and Cooperating in daily life.",
      keyInsight: "Rajyoga transforms spiritual knowledge into practical inner resilience and unconditional calm.",
      duration: "45 mins",
      youtubeUrl: "",
      youtubeVideoId: "",
      thumbnail: "",
      published: true
    },
    {
      day: 6,
      title: "The World Drama Cycle & Tree of Humanity",
      titleMl: "സൃഷ്ടി ചക്രവും മനുഷ്യ കുടുംബ വൃക്ഷവും",
      description: "Understand the eternal 5000-year cycle of 4 ages (Golden, Silver, Copper, Iron) and the auspicious Confluence Age (Sangam Yuga) of spiritual renewal.",
      summary: "Understand the eternal 5000-year cycle of 4 ages (Golden, Silver, Copper, Iron) and the auspicious Confluence Age (Sangam Yuga) of spiritual renewal.",
      keyInsight: "We are currently living in the dawn of spiritual awakening, transitioning humanity from darkness to golden divinity.",
      duration: "55 mins",
      youtubeUrl: "",
      youtubeVideoId: "",
      thumbnail: "",
      published: true
    },
    {
      day: 7,
      title: "Rajyoga in Practical Daily Life & Pure Living",
      titleMl: "നിത്യജീവിതത്തിൽ രാജയോഗവും സാത്വിക ജീവിതരീതിയും",
      description: "Integrate early morning Amritvela meditation (4:00 AM), pure satvik diet, elevated association, and Traffic Control into everyday family and professional routines.",
      summary: "Integrate early morning Amritvela meditation (4:00 AM), pure satvik diet, elevated association, and Traffic Control into everyday family and professional routines.",
      keyInsight: "Purity of diet, thoughts, and vision makes the mind an undisturbed mirror reflecting divine peace.",
      duration: "60 mins",
      youtubeUrl: "",
      youtubeVideoId: "",
      thumbnail: "",
      published: true
    }
  ],

  centers: [
    {
      id: 'ashokapuram',
      name: "Light Palace (Ashokapuram Main Center)",
      nameMl: "ലൈറ്റ് പാലസ്, അശോകാപുരം (പ്രധാന കേന്ദ്രം)",
      area: "Ashokapuram, Kozhikode",
      contactPerson: "BK Sister Sunanda / BK Brother Manoj",
      phone: "+91 9746334202",
      whatsapp: "+91 9746334202",
      landline: "0495-2770568",
      address: "H.No: 44/284, Balan K Nair Road, Ashokapuram, PO: Eranhipalam, Kozhikode - 673006",
      landmark: "Near Eranhipalam Junction / Balan K Nair Road",
      phones: ["0495-2770568", "+91 9746334202"],
      incharge: "BK Sister Sunanda / BK Brother Manoj",
      morningTimings: "6:30 AM – 9:00 AM (Amritvela & Murli Class)",
      eveningTimings: "5:00 PM – 8:00 PM (Rajyoga & Guided Meditation)",
      timings: "Morning: 6:30 AM – 9:00 AM | Evening: 5:00 PM – 8:00 PM",
      facilities: ["Air-cooled Meditation Hall", "Spiritual Library", "Counseling Room", "Daily Murli Classroom", "Visitor Parking"],
      description: "Zonal main spiritual center with spacious meditation sanctuary, regular daily Murli classes, and counseling.",
      mapUrl: "https://maps.google.com/?q=Brahma+Kumaris+Ashokapuram+Kozhikode",
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Ashokapuram+Kozhikode",
      isPrimary: true,
      isMain: true,
      published: true,
      image: "assets/images/light_palace_center.jpg"
    },
    {
      id: 'westhill',
      name: "Sivalayanam (West Hill Center)",
      nameMl: "ശിവാലയനം, വെസ്റ്റ് ഹിൽ",
      area: "West Hill, Kozhikode",
      contactPerson: "BK Sister Geetha",
      phone: "+91 9895777017",
      whatsapp: "+91 9895777017",
      landline: "0495-2384883",
      address: "Sivalayanam, Valakkettunilam Road, West Hill, Kozhikode - 673005",
      landmark: "Near West Hill Railway Station Road",
      phones: ["0495-2384883", "+91 9895777017"],
      incharge: "BK Sister Geetha",
      morningTimings: "7:00 AM – 8:30 AM",
      eveningTimings: "5:30 PM – 7:30 PM",
      timings: "Morning: 7:00 AM – 8:30 AM | Evening: 5:30 PM – 7:30 PM",
      facilities: ["Tranquil Meditation Hall", "Youth Value Education", "Daily Peace Sessions"],
      description: "Serene neighborhood center providing morning and evening guided meditation and Rajyoga classes.",
      mapUrl: "https://maps.google.com/?q=Brahma+Kumaris+West+Hill+Kozhikode",
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+West+Hill+Kozhikode",
      isPrimary: false,
      isMain: false,
      published: true,
      image: "assets/images/meditation_hall.jpg"
    },
    {
      id: 'balussery',
      name: "Sukhadham (Balussery Center)",
      nameMl: "സുഖധാം, ബാലുശ്ശേരി",
      area: "Balussery, Kozhikode",
      contactPerson: "BK Sister Bindu",
      phone: "+91 9895516762",
      whatsapp: "+91 9895516762",
      landline: "+91 9995586665",
      address: "Sukhadham, Near Co-operative Arts & Science College, Kairali Road, Balussery, Kozhikode - 673612",
      landmark: "Near Co-op College",
      phones: ["+91 9895516762", "+91 9995586665"],
      incharge: "BK Sister Bindu",
      morningTimings: "7:00 AM – 8:30 AM",
      eveningTimings: "5:00 PM – 7:30 PM",
      timings: "Morning: 7:00 AM – 8:30 AM | Evening: 5:00 PM – 7:30 PM",
      facilities: ["Spiritual Garden", "Children Value Education", "Stress Relief Sessions"],
      description: "Peaceful spiritual retreat center in Balussery with lush meditation garden and weekly workshops.",
      mapUrl: "https://maps.google.com/?q=Brahma+Kumaris+Balussery+Kozhikode",
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Balussery+Kozhikode",
      isPrimary: false,
      isMain: false,
      published: true,
      image: "assets/images/light_palace_center.jpg"
    },
    {
      id: 'koyilandy',
      name: "Vasantham (Koyilandy Center)",
      nameMl: "വസന്തം, കൊയിലാണ്ടി",
      area: "Koyilandy, Kozhikode",
      contactPerson: "BK Sister Radha",
      phone: "+91 9447432109",
      whatsapp: "+91 9447432109",
      landline: "",
      address: "H.No: 31/397, Vasantham, Kothamangalam, Panthalayani, Koyilandy, Kozhikode - 673305",
      landmark: "Panthalayani, Kothamangalam",
      phones: ["+91 9447432109", "+91 9746334202"],
      incharge: "BK Sister Radha",
      morningTimings: "7:00 AM – 8:30 AM",
      eveningTimings: "5:30 PM – 7:30 PM",
      timings: "Morning: 7:00 AM – 8:30 AM | Evening: 5:30 PM – 7:30 PM",
      facilities: ["Meditation Room", "Free 7-Day Courses", "Spiritual Counseling"],
      description: "Community center offering complimentary 7-Day foundation courses and stress-free living programs.",
      mapUrl: "https://maps.google.com/?q=Brahma+Kumaris+Koyilandy",
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Koyilandy",
      isPrimary: false,
      isMain: false,
      published: true,
      image: "assets/images/meditation_hall.jpg"
    },
    {
      id: 'vadakara',
      name: "Layam (Vadakara Center)",
      nameMl: "ലയം, വടകര",
      area: "Vadakara, Kozhikode",
      contactPerson: "BK Sister Preetha",
      phone: "+91 9496123456",
      whatsapp: "+91 9496123456",
      landline: "0496-2524331",
      address: "H.No: 20/380, Layam, Near Manikoth Temple Road, Narayana Nagar, Vadakara, Kozhikode - 673101",
      landmark: "Near Manikoth Temple Road",
      phones: ["0496-2524331", "+91 9496123456"],
      incharge: "BK Sister Preetha",
      morningTimings: "7:00 AM – 8:30 AM",
      eveningTimings: "5:00 PM – 7:30 PM",
      timings: "Morning: 7:00 AM – 8:30 AM | Evening: 5:00 PM – 7:30 PM",
      facilities: ["Peace Sanctuary", "Daily Murli Class", "Women Empowerment Sessions"],
      description: "Dedicated spiritual haven in Vadakara providing personalized counseling and values-based classes.",
      mapUrl: "https://maps.google.com/?q=Brahma+Kumaris+Vadakara",
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Vadakara",
      isPrimary: false,
      isMain: false,
      published: true,
      image: "assets/images/rajyoga_peace.jpg"
    },
    {
      id: 'chevayoor',
      name: "Chevayoor Meditation Sub-Center",
      nameMl: "ചേവായൂർ ഉപകേന്ദ്രം",
      area: "Chevayoor, Kozhikode",
      contactPerson: "BK Sister Latha",
      phone: "+91 9746334202",
      whatsapp: "+91 9746334202",
      landline: "",
      address: "Near Medical College Link Road, Chevayoor, Kozhikode - 673017",
      landmark: "Chevayoor Junction",
      phones: ["+91 9746334202"],
      incharge: "BK Sister Latha",
      morningTimings: "7:00 AM – 8:30 AM",
      eveningTimings: "6:00 PM – 7:30 PM",
      timings: "Morning: 7:00 AM – 8:30 AM | Evening: 6:00 PM – 7:30 PM",
      facilities: ["Neighborhood Meditation Space", "Introductory Rajyoga Classes"],
      description: "Neighborhood meditation hub for residents and students near Calicut Medical College.",
      mapUrl: "https://maps.google.com/?q=Brahma+Kumaris+Chevayoor+Kozhikode",
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Chevayoor+Kozhikode",
      isPrimary: false,
      isMain: false,
      published: true,
      image: "assets/images/meditation_hall.jpg"
    }
  ],

  gallery: [
    {
      id: 'g1',
      title: "Paramdham - The Realm of Golden-Red Supreme Light",
      titleMl: "പരന്ധാമം - ശാന്തിയുടെ നിത്യലോകം",
      category: "Spiritual Art",
      type: "image",
      url: "assets/images/paramdham_sunset.jpg",
      thumbnail: "assets/images/paramdham_sunset.jpg",
      description: "A visualization of the Incorporeal Soul World (Paramdham / Shantidham), where the Supreme Soul Shiv Baba radiates waves of peace, love, and divine power.",
      date: "2026-08-15"
    },
    {
      id: 'g2',
      title: "Light Palace Ashokapuram Meditation Hall & Retreat Center",
      titleMl: "അശോകാപുരം ലൈറ്റ് പാലസ് ധ്യാനകേന്ദ്രം",
      category: "Kozhikode Centers",
      type: "image",
      url: "assets/images/light_palace_center.jpg",
      thumbnail: "assets/images/light_palace_center.jpg",
      description: "Serene exterior view of Brahma Kumaris Light Palace in Ashokapuram, Kozhikode, welcoming seekers into spiritual study and inner peace.",
      date: "2026-08-10"
    },
    {
      id: 'g3',
      title: "Sacred Meditation Gathering at Ashokapuram Light Palace",
      titleMl: "സാമൂഹിക രാജയോഗ ധ്യാന സംഗമം",
      category: "Meditation Hall",
      type: "image",
      url: "assets/images/meditation_hall.jpg",
      thumbnail: "assets/images/meditation_hall.jpg",
      description: "Spiritual practitioners sitting in silent, open-eyed Rajyoga meditation before the glowing red-golden light stage of Shiva Baba at the Kozhikode meditation sanctuary.",
      date: "2026-08-01"
    },
    {
      id: 'g4',
      title: "Rajyoga Practitioner in Soul Consciousness & Bliss",
      titleMl: "ആത്മീയ അനുഭൂതിയിൽ മുഴുകിയ സാധകൻ",
      category: "Rajyoga Experience",
      type: "image",
      url: "assets/images/rajyoga_peace.jpg",
      thumbnail: "assets/images/rajyoga_peace.jpg",
      description: "Experiencing deep soul consciousness and spiritual connection with the Supreme Father during evening Amritvela meditation.",
      date: "2026-07-28"
    },
    {
      id: 'g5',
      title: "World Peace Meditation Hour & Candle Lighting Gathering",
      titleMl: "ലോക സമാധാന ധ്യാന മണിക്കൂറും ദീപം തെളിയിക്കലും",
      category: "Peace Initiatives",
      type: "image",
      url: "assets/images/meditation_hall.jpg",
      thumbnail: "assets/images/meditation_hall.jpg",
      description: "Hundreds of seekers gathering across Kozhikode branches on the 3rd Sunday of every month to send vibrations of peace to Mother Nature and humanity.",
      date: "2026-07-20"
    },
    {
      id: 'g6',
      title: "Brahma Kumaris Mount Abu Global Headquarters Heritage",
      titleMl: "മൗണ്ട് അബു അന്താരാഷ്ട്ര ആസ്ഥാനം",
      category: "Headquarters",
      type: "image",
      url: "assets/images/light_palace_center.jpg",
      thumbnail: "assets/images/light_palace_center.jpg",
      description: "Connecting our Kozhikode spiritual family with the international spiritual university headquarters at Shantivan & Pandav Bhawan, Mount Abu.",
      date: "2026-06-15"
    }
  ],

  events: [
    {
      id: "evt-navathi-90",
      title: "90th Anniversary: Navathi Celebrations of Brahma Kumaris",
      titleMl: "ബ്രഹ്മാകുമാരീസ് നവതി ആത്മീയ മഹോത്സവം",
      category: "navathi",
      date: "2026-10-15",
      time: "9:30 AM - 1:00 PM",
      location: "Ashokapuram Light Palace, Kozhikode",
      shortDesc: "A momentous milestone commemorating 90 years of world renewal, values education, and soul consciousness across humanity.",
      fullDesc: "Celebrating 90 glorious years of dedicated service to humanity, spiritual empowerment, and universal peace education. The Navathi celebrations bring together truth seekers, Rajyogis, and distinguished citizens of Kerala for divine remembrance, cultural harmony, and dedication to universal peace.",
      image: "assets/images/light_palace_center.jpg",
      additionalImages: [
        "assets/images/meditation_hall.jpg",
        "assets/images/paramdham_sunset.jpg"
      ],
      videoUrl: "",
      registrationUrl: "",
      externalUrl: "",
      schedule: [
        { time: "09:30 AM", session: "Welcome & Deep Meditation" },
        { time: "10:15 AM", session: "Inaugural Blessings & Keynote Discourse" },
        { time: "11:30 AM", session: "Spiritual Songs & Cultural Presentation" },
        { time: "12:30 PM", session: "Brahma Bhojan & Divine Prasadam" }
      ],
      isFeatured: true,
      status: "published",
      order: 1,
      createdAt: "2026-08-18"
    },
    {
      id: "evt-shivarathri-fest",
      title: "Maha Shivratri Spiritual Festival & Jyotirlingam Exhibition",
      titleMl: "മഹാശിവരാത്രി ആത്മീയ മേളയും ജ്യോതിർലിംഗ ദർശനവും",
      category: "shivarathri",
      date: "Sacred Festival Period",
      time: "Full Day (8:00 AM - 9:00 PM)",
      location: "Light Palace Grounds, Ashokapuram, Kozhikode",
      shortDesc: "Experience the profound spiritual significance of Shivratri with 3D Jyotirlingam darshan, flag unfurling, and continuous peace meditation.",
      fullDesc: "Maha Shivratri marks the divine descent of Incorporeal Supreme Soul Shiva, the Ocean of Peace and Purity, to dispel darkness and sorrow. The festival features the sacred flag hoisting ceremony, divine knowledge stalls, 3D spiritual cave of Paramdham, and sacred pledge for purity in thoughts and actions.",
      image: "assets/images/paramdham_sunset.jpg",
      additionalImages: [
        "assets/images/meditation_hall.jpg"
      ],
      videoUrl: "",
      registrationUrl: "",
      externalUrl: "",
      schedule: [
        { time: "08:00 AM", session: "Sacred Shiva Dhwaj Flag Hoisting" },
        { time: "10:00 AM", session: "Spiritual Discourse: The Secret of Shivratri" },
        { time: "04:00 PM", session: "3D Paramdham Meditation Journey" },
        { time: "07:00 PM", session: "Maha Deepotsav & 108 Light Darshan" }
      ],
      isFeatured: true,
      status: "published",
      order: 2,
      createdAt: "2026-08-18"
    },
    {
      id: "evt-raksha-bandhan-gathering",
      title: "Sacred Raksha Bandhan: Festival of Divine Purity & Brotherhood",
      titleMl: "വിശുദ്ധി ദിവ്യസ്നേഹ രക്ഷാബന്ധൻ ഉത്സവം",
      category: "rakshabandhan",
      date: "August Sacred Purnima",
      time: "10:00 AM - 6:00 PM",
      location: "All Kozhikode Center Branches",
      shortDesc: "Tying the sacred thread of purity, spiritual protection, and mutual goodwill with soul consciousness.",
      fullDesc: "Raksha Bandhan in its true spiritual essence signifies tying the divine bond of purity and receiving God Shiva's protection from vices. Seekers receive sacred tilak of soul realization, pure sweet blessings (Toli), and take an elevated pledge of living with unconditional peace and goodwill.",
      image: "assets/images/rajyoga_peace.jpg",
      additionalImages: [],
      videoUrl: "",
      registrationUrl: "",
      externalUrl: "",
      schedule: [
        { time: "10:00 AM", session: "Soul-Conscious Rakhi Blessing & Tilak" },
        { time: "11:30 AM", session: "Discourse on Spiritual Bond of Purity" },
        { time: "04:00 PM", session: "Special Gathering for Families" }
      ],
      isFeatured: false,
      status: "published",
      order: 3,
      createdAt: "2026-08-18"
    },
    {
      id: "evt-peace-workshop",
      title: "Stress-Free Living & Emotional Detox for Professionals",
      titleMl: "സമ്മർദ്ദരഹിത ജീവിതം - പ്രൊഫഷണലുകൾക്കായുള്ള ശിൽപശാല",
      category: "other",
      date: "Every 3rd Sunday",
      time: "10:00 AM - 1:00 PM",
      location: "Main Auditorium, Light Palace, Kozhikode",
      shortDesc: "Practical spiritual techniques and mindfulness practices to eliminate burnout, enhance mental clarity, and maintain harmony.",
      fullDesc: "An intensive, interactive seminar designed for educators, corporate executives, doctors, and professionals. Learn the art of response control, mental detox, positive affirmations, and 5-minute workplace meditation pauses to sustain peak performance and inner peace.",
      image: "assets/images/meditation_hall.jpg",
      additionalImages: [],
      videoUrl: "",
      registrationUrl: "",
      externalUrl: "",
      schedule: [
        { time: "10:00 AM", session: "Understanding Stress & The Mind Machine" },
        { time: "11:00 AM", session: "Emotional Detox Guided Meditation" },
        { time: "12:00 PM", session: "Q&A and Practical Toolkits" }
      ],
      isFeatured: false,
      status: "published",
      order: 4,
      createdAt: "2026-08-18"
    }
  ],

  registrations: [
    {
      id: 'reg_101',
      name: "Suresh Kumar",
      phone: "9847123456",
      email: "suresh.calicut@gmail.com",
      preferredCenter: "Ashokapuram Light Palace",
      courseType: "7-Day Rajyoga Foundation Course",
      timePreference: "Morning Batch (7:00 AM)",
      date: "2026-08-17",
      status: "Enrolled",
      notes: "Attending Day 1 orientation"
    },
    {
      id: 'reg_102',
      name: "Anjali Menon",
      phone: "9446789012",
      email: "anjali.menon@yahoo.com",
      preferredCenter: "West Hill Center",
      courseType: "Stress-Free Living Seminar",
      timePreference: "Evening Batch (6:00 PM)",
      date: "2026-08-18",
      status: "New",
      notes: "Requested Malayalam language batch"
    }
  ],

  socialChannels: [
    {
      id: "supreme-light-creations",
      name: "Supreme Light Creations",
      youtubeUrl: "",
      instagramUrl: "",
      facebookUrl: "",
      active: true
    },
    {
      id: "bks-calicut",
      name: "BKs Calicut",
      youtubeUrl: "",
      instagramUrl: "",
      facebookUrl: "",
      active: true
    },
    {
      id: "bk-sheeba",
      name: "BK Sheeba",
      youtubeUrl: "",
      instagramUrl: "",
      facebookUrl: "",
      active: true
    },
    {
      id: "bk-sheeja",
      name: "BK Sheeja",
      youtubeUrl: "",
      instagramUrl: "",
      facebookUrl: "",
      active: true
    }
  ]
};

// YouTube Utility Helpers
function extractYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return '';
  url = url.trim();
  const regExp = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/|v\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/i;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  return '';
}

function getYouTubeEmbedUrl(urlOrId) {
  const id = extractYouTubeVideoId(urlOrId);
  if (!id) return '';
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

// Expose on window for global access
window.bkUtils = {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl
};

// State Store singleton
class SiteStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure course modules merge with new schema fields seamlessly
        let mergedCourseModules = DEFAULT_DATA.courseModules;
        if (Array.isArray(parsed.courseModules) && parsed.courseModules.length > 0) {
          mergedCourseModules = DEFAULT_DATA.courseModules.map(defaultMod => {
            const existing = parsed.courseModules.find(m => m.day === defaultMod.day);
            if (!existing) return defaultMod;
            const ytUrl = existing.youtubeUrl !== undefined ? existing.youtubeUrl : defaultMod.youtubeUrl;
            return {
              ...defaultMod,
              ...existing,
              description: existing.description || existing.summary || defaultMod.description,
              youtubeUrl: ytUrl,
              youtubeVideoId: existing.youtubeVideoId || extractYouTubeVideoId(ytUrl || ''),
              duration: existing.duration || defaultMod.duration
            };
          });
        }

        // Ensure tabs have the exact updated labels and new Daily Murali tab
        let mergedTabs = DEFAULT_DATA.tabs;
        if (Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
          mergedTabs = parsed.tabs.map(t => {
            if (t.id === 'about') return { ...t, label: 'About Us' };
            if (t.id === 'gallery') return { ...t, label: 'Gallery' };
            if (t.id === 'centers') return { ...t, label: 'Center List' };
            if (t.id === 'contact') return { ...t, label: 'Contact Us' };
            if (t.id === 'events') return { ...t, label: 'Events', type: 'events-dropdown' };
            if (t.id === 'media') return { ...t, label: 'Media', type: 'media-dropdown' };
            return t;
          }).filter(t => t.id !== 'wisdom'); // replace old wisdom with murali

          // Ensure Daily Murali tab exists
          if (!mergedTabs.some(t => t.id === 'murali')) {
            const eventsIdx = mergedTabs.findIndex(t => t.id === 'events');
            const muraliTab = { id: 'murali', label: 'Daily Murali', icon: 'sun', isCore: true, enabled: true, order: 9, type: 'system' };
            if (eventsIdx !== -1) {
              mergedTabs.splice(eventsIdx + 1, 0, muraliTab);
            } else {
              mergedTabs.push(muraliTab);
            }
          }

          // Ensure Media tab exists
          if (!mergedTabs.some(t => t.id === 'media')) {
            const galleryIdx = mergedTabs.findIndex(t => t.id === 'gallery');
            const mediaTab = { id: 'media', label: 'Media', icon: 'film', isCore: true, enabled: true, order: 7, type: 'media-dropdown' };
            if (galleryIdx !== -1) {
              mergedTabs.splice(galleryIdx + 1, 0, mediaTab);
            } else {
              mergedTabs.push(mediaTab);
            }
          }
        }

        // Ensure events merge and migrate to new rich schema
        let mergedEvents = DEFAULT_DATA.events;
        if (Array.isArray(parsed.events) && parsed.events.length > 0) {
          mergedEvents = parsed.events.map(ev => {
            return {
              id: ev.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              title: ev.title || 'Spiritual Gathering',
              titleMl: ev.titleMl || '',
              category: ev.category || 'other',
              date: ev.date || 'Upcoming',
              time: ev.time || '10:00 AM - 1:00 PM',
              location: ev.location || ev.venue || 'Ashokapuram Light Palace, Kozhikode',
              shortDesc: ev.shortDesc || (ev.description ? ev.description.substring(0, 140) + '...' : ''),
              fullDesc: ev.fullDesc || ev.description || '',
              image: ev.image || 'assets/images/light_palace_center.jpg',
              additionalImages: Array.isArray(ev.additionalImages) ? ev.additionalImages : [],
              videoUrl: ev.videoUrl || '',
              registrationUrl: ev.registrationUrl || '',
              externalUrl: ev.externalUrl || '',
              schedule: Array.isArray(ev.schedule) ? ev.schedule : [],
              isFeatured: ev.isFeatured !== undefined ? ev.isFeatured : false,
              status: ev.status || 'published',
              order: ev.order || 1,
              createdAt: ev.createdAt || '2026-08-18'
            };
          });

          // Ensure default events exist if category is missing
          ['navathi', 'shivarathri', 'rakshabandhan'].forEach(cat => {
            const hasCat = mergedEvents.some(e => e.category === cat);
            if (!hasCat) {
              const defaultForCat = DEFAULT_DATA.events.find(e => e.category === cat);
              if (defaultForCat) mergedEvents.push(defaultForCat);
            }
          });
        }

        return {
          ...DEFAULT_DATA,
          ...parsed,
          settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
          dailyThought: { ...DEFAULT_DATA.dailyThought, ...(parsed.dailyThought || {}) },
          aboutData: { ...DEFAULT_DATA.aboutData, ...(parsed.aboutData || {}) },
          dailyMurali: { ...DEFAULT_DATA.dailyMurali, ...(parsed.dailyMurali || {}) },
          youtubeChannels: parsed.youtubeChannels && parsed.youtubeChannels.length > 0 ? parsed.youtubeChannels : DEFAULT_DATA.youtubeChannels,
          tabs: mergedTabs,
          customPages: parsed.customPages || DEFAULT_DATA.customPages,
          courseModules: mergedCourseModules,
          socialChannels: mergedSocialChannels,
          centers: parsed.centers || DEFAULT_DATA.centers,
          gallery: parsed.gallery || DEFAULT_DATA.gallery,
          events: mergedEvents,
          registrations: parsed.registrations || DEFAULT_DATA.registrations
        };
      }
    } catch (err) {
      console.warn('Failed to load localStorage data, using defaults', err);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('bk_store_updated', { detail: this.data }));
      }
      return true;
    } catch (err) {
      console.error('Failed to save to localStorage', err);
      return false;
    }
  }

  // --- Settings ---
  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
  }

  // --- Daily Murli & Thought ---
  getDailyThought() {
    return this.data.dailyThought;
  }

  updateDailyThought(newThought) {
    this.data.dailyThought = { ...this.data.dailyThought, ...newThought };
    this.saveData();
  }

  // --- Dynamic Tabs ---
  getTabs() {
    return (this.data.tabs || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getEnabledTabs() {
    return this.getTabs().filter(t => t.enabled !== false);
  }

  addTab(tabData) {
    const id = 'custom_' + Date.now();
    const order = this.data.tabs.length + 1;
    const newTab = {
      id,
      label: tabData.label || 'New Page',
      icon: tabData.icon || 'file-text',
      isCore: false,
      enabled: true,
      order,
      type: 'custom',
      customPageId: id
    };
    this.data.tabs.push(newTab);

    // Create corresponding custom page record
    const newPage = {
      id,
      title: tabData.label || 'New Page',
      slug: (tabData.label || 'page').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle: tabData.subtitle || 'Spiritual knowledge and insights from Brahma Kumaris Kozhikode',
      bannerImage: tabData.bannerImage || 'assets/images/paramdham_sunset.jpg',
      contentHtml: tabData.contentHtml || '<p>Welcome to this section. Content can be edited from the Admin panel.</p>',
      ctaText: tabData.ctaText || 'Learn More',
      ctaLink: tabData.ctaLink || '#contact',
      createdAt: new Date().toISOString()
    };
    this.data.customPages.push(newPage);

    this.saveData();
    return newTab;
  }

  updateTab(id, updates) {
    const idx = this.data.tabs.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.data.tabs[idx] = { ...this.data.tabs[idx], ...updates };
      // Also update linked custom page title if label changed
      if (updates.label) {
        const pageIdx = this.data.customPages.findIndex(p => p.id === id);
        if (pageIdx !== -1) {
          this.data.customPages[pageIdx].title = updates.label;
        }
      }
      this.saveData();
      return true;
    }
    return false;
  }

  deleteTab(id) {
    const tab = this.data.tabs.find(t => t.id === id);
    if (tab && tab.isCore) {
      alert('Core system tabs cannot be deleted. You may disable them instead.');
      return false;
    }
    this.data.tabs = this.data.tabs.filter(t => t.id !== id);
    this.data.customPages = (this.data.customPages || []).filter(p => p.id !== id);
    this.saveData();
    return true;
  }

  reorderTabs(orderedIds) {
    orderedIds.forEach((id, index) => {
      const tab = this.data.tabs.find(t => t.id === id);
      if (tab) {
        tab.order = index + 1;
      }
    });
    this.saveData();
  }

  // --- Custom Pages ---
  getCustomPage(id) {
    return (this.data.customPages || []).find(p => p.id === id);
  }

  updateCustomPage(id, pageData) {
    const idx = this.data.customPages.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.customPages[idx] = { ...this.data.customPages[idx], ...pageData };
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Gallery & Media ---
  getGallery() {
    return this.data.gallery || [];
  }

  addGalleryItem(item) {
    const id = 'media_' + Date.now();
    const newItem = {
      id,
      title: item.title || 'Spiritual Gallery Item',
      titleMl: item.titleMl || '',
      category: item.category || 'Ashokapuram Center',
      type: item.type || 'image',
      url: item.url || 'assets/images/paramdham_sunset.jpg',
      thumbnail: item.thumbnail || item.url || 'assets/images/paramdham_sunset.jpg',
      description: item.description || '',
      date: item.date || new Date().toISOString().split('T')[0]
    };
    this.data.gallery.unshift(newItem);
    this.saveData();
    return newItem;
  }

  updateGalleryItem(id, updates) {
    const idx = this.data.gallery.findIndex(g => g.id === id);
    if (idx !== -1) {
      this.data.gallery[idx] = { ...this.data.gallery[idx], ...updates };
      this.saveData();
      return true;
    }
    return false;
  }

  deleteGalleryItem(id) {
    this.data.gallery = this.data.gallery.filter(g => g.id !== id);
    this.saveData();
    return true;
  }

  // --- Events ---
  getEvents(filterCategory = 'all', includeDrafts = false) {
    let list = this.data.events || [];
    if (!includeDrafts) {
      list = list.filter(e => e.status !== 'draft');
    }
    if (filterCategory !== 'all') {
      if (filterCategory === 'latest') {
        // Return published events sorted: featured first, then order / date
        return [...list].sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (a.order || 99) - (b.order || 99);
        });
      } else if (filterCategory === 'festivals') {
        list = list.filter(e => ['shivarathri', 'rakshabandhan', 'other'].includes(e.category));
      } else {
        list = list.filter(e => e.category === filterCategory);
      }
    }
    return [...list].sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  getEvent(id) {
    return (this.data.events || []).find(e => e.id === id) || null;
  }

  saveEvent(event) {
    if (!this.data.events) {
      this.data.events = JSON.parse(JSON.stringify(DEFAULT_DATA.events));
    }
    
    // Auto-extract YouTube video ID if URL provided
    if (event.videoUrl) {
      event.youtubeVideoId = extractYouTubeVideoId(event.videoUrl);
    }

    if (event.id) {
      const idx = this.data.events.findIndex(e => e.id === event.id);
      if (idx !== -1) {
        this.data.events[idx] = {
          ...this.data.events[idx],
          ...event
        };
        this.saveData();
        return this.data.events[idx];
      }
    }

    // New event
    const newEvent = {
      id: event.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: event.title || 'Spiritual Program',
      titleMl: event.titleMl || '',
      category: event.category || 'other',
      date: event.date || 'Upcoming',
      time: event.time || '10:00 AM - 1:00 PM',
      location: event.location || 'Ashokapuram Light Palace, Kozhikode',
      shortDesc: event.shortDesc || '',
      fullDesc: event.fullDesc || event.shortDesc || '',
      image: event.image || 'assets/images/light_palace_center.jpg',
      additionalImages: Array.isArray(event.additionalImages) ? event.additionalImages : [],
      videoUrl: event.videoUrl || '',
      youtubeVideoId: event.youtubeVideoId || '',
      registrationUrl: event.registrationUrl || '',
      externalUrl: event.externalUrl || '',
      schedule: Array.isArray(event.schedule) ? event.schedule : [],
      isFeatured: Boolean(event.isFeatured),
      status: event.status || 'published',
      order: parseInt(event.order, 10) || (this.data.events.length + 1),
      createdAt: event.createdAt || new Date().toISOString().split('T')[0]
    };

    this.data.events.unshift(newEvent);
    this.saveData();
    return newEvent;
  }

  updateEvent(id, updates) {
    return this.saveEvent({ id, ...updates });
  }

  deleteEvent(id) {
    this.data.events = (this.data.events || []).filter(e => e.id !== id);
    this.saveData();
    return true;
  }

  duplicateEvent(id) {
    const original = this.getEvent(id);
    if (!original) return null;

    const clone = {
      ...JSON.parse(JSON.stringify(original)),
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: `${original.title} (Copy)`,
      status: 'draft',
      isFeatured: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.data.events.unshift(clone);
    this.saveData();
    return clone;
  }

  togglePublishEvent(id) {
    const ev = this.getEvent(id);
    if (!ev) return null;
    ev.status = ev.status === 'published' ? 'draft' : 'published';
    this.saveData();
    return ev;
  }

  // --- Course Registrations & Inquiries ---
  getRegistrations() {
    return this.data.registrations || [];
  }

  addRegistration(reg) {
    const id = 'reg_' + Date.now();
    const newReg = {
      id,
      name: reg.name,
      phone: reg.phone,
      email: reg.email || '',
      preferredCenter: reg.preferredCenter || 'Ashokapuram Light Palace',
      courseType: reg.courseType || '7-Day Rajyoga Foundation Course',
      timePreference: reg.timePreference || 'Morning Batch',
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      notes: reg.notes || ''
    };
    this.data.registrations.unshift(newReg);
    this.saveData();
    return newReg;
  }

  updateRegistrationStatus(id, status, notes = '') {
    const reg = this.data.registrations.find(r => r.id === id);
    if (reg) {
      reg.status = status;
      if (notes) reg.notes = notes;
      this.saveData();
      return true;
    }
    return false;
  }

  deleteRegistration(id) {
    this.data.registrations = this.data.registrations.filter(r => r.id !== id);
    this.saveData();
    return true;
  }

  // --- About Us Content ---
  getAboutData() {
    return this.data.aboutData || DEFAULT_DATA.aboutData;
  }

  updateAboutData(updates) {
    if (!this.data.aboutData) {
      this.data.aboutData = JSON.parse(JSON.stringify(DEFAULT_DATA.aboutData));
    }
    this.data.aboutData = {
      ...this.data.aboutData,
      ...updates
    };
    this.saveData();
    return this.data.aboutData;
  }

  // --- Daily Murali ---
  getDailyMurali() {
    return this.data.dailyMurali || DEFAULT_DATA.dailyMurali;
  }

  updateDailyMurali(updates) {
    if (!this.data.dailyMurali) {
      this.data.dailyMurali = JSON.parse(JSON.stringify(DEFAULT_DATA.dailyMurali));
    }
    this.data.dailyMurali = {
      ...this.data.dailyMurali,
      ...updates
    };
    this.saveData();
    return this.data.dailyMurali;
  }

  // --- Centers (Kozhikode Center List) ---
  getCenters(includeUnpublished = false) {
    const centers = this.data.centers || DEFAULT_DATA.centers;
    if (includeUnpublished) return centers;
    return centers.filter(c => c.published !== false);
  }

  getCenter(id) {
    return (this.data.centers || DEFAULT_DATA.centers).find(c => c.id === id) || null;
  }

  saveCenter(center) {
    if (!this.data.centers) {
      this.data.centers = JSON.parse(JSON.stringify(DEFAULT_DATA.centers));
    }

    if (center.id) {
      const idx = this.data.centers.findIndex(c => c.id === center.id);
      if (idx !== -1) {
        this.data.centers[idx] = {
          ...this.data.centers[idx],
          ...center
        };
        this.saveData();
        return this.data.centers[idx];
      }
    }

    const newCenter = {
      id: center.id || `center_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: center.name || 'Brahma Kumaris Center',
      nameMl: center.nameMl || '',
      area: center.area || 'Kozhikode',
      contactPerson: center.contactPerson || 'BK In-Charge',
      phone: center.phone || '',
      landline: center.landline || '',
      whatsapp: center.whatsapp || center.phone || '',
      address: center.address || '',
      mapsUrl: center.mapsUrl || '',
      description: center.description || '',
      timings: center.timings || 'Morning: 7:00 AM – 8:30 AM | Evening: 5:30 PM – 7:30 PM',
      isPrimary: Boolean(center.isPrimary),
      published: center.published !== false,
      image: center.image || 'assets/images/light_palace_center.jpg'
    };

    this.data.centers.push(newCenter);
    this.saveData();
    return newCenter;
  }

  deleteCenter(id) {
    if (!this.data.centers) return false;
    this.data.centers = this.data.centers.filter(c => c.id !== id);
    this.saveData();
    return true;
  }

  togglePublishCenter(id) {
    const center = this.getCenter(id);
    if (!center) return null;
    center.published = center.published === false;
    this.saveData();
    return center;
  }

  // --- YouTube Configured Channels ---
  getYouTubeChannels() {
    return this.data.youtubeChannels || DEFAULT_DATA.youtubeChannels;
  }

  getYouTubeChannel(id) {
    return (this.data.youtubeChannels || DEFAULT_DATA.youtubeChannels).find(c => c.id === id) || null;
  }

  updateYouTubeChannel(id, updates) {
    if (!this.data.youtubeChannels) {
      this.data.youtubeChannels = JSON.parse(JSON.stringify(DEFAULT_DATA.youtubeChannels));
    }
    const idx = this.data.youtubeChannels.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.youtubeChannels[idx] = {
        ...this.data.youtubeChannels[idx],
        ...updates
      };
      this.saveData();
      return this.data.youtubeChannels[idx];
    }
    return null;
  }

  saveYouTubeChannels(channels) {
    this.data.youtubeChannels = channels;
    this.saveData();
    return this.data.youtubeChannels;
  }

  // --- Course Modules ---
  getCourseModules() {
    return this.data.courseModules || [];
  }

  getCourseModule(day) {
    const d = parseInt(day, 10);
    return (this.data.courseModules || []).find(m => m.day === d) || null;
  }

  updateCourseModule(day, updatedFields) {
    const d = parseInt(day, 10);
    if (!this.data.courseModules) {
      this.data.courseModules = JSON.parse(JSON.stringify(DEFAULT_DATA.courseModules));
    }
    const idx = this.data.courseModules.findIndex(m => m.day === d);
    if (idx !== -1) {
      if (updatedFields.youtubeUrl !== undefined) {
        updatedFields.youtubeVideoId = extractYouTubeVideoId(updatedFields.youtubeUrl);
      }
      this.data.courseModules[idx] = {
        ...this.data.courseModules[idx],
        ...updatedFields
      };
      this.saveData();
      return this.data.courseModules[idx];
    }
    return null;
  }

  // --- Social Media Channels ---
  getSocialChannels() {
    return this.data.socialChannels || DEFAULT_DATA.socialChannels;
  }

  getSocialChannel(id) {
    return (this.data.socialChannels || DEFAULT_DATA.socialChannels).find(c => c.id === id) || null;
  }

  updateSocialChannel(id, updatedFields) {
    if (!this.data.socialChannels) {
      this.data.socialChannels = JSON.parse(JSON.stringify(DEFAULT_DATA.socialChannels));
    }
    const idx = this.data.socialChannels.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.socialChannels[idx] = {
        ...this.data.socialChannels[idx],
        ...updatedFields
      };
      this.saveData();
      return this.data.socialChannels[idx];
    }
    return null;
  }

  // --- Backup / Export / Reset ---
  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.settings && parsed.tabs) {
        this.data = parsed;
        this.saveData();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import parse error:', e);
      return false;
    }
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.saveData();
    return true;
  }

  // --- Admin Auth ---
  isAdminAuthenticated() {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  }

  authenticateAdmin(pin) {
    if (pin === this.data.settings.adminPin || pin === 'peace108') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  }

  logoutAdmin() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

// Global store instance
window.bkStore = new SiteStore();
