/**
 * Brahma Kumaris Kozhikode — Global Language & Localization Store (EN | മലയാളം)
 * Strictly adheres to Official Brahma Kumaris Malayalam Spiritual Lexicon
 * Tone: Serene, elevated, dignified spiritual literary standard (പ്രൗഢവും ലളിതവുമായ ശൈലി)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'bk_selected_language';
  const DEFAULT_LANG = 'ml'; // Default to Malayalam as per specifications

  const TRANSLATIONS = {
    en: {
      // Navigation
      nav_home: 'Home',
      nav_about: 'About Us',
      nav_meditation: 'Meditation',
      nav_course: 'Rajyoga Course',
      nav_centers: 'Centers',
      nav_gallery: 'Gallery',
      nav_media: 'Media',
      nav_events: 'Events',
      nav_navathi: 'Navathi',
      nav_murali: 'Daily Murli',
      nav_contact: 'Contact',
      nav_wa: 'WhatsApp',
      nav_drawer_label: 'Navigation · Pathways',
      nav_course_cta_heading: '7-Day Rajyoga Course',
      nav_course_cta_desc: 'Free Spiritual Education · Free Admission',
      nav_call_center: 'Call Center',

      // Hero Section
      hero_cinematic_title: 'Awaken Your Inner Peace <span class="title-accent">&amp; Divine Radiance</span>',
      hero_btn_course: 'Begin 7-Day Rajyoga Course',
      hero_btn_peace: 'Experience 1-Min Peace',

      // Daily Thought
      daily_kicker: 'Thought for Today · Divine Reflection',
      daily_share_btn: 'Share Wisdom',
      daily_listen_btn: 'Listen Audio',

      // Home Pathways
      pathways_kicker: 'Spiritual Pathways',
      pathways_title: 'Discover Peace in Kozhikode',
      pathways_subtitle: 'Choose how you wish to begin your spiritual journey with us',
      badge_foundational: 'Foundational',
      badge_interactive: 'Interactive',
      badge_daily: 'Daily Murli',
      course_card_desc: 'Explore the fundamental secrets of the soul, the Supreme Soul (God Shiva), the eternal Law of Karma, and the 8 divine powers to master your mind.',
      course_card_insight: '"Learn with personal guidance at your convenient morning or evening timings."',
      course_card_action: 'Explore Syllabus →',
      course_free_adm: 'Free Admission',
      meditation_card_desc: 'Step into our virtual meditation room with calming tanpura soundscapes, flute melodies, breath visualizer, and guided commentary.',
      meditation_card_insight: '"Take 1 minute for mind relaxation every hour with our Traffic Control bell."',
      meditation_card_action: 'Experience Now →',
      murali_card_desc: 'Bathe your mind each morning in the ocean of Godly wisdom. Read, listen, or download daily authentic Sakar and Avyakt Murlis in Malayalam, Hindi, and English.',
      murali_card_insight: '"The direct versions spoken by Supreme Father Shiva through Prajapita Brahma."',
      murali_card_action: 'Read Today’s Murli →',

      // About Section
      about_header_badge: 'Official Heritage · Prajapita Brahma Kumaris Ishwariya Vishwa Vidyalaya',
      about_h1: 'About Brahma Kumaris',
      about_lead: 'A worldwide spiritual movement dedicated to personal transformation and world renewal.',
      subtab_us: 'About Us',
      subtab_journey: 'Our Journey',
      subtab_founder: 'Founders & Adi Ratnas',
      subtab_wings: 'Service Wings',
      subtab_leaders: 'Current Leaders',
      subtab_kozhikode: 'Kozhikode Centre',

      // About Subpanel 1: Who We Are
      who_we_are_kicker: '🕊️ Who We Are · An Introduction',
      who_we_are_title: 'A Worldwide Spiritual Movement',
      who_we_are_lead: 'Brahma Kumaris, officially known as <strong>‘Prajapita Brahma Kumaris Ishwariya Vishwa Vidyalaya’</strong>, is a worldwide spiritual movement dedicated to personal transformation and world renewal. Founded in 1937 in Hyderabad, Sindh (then a part of undivided India) by <strong>Prajapita Brahma</strong>, Brahma Kumaris has spread to over <strong>130 countries in 5 continents</strong> and has had an extensive impact as an international NGO.',
      pillar_women_title: 'A Women-Led Spiritual Family',
      pillar_women_text: 'It supports the cultivation of a deep collective consciousness of peace and the individual dignity of each soul. The Brahma Kumaris has the unique distinction of being the world’s largest spiritual organisation led by women. It was the founder, Prajapita Brahma Baba, who put women in front from the very beginning, appointing Mateshwari Jagadamba (fondly known as Mamma) as its first administrative head.',
      pillar_madhuban_title: 'From Mount Abu to the World',
      pillar_madhuban_text: 'In 1950, this spiritual family relocated to India, establishing their home in the beautiful Aravalli Ranges of Mount Abu, Rajasthan, which serves as the international headquarters (Madhuban). From here, the teachings of Rajyoga spread overseas, with the first foreign center established in London in 1971.',
      lineage_badge: 'Spiritual Lineage',
      lineage_heading: 'A Lineage of Spiritual Leadership',
      lineage_sub: 'Guided by pure souls who dedicated every breath to selfless spiritual service.',
      trusts_badge: 'Institutional Foundations',
      trusts_heading: 'Our Trusts & Societies — The Tree and its Branches',
      trusts_sub: 'The Brahma Kumaris perform their socio-spiritual roles and responsibilities with the help of specialized sister institutions.',
      un_badge: 'Global Cooperation',
      un_heading: 'Brahma Kumaris at the United Nations',
      un_sub: 'An international non-governmental organisation (NGO) in consultative status with key UN bodies.',
      un_intro: 'The principles of the Brahma Kumaris align with the Preamble to the United Nations Charter: <em>"to reaffirm faith in fundamental human rights, in the dignity and worth of the human person, in the equal rights of men and women..."</em>',
      btn_explore_journey: 'Explore Our Illustrious Journey (1935 – Present) →',

      // About Subpanel 2: Our Journey
      journey_kicker: '⏳ Historical Milestones · Timeline',
      journey_title: 'Our Journey',
      journey_lead: 'From a humble beginning to becoming a World Spiritual Organization, the journey of Brahma Kumaris has been a unique one. Explore the 12 pivotal eras that shaped this global movement.',
      btn_meet_founders: 'Meet the Founders & Adi Ratnas →',

      // About Subpanel 3: Adi Ratnas & Supreme Shiva
      supreme_kicker: 'Sun of Knowledge · Supreme Soul Shiva',
      supreme_title: 'Incorporeal Supreme Soul Shiva (Shiv Baba)',
      supreme_quote: '"Beloved children, I am the self-luminous Supreme Light. Like you, I am an eternal point of spiritual light; an infinite Ocean of Peace, Love, and Supreme Purity."',
      supreme_desc: 'The Incorporeal Supreme Light who reveals eternal wisdom and Rajyoga meditation for world renewal and the establishment of the Golden Age (Satyug).',
      adi_grid_kicker: '👑 Divine Founders & Adi Ratnas · Spiritual Jewels',
      adi_grid_title: 'Adi Ratnas (Jewels of Light)',
      adi_grid_lead: 'Divine souls chosen by Almighty Supreme Father Shiva for world transformation. Their supreme sacrifice and intense tapasya form the bedrock of this spiritual university.',
      btn_view_bio: 'View Biography →',
      btn_explore_wings: 'Explore 24 Service Wings →',

      // Adi Ratna Profile Detail Page
      adi_back_to_page: '← Back to Adi Ratnas',
      adi_breadcrumb_root: 'Adi Ratnas',
      adi_badge_founder: '👑 Divine Founder',
      adi_badge_ratna: '💎 Adi Ratna',
      adi_detail_kicker: 'Authentic Spiritual Profile',
      adi_loukik_label: 'Worldly Name:',
      adi_virtues_heading: 'Divine Virtues & Powers',
      adi_bio_heading: 'Life Journey & Tapasya',
      adi_gallery_heading: 'Photo Gallery – Divine Memories',
      adi_gallery_subtitle: 'Sacred and colorful moments from a divine life journey',
      adi_video_heading: 'Official Documentary & Spiritual Message',
      adi_video_source: 'Brahma Kumaris Official Channel',
      adi_prev_sibling: '← Previous Jewel',
      adi_next_sibling: 'Next Jewel →',
      adi_back_to_grid_center: 'Back to Jewels (Grid)',
      adi_quick_nav_title: 'Other Divine Souls (Quick Navigation)',
      adi_zoom_badge: 'Click to Enlarge',

      // Service Wings
      wings_kicker: '🌐 Socio-Spiritual Wings · RE&RF',
      wings_title: 'The Rajyoga Education and Research Foundation (RE&RF)',
      wings_lead: 'Serving society through 24 dedicated professional and social service wings, taking spiritual wisdom, ethical values, and stress management into every walk of life.',
      btn_view_leaders: 'Meet Current Leadership →',

      // Current Leaders
      leaders_kicker: '👥 Guiding Lights · Global Leadership',
      leaders_title: 'Current Administrative Leadership',
      leaders_lead: 'Guided by revered spiritual elders and administrators carrying forward the eternal light of divine wisdom from Madhuban.',
      btn_view_kozhikode: 'View Kozhikode Centre Details →',

      // Kozhikode Center
      kozhikode_kicker: '📍 Local Sanctuary · Light Palace',
      kozhikode_title: 'Brahma Kumaris Kozhikode',
      kozhikode_lead: '\'Light Palace\', the main service centre of Prajapita Brahma Kumaris Ishwariya Vishwa Vidyalaya in Kozhikode, serving the community with pure vibrations and Rajyoga meditation since 1978.',
      kozhikode_main_center: 'Main Centre',
      kozhikode_visiting_hours: 'Visiting & Meditation Hours',
      kozhikode_morning: 'Morning: 7:00 AM – 9:00 AM',
      kozhikode_evening: 'Evening: 5:00 PM – 8:00 PM',
      kozhikode_contact: 'Direct Contact',
      btn_open_full_contact: 'Visit Full Contact & Branches Page →',

      // Meditation Tab
      med_peace_quote: '"I am a peaceful soul, connected to the Supreme Ocean of Peace."',
      med_select_soundscape: 'Select Ambient Soundscape',
      med_soundscape_desc: 'Choose soothing natural resonance, sacred bamboo flute, ocean waves, or pure soul silence:',
      med_duration_label: 'Meditation Duration:',
      med_btn_start: 'Start Meditation',
      med_btn_pause: 'Pause',
      med_btn_reset: 'Reset',

      // Course Tab
      course_banner_title: 'Complimentary 7-Day Rajyoga Meditation Foundation Course',
      course_banner_desc: 'Awaken your inner power through timeless spiritual wisdom. Morning & Evening batches conducted free of charge at all Kozhikode centers.',
      course_btn_start: 'Start Day 1 Lesson Now',

      // Centers Tab
      centers_title: 'Brahma Kumaris Centers in Kozhikode',
      centers_subtitle: 'Discover peace near you. All centers offer free meditation classes, personal spiritual counseling, and 7-day courses.',
      centers_search_placeholder: 'Search center name, locality, or contact person...',

      // Gallery & Media
      gallery_title: 'Spiritual Gallery & Sacred Moments',
      gallery_subtitle: 'Glimpses of spiritual events, divine gatherings, and peace campaigns in Kozhikode.',
      media_title: 'Spiritual Media Hub',
      media_subtitle: 'Watch inspirational videos, listen to daily meditation commentaries, and explore uplifting spiritual podcasts.',

      // Events & Navathi
      events_title: 'Spiritual Events & Programs',
      events_subtitle: 'Join public peace conferences, meditation retreats, and socio-spiritual workshops in Kozhikode.',
      navathi_title: 'Navathi Celebrations (90 Years of Divine Light)',
      navathi_subtitle: 'Commemorating 90 glorious years of world renewal, value education, and spiritual enlightenment (1936–2026).',

      // Daily Murali
      murali_page_title: 'Daily Godly Murli Reading',
      murali_page_subtitle: 'The divine nectar of spiritual wisdom spoken by Supreme Father Shiva for soul elevation.',

      // Contact Tab
      contact_title: 'Connect With Us',
      contact_subtitle: 'We warmly welcome you to visit our sanctuary at Ashokapuram or connect with our spiritual teachers for guidance.',
      contact_form_heading: 'Send a Message / Inquire About Courses',
      contact_btn_send_wa: 'Send Message Via WhatsApp →',

      // Footer
      footer_about_text: 'An international spiritual movement dedicated to inner peace, moral revival, and self-transformation through the study of Rajyoga meditation. All programs are open to all without charge.',
      footer_explore: 'Explore',
      footer_official_links: 'Official Links',
      footer_center_heading: 'Ashokapuram Center',
      footer_rights: '© 2026 Brahma Kumaris Kozhikode • World Spiritual University. All rights reserved.',
      footer_om_shanti: 'Om Shanti • Universal Peace & Serenity'
    },

    ml: {
      // Navigation
      nav_home: 'ഹോം',
      nav_about: 'ഞങ്ങളെക്കുറിച്ച്',
      nav_meditation: 'രാജയോഗ ധ്യാനം',
      nav_course: 'രാജയോഗ കോഴ്‌സ്',
      nav_centers: 'സേവന കേന്ദ്രങ്ങൾ',
      nav_gallery: 'ചിത്രശാല',
      nav_media: 'മീഡിയ',
      nav_events: 'പരിപാടികൾ',
      nav_navathi: 'നവതി',
      nav_murali: 'ഈശ്വരീയ മുരളി',
      nav_contact: 'ബന്ധപ്പെടുക',
      nav_wa: 'വാട്‌സ്ആപ്പ്',
      nav_drawer_label: 'വഴികാട്ടി · Navigation',
      nav_course_cta_heading: '7 ദിന രാജയോഗ കോഴ്സ്',
      nav_course_cta_desc: 'സൗജന്യ ഈശ്വരീയ വിദ്യാലയം · പ്രവേശനം സൗജന്യം',
      nav_call_center: 'കേന്ദ്രത്തിലേക്ക് വിളിക്കൂ',

      // Hero Section
      hero_cinematic_title: 'നിങ്ങളുടെ ആന്തരിക ശാന്തിയും <span class="title-accent">ആത്മപ്രകാശവും ഉണർത്തൂ</span>',
      hero_btn_course: '7 ദിവസത്തെ രാജയോഗ കോഴ്സ് ആരംഭിക്കൂ',
      hero_btn_peace: '1 മിനിറ്റ് ശാന്തി അനുഭവിക്കൂ',

      // Daily Thought
      daily_kicker: 'ഇന്നത്തെ ആത്മീയ ചിന്ത · Divine Reflection',
      daily_share_btn: 'സന്ദേശം പങ്കുവെക്കൂ',
      daily_listen_btn: 'ശബ്ദം കേൾക്കൂ',

      // Home Pathways
      pathways_kicker: 'ആത്മീയ വഴികൾ',
      pathways_title: 'കോഴിക്കോട് ആത്മശാന്തി കണ്ടെത്തൂ',
      pathways_subtitle: 'ഞങ്ങളോടൊപ്പം നിങ്ങളുടെ ആത്മീയ യാത്ര എങ്ങനെ ആരംഭിക്കണമെന്ന് തിരഞ്ഞെടുക്കൂ',
      badge_foundational: 'അടിസ്ഥാനം',
      badge_interactive: 'അനുഭൂതിപൂർണ്ണം',
      badge_daily: 'നിത്യസന്ദേശം',
      course_card_desc: 'ആത്മാവ്, പരമപിതാ പരമാത്മാ ശിവൻ, കർമ്മ സിദ്ധാന്തം, വിശ്വനാടക ചക്രം, മനസ്സിനെ നിയന്ത്രിക്കാനുള്ള 8 ആത്മീയ ശക്തികൾ എന്നിവ മനസ്സിലാക്കൂ.',
      course_card_insight: '"നിങ്ങളുടെ സൗകര്യപ്രദമായ പ്രഭാത, സായാഹ്ന സമയങ്ങളിൽ വ്യക്തിഗത മാർഗ്ഗനിർദ്ദേശത്തോടെ പഠിക്കൂ."',
      course_card_action: 'സിലബസ് കാണുക →',
      course_free_adm: 'പ്രവേശനം സൗജന്യം',
      meditation_card_desc: 'തൻപുര, ശാന്തമായ വേണുനാദം, ശ്വാസക്രമീകരണം, ശാന്തമായ മാർഗ്ഗനിർദ്ദേശങ്ങൾ എന്നിവയോടുകൂടിയ ഞങ്ങളുടെ ധ്യാന മുറിയിലേക്ക് പ്രവേശിക്കൂ.',
      meditation_card_insight: '"ട്രാഫിക് കൺട്രോൾ ബെല്ലിനൊപ്പം ഓരോ മണിക്കൂറിലും മനസ്സിന് 1 മിനിറ്റ് വിശ്രമം നൽകൂ."',
      meditation_card_action: 'ഇപ്പോൾ അനുഭവിക്കൂ →',
      murali_card_desc: 'പരമപിതാ പരമാത്മാ ശിവന്റെ അമൃതവാണികൾ. ദിവസേനയുള്ള സാകാര, അവ്യക്ത മുരളികൾ മലയാളത്തിലും ഹിന്ദിയിലും ഇംഗ്ലീഷിലും വായിക്കൂ, കേൾക്കൂ.',
      murali_card_insight: '"പരമപിതാ പരമാത്മാ ശിവൻ പ്രജാപീതാ ബ്രഹ്മാ ബാബയിലൂടെ അരുളിച്ചെയ്ത ഈശ്വരീയ മഹാവാക്യങ്ങൾ."',
      murali_card_action: 'ഇന്നത്തെ മുരളി വായിക്കൂ →',

      // About Section
      about_header_badge: 'ഔദ്യോഗിക പൈതൃകം · പ്രജാപീതാ ബ്രഹ്മാകുമാരീസ് ഈശ്വരീയ വിശ്വവിദ്യാലയം',
      about_h1: 'ബ്രഹ്മാകുമാരീസിനെക്കുറിച്ച്',
      about_lead: 'സ്വയം പരിവർത്തനത്തിലൂടെ ലോക പരിവർത്തനം ലക്ഷ്യമാക്കിയുള്ള ഒരു ആഗോള ആത്മീയ പ്രസ്ഥാനം.',
      subtab_us: 'ഞങ്ങളെക്കുറിച്ച്',
      subtab_journey: 'ഞങ്ങളുടെ ചരിത്രം',
      subtab_founder: 'ആദി രത്നങ്ങൾ (Adi Ratnas)',
      subtab_wings: 'സേവന വിഭാഗങ്ങൾ',
      subtab_leaders: 'നിലവിലെ നേതൃത്വം',
      subtab_kozhikode: 'കോഴിക്കോട് കേന്ദ്രം',

      // About Subpanel 1: Who We Are
      who_we_are_kicker: '🕊️ ആരാണ് ബ്രഹ്മാകുമാരീസ്? · Who We Are',
      who_we_are_title: 'ലോകവ്യാപകമായ ഒരു ആത്മീയ പ്രസ്ഥാനം',
      who_we_are_lead: 'ബ്രഹ്മാകുമാരീസ്, ഔദ്യോഗികമായി <strong>‘പ്രജാപീതാ ബ്രഹ്മാകുമാരീസ് ഈശ്വരീയ വിശ്വവിദ്യാലയം’</strong> എന്നറിയപ്പെടുന്നു. സ്വയം പരിവർത്തനത്തിലൂടെ ലോകനവീകരണവും ശാന്തിയും കൈവരിക്കാൻ സമർപ്പിതമായ ഒരു ആഗോള ആത്മീയ കുടുംബമാണിത്. 1937-ൽ അവിഭക്ത ഇന്ത്യയിലെ സിന്ധിലുള്ള ഹൈദരാബാദിൽ <strong>പ്രജാപീതാ ബ്രഹ്മാ ബാബ</strong> തുടക്കം കുറിച്ച ഈ പ്രസ്ഥാനം ഇന്ന് 5 ഭൂഖണ്ഡങ്ങളിലായി <strong>130-ലധികം രാജ്യങ്ങളിൽ</strong> വ്യാപിച്ച് കിടക്കുന്നു.',
      pillar_women_title: 'മാതൃശക്തി നയിക്കുന്ന ആത്മീയ കുടുംബം',
      pillar_women_text: 'ലോകത്തിലെ ഏറ്റവും വലിയ വനിതാ നേതൃത്വത്തിലുള്ള ആത്മീയ പ്രസ്ഥാനമാണിത്. പ്രഥമ ദിവ്യ പിതാവായ ബ്രഹ്മാ ബാബ തുടക്കം മുതൽക്കേ മാതൃശക്തിയെ മുൻനിരയിൽ നിർത്തുകയും മാതേശ്വരി ജഗദംബാ സരസ്വതിയെ (മമ്മ) പ്രഥമ മുഖ്യ ഭരണാധികാരിയായി നിയോഗിക്കുകയും ചെയ്തു.',
      pillar_madhuban_title: 'മൗണ്ട് അബുവിൽ നിന്ന് ലോകത്തിലേക്ക്',
      pillar_madhuban_text: '1950-ൽ രാജസ്ഥാനിലെ ആരവല്ലി പർവ്വതനിരകളിലുള്ള മൗണ്ട് അബുവിലേക്ക് (മധുബൻ) ആസ്ഥാനം മാറ്റിയ ശേഷം, അവിടെ നിന്നും രാജയോഗ സന്ദേശം ലോകമെമ്പാടും വ്യാപിച്ചു. 1971-ൽ ലണ്ടനിൽ ആദ്യത്തെ വിദേശ കേന്ദ്രം സ്ഥാപിതമായി.',
      lineage_badge: 'ആത്മീയ നേതൃത്വ പരമ്പര',
      lineage_heading: 'ആത്മീയ നേതൃത്വത്തിന്റെ ദിവ്യ പരമ്പര',
      lineage_sub: 'നിസ്വാർത്ഥമായ ഈശ്വരീയ സേവനത്തിനായി ജീവിതം സമർപ്പിച്ച പുണ്യാത്മാക്കൾ നയിച്ച പാത.',
      trusts_badge: 'സ്ഥാപനപരമായ അടിത്തറ',
      trusts_heading: 'നമ്മുടെ ട്രസ്റ്റുകളും സൊസൈറ്റികളും',
      trusts_sub: 'സമൂഹത്തിന്റെ സർവ്വതോന്മുഖമായ ഉന്നമനത്തിനായി പ്രവർത്തിക്കുന്ന അനുബന്ധ സംഘടനകൾ.',
      un_badge: 'ആഗോള സഹകരണം',
      un_heading: 'ബ്രഹ്മാകുമാരീസ് ഐക്യരാഷ്ട്രസഭയിൽ',
      un_sub: 'ഐക്യരാഷ്ട്രസഭയുടെ പ്രധാന ഘടകങ്ങളുമായി ജനറൽ കൺസൾട്ടേറ്റീവ് പദവിയുള്ള അന്താരാഷ്ട്ര സർക്കാരിതര സംഘടന (NGO).',
      un_intro: 'ഐക്യരാഷ്ട്രസഭാ ചാർട്ടറിലെ മൂല്യങ്ങളുമായി യോജിച്ചു പ്രവർത്തിക്കുന്ന ബ്രഹ്മാകുമാരീസ്, മൗലിക മനുഷ്യാവകാശങ്ങൾ, മനുഷ്യന്റെ ആത്മാഭിമാനം, സ്ത്രീ-പുരുഷ തുല്യത എന്നിവ ഉയർത്തിപ്പിടിക്കുന്നു.',
      btn_explore_journey: 'ഞങ്ങളുടെ ചരിത്ര നാൾവഴികൾ കാണുക (1935 – ഇപ്പോൾ) →',

      // About Subpanel 2: Our Journey
      journey_kicker: '⏳ ചരിത്ര നാൾവഴികൾ · Historical Milestones',
      journey_title: 'ഞങ്ങളുടെ ചരിത്രം',
      journey_lead: 'ഒരു ചെറിയ തുടക്കത്തിൽ നിന്ന് ആരംഭിച്ച് ഒരു വിശ്വ ആത്മീയ വിദ്യാലയമായി മാറിയ ബ്രഹ്മാകുമാരീസിന്റെ ചരിത്രം സമാനതകളില്ലാത്തതാണ്. ഈ പ്രസ്ഥാനത്തെ രൂപപ്പെടുത്തിയ 12 സുപ്രധാന യുഗങ്ങളിലൂടെ കടന്നുപോകൂ.',
      btn_meet_founders: 'ദിവ്യ സ്ഥാപകരെയും ആദിരത്നങ്ങളെയും പരിചയപ്പെടൂ →',

      // About Subpanel 3: Adi Ratnas & Supreme Shiva
      supreme_kicker: 'ജ്ഞാനസൂര്യൻ · പരമാത്മാ ശിവൻ',
      supreme_title: 'ജ്യോതിർബിന്ദു സ്വരൂപ പരമാത്മാവ് ശിവൻ (ശിവബാബ)',
      supreme_quote: '"പ്രിയ കുഞ്ഞുങ്ങളേ, ഞാൻ സ്വയം പ്രകാശമാനനായ പരമ ജ്യോതിസ്സാണ്. നിങ്ങളെപ്പോലെ ഞാനും പ്രകാശബിന്ദുവായ ആത്മാവാണ്; ശാന്തിയുടെയും സ്നേഹത്തിന്റെയും പരമ പവിത്രതയുടെയും അനന്ത സാഗരമാണ്."',
      supreme_desc: 'സത്യയുഗ ലോകസ്ഥാപനത്തിനായി നിത്യസത്യങ്ങളും രാജയോഗ ധ്യാനവും പകർന്നുനൽകിയ നിരാകാര ജ്യോതിർബിന്ദു പരമാത്മാവ്.',
      adi_grid_kicker: '👑 ദിവ്യ സ്ഥാപകരും ആദിരത്നങ്ങളും · Divine Instruments',
      adi_grid_title: 'ആദി രത്നങ്ങൾ (Adi Ratnas)',
      adi_grid_lead: 'ലോക പരിവർത്തനത്തിനായി സർവ്വശക്തനായ പരമപിതാ ശിവൻ തിരഞ്ഞെടുത്ത ദിവ്യ ആത്മാക്കൾ. അവരുടെ നിസ്തുലമായ ത്യാഗവും തപസ്യയുമാണ് ഈ ഈശ്വരീയ വിശ്വവിദ്യാലയത്തിന്റെ കരുത്തുറ്റ അടിത്തറ.',
      btn_view_bio: 'ജീവചരിത്രം കാണുക →',
      btn_explore_wings: 'സേവന വിഭാഗങ്ങൾ കാണുക (24 Service Wings) →',

      // Adi Ratna Profile Detail Page
      adi_back_to_page: '← തിരികെ പേജിലേക്ക് (ആദിരത്നങ്ങൾ)',
      adi_breadcrumb_root: 'ആദിരത്നങ്ങൾ',
      adi_badge_founder: '👑 ദിവ്യ സ്ഥാപകർ',
      adi_badge_ratna: '💎 ആദി രത്നം',
      adi_detail_kicker: 'ആത്മീയ ജീവചരിത്രം · Authentic Spiritual Profile',
      adi_loukik_label: 'ലൗകിക നാമം:',
      adi_virtues_heading: 'ആത്മീയ ഗുണങ്ങൾ (Key Virtues)',
      adi_bio_heading: 'തപസ്യയും ജീവിതരേഖയും',
      adi_gallery_heading: 'ഫോട്ടോ ഗാലറി – ദിവ്യ സ്മരണകൾ',
      adi_gallery_subtitle: 'ആത്മീയ ജീവിതത്തിലെ അപൂർവ്വവും പവിത്രവുമായ നിറമുള്ള മുഹൂർത്തങ്ങൾ',
      adi_video_heading: 'ഔദ്യോഗിക ഡോക്യുമെന്ററി & ആത്മീയ സന്ദേശം',
      adi_video_source: 'ബ്രഹ്മാകുമാരീസ് ഔദ്യോഗിക ചാനൽ',
      adi_prev_sibling: '← മുൻപത്തെ ആദിരത്നം',
      adi_next_sibling: 'അടുത്ത ആദിരത്നം →',
      adi_back_to_grid_center: 'തിരികെ ആദിരത്നങ്ങളിലേക്ക് (Back to Grid)',
      adi_quick_nav_title: 'മറ്റു ദിവ്യ വ്യക്തിത്വങ്ങൾ (Quick Navigation)',
      adi_zoom_badge: 'വലുതാക്കി കാണുക',

      // Service Wings
      wings_kicker: '🌐 സേവന വിഭാഗങ്ങൾ · Socio-Spiritual Wings',
      wings_title: 'രാജയോഗ എഡ്യൂക്കേഷൻ ആൻഡ് റിസർച്ച് ഫൗണ്ടേഷൻ (RE&RF)',
      wings_lead: '24 പ്രത്യേക സേവന വിഭാഗങ്ങളിലൂടെ സമൂഹത്തിന്റെ നാനാതുറകളിലുള്ളവർക്ക് ആത്മീയ ജ്ഞാനവും ധാർമ്മിക മൂല്യങ്ങളും മാനസിക പിരിമുറുക്കം അകറ്റാനുള്ള വഴികളും പകർന്നുനൽകുന്നു.',
      btn_view_leaders: 'നിലവിലെ നേതൃത്വത്തെ പരിചയപ്പെടൂ →',

      // Current Leaders
      leaders_kicker: '👥 ആത്മീയ നേതൃത്വം · Global Leadership',
      leaders_title: 'നിലവിലെ ഭരണ നേതൃത്വം',
      leaders_lead: 'മധുബനിൽ നിന്നുള്ള ആത്മീയ പ്രകാശവും ഈശ്വരീയ മാർഗ്ഗനിർദ്ദേശങ്ങളും ലോകമെമ്പാടും എത്തിക്കുന്ന വന്ദ്യരായ നേതൃത്വം.',
      btn_view_kozhikode: 'കോഴിക്കോട് കേന്ദ്രത്തിന്റെ വിവരങ്ങൾ കാണുക →',

      // Kozhikode Center
      kozhikode_kicker: '📍 കോഴിക്കോട് സേവന കേന്ദ്രം · Local Sanctuary',
      kozhikode_title: 'ബ്രഹ്മാകുമാരീസ് കോഴിക്കോട്',
      kozhikode_lead: '\'ലൈറ്റ് പാലസ്\', കോഴിക്കോട് അശോകപുരത്തുള്ള പ്രജാപീതാ ബ്രഹ്മാകുമാരീസ് ഈശ്വരീയ വിശ്വവിദ്യാലയത്തിന്റെ പ്രധാന സേവന കേന്ദ്രം. 1978 മുതൽ ദിവ്യ സ്പന്ദനങ്ങളും രാജയോഗ ധ്യാനവും സൗജന്യമായി പകർന്നുനൽകുന്നു.',
      kozhikode_main_center: 'പ്രധാന കേന്ദ്രം',
      kozhikode_visiting_hours: 'സന്ദർശന സമയവും ധ്യാനവേളകളും',
      kozhikode_morning: 'പ്രഭാതം: 7:00 AM – 9:00 AM',
      kozhikode_evening: 'സായാഹ്നം: 5:00 PM – 8:00 PM',
      kozhikode_contact: 'നേരിട്ട് ബന്ധപ്പെടാം',
      btn_open_full_contact: 'പൂർണ്ണ കോൺടാക്റ്റ് വിവരങ്ങൾ കാണുക →',

      // Meditation Tab
      med_peace_quote: '"ഞാൻ ഒരു ശാന്ത സ്വരൂപ ആത്മാവാണ്, പരമപിതാവായ പരമാത്മാ ശിവന്റെ ശാന്തി സാഗരവുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു."',
      med_select_soundscape: 'ധ്യാന ശബ്ദധാര തിരഞ്ഞെടുക്കൂ',
      med_soundscape_desc: 'പ്രകൃതിദത്തമായ തൻപുര, ശാന്തമായ പുല്ലാങ്കുഴൽ നാദം, ശാന്തി സാഗര തിരമാലകൾ അല്ലെങ്കിൽ പൂർണ്ണ നിശ്ശബ്ദത:',
      med_duration_label: 'ധ്യാന സമയം:',
      med_btn_start: 'ധ്യാനം ആരംഭിക്കൂ',
      med_btn_pause: 'താൽക്കാലികമായി നിർത്തൂ',
      med_btn_reset: 'പുനഃക്രമീകരിക്കൂ',

      // Course Tab
      course_banner_title: 'സൗജന്യ 7 ദിന രാജയോഗ ധ്യാന ഫൗണ്ടേഷൻ കോഴ്സ്',
      course_banner_desc: 'ശാശ്വത ആത്മീയ ജ്ഞാനത്തിലൂടെ നിങ്ങളുടെ ആന്തരിക ശക്തിയെ ഉണർത്തൂ. കോഴിക്കോട്ടെ എല്ലാ കേന്ദ്രങ്ങളിലും പ്രഭാത, സായാഹ്ന ബാച്ചുകൾ തികച്ചും സൗജന്യമായി നടക്കുന്നു.',
      course_btn_start: 'ഒന്നാം ദിന പാഠം ഇപ്പോൾ ആരംഭിക്കൂ',

      // Centers Tab
      centers_title: 'കോഴിക്കോട്ടെ ബ്രഹ്മാകുമാരീസ് സേവന കേന്ദ്രങ്ങൾ',
      centers_subtitle: 'നിങ്ങളുടെ അടുത്തുള്ള കേന്ദ്രം കണ്ടെത്തൂ. എല്ലാ കേന്ദ്രങ്ങളിലും രാജയോഗ കോഴ്സും ആത്മീയ കൗൺസിലിംഗും തികച്ചും സൗജന്യമാണ്.',
      centers_search_placeholder: 'കേന്ദ്രത്തിന്റെ പേര്, സ്ഥലം അല്ലെങ്കിൽ ഫോൺ നമ്പർ തിരയൂ...',

      // Gallery & Media
      gallery_title: 'ആത്മീയ ചിത്രശാല & പുണ്യ നിമിഷങ്ങൾ',
      gallery_subtitle: 'കോഴിക്കോട്ടെ ആത്മീയ പരിപാടികളുടെയും സേവനങ്ങളുടെയും മനോഹരമായ ദൃശ്യങ്ങൾ.',
      media_title: 'ആത്മീയ മീഡിയ ഹബ്',
      media_subtitle: 'പ്രചോദനാത്മകമായ വീഡിയോകൾ, ധ്യാന സന്ദേശങ്ങൾ, ആത്മീയ പ്രഭാഷണങ്ങൾ എന്നിവ ആസ്വദിക്കൂ.',

      // Events & Navathi
      events_title: 'ആത്മീയ പരിപാടികൾ & കോൺഫറൻസുകൾ',
      events_subtitle: 'കോഴിക്കോട് നടക്കുന്ന പൊതു സമാധാന സമ്മേളനങ്ങൾ, ധ്യാന ശിൽപ്പശാലകൾ, സാമൂഹിക സേവനങ്ങൾ എന്നിവയിൽ പങ്കെടുക്കൂ.',
      navathi_title: 'നവതി ആഘോഷങ്ങൾ (ഈശ്വരീയ പ്രകാശത്തിന്റെ 90 വർഷങ്ങൾ)',
      navathi_subtitle: 'ലോക പരിവർത്തനത്തിന്റെയും മൂല്യാധിഷ്ഠിത വിദ്യാഭ്യാസത്തിന്റെയും 90 സുവർണ്ണ വർഷങ്ങൾ (1936–2026).',

      // Daily Murali
      murali_page_title: 'ദിവസേനയുള്ള ഈശ്വരീയ മുരളി പാരായണം',
      murali_page_subtitle: 'ആത്മീയ ഉന്നമനത്തിനായി പരമപിതാ പരമാത്മാ ശിവൻ അരുളിച്ചെയ്ത ദിവ്യ ജ്ഞാനാമൃതം.',

      // Contact Tab
      contact_title: 'ഞങ്ങളുമായി ബന്ധപ്പെടൂ',
      contact_subtitle: 'അശോകപുരം ലൈറ്റ് പാലസിലേക്ക് ഏവരെയും സ്നേഹപൂർവ്വം സ്വാഗതം ചെയ്യുന്നു. ആത്മീയ മാർഗ്ഗനിർദ്ദേശങ്ങൾക്കായി സഹോദരിമാരുമായി നേരിട്ട് ബന്ധപ്പെടാം.',
      contact_form_heading: 'സന്ദേശം അയക്കൂ / കോഴ്സ് വിവരങ്ങൾ അറിയൂ',
      contact_btn_send_wa: 'വാട്‌സ്ആപ്പിലൂടെ സന്ദേശം അയക്കുക →',

      // Footer
      footer_about_text: 'രാജയോഗ ധ്യാനത്തിലൂടെ സ്വയം പരിവർത്തനവും ആത്മീയ ശാന്തിയും സമന്വയിപ്പിക്കുന്ന ആഗോള ആത്മീയ പ്രസ്ഥാനം. എല്ലാ കോഴ്സുകളും തികച്ചും സൗജന്യമാണ്.',
      footer_explore: 'വിഭാഗങ്ങൾ',
      footer_official_links: 'ഔദ്യോഗിക വെബ്‌സൈറ്റുകൾ',
      footer_center_heading: 'അശോകപുരം ലൈറ്റ് പാലസ്',
      footer_rights: '© 2026 ബ്രഹ്മാകുമാരീസ് കോഴിക്കോട് • ഈശ്വരീയ വിശ്വവിദ്യാലയം. സർവ്വ അവകാശങ്ങളും നിക്ഷിപ്തം.',
      footer_om_shanti: 'ഓം ശാന്തി • വിശ്വശാന്തി ശാന്തിധാമം'
    }
  };

  class LanguageStore {
    constructor() {
      const stored = localStorage.getItem(STORAGE_KEY);
      this.currentLang = (stored === 'en' || stored === 'ml') ? stored : DEFAULT_LANG;
      this.translations = TRANSLATIONS;
    }

    getLanguage() {
      return this.currentLang;
    }

    t(key) {
      const dict = this.translations[this.currentLang] || this.translations[DEFAULT_LANG];
      return dict[key] || this.translations['en'][key] || key;
    }

    setLanguage(lang) {
      if (lang !== 'en' && lang !== 'ml') return;
      this.currentLang = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        console.warn('Could not persist language to localStorage', e);
      }

      // Update root HTML lang attribute & class
      document.documentElement.lang = lang;
      if (document.body) {
        document.body.classList.toggle('lang-ml', lang === 'ml');
        document.body.classList.toggle('lang-en', lang === 'en');
      }

      // Update all toggle switchers
      this.updateSwitcherButtons();

      // Apply translations to data-i18n elements
      this.applyDomTranslations();

      // Dispatch global event for components (Adi Ratna, Navigation, Course, Murli)
      window.dispatchEvent(new CustomEvent('bk_language_changed', { detail: { lang } }));

      // Refresh app dynamic views if app is ready
      if (window.bkApp) {
        if (typeof window.bkApp.renderNavigation === 'function') {
          window.bkApp.renderNavigation();
        }
        if (typeof window.bkApp.renderDailyThought === 'function') {
          window.bkApp.renderDailyThought();
        }
      }

      // Re-render Adi Ratna if active
      if (window.onAdiRatnaLanguageChange) {
        window.onAdiRatnaLanguageChange(lang);
      }
    }

    updateSwitcherButtons() {
      const btns = document.querySelectorAll('.bk-lang-btn');
      btns.forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        btn.classList.toggle('active', btnLang === this.currentLang);
        btn.setAttribute('aria-pressed', btnLang === this.currentLang ? 'true' : 'false');
      });
    }

    applyDomTranslations() {
      const elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = this.t(key);
        if (translated) {
          // If the element has child icons or badges that shouldn't be overridden,
          // check if there's a text container span
          const targetSpan = el.querySelector('.i18n-text');
          if (targetSpan) {
            targetSpan.innerHTML = translated;
          } else {
            el.innerHTML = translated;
          }
        }
      });

      // Handle attribute translations e.g. placeholder
      const attrElements = document.querySelectorAll('[data-i18n-attr]');
      attrElements.forEach(el => {
        const attrSpec = el.getAttribute('data-i18n-attr'); // e.g. "placeholder:centers_search_placeholder"
        const [attrName, key] = attrSpec.split(':');
        if (attrName && key) {
          const translated = this.t(key);
          if (translated) {
            el.setAttribute(attrName, translated);
          }
        }
      });
    }
  }

  // Create singleton instance
  const langStore = new LanguageStore();

  // Expose globally
  window.bkLang = langStore;
  window.bkGetLanguage = () => langStore.getLanguage();
  window.bkSetLanguage = (lang) => langStore.setLanguage(lang);
  window.bkT = (key) => langStore.t(key);
  window.bkApplyDomTranslations = () => langStore.applyDomTranslations();

  // Initialize on DOM ready or immediately if already ready
  function initLang() {
    langStore.setLanguage(langStore.getLanguage());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    setTimeout(initLang, 20);
  }
})();
