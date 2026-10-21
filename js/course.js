/**
 * Brahma Kumaris Kozhikode — 7-Day Rajayoga Course Interactive Learning Platform
 * Features:
 * - Sequential Day 1–7 curriculum with persistent progress in localStorage
 * - YouTube IFrame API integration with video completion detection
 * - Daily reflection and knowledge quiz with automated unlocking of next day
 * - Course completion certificate and center batch registration integration
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'bk_rajyoga_course_progress_v1';

  const COURSE_CURRICULUM = [
    {
      day: 1,
      keyword: "Soul",
      title: "Soul Consciousness vs Body Consciousness",
      titleMl: "ഞാൻ ആരാണ്? ആത്മജ്ഞാനം",
      duration: "45 mins",
      youtubeUrl: "https://www.youtube.com/live/xeZ_HBW1mq4",
      youtubeVideoId: "xeZ_HBW1mq4",
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
  ];

  class RajyogaCourseManager {
    constructor() {
      this.curriculum = this.getCurriculum();
      this.state = {
        completedDays: [],
        currentUnlockedDay: 1,
        activeDay: 1,
        watchedVideos: {},
        dayReflections: {},
        selectedAnswers: {}
      };

      this.ytPlayer = null;
      this.isYtApiReady = false;
      this.ytInitTimer = null;
      this.hasLoaded = false;
      this._hasMessageListener = false;
    }

    getCurriculum() {
      if (window.bkStore && typeof window.bkStore.getCourseModules === 'function') {
        const storeMods = window.bkStore.getCourseModules();
        if (Array.isArray(storeMods) && storeMods.length === 7) {
          return storeMods;
        }
      }
      return COURSE_CURRICULUM;
    }

    init() {
      this.curriculum = this.getCurriculum();
      this.loadProgress();
      this.loadYouTubeIframeAPI();
      this.render();
      this.hasLoaded = true;
    }

    loadProgress() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.state.completedDays = Array.isArray(parsed.completedDays) ? parsed.completedDays : [];
          this.state.currentUnlockedDay = Number(parsed.currentUnlockedDay) || 1;
          this.state.activeDay = Number(parsed.activeDay) || 1;
          this.state.watchedVideos = parsed.watchedVideos || {};
          this.state.dayReflections = parsed.dayReflections || {};
        } else {
          // Defaults: Day 1 unlocked, Days 2-7 locked
          this.state.completedDays = [];
          this.state.currentUnlockedDay = 1;
          this.state.activeDay = 1;
          this.state.watchedVideos = {};
          this.state.dayReflections = {};
          this.saveProgress();
        }
      } catch (err) {
        console.warn('Could not read course progress from localStorage:', err);
      }
    }

    saveProgress() {
      try {
        const payload = {
          completedDays: this.state.completedDays,
          currentUnlockedDay: this.state.currentUnlockedDay,
          activeDay: this.state.activeDay,
          watchedVideos: this.state.watchedVideos,
          dayReflections: this.state.dayReflections
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn('Could not save course progress to localStorage:', err);
      }
    }

    resetProgress() {
      if (confirm("Are you sure you want to reset your 7-Day Course progress? This will reset all days back to Day 1.")) {
        this.state.completedDays = [];
        this.state.currentUnlockedDay = 1;
        this.state.activeDay = 1;
        this.state.watchedVideos = {};
        this.state.dayReflections = {};
        this.state.selectedAnswers = {};
        this.saveProgress();
        this.render();
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast("🕊️ Course progress has been reset to Day 1.");
        }
      }
    }

    loadYouTubeIframeAPI() {
      if (window.YT && window.YT.Player) {
        this.isYtApiReady = true;
        return;
      }
      if (document.getElementById('ytIframeApiScript')) {
        return;
      }
      const tag = document.createElement('script');
      tag.id = 'ytIframeApiScript';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      const oldCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (oldCallback) oldCallback();
        this.isYtApiReady = true;
        this.mountActivePlayer();
      };
    }

    selectDay(dayNumber) {
      if (!window.bkAuth || !window.bkAuth.isLoggedIn()) {
        this.render();
        if (window.bkAuth && window.bkAuth.openAuthModal) {
          window.bkAuth.openAuthModal();
        }
        return;
      }

      if (dayNumber > this.state.currentUnlockedDay) {
        const requiredDay = dayNumber - 1;
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast(`🔒 Day ${dayNumber} is locked. Complete Day ${requiredDay} lesson & quiz first!`, "warning");
        } else {
          alert(`Day ${dayNumber} is locked. Please complete Day ${requiredDay} first!`);
        }
        return;
      }

      this.state.activeDay = dayNumber;
      this.state.selectedAnswers = {};
      this.saveProgress();
      this.render();

      // Scroll smoothly to active day in mobile touch stepper if applicable
      const activeStepBtn = document.querySelector(`.step-day-btn.active`);
      if (activeStepBtn && typeof activeStepBtn.scrollIntoView === 'function') {
        try {
          activeStepBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } catch (_) {}
      }

      // Scroll smoothly to lesson stage
      const stage = document.getElementById('rajyogaLessonStage');
      if (stage) {
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    handleVideoEnded(dayNumber) {
      this.state.watchedVideos[dayNumber] = true;
      this.saveProgress();
      this.render();

      if (window.bkApp && window.bkApp.toast) {
        window.bkApp.toast(`🎉 Video lesson completed! You can now take today's Daily Reflection & Quiz.`, "success");
      }

      // Scroll to quiz section smoothly
      const quizSection = document.getElementById('dailyReflectionQuizSection');
      if (quizSection) {
        quizSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    skipVideoForTesting(dayNumber) {
      this.state.watchedVideos[dayNumber] = true;
      this.saveProgress();
      this.render();
      if (window.bkApp && window.bkApp.toast) {
        window.bkApp.toast(`⚡ Video marked as watched! Daily Reflection & Quiz is now unlocked.`, "success");
      }
    }

    selectOption(questionId, optionIndex) {
      this.state.selectedAnswers[questionId] = optionIndex;
      const questionBlock = document.getElementById(`qblock_${questionId}`);
      if (questionBlock) {
        questionBlock.querySelectorAll('.option-label').forEach((lbl, idx) => {
          lbl.classList.toggle('selected', idx === optionIndex);
          const radio = lbl.querySelector('input[type="radio"]');
          if (radio) radio.checked = (idx === optionIndex);
        });
      }
    }

    submitQuiz(event, dayNumber) {
      if (event) event.preventDefault();
      const currentMod = this.curriculum.find(m => m.day === dayNumber);
      if (!currentMod) return;

      // Validate all questions
      let allAnswered = true;
      let score = 0;
      const totalQuestions = currentMod.quizQuestions.length;

      currentMod.quizQuestions.forEach(q => {
        const selected = this.state.selectedAnswers[q.id];
        if (selected === undefined || selected === null) {
          allAnswered = false;
        } else if (Number(selected) === q.correctIndex) {
          score++;
        }
      });

      if (!allAnswered) {
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast("⚠️ Please answer all quiz questions before submitting.", "warning");
        } else {
          alert("Please answer all quiz questions before submitting.");
        }
        return;
      }

      const reflectionEl = document.getElementById(`reflectionText_${dayNumber}`);
      const reflectionText = reflectionEl ? reflectionEl.value.trim() : '';

      if (reflectionText.length < 8) {
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast("✍️ Please share your personal spiritual reflection (minimum 8 characters).", "warning");
        } else {
          alert("Please write a brief reflection before submitting.");
        }
        if (reflectionEl) reflectionEl.focus();
        return;
      }

      // Mark Day as Completed
      if (!this.state.completedDays.includes(dayNumber)) {
        this.state.completedDays.push(dayNumber);
      }

      // Unlock Next Day
      if (dayNumber < 7) {
        this.state.currentUnlockedDay = Math.max(this.state.currentUnlockedDay, dayNumber + 1);
      }

      // Store reflection result
      this.state.dayReflections[dayNumber] = {
        score: `${score}/${totalQuestions}`,
        reflection: reflectionText,
        completedAt: new Date().toISOString()
      };

      this.saveProgress();

      // Show immediate feedback on quiz block
      currentMod.quizQuestions.forEach(q => {
        const questionBlock = document.getElementById(`qblock_${q.id}`);
        if (questionBlock) {
          questionBlock.querySelectorAll('.option-label').forEach((lbl, idx) => {
            if (idx === q.correctIndex) {
              lbl.classList.add('is-correct');
            } else if (idx === this.state.selectedAnswers[q.id]) {
              lbl.classList.add('is-incorrect');
            }
          });
        }
      });

      // Show result celebration
      const quizContainer = document.getElementById('dailyReflectionQuizSection');
      if (quizContainer) {
        const nextDay = dayNumber + 1;
        const isFinished = dayNumber >= 7;

        quizContainer.innerHTML = `
          <div class="quiz-congrats-card">
            <div class="congrats-icon">
              <i data-lucide="${isFinished ? 'award' : 'check-circle-2'}" style="width:34px;height:34px;"></i>
            </div>
            <h3>${isFinished ? '🏆 Congratulations on Graduating!' : `🎉 Congratulations! Day 0${dayNumber} Completed!`}</h3>
            <p>
              ${isFinished 
                ? 'You have successfully completed the entire 7-Day Rajayoga Meditation Course. May divine peace and wisdom illuminate every step of your life journey.' 
                : `Your score: <strong>${score} of ${totalQuestions}</strong>. Day 0${nextDay} has been unlocked automatically!`}
            </p>
            
            <div class="congrats-buttons-row">
              ${!isFinished ? `
                <button class="btn-next-day" onclick="bkCourse.selectDay(${nextDay})">
                  <span>Start Day 0${nextDay} Now</span>
                  <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
                </button>
              ` : `
                <button class="btn-next-day" onclick="bkCourse.renderCertificate()">
                  <i data-lucide="award" style="width:16px;height:16px;"></i>
                  <span>View Course Certificate</span>
                </button>
              `}
              <button class="btn-review-answers" onclick="bkCourse.render()">
                <span>Review Lesson</span>
              </button>
            </div>

            ${isFinished ? `
              <div style="margin-top:1.75rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.15);">
                <button class="btn-hero-primary" onclick="bkApp.openRegistrationModal('7-Day Course In-Person Batch')">
                  <i data-lucide="map-pin" style="width:16px;height:16px;"></i>
                  <span>Register for In-Person Batch at Kozhikode Center (Free)</span>
                </button>
              </div>
            ` : ''}
          </div>
        `;

        if (window.lucide) {
          window.lucide.createIcons();
        }

        quizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Update header progress bar & stepper
      this.updateProgressCards();

      if (window.bkApp && window.bkApp.toast) {
        window.bkApp.toast(`✨ Day 0${dayNumber} successfully completed!`, "success");
      }
    }

    renderCertificate() {
      const container = document.getElementById('dailyReflectionQuizSection');
      if (!container) return;

      const user = (window.bkAuth && window.bkAuth.getUser) ? window.bkAuth.getUser() : null;
      const initialStudentName = (user && user.name) ? user.name : "Dedicated Seeker of Peace";

      const dateStr = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      container.innerHTML = `
        <div class="certificate-card" id="courseCertificateCard">
          <img src="assets/images/logo.png" alt="Brahma Kumaris Logo" class="certificate-emblem">
          <h2 class="certificate-header-org">PRAJAPITA BRAHMA KUMARIS ISHWARIYA VISHWA VIDYALAYA</h2>
          <div class="certificate-sub-org">LIGHT PALACE, ASHOKAPURAM, KOZHIKODE</div>

          <h3 class="certificate-title">CERTIFICATE OF SPIRITUAL STUDY</h3>
          <p class="certificate-body">
            This is to certify that the dedicated seeker has successfully completed the foundational
            <strong>7-Day Rajayoga Meditation Course</strong> in Soul-Consciousness, Supreme Connection, 
            the Infallible Law of Karma, the 8 Spiritual Powers, and Pure Living.
          </p>

          <div class="student-name-input-group">
            <input type="text" id="certStudentName" class="student-name-input" placeholder="Enter Your Name for Certificate" value="${initialStudentName}">
          </div>

          <div style="font-size:0.85rem;color:rgba(255,255,255,0.7);margin-bottom:1.5rem;">
            Completed on: <strong>${dateStr}</strong> • Kozhikode, Kerala
          </div>

          <div class="congrats-buttons-row">
            <button class="btn-next-day" onclick="window.print()">
              <i data-lucide="printer" style="width:16px;height:16px;"></i>
              <span>Print / Save Certificate</span>
            </button>
            <button class="btn-review-answers" onclick="bkApp.openRegistrationModal('Advanced Murli Classes')">
              <span>Join Daily Murli & Meditation Class</span>
            </button>
          </div>

          <div class="certificate-footer-signatures">
            <div>
              <div style="color:#ffd68a;font-weight:700;">BK Sister Sunanda / BK Manoj</div>
              <div>Center In-Charge, Ashokapuram</div>
            </div>
            <div>
              <div style="color:#ffd68a;font-weight:700;">Brahma Kumaris Kozhikode</div>
              <div>Om Shanti • ഓം ശാന്തി</div>
            </div>
          </div>
        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }

      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    switchGateTab(tab) {
      const signinBtn = document.getElementById('gateTabBtnSignin');
      const signupBtn = document.getElementById('gateTabBtnSignup');
      const nameGroup = document.getElementById('gateNameGroup');
      const modeInput = document.getElementById('gateFormMode');
      const submitBtnText = document.getElementById('gateSubmitBtnText');

      if (tab === 'signup') {
        if (signupBtn) signupBtn.classList.add('active');
        if (signinBtn) signinBtn.classList.remove('active');
        if (nameGroup) nameGroup.style.display = 'block';
        if (modeInput) modeInput.value = 'signup';
        if (submitBtnText) submitBtnText.textContent = 'Create Account & Begin';
      } else {
        if (signinBtn) signinBtn.classList.add('active');
        if (signupBtn) signupBtn.classList.remove('active');
        if (nameGroup) nameGroup.style.display = 'none';
        if (modeInput) modeInput.value = 'signin';
        if (submitBtnText) submitBtnText.textContent = 'Sign In to 7-Day Course';
      }
    }

    handleGateSubmit(e) {
      e.preventDefault();
      const mode = (document.getElementById('gateFormMode') || {}).value || 'signin';
      const name = (document.getElementById('gateInputName') || {}).value || '';
      const email = (document.getElementById('gateInputEmail') || {}).value || '';
      const pass = (document.getElementById('gateInputPassword') || {}).value || '';

      if (mode === 'signup' && !name.trim()) {
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast('Please enter your full name.', 'warning');
        }
        return;
      }

      if (!email.trim()) {
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast('Please enter your email address.', 'warning');
        }
        return;
      }

      if (window.bkAuth) {
        window.bkAuth.loginWithEmail(name || email.split('@')[0], email, pass);
      }
    }

    renderAuthGate(container) {
      container.innerHTML = `
        <div class="section-padding" style="padding-top:1.5rem;padding-bottom:3.5rem;">
          <div class="container course-platform-wrapper">
            
            <!-- High Contrast Section Header -->
            <div class="section-header">
              <span class="section-kicker">Complimentary Spiritual Education • സൗജന്യ രാജയോഗ പഠനം</span>
              <h2>7-Day Rajayoga Meditation Course</h2>
              <div class="section-title-ml">7 ദിവസത്തെ രാജയോഗ ആത്മീയ പഠന യാത്ര</div>
              <div class="divider-sun"></div>
              <p class="section-subtitle">
                A structured, step-by-step foundation course in Raja Yoga meditation. Sign in or create your student account to access the daily video lessons, submit your reflections, and track your 7-day path to self-mastery.
              </p>
            </div>

            <!-- Modern Auth Gate Card -->
            <div class="course-auth-gate-card">
              <div class="auth-gate-aura">
                <div class="auth-gate-om-icon">
                  <i data-lucide="shield-check" style="width:36px;height:36px;color:#ffd700;"></i>
                </div>
                <div class="auth-gate-badge">
                  <i data-lucide="lock" style="width:12px;height:12px;"></i>
                  <span>Student Access Required • വിദ്യാർത്ഥി ലോഗിൻ</span>
                </div>
                <h3 class="auth-gate-title">Enter the Sacred Sanctuary</h3>
                <p class="auth-gate-desc">
                  Sign in to unlock Day 1–7 video modules, save your reflection notes, and earn your verified <strong>Certificate of Spiritual Study</strong>.
                </p>
              </div>

              <!-- 1-Click Google Sign In -->
              <button type="button" class="btn-auth-google" onclick="window.bkAuth.loginWithGoogle()">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div class="auth-divider">
                <span>or continue with email</span>
              </div>

              <!-- Auth Gate Tabs (Sign In / Register) -->
              <div class="auth-gate-tabs">
                <button type="button" class="auth-gate-tab-btn active" id="gateTabBtnSignin" onclick="bkCourse.switchGateTab('signin')">
                  Sign In
                </button>
                <button type="button" class="auth-gate-tab-btn" id="gateTabBtnSignup" onclick="bkCourse.switchGateTab('signup')">
                  Create Student Account
                </button>
              </div>

              <!-- Email Form -->
              <form class="auth-gate-form" id="courseGateAuthForm" onsubmit="bkCourse.handleGateSubmit(event)">
                <input type="hidden" id="gateFormMode" value="signin">
                
                <div class="auth-input-group" id="gateNameGroup" style="display:none;">
                  <label for="gateInputName">Your Full Name (for Certificate)</label>
                  <input type="text" id="gateInputName" class="auth-input" placeholder="e.g. Anand Sharma">
                </div>

                <div class="auth-input-group">
                  <label for="gateInputEmail">Email Address</label>
                  <input type="email" id="gateInputEmail" class="auth-input" placeholder="you@example.com" required>
                </div>

                <div class="auth-input-group">
                  <label for="gateInputPassword">Password</label>
                  <input type="password" id="gateInputPassword" class="auth-input" placeholder="••••••••" required>
                </div>

                <button type="submit" class="btn-auth-submit" id="gateSubmitBtn">
                  <i data-lucide="sparkles" style="width:16px;height:16px;"></i>
                  <span id="gateSubmitBtnText">Sign In to 7-Day Course</span>
                </button>
              </form>

              <!-- 1-Click Instant Demo Access -->
              <div class="auth-demo-box">
                <div class="auth-demo-label">Just exploring? Try instant access:</div>
                <button type="button" class="btn-demo-access" onclick="window.bkAuth.loginDemo()">
                  <i data-lucide="zap" style="width:15px;height:15px;color:#ffd700;"></i>
                  <span>1-Click Instant Guest Access (Demo Student)</span>
                </button>
              </div>

              <!-- Course Perks Grid -->
              <div class="auth-perks-grid">
                <div class="auth-perk-item">
                  <i data-lucide="play-circle" style="width:18px;height:18px;color:#ffd700;"></i>
                  <div>
                    <strong>Sequential Learning</strong>
                    <span>Day 1–7 video lectures & reflection guides</span>
                  </div>
                </div>
                <div class="auth-perk-item">
                  <i data-lucide="award" style="width:18px;height:18px;color:#ffd700;"></i>
                  <div>
                    <strong>Course Certificate</strong>
                    <span>Personalized completion credential</span>
                  </div>
                </div>
                <div class="auth-perk-item">
                  <i data-lucide="cloud" style="width:18px;height:18px;color:#ffd700;"></i>
                  <div>
                    <strong>Sync Progress</strong>
                    <span>Resume smoothly anytime on any device</span>
                  </div>
                </div>
                <div class="auth-perk-item">
                  <i data-lucide="heart-handshake" style="width:18px;height:18px;color:#ffd700;"></i>
                  <div>
                    <strong>100% Complimentary</strong>
                    <span>Universal spiritual knowledge for all souls</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    render() {
      const container = document.getElementById('tab-course');
      if (!container) return;

      const isAuthed = Boolean(window.bkAuth && window.bkAuth.isLoggedIn());
      if (!isAuthed) {
        this.renderAuthGate(container);
        return;
      }

      const currentUser = window.bkAuth.getUser() || { name: 'Enrolled Seeker', email: 'seeker@bkkozhikode.com' };
      this.curriculum = this.getCurriculum();
      const activeMod = this.curriculum.find(m => m.day === this.state.activeDay) || this.curriculum[0];
      const completedCount = this.state.completedDays.length;
      const progressPercent = Math.round((completedCount / 7) * 100);
      const isVideoWatched = Boolean(this.state.watchedVideos[activeMod.day]) || this.state.completedDays.includes(activeMod.day);
      const isDayCompleted = this.state.completedDays.includes(activeMod.day);

      container.innerHTML = `
        <div class="section-padding" style="padding-top:1rem;">
          <div class="container course-platform-wrapper">
            
            <!-- Section Header -->
            <div class="section-header">
              <span class="section-kicker">Complimentary Spiritual Education • സൗജന്യ രാജയോഗ പഠനം</span>
              <h2>7-Day Rajayoga Meditation Course</h2>
              <div class="section-title-ml">7 ദിവസത്തെ രാജയോഗ ആത്മീയ പഠന യാത്ര</div>
              <div class="divider-sun"></div>
              <p class="section-subtitle">
                A structured, step-by-step foundation course in Raja Yoga meditation. Watch each daily video lesson attentively, reflect on its divine realizations, and complete the daily quiz to unlock your next day of spiritual awakening.
              </p>
            </div>

            <!-- Overall Course Progress Card -->
            <div class="course-progress-card" id="courseProgressCard">
              <div class="user-auth-badge-row">
                <div class="user-auth-info">
                  <div class="user-auth-avatar-circle">
                    ${currentUser.avatar 
                      ? `<img src="${currentUser.avatar}" alt="${currentUser.name}" class="user-auth-avatar-img" onerror="this.parentElement.innerHTML='<i data-lucide=\\'user\\' style=\\'width:18px;height:18px;color:#ffd700;\\'></i>'">` 
                      : `<i data-lucide="user" style="width:18px;height:18px;color:#ffd700;"></i>`}
                  </div>
                  <div class="user-auth-details">
                    <div class="user-auth-name-line">
                      <span class="user-auth-name">${currentUser.name}</span>
                      <span class="user-auth-badge">Enrolled Seeker</span>
                    </div>
                    <div class="user-auth-email">${currentUser.email} • 7-Day Journey Synced</div>
                  </div>
                </div>
                <div class="user-auth-actions">
                  <button type="button" class="btn-auth-logout" onclick="window.bkAuth.logout()" title="Sign out of student account">
                    <i data-lucide="log-out" style="width:13px;height:13px;"></i>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              <div class="course-progress-header">
                <div class="progress-title-group">
                  <h3>
                    <i data-lucide="sparkles" style="width:18px;height:18px;color:#ffd064;"></i>
                    <span>Your Learning Journey</span>
                  </h3>
                  <p>Step-by-step spiritual mastery through soul consciousness and meditation</p>
                </div>
                <div class="progress-stats-group">
                  <span class="progress-stat-pill">
                    <i data-lucide="check-circle" style="width:15px;height:15px;color:#10b981;"></i>
                    <span>${completedCount} of 7 Days Completed (${progressPercent}%)</span>
                  </span>
                  ${completedCount > 0 ? `
                    <button class="btn-reset-course" onclick="bkCourse.resetProgress()" title="Restart course from Day 1">
                      <i data-lucide="rotate-ccw" style="width:13px;height:13px;"></i>
                      <span>Reset Progress</span>
                    </button>
                  ` : ''}
                </div>
              </div>
              <div class="course-progress-bar-track">
                <div class="course-progress-bar-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>

            <!-- Top Stepper Navigation (Days 1–7) -->
            <nav class="course-stepper-nav" aria-label="7-Day Course Stepper">
              ${this.curriculum.map(mod => {
                const isLocked = mod.day > this.state.currentUnlockedDay;
                const isComplete = this.state.completedDays.includes(mod.day);
                const isActive = mod.day === this.state.activeDay;

                let iconHtml = '';
                if (isComplete) {
                  iconHtml = `<i data-lucide="check-circle-2" class="step-day-icon icon-complete"></i>`;
                } else if (isLocked) {
                  iconHtml = `<i data-lucide="lock" class="step-day-icon icon-locked"></i>`;
                } else {
                  iconHtml = `<i data-lucide="play-circle" class="step-day-icon icon-active"></i>`;
                }

                return `
                  <button 
                    type="button"
                    class="step-day-btn ${isActive ? 'active' : ''} ${isComplete ? 'completed' : ''} ${isLocked ? 'locked' : ''}"
                    onclick="bkCourse.selectDay(${mod.day})"
                    aria-label="Day ${mod.day}: ${mod.title}"
                    ${isLocked ? 'aria-disabled="true"' : ''}>
                    <span class="step-day-badge">Day 0${mod.day}</span>
                    <span class="step-day-title">${mod.keyword}</span>
                    ${iconHtml}
                  </button>
                `;
              }).join('')}
            </nav>

            <!-- Main Learning Workspace -->
            <div class="course-main-layout" id="rajyogaLessonStage">
              
              <!-- Left Sidebar: Curriculum List -->
              <aside class="course-sidebar-panel" aria-label="Curriculum Outline">
                <div class="sidebar-title">
                  <span>Course Modules</span>
                  <span style="font-size:0.75rem;color:rgba(255,255,255,0.5);">7 Lessons</span>
                </div>
                <div class="sidebar-day-list">
                  ${this.curriculum.map(mod => {
                    const isLocked = mod.day > this.state.currentUnlockedDay;
                    const isComplete = this.state.completedDays.includes(mod.day);
                    const isActive = mod.day === this.state.activeDay;

                    return `
                      <div 
                        class="sidebar-day-item ${isActive ? 'active' : ''} ${isComplete ? 'completed' : ''} ${isLocked ? 'locked' : ''}"
                        onclick="bkCourse.selectDay(${mod.day})"
                        role="button"
                        tabindex="${isLocked ? '-1' : '0'}">
                        <div class="day-item-number">
                          ${isComplete ? `<i data-lucide="check" style="width:14px;height:14px;"></i>` : (isLocked ? `<i data-lucide="lock" style="width:12px;height:12px;"></i>` : `0${mod.day}`)}
                        </div>
                        <div class="day-item-details">
                          <div class="day-item-heading">${mod.title}</div>
                          <div class="day-item-ml">${mod.titleMl}</div>
                          <div class="day-item-meta">
                            <span><i data-lucide="clock" style="width:11px;height:11px;display:inline-block;vertical-align:middle;"></i> ${mod.duration}</span>
                            ${isComplete ? '<span style="color:#10b981;">• Completed</span>' : (isLocked ? '<span style="color:rgba(255,255,255,0.4);">• Locked</span>' : '<span style="color:#fbbf24;">• Active</span>')}
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>

                <div class="sidebar-center-cta">
                  <strong>Prefer in-person guidance?</strong>
                  <p style="margin:0.25rem 0 0;font-size:0.75rem;line-height:1.4;">Free morning & evening classes at Ashokapuram Light Palace and Kozhikode branches.</p>
                  <button type="button" onclick="bkApp.openRegistrationModal('7-Day Course Center Batch')">
                    Join Kozhikode Center Batch
                  </button>
                </div>
              </aside>

              <!-- Right Stage: Active Lesson & Classroom -->
              <main class="course-stage-panel">
                
                <!-- Lesson Header Card -->
                <article class="lesson-header-card">
                  <div class="lesson-top-meta">
                    <span class="lesson-day-pill">Day 0${activeMod.day} of 07</span>
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                      <span class="lesson-duration-badge">
                        <i data-lucide="clock" style="width:13px;height:13px;"></i>
                        <span>${activeMod.duration}</span>
                      </span>
                      <span class="lesson-status-badge ${isDayCompleted ? 'completed' : 'in-progress'}">
                        <i data-lucide="${isDayCompleted ? 'check-circle-2' : 'sparkles'}" style="width:13px;height:13px;"></i>
                        <span>${isDayCompleted ? 'Lesson Completed' : 'In Progress'}</span>
                      </span>
                    </div>
                  </div>

                  <h3 class="lesson-title">${activeMod.title}</h3>
                  <div class="lesson-title-ml">${activeMod.titleMl}</div>
                  <p class="lesson-description">${activeMod.summary}</p>

                  <div class="lesson-key-insight">
                    <strong>✨ Core Realization:</strong> "${activeMod.keyInsight}"
                  </div>
                </article>

                <!-- Video Player Stage Card -->
                <section class="video-stage-card" aria-label="Lesson Video Player">
                  <div class="video-frame-wrapper" id="ytVideoFrameWrapper">
                    <div class="yt-header-shield" aria-hidden="true" title="Brahma Kumaris Rajyoga Meditation"></div>
                    <div class="yt-watermark-shield" aria-hidden="true"></div>
                    <div id="rajyogaCoursePlayer"></div>
                  </div>
                  <div class="video-status-bar">
                    <div class="video-status-indicator">
                      <span class="pulse-dot ${isVideoWatched ? 'dot-watched' : 'dot-watching'}"></span>
                      <span>
                        ${isVideoWatched 
                          ? '✅ <strong>Video Completed:</strong> Today\'s Reflection &amp; Quiz is unlocked below.' 
                          : '🔴 <strong>Video In Progress:</strong> Watch until the end to unlock today\'s reflection &amp; quiz.'}
                      </span>
                    </div>
                  </div>
                </section>

                <!-- Daily Reflection & Quiz Section -->
                <section class="quiz-section-card" id="dailyReflectionQuizSection" aria-label="Daily Reflection and Quiz">
                  ${!isVideoWatched ? `
                    <!-- Locked Quiz State -->
                    <div class="quiz-locked-card">
                      <div class="locked-icon-aura">
                        <i data-lucide="lock" style="width:28px;height:28px;"></i>
                      </div>
                      <h4>Daily Reflection &amp; Quiz is Locked</h4>
                      <p>
                        Please watch the video lesson above. The quiz and spiritual reflection questions will automatically activate once the video finishes playing.
                      </p>
                    </div>
                  ` : `
                    <!-- Unlocked Interactive Quiz Form -->
                    <div class="quiz-header">
                      <h3>
                        <i data-lucide="help-circle" style="width:20px;height:20px;color:#ffd064;"></i>
                        <span>Day 0${activeMod.day} • Daily Reflection & Quiz</span>
                      </h3>
                      <p>Confirm your spiritual grasp of today's lesson and record your personal reflection.</p>
                    </div>

                    <form class="quiz-questions-form" onsubmit="bkCourse.submitQuiz(event, ${activeMod.day})">
                      ${activeMod.quizQuestions.map((q, qIndex) => `
                        <div class="quiz-question-block" id="qblock_${q.id}">
                          <div class="question-text">
                            <span class="question-number">Q${qIndex + 1}.</span>
                            <span>${q.question}</span>
                          </div>
                          <div class="question-options-list">
                            ${q.options.map((opt, optIdx) => {
                              const isChecked = this.state.selectedAnswers[q.id] === optIdx;
                              return `
                                <label class="option-label ${isChecked ? 'selected' : ''}" onclick="bkCourse.selectOption('${q.id}', ${optIdx})">
                                  <input 
                                    type="radio" 
                                    name="q_${q.id}" 
                                    value="${optIdx}" 
                                    ${isChecked ? 'checked' : ''} 
                                    required>
                                  <span>${opt}</span>
                                </label>
                              `;
                            }).join('')}
                          </div>
                        </div>
                      `).join('')}

                      <!-- Reflection Prompt -->
                      <div class="reflection-block">
                        <label class="reflection-label" for="reflectionText_${activeMod.day}">
                          🕊️ Personal Spiritual Reflection
                        </label>
                        <div class="reflection-prompt-text">
                          ${activeMod.reflectionPrompt}
                        </div>
                        <textarea 
                          id="reflectionText_${activeMod.day}" 
                          class="reflection-textarea" 
                          placeholder="Write your personal reflections and takeaways here..."
                          required>${(this.state.dayReflections[activeMod.day] && this.state.dayReflections[activeMod.day].reflection) || ''}</textarea>
                      </div>

                      <div class="quiz-actions-bar">
                        <span style="font-size:0.8rem;color:rgba(255,255,255,0.65);">
                          * Submitting answers completes Day 0${activeMod.day} and unlocks Day 0${Math.min(activeMod.day + 1, 7)}.
                        </span>
                        <button type="submit" class="btn-submit-quiz">
                          <i data-lucide="check" style="width:16px;height:16px;"></i>
                          <span>Submit Answers &amp; Complete Day 0${activeMod.day}</span>
                        </button>
                      </div>
                    </form>
                  `}
                </section>

              </main>
            </div>

          </div>
        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }

      this.mountActivePlayer();
    }

    updateProgressCards() {
      const completedCount = this.state.completedDays.length;
      const progressPercent = Math.round((completedCount / 7) * 100);
      const fillEl = document.querySelector('.course-progress-bar-fill');
      if (fillEl) fillEl.style.width = `${progressPercent}%`;

      const statEl = document.querySelector('.progress-stat-pill span');
      if (statEl) statEl.textContent = `${completedCount} of 7 Days Completed (${progressPercent}%)`;
    }

    mountActivePlayer() {
      this.curriculum = this.getCurriculum();
      const activeMod = this.curriculum.find(m => m.day === this.state.activeDay) || this.curriculum[0];
      const videoId = activeMod.youtubeVideoId || (window.bkUtils ? window.bkUtils.extractYouTubeVideoId(activeMod.youtubeUrl || '') : '') || 'xeZ_HBW1mq4';

      // Clear existing player reference
      if (this.ytPlayer && typeof this.ytPlayer.destroy === 'function') {
        try {
          this.ytPlayer.destroy();
        } catch (e) {}
        this.ytPlayer = null;
      }

      const playerDiv = document.getElementById('rajyogaCoursePlayer');
      if (!playerDiv) return;

      if (window.YT && window.YT.Player) {
        try {
          this.ytPlayer = new window.YT.Player('rajyogaCoursePlayer', {
            videoId: videoId,
            playerVars: {
              controls: 1,
              enablejsapi: 1,
              rel: 0,
              modestbranding: 1,
              iv_load_policy: 3,
              playsinline: 1,
              fs: 1,
              disablekb: 0
            },
            events: {
              onStateChange: (event) => {
                // YT.PlayerState.ENDED is 0
                if (event.data === 0) {
                  this.handleVideoEnded(activeMod.day);
                }
              }
            }
          });
        } catch (err) {
          console.warn('Error mounting YouTube Player via API, fallback to iframe:', err);
          this.fallbackIframe(videoId, activeMod.day);
        }
      } else {
        // API still loading or blocked, use clean iframe with fallback
        this.fallbackIframe(videoId, activeMod.day);
      }

      this.setupMessageListener();
    }

    fallbackIframe(videoId, dayNumber) {
      const container = document.getElementById('ytVideoFrameWrapper');
      if (!container) return;
      container.innerHTML = `
        <div class="yt-header-shield" aria-hidden="true" title="Brahma Kumaris Rajyoga Meditation"></div>
        <div class="yt-watermark-shield" aria-hidden="true"></div>
        <iframe 
          id="rajyogaCoursePlayer"
          src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&iv_load_policy=3&enablejsapi=1&playsinline=1&fs=1&color=white" 
          title="Day ${dayNumber} Video Lesson" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen 
          loading="lazy">
        </iframe>
      `;
    }

    setupMessageListener() {
      if (this._hasMessageListener) return;
      this._hasMessageListener = true;
      window.addEventListener('message', (event) => {
        try {
          if (!event.data) return;
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data && data.event === 'onStateChange' && (data.info === 0 || data.data === 0)) {
            const activeMod = this.curriculum.find(m => m.day === this.state.activeDay) || this.curriculum[0];
            this.handleVideoEnded(activeMod.day);
          }
        } catch (e) {}
      });
    }
  }

  // Export globally
  window.bkCourse = new RajyogaCourseManager();

})();
