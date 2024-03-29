const airlineColors = {
    "flights_1I_2024-01-01.geojson": "#d4f094",  // Netjets
    "flights_4Z_2024-01-01.geojson": "#dbefd9",  // Airlink, South Africa
    "flights_5X_2024-01-01.geojson": "#f619f7",  // UPS Airlines, USA
    "flights_6E_2024-01-01.geojson": "#d4f094",  // IndiGo, India
    "flights_8U_2024-01-01.geojson": "#385ab7",  // Afriqiyah Airways, Libya
    "flights_9W_2024-01-01.geojson": "#e4b7f0",  // Jet Airways, India (historical context)
    "flights_A9_2024-01-01.geojson": "#270910",  // Georgian Airways, Georgia
    "flights_AA_2024-01-01.geojson": "#51ff40",  // American Airlines, USA
    "flights_AC_2024-01-01.geojson": "#586e00",  // Air Canada, Canada
    "flights_AF_2024-01-01.geojson": "#c38930",  // Air France, France
    "flights_AI_2024-01-01.geojson": "#9ba6f0",  // Air India, India
    "flights_AM_2024-01-01.geojson": "#ea8ca0",  // Aeroméxico, Mexico
    "flights_AR_2024-01-01.geojson": "#e64900",  // Aerolíneas Argentinas, Argentina
    "flights_AS_2024-01-01.geojson": "#586e00",  // Alaska Airlines, USA
    "flights_AT_2024-01-01.geojson": "#fe9c40",  // Royal Air Maroc, Morocco
    "flights_AY_2024-01-01.geojson": "#74b898",  // Finnair, Finland
    "flights_AZ_2024-01-01.geojson": "#d05b97",  // Alitalia, Italy
    "flights_B6_2024-01-01.geojson": "#0000ff",  // JetBlue Airways, USA
    "flights_BA_2024-01-01.geojson": "#56eb6e",  // British Airways, United Kingdom
    "flights_BG_2024-01-01.geojson": "#5192e0",  // Biman Bangladesh Airlines, Bangladesh
    "flights_BI_2024-01-01.geojson": "#e3b2f2",  // Royal Brunei Airlines, Brunei
    "flights_BT_2024-01-01.geojson": "#bba1f8",  // Air Baltic, Latvia
    "flights_CA_2024-01-01.geojson": "#2ae877",  // Air China, China
    "flights_CX_2024-01-01.geojson": "#8c8c0e",  // Cathay Pacific, Hong Kong
    "flights_CZ_2024-01-01.geojson": "#3b2a9d",  // China Southern Airlines, China
    "flights_D8_2024-01-01.geojson": "#a66e59",  // Norwegian Air International, Norway
    "flights_DL_2024-01-01.geojson": "#3441ca",  // Delta Air Lines, USA
    "flights_EK_2024-01-01.geojson": "#698bb7",  // Emirates, United Arab Emirates
    "flights_ET_2024-01-01.geojson": "#9240a9",  // Ethiopian Airlines, Ethiopia
    "flights_EY_2024-01-01.geojson": "#7110fc",  // Etihad Airways, United Arab Emirates
    "flights_F9_2024-01-01.geojson": "#606b76",  // Frontier Airlines, USA
    "flights_F9_2024-01-01.geojson": "#CDFA01",  // Frontier, USA
    "flights_FG_2024-01-01.geojson": "#10f3f9",  // Ariana Afghan Airlines, Afghanistan
    "flights_FJ_2024-01-01.geojson": "#c11970",  // Fiji Airways, Fiji
    "flights_FR_2024-01-01.geojson": "#8747f9",  // Ryanair, Ireland
    "flights_FX_2024-01-01.geojson": "#c75808", // FedEx Express, USA
    "flights_G3_2024-01-01.geojson": "#a000ad", // Gol Linhas Aéreas, Brazil
    "flights_G4_2024-01-01.geojson": "#c991cf", // Allegiant Air, USA
    "flights_GA_2024-01-01.geojson": "#9282f9", // Garuda Indonesia, Indonesia
    "flights_GF_2024-01-01.geojson": "#d86750", // Gulf Air, Bahrain
    "flights_HA_2024-01-01.geojson": "#c54ec0", // Hawaiian Airlines, USA
    "flights_HZ_2024-01-01.geojson": "#8ac4d2", // Aurora, Russia
    "flights_IA_2024-01-01.geojson": "#128ca4", // Iraqi Airways, Iraq
    "flights_IB_2024-01-01.geojson": "#68a638", // Iberia, Spain
    "flights_IR_2024-01-01.geojson": "#d6d1da", // Iran Air, Iran
    "flights_J2_2024-01-01.geojson": "#751cb4", // Azerbaijan Airlines, Azerbaijan
    "flights_JB_2024-01-01.geojson": "#19e183", // Helijet, Canada (fictional for this context)
    "flights_JL_2024-01-01.geojson": "#97919e", // Japan Airlines, Japan
    "flights_KE_2024-01-01.geojson": "#44e611", // Korean Air, South Korea
    "flights_KL_2024-01-01.geojson": "#32d350", // KLM Royal Dutch Airlines, Netherlands
    "flights_KQ_2024-01-01.geojson": "#ec386f", // Kenya Airways, Kenya
    "flights_KU_2024-01-01.geojson": "#367751", // Kuwait Airways, Kuwait
    "flights_LA_2024-01-01.geojson": "#777530", // LATAM Chile, Chile
    "flights_LH_2024-01-01.geojson": "#975392", // Lufthansa, Germany
    "flights_LO_2024-01-01.geojson": "#2100f1", // LOT Polish Airlines, Poland
    "flights_LX_2024-01-01.geojson": "#b9d14a", // Swiss International Air Lines, Switzerland
    "flights_LY_2024-01-01.geojson": "#f123d1", // El Al, Israel
    "flights_ME_2024-01-01.geojson": "#b7386c", // Middle East Airlines, Lebanon
    "flights_MH_2024-01-01.geojson": "#25b519", // Malaysia Airlines, Malaysia
    "flights_MS_2024-01-01.geojson": "#3e3b7b", // EgyptAir, Egypt
    "flights_MU_2024-01-01.geojson": "#42f3f4", // China Eastern Airlines, China
    "flights_NH_2024-01-01.geojson": "#e3632d", // All Nippon Airways, Japan
    "flights_NK_2024-01-01.geojson": "#573001", // Spirit Airlines, USA
    "flights_NM_2024-01-01.geojson": "#bdb7c7", // Manx Airlines, Isle of Man (historical or fictional context)
    "flights_NZ_2024-01-01.geojson": "#5232ad", // Air New Zealand, New Zealand
    "flights_OK_2024-01-01.geojson": "#8f0c9f", // Czech Airlines, Czech Republic
    "flights_OM_2024-01-01.geojson": "#a83041", // MIAT Mongolian Airlines, Mongolia
    "flights_OS_2024-01-01.geojson": "#aa8f86", // Austrian Airlines, Austria
    "flights_PC_2024-01-01.geojson": "#991bb0", // Pegasus Airlines, Turkey
    "flights_PK_2024-01-01.geojson": "#f8aedc", // Pakistan International Airlines, Pakistan
    "flights_PR_2024-01-01.geojson": "#d40514", // Philippine Airlines, Philippines
    "flights_QF_2024-01-01.geojson": "#aa48d1", // Qantas, Australia
    "flights_QH_2024-01-01.geojson": "#8aece8", // Bamboo Airways, Vietnam (fictional for this context)
    "flights_QR_2024-01-01.geojson": "#5dab5c", // Qatar Airways, Qatar
    "flights_QZ_2024-01-01.geojson": "#ce768c", // Indonesia AirAsia, Indonesia
    "flights_RJ_2024-01-01.geojson": "#402e1f", // Royal Jordanian, Jordan
    "flights_RQ_2024-01-01.geojson": "#7faa11", // Kam Air, Afghanistan (fictional for this context)
    "flights_S7_2024-01-01.geojson": "#94b753", // S7 Airlines, Russia
    "flights_SG_2024-01-01.geojson": "#25798a", // SpiceJet, India
    "flights_SK_2024-01-01.geojson": "#ceb709", // SAS Scandinavian Airlines, Sweden/Denmark/Norway
    "flights_SN_2024-01-01.geojson": "#9c528e", // Brussels Airlines, Belgium
    "flights_SQ_2024-01-01.geojson": "#e7b216", // Singapore Airlines, Singapore
    "flights_SU_2024-01-01.geojson": "#9a271c", // Aeroflot, Russia
    "flights_SV_2024-01-01.geojson": "#542867", // Saudia, Saudi Arabia
    "flights_SZ_2024-01-01.geojson": "#5a7320", // Somon Air, Tajikistan (fictional for this context)
    "flights_T5_2024-01-01.geojson": "#859b8e", // Turkmenistan Airlines, Turkmenistan
    "flights_TG_2024-01-01.geojson": "#c0cfb3", // Thai Airways International, Thailand
    "flights_TK_2024-01-01.geojson": "#f31a60", // Turkish Airlines, Turkey
    "flights_TP_2024-01-01.geojson": "#bd269d", // TAP Air Portugal, Portugal
    "flights_TV_2024-01-01.geojson": "#d7fa54", // Tibet Airlines, China (fictional for this context)
    "flights_U2_2024-01-01.geojson": "#5bd3d2", // easyJet, United Kingdom
    "flights_U6_2024-01-01.geojson": "#f56dfb", // Ural Airlines, Russia
    "flights_UA_2024-01-01.geojson": "#14c6b8", // United Airlines, USA
    "flights_UX_2024-01-01.geojson": "#5ec6e3", // Air Europa, Spain
    "flights_VN_2024-01-01.geojson": "#000000", // Vietnam Airlines, Vietnam
    "flights_VS_2024-01-01.geojson": "#d07810", // Virgin Atlantic, United Kingdom
    "flights_VY_2024-01-01.geojson": "#5bee79", // Vueling, Spain
    "flights_W6_2024-01-01.geojson": "#cb2db5", // Wizz Air, Hungary
    "flights_WN_2024-01-01.geojson": "#2d866c", // Southwest Airlines, USA
    "flights_WS_2024-01-01.geojson": "#ec7c1b", // WestJet, Canada
    "flights_WY_2024-01-01.geojson": "#44c9db", // Oman Air, Oman
    "flights_XP_2024-01-01.geojson": "#f619f7", // Xtra Airways, USA
    "flights_Y7_2024-01-01.geojson": "#dd7d83", // NordStar Airlines, Russia (fictional context)
    "flights_YX_2024-01-01.geojson": "#874393", // Republic Airways, USA
    "flights_ZH_2024-01-01.geojson": "#a2c4c9", // Shenzhen Airlines, China (added for continuity)

    "flights_EI_2024-01-01.geojson": "#008374",  // Aer Lingus, Ireland
    "flights_BE_2024-01-01.geojson": "#00b2d5",  // Flybe, United Kingdom
    "flights_X3_2024-01-01.geojson": "#e2001a",  // TUI Airways, United Kingdom

    "flights_EW_2024-01-01.geojson": "#00a9e0",  // Eurowings, Germany

    "flights_UT_2024-01-01.geojson": "#00F",  //
    "flights_WZ_2024-01-01.geojson": "#F00",  //

    "flights_Y7_2024-01-01.geojson": "#f619f7",  //
    "flights_Y4_2024-01-01.geojson": "#14c6b8",  //
    "flights_WB_2024-01-01.geojson": "#14c6b8",  //
    "flights_UM_2024-01-01.geojson": "#00c600",  //

}
