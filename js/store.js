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
    adminPin: "",
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
    { id: 'events', label: 'Events', icon: 'calendar', isCore: true, enabled: true, order: 8, type: 'system' },
    { id: 'navathi', label: 'Navathi', icon: 'award', isCore: true, enabled: true, order: 9, type: 'system' },
    { id: 'murali', label: 'Daily Murali', icon: 'sun', isCore: true, enabled: true, order: 10, type: 'system' },
    { id: 'contact', label: 'Contact Us', icon: 'mail', isCore: true, enabled: true, order: 11, type: 'system' }
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
      keyword: "Soul",
      title: "Soul Consciousness vs Body Consciousness",
      titleMl: "ഞാൻ ആരാണ്? ആത്മജ്ഞാനം",
      duration: "45 mins",
      youtubeUrl: "https://www.youtube.com/live/xeZ_HBW1mq4",
      youtubeVideoId: "xeZ_HBW1mq4",
      thumbnail: "",
      published: true,
      description: "Understand your true eternal identity as a sparkling point of divine spiritual light (Atma) situated at the center of the forehead, distinct from the physical body, temporary worldly labels, and physical senses.",
      summary: "Understand your true eternal identity as a sparkling point of divine spiritual light (Atma) situated at the center of the forehead, distinct from the physical body, temporary worldly labels, and physical senses.",
      keyInsight: "ഞാൻ ശാന്ത സ്വരൂപമായ അനശ്വര ആത്മാവാണ് (I am a peaceful, immortal soul). ശരീരം ഞാൻ ഉപയോഗിക്കുന്ന ഉപകരണം മാത്രമാണ്.",
      reflectionPrompt: "ഇന്ന് സ്വയം ഒരു ആത്മാവായി ദർശിക്കുകയും, മറ്റുള്ളവരെ ശരീരത്തിന് പകരം പവിത്രമായ ശാന്ത സ്വരൂപ ആത്മാക്കളായി കാണുകയും ചെയ്യുമ്പോൾ നിങ്ങളുടെ മനസ്സിലും ബന്ധങ്ങളിലും എന്ത് മാറ്റമാണ് അനുഭവപ്പെടുന്നത്?",
      quizQuestions: [
        {
          id: "d1_q1",
          question: "രാജയോഗ ധ്യാന പ്രകാരം ആത്മാവിന്റെ യഥാർത്ഥ സ്വരൂപവും ഗുണങ്ങളും എന്താണ്? (What is the true nature of the soul?)",
          options: [
            "ശരീരത്തോടൊപ്പം അവസാനിക്കുന്ന ജൈവ രാസവസ്തു (A mortal biochemical byproduct)",
            "ശാന്തി, സ്നേഹം, പവിത്രത എന്നീ സ്വഭാവിക ഗുണങ്ങളുള്ള ശാശ്വത ദിവ്യപ്രകാശ ബിന്ദു (An eternal conscious point of divine spiritual light)",
            "യാതൊരു ബോധവുമില്ലാത്ത ഒരു വൈകാരിക മായ (An emotional illusion)",
            "ഹൃദയത്തിൽ സ്ഥിതി ചെയ്യുന്ന ഒരു ഭൗതിക അവയവം (A physical organ)"
          ],
          correctIndex: 1,
          explanation: "ആത്മാവ് (ജ്യോതി ബിന്ദു) അനശ്വരമായ ദിവ്യപ്രകാശ ബിന്ദുവാണ്. ശാന്തി, സ്നേഹം, ആനന്ദം, പവിത്രത എന്നിവ ആത്മാവിന്റെ സ്വാഭാവിക ഗുണങ്ങളാണ്."
        },
        {
          id: "d1_q2",
          question: "മനുഷ്യശരീരത്തിൽ ആത്മാവിന്റെ ഇരിപ്പിടം എവിടെയാണ്? (Where is the physical seat of the soul?)",
          options: [
            "നട്ടെല്ലിന്റെ താഴത്തെ ഭാഗത്ത് (In the lower spinal cord)",
            "നെറ്റിയുടെ മധ്യത്തിൽ, പുരികങ്ങൾക്ക് ഇടയിൽ ഭ്രുകുടിയിൽ (In the center of the forehead, between the eyebrows)",
            "പേശികളിൽ എല്ലായിടത്തും ഒരുപോലെ (Distributed evenly in muscles)",
            "ശബ്ദപേടകത്തിൽ (Inside the vocal cords)"
          ],
          correctIndex: 1,
          explanation: "ഒരു ഡ്രൈവർ കാറിലിരുന്ന് വാഹനം നിയന്ത്രിക്കുന്നതുപോലെ, ആത്മാവ് ഭ്രുകുടിയിൽ (നെറ്റിയുടെ മധ്യത്തിൽ) ഇരുന്നാണ് മുഴുവൻ ശരീരത്തെയും ഇന്ദ്രിയങ്ങളെയും നിയന്ത്രിക്കുന്നത്."
        }
      ]
    },
    {
      day: 2,
      keyword: "Supreme Soul",
      title: "The Supreme Soul: God the Ocean of Peace",
      titleMl: "പരമാത്മാവ് - പരമപിതാവായ ശിവബാബ",
      duration: "45 mins",
      youtubeUrl: "https://www.youtube.com/live/YMXD1FmGleg",
      youtubeVideoId: "YMXD1FmGleg",
      thumbnail: "",
      published: true,
      description: "Discover the true form, supreme abode, and benevolent role of Shiv Baba, the incorporeal Supreme Father, Teacher, and Guide of all souls who never enters the bondage of birth, death, or karmic suffering.",
      summary: "Discover the true form, supreme abode, and benevolent role of Shiv Baba, the incorporeal Supreme Father, Teacher, and Guide of all souls who never enters the bondage of birth, death, or karmic suffering.",
      keyInsight: "ഭഗവാൻ അരൂപിയായ ജ്യോതിർബിന്ദുവാണ് (God is an incorporeal Point of Radiant Light), എല്ലാ ആത്മാക്കളുടെയും നിത്യ പിതാവും മാതാവും മാർഗ്ഗദർശിയുമാണ്.",
      reflectionPrompt: "ശാന്തമായി ഇരുന്ന് പരമപിതാവായ ശിവബാബയെ നിങ്ങളുടെ സ്നേഹനിധിയായ പിതാവായും മാതാവായും സുഹൃത്തായും സ്മരിക്കുക. നിങ്ങളുടെ മനസ്സിന് ലഭിച്ച സുരക്ഷിതത്വവും ദിവ്യശാന്തിയും കുറിക്കുക.",
      quizQuestions: [
        {
          id: "d2_q1",
          question: "രാജയോഗത്തിൽ പരമാത്മാവിന്റെ യഥാർത്ഥ നാമവും രൂപവും എന്താണ്? (What is the true name and form of the Supreme Soul?)",
          options: [
            "ആയുധങ്ങൾ ധരിച്ച ഭൗതിക ശരീരം (A physical form with weapons)",
            "'ശിവൻ' (പരമപിതാവ്) എന്ന നാമമുള്ള അരൂപിയായ പ്രകാശ ബിന്ദു (An incorporeal Point of Radiant Light named Shiva)",
            "യാതൊരു ഗുണങ്ങളുമില്ലാത്ത ശൂന്യത (An empty void)",
            "കല്ലിലും മൃഗങ്ങളിലും നിറഞ്ഞിരിക്കുന്ന ശക്തി (Omnipresent in matter)"
          ],
          correctIndex: 1,
          explanation: "പരമാത്മാവായ ശിവബാബ സദാ മുക്തനും സദാ പവിത്രനുമായ ജ്യോതിർബിന്ദുവാണ് (Ocean of Peace and Purity)."
        },
        {
          id: "d2_q2",
          question: "മനുഷ്യ ആത്മാക്കളും പരമാത്മാവും തമ്മിലുള്ള പ്രധാന വ്യത്യാസം എന്താണ്? (How does the Supreme Soul differ from human souls?)",
          options: [
            "പരമാത്മാവിന് എപ്പോഴും മാറുന്ന ഭൗതിക ശരീരമുണ്ട് (He has a changing physical body)",
            "സദാ ശിവൻ (നിത്യ പവിത്രൻ), ഒരിക്കലും ശരീരത്തിൽ ജനിക്കുകയോ കർമ്മബന്ധനത്തിലോ ദുഃഖത്തിലോ വീഴുകയോ ചെയ്യുന്നില്ല (Sada-Shiva: ever-liberated, never enters the cycle of birth and sorrow)",
            "കലിയുഗത്തിൽ ഭഗവാൻ സ്വന്തം ജ്ഞാനം മറന്നുപോകുന്നു (He forgets His knowledge)",
            "മനുഷ്യ ആത്മാക്കളും പരമാത്മാവും തമ്മിൽ യാതൊരു വ്യത്യാസവുമില്ല (No difference)"
          ],
          correctIndex: 1,
          explanation: "മനുഷ്യ ആത്മാക്കൾ ശരീരമെടുത്ത് ജനന-മരണ ചക്രത്തിലൂടെ കടന്നുപോകുന്നു; എന്നാൽ പരമാത്മാവ് സദാ മുക്തനും ശാന്തിയുടെ അനന്ത സാഗരവുമായി നിലകൊള്ളുന്നു."
        }
      ]
    },
    {
      day: 3,
      keyword: "Three Worlds",
      title: "The Three Worlds & Paramdham (Soul World)",
      titleMl: "ത്രിമൂർത്തി ലോകങ്ങളും പരന്ധാമവും",
      duration: "50 mins",
      youtubeUrl: "https://youtu.be/s_pvQAkXVe8",
      youtubeVideoId: "s_pvQAkXVe8",
      thumbnail: "",
      published: true,
      description: "Explore the geography of existence: the Corporeal World (matter and sound), the Subtle Angelic World (Vyakta Watan of pure thoughts and light), and Paramdham (Shantidham / Nirvana), the silent golden-red abode of souls.",
      summary: "Explore the geography of existence: the Corporeal World (matter and sound), the Subtle Angelic World (Vyakta Watan of pure thoughts and light), and Paramdham (Shantidham / Nirvana), the silent golden-red abode of souls.",
      keyInsight: "പരന്ധാമം നമ്മുടെ നിത്യ ശാന്തിയുടെ ഭവനമാണ്. ലോകനാടക വേദിയിലേക്ക് വരുന്നതിന് മുൻപ് എല്ലാ ആത്മാക്കളും അവിടെയാണ് പരമശാന്തിയിൽ വിശ്രമിക്കുന്നത്.",
      reflectionPrompt: "കണ്ണുകൾ അടച്ച് ഭൗതിക ലോകത്തിന് മുകളിലേക്ക് പറന്ന് പരന്ധാമത്തിലെ മനോഹരമായ ശാന്തി സാഗരത്തിൽ ലയിക്കുന്നതായി സങ്കൽപ്പിക്കുക. നിങ്ങളുടെ ഉള്ളിൽ തോന്നുന്ന നിശബ്ദത എന്താണ്?",
      quizQuestions: [
        {
          id: "d3_q1",
          question: "പരന്ധാമം (ശാന്തിധാമം / മുക്തിധാമം) എന്നാൽ എന്താണ്? (What is Paramdham?)",
          options: [
            "മറ്റ് സൗരയൂഥത്തിലെ ഒരു ഭൗതിക ഗ്രഹം (A distant physical planet)",
            "ശബ്ദത്തിനും ദ്രവ്യത്തിനും അതീതമായ, സുവർണ്ണ-ചുവപ്പ് ദിവ്യ പ്രകാശത്താൽ നിറഞ്ഞ ആത്മാക്കളുടെ ശാശ്വത ഭവനം (The supreme silent realm of golden-red light, eternal home of all souls)",
            "ഭൂമിയുടെ അന്തരീക്ഷത്തിലെ മേഘക്കൂട്ടം (Clouds in earth's atmosphere)",
            "വലിയ പർവതങ്ങളിലെ ഗുഹ (A cave in high mountains)"
          ],
          correctIndex: 1,
          explanation: "പരന്ധാമം (മുക്തിധാമം) ബ്രഹ്മതത്വം നിറഞ്ഞ നിത്യശാന്തിയുടെ ലോകമാണ്. അവിടെ ഭൗതിക ദ്രവ്യമോ ശബ്ദമോ ദുഃഖമോ ഇല്ല."
        },
        {
          id: "d3_q2",
          question: "സൂക്ഷ്മ വതനത്തിന്റെ (സൂക്ഷ്മ ലോകത്തിന്റെ) പ്രത്യേകത എന്താണ്? (What characterizes the Subtle World?)",
          options: [
            "ഭാരമുള്ള മണ്ണും ഭൗതിക ശരീരങ്ങളും (Heavy matter and biological bodies)",
            "പ്രകാശമയമായ ദിവ്യ രൂപങ്ങൾ, ശുദ്ധമായ സങ്കൽപ്പങ്ങളിലൂടെയുള്ള ആശയവിനിമയം (Angelic light forms and pure thought communication)",
            "കത്തുന്ന തീയും കൊടുങ്കാറ്റും (Intense heat and burning storms)",
            "ആഴത്തിലുള്ള സമുദ്ര തരംഗങ്ങൾ (Deep ocean waves)"
          ],
          correctIndex: 1,
          explanation: "സ്ഥൂല ലോകത്തിനും പരന്ധാമത്തിനും ഇടയിലുള്ള പ്രകാശ ലോകമാണ് സൂക്ഷ്മ വതനം. അവിടെ ഫരിഷ്തകൾ ദിവ്യ പ്രകാശ രൂപത്തിൽ സഞ്ചരിക്കുന്നു."
        }
      ]
    },
    {
      day: 4,
      keyword: "Karma Law",
      title: "The Infallible Law of Karma & Destiny",
      titleMl: "കർമ്മ സിദ്ധാന്തം - കർമ്മത്തിന്റെ നിയമം",
      duration: "50 mins",
      youtubeUrl: "https://youtu.be/bRbhufP2LP8",
      youtubeVideoId: "bRbhufP2LP8",
      thumbnail: "",
      published: true,
      description: "Unveil the universal mechanics of cause and effect. Every thought, intention, and action plants an energetic seed that unfailingly yields its harvest to the performer.",
      summary: "Unveil the universal mechanics of cause and effect. Every thought, intention, and action plants an energetic seed that unfailingly yields its harvest to the performer.",
      keyInsight: "നാം വിതയ്ക്കുന്നത് തന്നെ കൊയ്യുന്നു. ആത്മീയ ബോധത്തോടെയുള്ള ശ്രേഷ്ഠ കർമ്മങ്ങളിലൂടെ ഉജ്ജ്വലമായ ഭാഗ്യം സൃഷ്ടിക്കാം.",
      reflectionPrompt: "ഈയടുത്ത് നിങ്ങളിൽ ഉണ്ടായ ഒരു അസ്വസ്ഥതയോ പ്രതികരണമോ ഓർക്കുക. ആ സാഹചര്യത്തിൽ ക്ഷമയോടും ആത്മീയ വിവേകത്തോടും കൂടി എങ്ങനെ പ്രതികരിക്കാൻ ഇന്ന് നിങ്ങൾക്ക് സാധിക്കും?",
      quizQuestions: [
        {
          id: "d4_q1",
          question: "കർമ്മ നിയമമനുസരിച്ച് നമ്മുടെ സന്തോഷങ്ങൾക്കും ദുഃഖങ്ങൾക്കും വിധിക്കും കാരണം ആരാണ്? (Who creates our destiny according to Karma Law?)",
          options: [
            "ഗ്രഹങ്ങളുടെ സ്ഥാനങ്ങളും അന്ധമായ ഭാഗ്യക്കേടും (Planets and blind luck)",
            "നമ്മെ വേദനിപ്പിക്കുന്ന ചുറ്റുമുള്ള മറ്റ് ആളുകൾ (Other people around us)",
            "നമ്മുടെ സ്വന്തം ചിന്തകളും സങ്കൽപ്പങ്ങളും വാക്കുകളും മുൻകാല കർമ്മങ്ങളും (Our own thoughts, intentions, words, and actions)",
            "ദൈവം ചിലർക്ക് ദുരിതവും ചിലർക്ക് സമ്പത്തും സ്വയം നൽകുന്നു (God decides arbitrarily)"
          ],
          correctIndex: 2,
          explanation: "കർമ്മ നിയമം സമ്പൂർണ്ണവും നീതിപൂർവ്വവുമാണ്. നമ്മുടെ ചിന്തകളുടെയും തിരഞ്ഞെടുപ്പുകളുടെയും ഫലമായാണ് നാം ഭാഗ്യം നിർമ്മിക്കുന്നത്."
        },
        {
          id: "d4_q2",
          question: "മുൻകാലങ്ങളിലെ തെറ്റായ കർമ്മങ്ങളുടെ ഫലവും സംസ്കാരങ്ങളും എങ്ങനെ ശുദ്ധീകരിക്കാം? (How to purify past negative karmas?)",
          options: [
            "മറ്റുള്ളവരെ പഴിചാരി സങ്കടപ്പെട്ടുകൊണ്ട് (Blaming others and feeling helpless)",
            "പരമാത്മാവുമായുള്ള സ്നേഹപൂർണ്ണമായ യോഗത്തിലൂടെയും (യോഗാഗ്നി) നിസ്വാർത്ഥമായ ശ്രേഷ്ഠ കർമ്മങ്ങളിലൂടെയും (Through communion with the Supreme Soul and elevated selfless actions)",
            "ഉള്ളിൽ മാറ്റമില്ലാതെ ബാഹ്യ ചടങ്ങുകൾ മാത്രം നടത്തി (Outer rituals without inner purity)",
            "കർമ്മക്കണക്കുകൾ മാറ്റാൻ ഒരിക്കലും സാധ്യമല്ല (Impossible to change)"
          ],
          correctIndex: 1,
          explanation: "പരമാത്മാവിന്റെ സ്നേഹപൂർണ്ണമായ ഓർമ്മ (യോഗാഗ്നി) മുൻകാല പാപങ്ങളെ ദഹിപ്പിച്ച് ആത്മാവിനെ പരിശുദ്ധമാക്കുന്നു."
        }
      ]
    },
    {
      day: 5,
      keyword: "8 Powers",
      title: "The 8 Spiritual Powers of Raja Yoga",
      titleMl: "രാജയോഗത്തിന്റെ 8 ആത്മീയ ശക്തികൾ",
      duration: "45 mins",
      youtubeUrl: "https://youtu.be/kmVjGkJjxUY",
      youtubeVideoId: "kmVjGkJjxUY",
      thumbnail: "",
      published: true,
      description: "Master the eight practical spiritual powers: Withdrawing, Packing Up, Tolerating, Accommodating, Discerning, Judging, Facing, and Cooperating to remain stable in all life situations.",
      summary: "Master the eight practical spiritual powers: Withdrawing, Packing Up, Tolerating, Accommodating, Discerning, Judging, Facing, and Cooperating to remain stable in all life situations.",
      keyInsight: "ആത്മീയ ശക്തികൾ ദൈനംദിന ജീവിതത്തിൽ സമ്മർദ്ദവും ഭയവും ഇല്ലാതെ മനസ്സിന് അചഞ്ചലമായ ശാന്തി നൽകുന്നു.",
      reflectionPrompt: "രാജയോഗത്തിന്റെ 8 ശക്തികളിൽ (സങ്കോച ശക്തി, സഹന ശക്തി, ഉൾക്കൊള്ളാനുള്ള ശക്തി, നിർണ്ണയ ശക്തി തുടങ്ങിയവ) ഇപ്പോൾ നിങ്ങളുടെ ജീവിതത്തിൽ ഏറ്റവും ആവശ്യമുള്ളത് ഏതാണ്? അത് എങ്ങനെ പ്രാവർത്തികമാക്കും?",
      quizQuestions: [
        {
          id: "d5_q1",
          question: "ഒരു ആമ സ്വന്തം അവയവങ്ങൾ ഉള്ളിലേക്ക് വലിക്കുന്നതുപോലെ, ബാഹ്യ വിക്ഷോഭങ്ങളിൽ നിന്ന് മനസ്സിനെ നിമിഷനേരം കൊണ്ട് മാറ്റിവെക്കാൻ സഹായിക്കുന്ന ശക്തി ഏതാണ്? (Which power helps withdraw the mind like a tortoise?)",
          options: [
            "നേരിടാനുള്ള ശക്തി (Power to Face)",
            "സങ്കോച ശക്തി / പിൻവലിയാനുള്ള ശക്തി (Power to Withdraw / Sametna)",
            "തിരിച്ചറിയാനുള്ള ശക്തി (Power to Discern)",
            "തീരുമാനമെടുക്കാനുള്ള ശക്തി (Power to Judge)"
          ],
          correctIndex: 1,
          explanation: "സങ്കോച ശക്തിയിലൂടെ (Power to Withdraw) ഒരാൾക്ക് ബാഹ്യമായ ശബ്ദങ്ങളിൽ നിന്നും സമ്മർദ്ദങ്ങളിൽ നിന്നും ഉടൻ ശാന്തമായ ആത്മീയ ബോധത്തിലേക്ക് പിൻവലിയാൻ സാധിക്കുന്നു."
        },
        {
          id: "d5_q2",
          question: "ദൈനംദിന ബന്ധങ്ങളിൽ 'ഉൾക്കൊള്ളാനുള്ള ശക്തി' (Power to Accommodate) എന്നാൽ എന്താണ്? (What is the Power to Accommodate?)",
          options: [
            "എല്ലാവരെയും നമ്മുടെ ഇഷ്ടത്തിനനുസരിച്ച് മാറ്റാൻ നിർബന്ധിക്കുക (Forcing everyone else)",
            "ഒരു സമുദ്രം എല്ലാ നദികളെയും സ്വീകരിക്കുന്നതുപോലെ, മറ്റുള്ളവരുടെ സ്വഭാവ വൈവിധ്യങ്ങളെ ഉൾക്കൊണ്ട് ശാന്തത കാത്തുസൂക്ഷിക്കുക (Accepting differing personalities like an ocean without losing serenity)",
            "ഭയം കാരണം തെറ്റുകൾക്ക് വഴങ്ങുക (Weak surrender)",
            "സമൂഹത്തിൽ ആരോടും ഇടപഴകാതിരിക്കുക (Avoiding everyone)"
          ],
          correctIndex: 1,
          explanation: "സമുദ്രം നദികളുടെ കുറവുകൾ നോക്കാതെ തന്നിലേക്ക് ഉൾക്കൊള്ളുന്നതുപോലെ, ഈ ശക്തി മറ്റുള്ളവരുടെ കുറവുകൾ സഹിച്ച് ദിവ്യ സ്നേഹം പകരാൻ സഹായിക്കുന്നു."
        }
      ]
    },
    {
      day: 6,
      keyword: "World Drama",
      title: "The World Drama Cycle & Tree of Humanity",
      titleMl: "സൃഷ്ടി ചക്രവും മനുഷ്യ കുടുംബ വൃക്ഷവും",
      duration: "55 mins",
      youtubeUrl: "https://youtu.be/xYBiS4eQrUs",
      youtubeVideoId: "xYBiS4eQrUs",
      thumbnail: "",
      published: true,
      description: "Understand the eternal 5,000-year cycle of human civilization comprising four equal ages (Golden, Silver, Copper, Iron) and the auspicious Confluence Age (Sangam Yuga) of spiritual renewal.",
      summary: "Understand the eternal 5,000-year cycle of human civilization comprising four equal ages (Golden, Silver, Copper, Iron) and the auspicious Confluence Age (Sangam Yuga) of spiritual renewal.",
      keyInsight: "ഈ ലോകനാടകത്തിലെ ഓരോ രംഗവും കല്യാണകാരിയാണ് (benevolent). നാം ശാശ്വത ആത്മീയ അഭിനേതാക്കളാണ്.",
      reflectionPrompt: "നിങ്ങൾ ഈ പ്രപഞ്ച നാടക വേദിയിലെ അമരനായ ഒരു ആത്മീയ നടനാണെന്ന തിരിച്ചറിവ് നിങ്ങളുടെ ജീവിതത്തിലെ ഭയങ്ങളും ഉത്കണ്ഠകളും അകറ്റാൻ എങ്ങനെ സഹായിക്കുന്നു?",
      quizQuestions: [
        {
          id: "d6_q1",
          question: "രാജയോഗ ജ്ഞാനപ്രകാരം ലോക നാടക ചക്രത്തിന്റെ (World Drama Cycle) കാലയളവും ഘടനയും എന്താണ്? (What is the duration of the World Drama Cycle?)",
          options: [
            "ലക്ഷക്കണക്കിന് വർഷങ്ങളുടെ ക്രമരഹിതമായ കാലം (Millions of random years)",
            "5,000 വർഷം നീളുന്ന, 4 തുല്യ യുഗങ്ങളും സംഗമയുഗവും അടങ്ങിയ നിത്യ ആവർത്തന ചക്രം (An eternal 5,000-year cycle of 4 equal eras plus the Confluence Age)",
            "വെറും 100 വർഷം മാത്രം (Just 100 years)",
            "ഒരു കോടി വർഷങ്ങൾ (10 million years)"
          ],
          correctIndex: 1,
          explanation: "ലോകനാടകം കൃത്യമായി 5000 വർഷങ്ങളിൽ ആവർത്തിക്കുന്നു (സത്യയുഗം, ത്രേതായുഗം, ദ്വാപരയുഗം, കലിയുഗം - ഓരോന്നും 1250 വർഷങ്ങൾ വീതം)."
        },
        {
          id: "d6_q2",
          question: "സംഗമയുഗത്തിന്റെ (Confluence Age) സവിശേഷതയും പ്രാധാന്യവും എന്താണ്? (What is the significance of the Confluence Age?)",
          options: [
            "എല്ലാം നശിച്ചുപോകുന്ന പ്രതീക്ഷയില്ലാത്ത ഇരുണ്ട കാലം (Hopeless destruction)",
            "പരമാത്മാവ് ഭൂമിയിൽ അവതരിച്ച് കലിയുഗ ഇരുട്ടിൽ നിന്ന് മനുഷ്യരെ സത്യയുഗ പ്രകാശത്തിലേക്ക് നയിക്കുന്ന അമൃത കാലം (The auspicious transition dawn when God descends to rejuvenate souls)",
            "ആത്മാക്കൾ സദാ ഉറങ്ങുന്ന കാലം (Eternal slumber)",
            "ആത്മീയ അറിവില്ലാത്ത കാലം (Era without spiritual study)"
          ],
          correctIndex: 1,
          explanation: "സംഗമയുഗം രാത്രിയും പുലർച്ചയും ചേരുന്ന പ്രഭാതമാണ്; പരമപിതാവ് ശിവബാബ സ്വയം രാജയോഗ ജ്ഞാനം പകർന്ന് മനുഷ്യരെ ദേവതുല്യരാക്കുന്ന പുണ്യകാലം."
        }
      ]
    },
    {
      day: 7,
      keyword: "Pure Living",
      title: "Rajyoga in Practical Daily Life & Pure Living",
      titleMl: "നിത്യജീവിതത്തിൽ രാജയോഗവും സാത്വിക ജീവിതരീതിയും",
      duration: "60 mins",
      youtubeUrl: "https://youtu.be/gKTyHX3YuTQ",
      youtubeVideoId: "gKTyHX3YuTQ",
      thumbnail: "",
      published: true,
      description: "Integrate Raja Yoga into modern everyday living: early morning Amritvela meditation, pure Satvik diet, spiritual study (Murli), positive associations, and hourly Traffic Control pauses.",
      summary: "Integrate Raja Yoga into modern everyday living: early morning Amritvela meditation, pure Satvik diet, spiritual study (Murli), positive associations, and hourly Traffic Control pauses.",
      keyInsight: "സാത്വിക ഭക്ഷണവും, ഈശ്വര സ്മരണയും, അമൃതവേള ധ്യാനവും മനസ്സിനെ സദാ സമാധാനത്തിന്റെ തടാകമാക്കി മാറ്റുന്നു.",
      reflectionPrompt: "ശാന്തവും സന്തുഷ്ടവുമായ ജീവിതത്തിനായി ഇന്ന് മുതൽ നിങ്ങളുടെ ജീവിതചര്യയിൽ ഉൾപ്പെടുത്താൻ ആഗ്രഹിക്കുന്ന ഒരു സാത്വിക ശീലം (ഉദാ: അമൃതവേള, ട്രാഫിക് കൺട്രോൾ, സാത്വിക ഭക്ഷണം) എന്താണ്?",
      quizQuestions: [
        {
          id: "d7_q1",
          question: "ഒരു രാജയോഗ അഭ്യാസിയുടെ ദിനചര്യയിലെ 'അമൃതവേള' (Amritvela) എന്നാൽ എന്താണ്? (What is Amritvela in Rajyoga meditation?)",
          options: [
            "രാത്രി വൈകിയുള്ള വിനോദ സമയം (Late night entertainment)",
            "പുലർച്ചെ 4 മണിക്ക് ശാന്തതയിൽ പരമാത്മാവുമായി ധ്യാനത്തിൽ ഒന്നാകുന്ന അമൃത സമയം (The ambrosial early morning hours around 4:00 AM dedicated to quiet meditation)",
            "ഉച്ചയുറക്ക സമയം (Afternoon nap)",
            "വൈകുന്നേരത്തെ സന്ധ്യാ സമയം (Evening twilight)"
          ],
          correctIndex: 1,
          explanation: "പുലർച്ചെയുള്ള അമൃതവേള പ്രകൃതി ഏറ്റവും നിശ്ശബ്ദവും പരിശുദ്ധവുമായ സമയമാണ്; പരമാത്മാവിൽ നിന്ന് ദിവ്യശക്തികൾ സ്വീകരിക്കാൻ ഏറ്റവും ഉത്തമം."
        },
        {
          id: "d7_q2",
          question: "ദൈനംദിന ജീവിതത്തിലെ 'ട്രാഫിക് കൺട്രോൾ' (Traffic Control) കൊണ്ട് അർത്ഥമാക്കുന്നത് എന്താണ്? (What is Traffic Control pause in daily routine?)",
          options: [
            "റോഡിലെ ട്രാഫിക് നിയന്ത്രിക്കൽ (Traffic control on roads)",
            "പകൽസമയത്ത് 1-2 മണിക്കൂർ കൂടുമ്പോൾ 1 മിനിറ്റ് മനസ്സിന്റെ ചിന്തകളെ നിർത്തി ആത്മീയ ശാന്തി അനുഭവിക്കൽ (Short 1-minute mindful pauses throughout the day to stop wasteful thoughts)",
            "ദിവസേനയുള്ള പണച്ചെലവ് കുറയ്ക്കൽ (Expense management)",
            "പത്രവായന നടത്തൽ (Reading newspapers)"
          ],
          correctIndex: 1,
          explanation: "ട്രാഫിക് കൺട്രോൾ എന്നത് ദിവസവും ഇടയ്ക്കിടെ മനസ്സിനെ ഒരു നിമിഷം ശാന്തമാക്കി വീണ്ടും കർമ്മത്തിലേക്ക് ഇറങ്ങുന്ന വിശിഷ്ട പരിശീലനമാണ്."
        }
      ]
    }
  ],

  centers: [
    {
      id: 'kozhikode-main',
      name: "Kozhikode Main",
      nameMl: "കോഴിക്കോട് മെയിൻ (ലൈറ്റ് പാലസ്)",
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
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Ashokapuram+Kozhikode",
      isPrimary: true,
      isMain: true,
      published: true,
      image: "assets/images/light_palace_center.jpg"
    },
    {
      id: 'ashokapuram',
      name: "Ashokapuram",
      nameMl: "ലൈറ്റ് പാലസ്, അശോകാപുരം",
      area: "Ashokapuram, Kozhikode",
      contactPerson: "BK Sister Sunanda",
      phone: "+91 9746334202",
      whatsapp: "+91 9746334202",
      landline: "0495-2770568",
      address: "Balan K Nair Road, Ashokapuram, Kozhikode - 673006",
      landmark: "Balan K Nair Road",
      phones: ["0495-2770568", "+91 9746334202"],
      incharge: "BK Sister Sunanda",
      morningTimings: "6:30 AM – 9:00 AM",
      eveningTimings: "5:00 PM – 8:00 PM",
      timings: "Morning: 6:30 AM – 9:00 AM | Evening: 5:00 PM – 8:00 PM",
      facilities: ["Spiritual Library", "Meditation Sanctuary"],
      description: "Ashokapuram spiritual center and meditation hall.",
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Ashokapuram+Kozhikode",
      isPrimary: false,
      published: true,
      image: "assets/images/light_palace_center.jpg"
    },
    {
      id: 'feroke',
      name: "Feroke",
      nameMl: "ഫറോക്ക് ശാഖാ കേന്ദ്രം",
      area: "Feroke, Kozhikode",
      contactPerson: "BK Brother Rajesh",
      phone: "+91 9447123890",
      whatsapp: "+91 9447123890",
      landline: "",
      address: "Brahma Kumaris Center, Near Old Bridge, Feroke, Kozhikode - 673631",
      landmark: "Near Feroke Old Bridge",
      phones: ["+91 9447123890"],
      incharge: "BK Brother Rajesh",
      morningTimings: "7:00 AM – 8:30 AM",
      eveningTimings: "5:30 PM – 7:30 PM",
      timings: "Morning: 7:00 AM – 8:30 AM | Evening: 5:30 PM – 7:30 PM",
      facilities: ["Meditation Hall", "Youth Rajyoga Classes", "Spiritual Counseling"],
      description: "Community Rajayoga meditation center serving Feroke and South Kozhikode.",
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Feroke",
      isPrimary: false,
      published: true,
      image: "assets/images/meditation_hall.jpg"
    },
    {
      id: 'vadakara',
      name: "Vadakara",
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
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Vadakara",
      isPrimary: false,
      published: true,
      image: "assets/images/rajyoga_peace.jpg"
    },
    {
      id: 'westhill',
      name: "West Hill",
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
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+West+Hill+Kozhikode",
      isPrimary: false,
      published: true,
      image: "assets/images/meditation_hall.jpg"
    },
    {
      id: 'balussery',
      name: "Balussery",
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
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Balussery+Kozhikode",
      isPrimary: false,
      published: true,
      image: "assets/images/light_palace_center.jpg"
    },
    {
      id: 'koyilandy',
      name: "Koyilandy",
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
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Koyilandy",
      isPrimary: false,
      published: true,
      image: "assets/images/meditation_hall.jpg"
    },
    {
      id: 'chevayoor',
      name: "Chevayoor",
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
      mapsUrl: "https://maps.google.com/?q=Brahma+Kumaris+Chevayoor+Kozhikode",
      isPrimary: false,
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
      id: "evt-navathi-kozhikode-2026",
      title: "90th Navathi Celebrations: Grand Spiritual Conclave & Peace Gathering",
      titleMl: "ബ്രഹ്മാകുമാരീസ് 90-ാം നവതി ആത്മീയ മഹാസമ്മേളനം",
      date: "2026-10-15",
      year: "2026",
      centre: "Kozhikode Main",
      category: "Festivals",
      isNavathi: true,
      coverImage: "assets/images/light_palace_center.jpg",
      photos: [
        "assets/images/meditation_hall.jpg",
        "assets/images/paramdham_sunset.jpg",
        "assets/images/rajyoga_peace.jpg"
      ],
      youtubeUrl: "https://www.youtube.com/live/xeZ_HBW1mq4",
      description: "Commemorating 90 glorious years of Brahma Kumaris (1936-2026) dedicated to world renewal, spiritual enlightenment of women, and global harmony. Features divine flag unfurling, amritvela mass meditation, and special address by senior Rajyogis.",
      image: "assets/images/light_palace_center.jpg",
      additionalImages: [
        "assets/images/meditation_hall.jpg",
        "assets/images/paramdham_sunset.jpg",
        "assets/images/rajyoga_peace.jpg"
      ],
      videoUrl: "https://www.youtube.com/live/xeZ_HBW1mq4",
      location: "Kozhikode Main",
      shortDesc: "A momentous milestone commemorating 90 years of world renewal, values education, and soul consciousness.",
      fullDesc: "Commemorating 90 glorious years of Brahma Kumaris (1936-2026) dedicated to world renewal, spiritual enlightenment of women, and global harmony. Features divine flag unfurling, amritvela mass meditation, and special address by senior Rajyogis.",
      time: "9:30 AM - 1:00 PM",
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
      id: "evt-navathi-feroke-2026",
      title: "Navathi 90: Harmony & Stress-Free Youth Leadership Summit",
      titleMl: "നവതി യുവ നേതൃത്വ ശിൽപശാല",
      date: "2026-08-22",
      year: "2026",
      centre: "Feroke",
      category: "Youth Program",
      isNavathi: true,
      coverImage: "assets/images/meditation_hall.jpg",
      photos: [
        "assets/images/rajyoga_peace.jpg",
        "assets/images/light_palace_center.jpg"
      ],
      youtubeUrl: "https://www.youtube.com/live/YMXD1FmGleg",
      description: "Special youth convention organized as part of the 90th Navathi celebrations, inspiring students and young professionals towards emotional resilience, concentration, and ethical living.",
      image: "assets/images/meditation_hall.jpg",
      additionalImages: [
        "assets/images/rajyoga_peace.jpg",
        "assets/images/light_palace_center.jpg"
      ],
      videoUrl: "https://www.youtube.com/live/YMXD1FmGleg",
      location: "Feroke",
      shortDesc: "Special youth convention organized as part of the 90th Navathi celebrations.",
      fullDesc: "Special youth convention organized as part of the 90th Navathi celebrations, inspiring students and young professionals towards emotional resilience, concentration, and ethical living.",
      time: "10:00 AM - 2:00 PM",
      schedule: [
        { time: "10:00 AM", session: "Mind Power & Memory Dynamics" },
        { time: "11:30 AM", session: "Peer Pressure & Habits Overcoming" },
        { time: "01:00 PM", session: "Interactive Youth Forum" }
      ],
      isFeatured: false,
      status: "published",
      order: 2,
      createdAt: "2026-08-18"
    },
    {
      id: "evt-navathi-vadakara-2025",
      title: "Navathi Milestones: Value Education & Meditation Camp",
      titleMl: "നവതി മൂല്യവിദ്യാഭ്യാസ മെഡിറ്റേഷൻ ക്യാമ്പ്",
      date: "2025-11-18",
      year: "2025",
      centre: "Vadakara",
      category: "Rajayoga Shivir",
      isNavathi: true,
      coverImage: "assets/images/paramdham_sunset.jpg",
      photos: [
        "assets/images/meditation_hall.jpg",
        "assets/images/rajyoga_peace.jpg"
      ],
      youtubeUrl: "https://www.youtube.com/watch?v=1zxJA_XoEog",
      description: "A divine 3-day Rajayoga meditation shivir heralding the 90th year anniversary, guiding families through self-empowerment and soul consciousness.",
      image: "assets/images/paramdham_sunset.jpg",
      additionalImages: [
        "assets/images/meditation_hall.jpg",
        "assets/images/rajyoga_peace.jpg"
      ],
      videoUrl: "https://www.youtube.com/watch?v=1zxJA_XoEog",
      location: "Vadakara",
      shortDesc: "A divine Rajayoga meditation shivir heralding the 90th year anniversary.",
      fullDesc: "A divine 3-day Rajayoga meditation shivir heralding the 90th year anniversary, guiding families through self-empowerment and soul consciousness.",
      time: "6:00 PM - 8:00 PM",
      schedule: [
        { time: "06:00 PM", session: "Understanding True Identity of the Soul" },
        { time: "07:00 PM", session: "Connecting with the Supreme Ocean of Peace" }
      ],
      isFeatured: false,
      status: "published",
      order: 3,
      createdAt: "2025-11-01"
    },
    {
      id: "evt-shivarathri-ashokapuram-2026",
      title: "Maha Shivratri Spiritual Festival & 12 Jyotirlingam Darshan",
      titleMl: "മഹാശിവരാത്രി ആത്മീയോത്സവവും ജ്യോതിർലിംഗ ദർശനവും",
      date: "2026-03-08",
      year: "2026",
      centre: "Ashokapuram",
      category: "Festivals",
      isNavathi: false,
      coverImage: "assets/images/paramdham_sunset.jpg",
      photos: [
        "assets/images/light_palace_center.jpg",
        "assets/images/meditation_hall.jpg"
      ],
      youtubeUrl: "https://www.youtube.com/watch?v=1zxJA_XoEog",
      description: "Experience the profound spiritual significance of Shivratri with 3D Jyotirlingam darshan, flag unfurling, and continuous 24-hour peace meditation.",
      image: "assets/images/paramdham_sunset.jpg",
      additionalImages: [
        "assets/images/light_palace_center.jpg",
        "assets/images/meditation_hall.jpg"
      ],
      videoUrl: "https://www.youtube.com/watch?v=1zxJA_XoEog",
      location: "Ashokapuram",
      shortDesc: "Experience the profound spiritual significance of Shivratri with 3D Jyotirlingam darshan.",
      fullDesc: "Maha Shivratri marks the divine descent of Incorporeal Supreme Soul Shiva. Features flag unfurling, 3D spiritual cave darshan, and sacred pledge for purity.",
      time: "8:00 AM - 9:00 PM",
      schedule: [
        { time: "08:00 AM", session: "Sacred Shiva Dhwaj Flag Hoisting" },
        { time: "10:00 AM", session: "Spiritual Discourse: The Secret of Shivratri" },
        { time: "07:00 PM", session: "Maha Deepotsav & 108 Light Darshan" }
      ],
      isFeatured: true,
      status: "published",
      order: 4,
      createdAt: "2026-03-01"
    },
    {
      id: "evt-wellness-kozhikode-2026",
      title: "De-Addiction & Mind Wellness Campaign for Community Health",
      titleMl: "ലഹരിവിമുക്ത ആരോഗ്യ ബോധവൽക്കരണ പരിപാടി",
      date: "2026-05-14",
      year: "2026",
      centre: "Kozhikode Main",
      category: "Social Service",
      isNavathi: false,
      coverImage: "assets/images/rajyoga_peace.jpg",
      photos: [
        "assets/images/meditation_hall.jpg"
      ],
      youtubeUrl: "",
      description: "Community outreach initiative offering free health checkups, subconscious mind empowerment, and lifestyle coaching for tobacco and stress de-addiction.",
      image: "assets/images/rajyoga_peace.jpg",
      additionalImages: [
        "assets/images/meditation_hall.jpg"
      ],
      videoUrl: "",
      location: "Kozhikode Main",
      shortDesc: "Community outreach initiative offering subconscious mind empowerment and lifestyle coaching.",
      fullDesc: "Community outreach initiative offering free health checkups, subconscious mind empowerment, and lifestyle coaching for tobacco and stress de-addiction.",
      time: "10:00 AM - 1:00 PM",
      schedule: [
        { time: "10:00 AM", session: "Medical Doctors Panel Presentation" },
        { time: "11:30 AM", session: "Subconscious Reprogramming Meditation" }
      ],
      isFeatured: false,
      status: "published",
      order: 5,
      createdAt: "2026-05-01"
    },
    {
      id: "evt-shivir-balussery-2025",
      title: "Raja Yoga Deep Meditation Shivir for Inner Peace",
      titleMl: "രാജയോഗ ആഴത്തിലുള്ള ധ്യാന ശിബിരം",
      date: "2025-09-10",
      year: "2025",
      centre: "Balussery",
      category: "Rajayoga Shivir",
      isNavathi: false,
      coverImage: "assets/images/light_palace_center.jpg",
      photos: [
        "assets/images/paramdham_sunset.jpg"
      ],
      youtubeUrl: "",
      description: "Comprehensive 7-day experiential retreat on mind mastery, karmic philosophy, and experiencing God's supreme unconditional love.",
      image: "assets/images/light_palace_center.jpg",
      additionalImages: [
        "assets/images/paramdham_sunset.jpg"
      ],
      videoUrl: "",
      location: "Balussery",
      shortDesc: "Comprehensive 7-day experiential retreat on mind mastery and karmic philosophy.",
      fullDesc: "Comprehensive 7-day experiential retreat on mind mastery, karmic philosophy, and experiencing God's supreme unconditional love.",
      time: "6:30 AM - 8:00 AM",
      schedule: [
        { time: "06:30 AM", session: "Morning Amritvela Meditation" },
        { time: "07:15 AM", session: "Wisdom of Raja Yoga Philosophy" }
      ],
      isFeatured: false,
      status: "published",
      order: 6,
      createdAt: "2025-09-01"
    },
    {
      id: "evt-navathi-koyilandy-2026",
      title: "Navathi Special: Women Empowerment & Values in Governance",
      titleMl: "നവതി വിശേഷ വനിതാ ശാക്തീകരണ സെമിനാർ",
      date: "2026-04-20",
      year: "2026",
      centre: "Koyilandy",
      category: "Social Service",
      isNavathi: true,
      coverImage: "assets/images/meditation_hall.jpg",
      photos: [
        "assets/images/light_palace_center.jpg",
        "assets/images/rajyoga_peace.jpg"
      ],
      youtubeUrl: "https://www.youtube.com/watch?v=1zxJA_XoEog",
      description: "Special seminar recognizing maternal leadership and spiritual qualities in society, hosted under the 90th year celebrations banner.",
      image: "assets/images/meditation_hall.jpg",
      additionalImages: [
        "assets/images/light_palace_center.jpg",
        "assets/images/rajyoga_peace.jpg"
      ],
      videoUrl: "https://www.youtube.com/watch?v=1zxJA_XoEog",
      location: "Koyilandy",
      shortDesc: "Special seminar recognizing maternal leadership and spiritual qualities in society.",
      fullDesc: "Special seminar recognizing maternal leadership and spiritual qualities in society, hosted under the 90th year celebrations banner.",
      time: "10:00 AM - 1:00 PM",
      schedule: [
        { time: "10:00 AM", session: "Spiritual Values in Family & Governance" },
        { time: "11:30 AM", session: "Guided Rajayoga Experience" }
      ],
      isFeatured: false,
      status: "published",
      order: 7,
      createdAt: "2026-04-10"
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
  const regExp = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/i;
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
            const oldPlaceholders = ['xZhO2wbz_0E', 'lB_O7PP0Uh4', '7swHqPtUSmE', 'xbW8AWKK-mo', 'cRRkM_zxV_o', 'Q2llFc3ifd0', 'xxIxyi9w_6k'];
            let ytUrl = existing.youtubeUrl || defaultMod.youtubeUrl;
            let ytVid = existing.youtubeVideoId || extractYouTubeVideoId(ytUrl || '') || defaultMod.youtubeVideoId;
            if (oldPlaceholders.includes(ytVid) || (existing.youtubeUrl && oldPlaceholders.some(p => existing.youtubeUrl.includes(p)))) {
              ytUrl = defaultMod.youtubeUrl;
              ytVid = defaultMod.youtubeVideoId;
            }
            const quizQs = (Array.isArray(existing.quizQuestions) && existing.quizQuestions.length > 0) 
              ? existing.quizQuestions 
              : defaultMod.quizQuestions;
            const refPrompt = existing.reflectionPrompt || defaultMod.reflectionPrompt;
            return {
              ...defaultMod,
              ...existing,
              description: existing.description || existing.summary || defaultMod.description,
              youtubeUrl: ytUrl,
              youtubeVideoId: ytVid,
              duration: existing.duration || defaultMod.duration,
              quizQuestions: quizQs,
              reflectionPrompt: refPrompt
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
            if (t.id === 'events') return { ...t, label: 'Events', type: 'system' };
            if (t.id === 'media') return { ...t, label: 'Media', type: 'media-dropdown' };
            return t;
          }).filter(t => t.id !== 'wisdom'); // replace old wisdom with murali

          // Ensure Events tab is system type
          const evTab = mergedTabs.find(t => t.id === 'events');
          if (evTab) {
            evTab.type = 'system';
            evTab.order = 8;
          }

          // Ensure Navathi tab exists alongside Events
          if (!mergedTabs.some(t => t.id === 'navathi')) {
            const eventsIdx = mergedTabs.findIndex(t => t.id === 'events');
            const navathiTab = { id: 'navathi', label: 'Navathi', icon: 'award', isCore: true, enabled: true, order: 9, type: 'system' };
            if (eventsIdx !== -1) {
              mergedTabs.splice(eventsIdx + 1, 0, navathiTab);
            } else {
              mergedTabs.push(navathiTab);
            }
          }

          // Ensure Daily Murali tab exists
          if (!mergedTabs.some(t => t.id === 'murali')) {
            const navathiIdx = mergedTabs.findIndex(t => t.id === 'navathi');
            const muraliTab = { id: 'murali', label: 'Daily Murali', icon: 'sun', isCore: true, enabled: true, order: 10, type: 'system' };
            if (navathiIdx !== -1) {
              mergedTabs.splice(navathiIdx + 1, 0, muraliTab);
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
            const date = ev.date && ev.date.trim() ? ev.date : '2026-10-15';
            const year = ev.year || (date.length >= 4 && !isNaN(date.substring(0, 4)) ? date.substring(0, 4) : '2026');
            const centre = ev.centre || ev.center || ev.location || 'Kozhikode Main';
            const isNavathi = Boolean(ev.isNavathi !== undefined ? ev.isNavathi : (ev.category === 'navathi' || (ev.title && ev.title.toLowerCase().includes('navathi'))));
            const coverImage = ev.coverImage || ev.image || 'assets/images/light_palace_center.jpg';
            let youtubeUrl = ev.youtubeUrl || ev.videoUrl || '';
            if (youtubeUrl.includes('1zxJA_XoEog')) {
              if (ev.id === 'evt-navathi-kozhikode-2026') youtubeUrl = 'https://www.youtube.com/live/xeZ_HBW1mq4';
              else if (ev.id === 'evt-navathi-feroke-2026') youtubeUrl = 'https://www.youtube.com/live/YMXD1FmGleg';
            }
            const description = ev.description || ev.fullDesc || ev.shortDesc || '';
            const photos = Array.isArray(ev.photos) && ev.photos.length > 0 ? ev.photos : (Array.isArray(ev.additionalImages) ? ev.additionalImages : []);

            return {
              id: ev.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              title: ev.title || 'Spiritual Gathering',
              titleMl: ev.titleMl || '',
              date,
              year,
              centre,
              category: ev.category && ev.category !== 'navathi' ? ev.category : (isNavathi ? 'Festivals' : 'Festivals'),
              isNavathi,
              coverImage,
              photos,
              youtubeUrl,
              description,
              image: coverImage,
              additionalImages: photos,
              videoUrl: youtubeUrl,
              location: centre,
              shortDesc: description.length > 150 ? description.substring(0, 150) + '...' : description,
              fullDesc: description,
              time: ev.time || '10:00 AM - 1:00 PM',
              schedule: Array.isArray(ev.schedule) ? ev.schedule : [],
              isFeatured: ev.isFeatured !== undefined ? ev.isFeatured : false,
              status: ev.status || 'published',
              order: ev.order || 1,
              createdAt: ev.createdAt || '2026-08-18'
            };
          });

          // Ensure default events exist if missing
          DEFAULT_DATA.events.forEach(defEv => {
            if (!mergedEvents.some(e => e.id === defEv.id || e.title === defEv.title)) {
              mergedEvents.push(defEv);
            }
          });
        }

        // Ensure key centres are present
        let mergedCenters = parsed.centers || DEFAULT_DATA.centers;
        if (Array.isArray(mergedCenters)) {
          DEFAULT_DATA.centers.forEach(defC => {
            if (!mergedCenters.some(c => (c.name || '').toLowerCase() === (defC.name || '').toLowerCase())) {
              mergedCenters.push(defC);
            }
          });
        }

        let mergedSocialChannels = Array.isArray(parsed.socialChannels) && parsed.socialChannels.length > 0 ? parsed.socialChannels : DEFAULT_DATA.socialChannels;

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
          centers: mergedCenters,
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

    const date = event.date && event.date.trim() ? event.date.trim() : new Date().toISOString().split('T')[0];
    const year = event.year && event.year.trim() ? event.year.trim() : (date.length >= 4 && !isNaN(date.substring(0, 4)) ? date.substring(0, 4) : '2026');
    const centre = event.centre || event.center || event.location || 'Kozhikode Main';
    const isNavathi = Boolean(event.isNavathi !== undefined ? event.isNavathi : (event.category === 'navathi'));
    const coverImage = event.coverImage || event.image || 'assets/images/light_palace_center.jpg';
    const photos = Array.isArray(event.photos) ? event.photos : (Array.isArray(event.additionalImages) ? event.additionalImages : []);
    const youtubeUrl = event.youtubeUrl || event.videoUrl || '';
    const description = event.description || event.fullDesc || event.shortDesc || '';

    // Auto-extract YouTube video ID if URL provided
    let youtubeVideoId = event.youtubeVideoId || '';
    if (youtubeUrl) {
      youtubeVideoId = extractYouTubeVideoId(youtubeUrl);
    }

    const normalizedData = {
      ...event,
      title: event.title || 'Spiritual Gathering',
      titleMl: event.titleMl || '',
      date,
      year,
      centre,
      location: centre,
      category: event.category || (isNavathi ? 'Festivals' : 'Festivals'),
      isNavathi,
      coverImage,
      image: coverImage,
      photos,
      additionalImages: photos,
      youtubeUrl,
      videoUrl: youtubeUrl,
      youtubeVideoId,
      description,
      shortDesc: description.length > 150 ? description.substring(0, 150) + '...' : description,
      fullDesc: description,
      time: event.time || '10:00 AM - 1:00 PM',
      registrationUrl: event.registrationUrl || '',
      externalUrl: event.externalUrl || '',
      schedule: Array.isArray(event.schedule) ? event.schedule : [],
      isFeatured: Boolean(event.isFeatured),
      status: event.status || 'published',
      order: parseInt(event.order, 10) || 1
    };

    if (event.id) {
      const idx = this.data.events.findIndex(e => e.id === event.id);
      if (idx !== -1) {
        this.data.events[idx] = {
          ...this.data.events[idx],
          ...normalizedData
        };
        this.saveData();
        return this.data.events[idx];
      }
    }

    // New event
    const newEvent = {
      ...normalizedData,
      id: event.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
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
    if (!pin) return false;
    if (this.data.settings.adminPin && pin === this.data.settings.adminPin) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    if (pin === 'OmShanti@Kozhikode2026') {
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
