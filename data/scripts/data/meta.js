var ARTIST = {
    NULL: {
        eng: "",
        engAlias: [],
        jap: "",
        japAlias: []
    },};

var CV = {
    NULL: {
        eng: "",
        engAlias: [],
        jap: "",
        japAlias: []
    },
};

var TAG = {
    // Sex

    //// Parent Tags
    ANAL: {
        name: "Anal",
        aliases: [],
        parents: []
    },
    SEXUAL_DEVICES: {
        name: "Sexual Devices",
        aliases: ["Sexual Device", "Sexual Instruments", "Sexual Instrument"],
        parents: []
    },
    SEX_TOYS: {
        name: "Sex Toys",
        aliases: ["Sex Toy"],
        parents: ["SEXUAL_DEVICES"]
    },
    ORAL_SEX: {
        name: "Oral Sex",
        aliases: [],
        parents: []
    },
    BDSM: {
        name: "BDSM",
        aliases: ["Bondage Discipline Sadism and Masochism"],
        parents: []
    },
    BONDAGE: {
        name: "Bondage",
        aliases: ["Tied up", "Bound", "Restrained"],
        parents: ["BDSM"]
    },
    SEXUAL_SLAVERY: {
        name: "Sexual Slavery",
        aliases: ["Sex Slave"],
        parents: ["BDSM"]
    },
    URINATION_FETISH: {
        name: "Urination Fetish",
        aliases: ["Piss Play", "Pee Play", "Urine Play", "Golden Shower", "Watersports", "Urophillia", "Undinism", "Urolagnia"],
        parents: []
    },
    PORN_PRODUCTION: {
        name: "Porn Production",
        aliases: [],
        parents: []
    },
    RAPE: {
        name: "Rape",
        aliases: ["Sexual Assault", "Non-Consensual Sex", "Non Consensual Sex"],
        parents: []
    },
    GROUP: {
        name: "Group",
        aliases: ["Gang", "Multiple People", "Multiple Partners"],
        parents: []
    },
    DRUGS: {
        name: "Drugs",
        aliases: ["Drugged", "Drug Use", "Drug"],
        parents: []
    },
    FINGERING: {
        name: "Fingering",
        aliases: [],
        parents: []
    },

    //// Vaginal
    VAGINAL_SEX:{
        name:"Vaginal Sex",
        aliases:[],
        parents:[]
    },
    DEFLORATION:{
        name:"Defloration",
        aliases:["Popped Cherry", "Popping the Cherry", "Virgin"],
        parents:[]
    },
    VAGINAL_FINGERING:{
        name:"Vaginal Fingering",
        aliases:[],
        parents:["FINGERING"]
    },
    VAGINAL_INSERTION:{
        // non-living object inserted into vagina
        name:"Vaginal Insertion",
        aliases:[],
        parents:[]
    },

    //// Anal & Ass
    ANAL_SEX: {
        name: "Anal Sex",
        aliases: ["Bum sex", "Arse sex", "Ass sex", "Up the Arse", "Up the Ass", "Butt Sex", "Up the Butt"],
        parents: ["ANAL"]
    },
    ANAL_FINGERING: {
        name: "Anal Fingering",
        aliases: ["Finger up the Bum", "Finger up Bum", "Finger up the Ass", "Finger up Ass", "Finger up the Arse", "Finger up Arse", "Finger up the Butt", "Finger up Butt"],
        parents: ["ANAL", "FINGERING"]
    },
    ASS_MASSAGE:{
        name:"Ass Massage",
        aliases:["Butt Massage", "Bum Massage"],
        parents:[]
    },
    ASS_GROPING:{
        name:"Ass Groping",
        aliases:["Butt Groping", "Bum Groping", "Ass Squeezing", "Butt Squeezing", "Bum Squeezing"],
        parents:[]
    },
    ANAL_INSERTION:{
        // non-living object inserted into ass
        name:"Anal Insertion",
        aliases:[],
        parents:["ANAL"]
    },
    ASSJOB:{
        name:"Assjob",
        aliases:["Buttjob"],
        parents:[]
    },

    //// Vaginal / Anal
    GAPING:{
        name:"Gaping",
        aliases:["Gaped"],
        parents:[]
    },
    FISTING:{
        name:"Fisting",
        aliases:[],
        parents:[]
    },
    LARGE_INSERTIONS:{
        // Large non-living object inserted
        name:"Large Insertions",
        aliases:[],
        parents:[]
    },

    //// Sex Toys
    VIBRATOR: {
        name: "Vibrator",
        aliases: ["Dildo", "Vibe"],
        parents: ["SEX_TOYS"]
    },
    HIDDEN_VIBRATOR: {
        name: "Hidden Vibrator",
        aliases: ["Hidden Dildo", "Hidden Vibe"],
        parents: ["SEX_TOYS"]
    },
    AFFIXED_DILDO:{
        name:"Affixed Dildo",
        aliases:["Affixed Vibrator", "Attached Dildo", "Attached Vibrator"],
        parents:["VIBRATOR"]
    },
    MAGIC_WAND: {
        name: "Magic Wand",
        aliases: ["Hitachi Magic Wand"],
        parents: ["SEX_TOYS"]
    },
    ROTOR: {
        name: "Rotor",
        aliases: ["Pink Rotor", "Egg Rotor", "Love Egg", "Vibro Egg", "Bullet Vibe", "Bullet Vibrator"],
        parents: ["SEX_TOYS"]
    },
    ANAL_BEADS: {
        name: "Anal Beads",
        aliases: ["Anal Balls"],
        parents: ["SEX_TOYS", "ANAL_INSERTION"]
    },
    BUTT_PLUG: {
        name: "Butt Plug",
        aliases: ["Anal Plug", "Ass Plug"],
        parents: ["SEX_TOYS", "ANAL_INSERTION"]
    },
    BUTT_PLUG_TAIL: {
        name: "Butt Plug Tail",
        aliases: ["Anal Plug Tail", "Anal Tail", "Ass Plug Tail"],
        parents: ["BUTT_PLUG"]
    },
    SEX_ENGINE:{
        name:"Sex Engine",
        aliases:["Sex Machine", "Sex Robot"],
        parents:["SEXUAL_DEVICES"]
    },
    ONAHOLE:{
        name:"Onahole",
        aliases:["Onnahole", "Onna Hole", "Ona Hole", "Fleshlight", "Flesh Light", "Pocket Pussy", "Pocketpussy"],
        parents:["SEX_TOYS"]
    },
    STRAP_ON:{
        name:"Strap-on",
        aliases:["Strap-on Dildo", "Strapon", "Strapon Dildo", "Strap On", "Strap On Dildo"],
        parents:["SEX_TOYS"]
    },

    //// Oral
    BLOWJOB: {
        name: "Blowjob",
        aliases: ["Blow Job", "Dick Sucking", "Cock Sucking", "Face Fucking", "Facial", "Fellatio", "Mouth Fuck", "BJ", "Giving Head", "Sucking off"],
        parents: ["ORAL_SEX"]
    },
    DICK_CLEANING_BLOWJOB:{
        name:"Dick Cleaning Blowjob",
        aliases:["Cock Cleaning Blowjob", "Penis Cleaning Blowjob", "After Sex Blowjob"],
        parents:["BLOWJOB"]
    },
    DEEPTHROAT: {
        name: "Deepthroat",
        aliases: ["Irrumatio", "Throat Deformation", "Throat Fuck", "Deep Throating", "Deep-throating", "Throat Fucking", "Gag Fuck"],
        parents: ["BLOWJOB"]
    },
    BLOWBANG: {
        name: "Blowbang",
        aliases: ["Gangsuck", "Lineup", "Gang Suck"],
        parents: ["BLOWJOB"]
    },
    FORCEFUL_BLOWJOB:{
        name:"Forceful Blowjob",
        aliases:["Forecful Fellatio", "Forceful Blow-job", "Forceful Blow Job"],
        parents:["BLOWJOB"]
    },
    BALLS_SUCKING: {
        name: "Balls Sucking",
        aliases: ["Balls Licking", "Sucking Balls", "Licking Balls", "Tea Bag", "Ball Sucking", "Ball Licking"],
        parents: ["ORAL_SEX"]
    },
    TESTICULAR_MASSAGE:{
        name:"Testicular Massage",
        aliases:["Ball Massage", "Ball Play"],
        parents:[]
    },
    CUM_IN_MOUTH:{
        // Cum enters the mouth
        name:"Cum in Mouth",
        aliases:["Sperm in Mouth", "Semen in Mouth"],
        parents:[]
    },
    CUM_LICKUP:{
        name:"Cum Lickup",
        aliases:["Sprem Lickup", "Licking up Cum", "Licking up Sperm", "Cum Cleanup", "Sperm Cleanup", "Cum Eating", "Sperm Eating", "Semen Eating", "Eating Cum", "Eating Sperm", "Eating Semen"],
        parents:["CUM_IN_MOUTH"]
    },
    CUM_SWALLOWING:{
        // Cum goes down the throat
        name:"Cum Swallowing",
        aliases:["Sperm Swallowing", "Semen Swallowing"],
        parents:["CUM_IN_MOUTH"]
    },
    GOKKUN:{
        // Emphasis put on cum swallowing
        name:"Gokkun",
        aliases:["Cum Drinking", "Sperm Drinking", "Semen Drinking"],
        parents:["CUM_SWALLOWING"]  
    },
    CUNNILINGUS: {
        name: "Cunnilingus",
        aliases: ["Pussy Licking", "Pussy Eating", "Vagina Licking", "Vagina Eating", "Vaginal Licking", "Vaginal Eating"],
        parents: ["ORAL_SEX"]
    },
    ANILINGUS: {
        name: "Anilingus",
        aliases: ["Anal-oral Sex", "Anal Oral Sex", "Rimming", "Rim-job", "Rimjob", "Rim Job", "Eating Ass", "Eating Arse", "Licking Ass", "Licking Arse"],
        parents: ["ORAL_SEX", "ANAL"]
    },
    FACESITTING: {
        name: "Facesitting",
        aliases: ["Face Sitting", "Face-sitting", "Queening"],
        parents: ["ORAL_SEX", "BDSM"]
    },
    SENSUAL_BITING: {
        name: "Sensual Biting",
        aliases: ["Odaxelagnia", "Biting"],
        parents: ["ORAL_SEX", "BDSM"]
    },
    FINGER_SUCKING: {
        name: "Finger Sucking",
        aliases: ["Finger Blowjob", "Finger Fellatio"],
        parents:[]
    },

    //// Tits stuff
    PAIZURI:{
        name:"Paizuri",
        aliases:["Tit Wank", "Boob Wank", "Breast Wank"],
        parents:[]
    },
    BLOWJOB_PAIZURI:{
        name:"Blowjob Paizuri",
        aliases:["Blow job Paizuri"],
        parents:["PAIZURI", "BLOWJOB"]
    },
    BREAST_SUCKING:{
        name:"Breast Sucking",
        aliases:["Boob sucking", "Tit Sucking"],
        parents:["NIPPLE_SUCKING"]
    },
    BREAST_MASSAGE:{
        name:"Breast Massage",
        aliases:["Boob Massage", "Tit Massage"],
        parents:[]
    },
    BREAST_GROPING:{
        name:"Breast Groping",
        aliases:["Breast Groping", "Boob Groping", "Tit Groping", "Breast Squeezing", "Boob Squeezing", "Tit Squeezing"],
        parents:[]
    },
    LACTATION:{
        name:"Lactation",
        aliases:[],
        parents:[]
    },
    BREAST_INJECTION:{
        name:"Breast Injection",
        aliases:[],
        parents:[]
    },
    UNDERBOOB:{
        name:"Undeboob",
        aliases:[],
        parents:[]
    },
    NIPPLE_PLAY:{
        name:"Nipple Play",
        aliases:[],
        parents:[]
    },
    NIPPLE_PINCHING:{
        name:"Nipple Pinching",
        aliases:[],
        parents:["NIPPLE_PLAY"]
    },
    NIPPLE_PULLING:{
        name:"Nipple Pulling",
        aliases:[],
        parents:["NIPPLE_PINCHING"]
    },
    NIPPLE_FUCK:{
        name:"Nipple Fuck",
        aliases:["Nipple Fucking", "Nipple Penetration"],
        parents:["NIPPLE_PLAY"]
    },
    NIPPLE_SUCKING:{
        name:"Nipple Sucking",
        aliases:[],
        parents:["NIPPLE_PLAY"]
    },


    //// Cum Stuff
    NAKADASHI: {
        name: "Nakadashi",
        aliases: ["Creampie"],
        parents: []
    },
    BUKKAKE: {
        name: "Bukkake",
        aliases: ["Covered in Cum", "Semen Shower", "Cum Shower", "Covered in Semen"],
        parents: []
    },
    CUM_BATH: {
        name: "Cum Bath",
        aliases: ["Cum Pool", "Submerged in Cum", "Semen Bath", "Semen Pool", "Sperm Bath", "Sperm Pool", "Submerged in Sperm", "Submerged in Semen"],
        parents: ["BUKKAKE"]
    },
    SQUIRTING: {
        name: "Squirting",
        aliases: ["Female Ejaculation", "Cumming"],
        parents: []
    },
    VAGINAL_LEAKAGE:{
        name: "Vaginal Leakage",
        aliases: [],
        parents: []
    },
    CUM_PLAY:{
        name:"Cum Play",
        aliases:[],
        parents:[]
    },

    //// BDSM
    FEMDOM: {
        name: "Femdom",
        aliases: ["Dominatrix", "Domination", "Dominant", "Dominant Female"],
        parents: ["BDSM"]
    },
    BALL_CRUSHING:{
        name:"Ball Crushing",
        aliases:[],
        parents:["BDSM"]
    },
    ELECTRIC_SHOCKS: {
        name: "Electric Shocks",
        aliases: ["Electrocution", "Erotic Electrostimulation", "E-stim", "Electrosex", "Electro Sex", "Erotic Electrocution"],
        parents: ["BDSM"]
    },
    SPANKING: {
        name: "Spanking",
        aliases: ["Slapping Ass", "Slapping", "Erotic Spanking", "Sexual Spanking", "Spankophillia"],
        parents: ["BDSM"]
    },
    HUMAN_BRANDING: {
        name: "Human Branding",
        aliases: ["Human Stigmatizing"],
        parents: ["BDSM"]
    },
    USED_CONDOMS_EXPOSITION: {
        name: "Used Condoms Exposition",
        aliases: ["Condoms Exposition", "Used Condom Exposition", "Condom Exposition", "Used Condoms Collection", "Used Condoms Display", "Used Condom Collection", "Used Condom Display"],
        parents: ["BDSM"]
    },
    MOUTH_GAG: {
        name: "Mouth Gag",
        aliases: ["Ball Gag", "Mouth Plug", "Gag"],
        parents: ["BDSM", "SEXUAL_DEVICES"]
    },
    OPEN_GAG: {
        name: "Open Gag",
        aliases: ["Ring Gag", "Tube Gag", "Spider Gag", "Mouth Gag", "Gag"],
        parents: ["BDSM", "SEXUAL_DEVICES"]
    },
    PANTY_GAG: {
        name: "Panty Gag",
        aliases: ["Mouth Gag", "Gag"],
        parents: ["BDSM", "SEXUAL_DEVICES"]
    },
    NOSE_HOOK:{
        name:"Nose Hook",
        aliases:[],
        parents:["BDSM", "SEXUAL_DEVICES"]
    },
    BODY_WRITING: {
        name: "Body Writing",
        aliases: ["Writing on Body", "Rakugaki"],
        parents: ["BDSM"]
    },
    SPREADER_BAR: {
        name: "Spreader Bar",
        aliases: [],
        parents: ["BDSM", "SEXUAL_DEVICES"]
    },
    WAX_PLAY: {
        name: "Wax Play",
        aliases: [],
        parents: ["BDSM"]
    },
    CLAMPS: {
        name: "Clamps",
        aliases: ["Clothes Pin", "Clothespin", "Clothes-peg", "Nipple Clamps", "Clothes Peg", "Clothes-pin", "Clamp"],
        parents: ["BDSM", "SEXUAL_DEVICES"]
    },
    LINKED_CLAMPS: {
        name: "Linked Clamps",
        aliases: ["Chained Clamps"],
        parents: ["BDSM", "CLAMPS"]
    },
    ARMBINDER: {
        name: "Arm Binder",
        aliases: ["Moonglove", "Moon Glove"],
        parents: ["BDSM", "SEXUAL_DEVICES"]
    },
    HAIR_PULLING: {
        name: "Hair Pulling",
        aliases: [],
        parents: ["BDSM"]
    },
    DOGEZA: {
        name: "Dogeza",
        aliases: ["Prostration", "Kowtow"],
        parents: ["BDSM"]
    },
    NAKED_DOGEZA: {
        name: "Naked Dogeza",
        aliases: ["Naked Prostration", "Naked Kowtow"],
        parents: ["DOGEZA", "NAKED"]
    },
    SEX_SWING: {
        name: "Sex Swing",
        aliases: ["Sling"],
        parents: ["BDSM", "SEXUAL_DEVICES"]
    },
    WOODEN_HORSE: {
        name: "Wooden Horse",
        aliases: [],
        parents: ["BDSM", "SEXUAL_DEVICES"]
    },
    ORGASM_DENIAL: {
        name: "Orgasm Denial",
        aliases: ["Tease and Denial", "T&D", "Tease & Denial", "Orgasm Control", "Edging", "Peaking", "Surfing", "Erotic Sexual Denial"],
        parents: ["BDSM"]
    },
    BREAST_PRESS: {
        name: "Breast Press",
        aliases: ["Improvised Breast Press"],
        parents: ["BDSM", "SEXUAL_DEVICES"]
    },
    BLINDFOLD: {
        name: "Blindfold",
        aliases: ["Blindfold Sex"],
        parents: ["BDSM"]
    },
    WHIP:{
        name:"Whip",
        aliases:["Lash"],
        parents:["BDSM"]
    },

    //// Bondage
    DUCT_TAPE_BONDAGE: {
        name: "Duct Tape Bondage",
        aliases: ["Tape Bondage"],
        parents: ["BONDAGE"]
    },
    LEATHER_BONDAGE: {
        name: "Leather Bondage",
        aliases: ["Rubber Bondage"],
        parents: ["BONDAGE"]
    },
    METAL_BONDAGE: {
        name: "Metal Bondage",
        aliases: ["Chain Bondage", "Shackles Bondage"],
        parents: ["BONDAGE"]
    },
    ROPE_BONDAGE: {
        name: "Rope Bondage",
        aliases: ["Shibari"],
        parents: ["BONDAGE"]
    },
    SUSPENSION_BONDAGE: {
        name: "Suspension Bondage",
        aliases: ["Suspended Sex", "Suspended BDSM"],
        parents: ["BONDAGE"]
    },
    TENTACLE_BONDAGE:{
        name:"Tentacle Bondage",
        aliases:["Bound by Tentacles"],
        parents:["BONDAGE"]
    },
    HANDCUFFS:{
        name:"Handcuffs",
        aliases:["Handcuffed"],
        parents:["BONDAGE"]
    },
    HANDCUFFED_SEX: {
        name: "Handcuffed Sex",
        aliases: ["Sex with Handcuffs", "Handcuffs"],
        parents: ["HANDCUFFS"]
    },
    PILLORY: {
        name: "Pillory",
        aliases: ["Stocks", "Wooden Stocks"],
        parents: ["BONDAGE"]
    },
    STUCK_IN_WALL_SEX: {
        name: "Stuck-in-Wall Sex",
        aliases: ["Stuck-in-Wall", "Stuck in Wall", "Wall Fucking", "Stuck in Concrete Block Sex"],
        parents: ["BONDAGE"]
    },
    STUCK_IN_MEAT_WALL: {
        name: "Stuck-in-Meatwall",
        aliases: ["Stuck in Meatwall", "Stuck in Meat Wall", "Stuck-in-Meat Wall", "Tentacle Wall", "Tentacle Floor"],
        parents: ["BONDAGE", "STUCK_IN_WALL_SEX"]
    },
    BONDAGE_WEIGHTS: {
        name: "Bondage Weights",
        aliases: ["BDSM Weights"],
        parents: ["BONDAGE", "SEXUAL_DEVICES"]
    },

    //// Sexual Slavery
    CONSENSUAL_SEXUAL_SLAVERY: {
        name: "Consensual Sexual Slavery",
        aliases: [],
        parents: ["SEXUAL_SLAVERY"]
    },
    CHOUKYOU_SEXUAL_SLAVERY: {
        name: "Choukyou Sexual Slavery",
        aliases: ["Sexual Slavery Choukyou Variation", "Sexual Slavery", "Semi-consensual Sexual Slavery", "Mindbroken Sexual Slavery"],
        parents: ["SEXUAL_SLAVERY"]
    },
    NON_CONSENSUAL_SEXUAL_SLAVERY: {
        name: "Non-consensual Sexual Slavery",
        aliases: [],
        parents: ["SEXUAL_SLAVERY"]
    },
    PUBLIC_CUM_DUMPSTER: {
        name: "Public Cum Dumpster",
        aliases: ["Cum Dumpster", "Cum Dump", "Free Use", "Public Meat Toilet", "Public Niku Benki", "Public Use"],
        parents: ["SEXUAL_SLAVERY"]
    },

    //// Positions
    BUTTERFLY_POSITION: {
        name: "Butterfly Position",
        aliases: [],
        parents: []
    },
    SEVENTH_POSTURE: {
        name: "Seventh Posture",
        aliases: ["Leg Glider"],
        parents: []
    },
    TOMINAGI: {
        name: "Tominagi",
        aliases: [],
        parents: []
    },
    LEGS_PULLED_UP:{
        name:"Legs Pulled Up",
        aliases:["Legs Up"],
        parents:[]
    },
    COWGIRL_POSITION: {
        name: "Cowgirl Position",
        aliases: ["Woman on Top", "Jackhammer", "Recieving Partner on Top", "Horse Riding Position", "Horse Mounting Position"],
        parents: []
    },
    REVERSE_COWGIRL_POSITION: {
        name: "Reverse Cowgirl Position",
        aliases: ["Woman on Top", "Reverse Jackhammer", "Recieving Partner on Top", "Reverse Horse Riding Position", "Reverse Horse Mounting Position"],
        parents: []
    },
    DOGGY_STYLE: {
        name: "Doggy Style",
        aliases: ["Taken from Behind", "From Behind"],
        parents: []
    },
    QUICKIE_FIX_POSITION: {
        name: "Quickie Fix Position",
        aliases: ["Bent Over"],
        parents: ["DOGGY_STYLE"]
    },
    PILEDRIVER: {
        name: "Piledriver",
        aliases: [],
        parents: []
    },
    REVERSE_PILEDRIVER: {
        name: "Reverse Piledriver",
        aliases: [],
        parents: []
    },
    MISSIONARY_POSITION: {
        name: "Missionary Position",
        aliases: ["Gods Intended Method of Procreation"],
        parents: []
    },
    REVERSE_MISSIONARY_POSITION: {
        name: "Reverse Missionary Position",
        aliases: [],
        parents: []
    },
    SPITROAST: {
        name: "Spit-roast",
        aliases: ["Spit Roast", "Spitroast", "Between a Cock and a Hard Place"],
        parents: []
    },
    REVERSE_SPITROAST: {
        name: "Reverse Spit-roast",
        aliases: ["Reverse Spit Roast", "Reverse Spitroast"],
        parents: []
    },
    SITTING_SEX: {
        name: "Sitting Sex",
        aliases: [],
        parents: []
    },
    SPOONING: {
        name: "Spooning",
        aliases: ["Spoons"],
        parents: []
    },
    STANDING_SEX: {
        name: "Standing Sex",
        aliases: ["Stand and Carry", "Stand & Carry", "Dancer Position", "Slow Dancing Position"],
        parents: []
    },
    ARMS_BEHIND_HEAD:{
        name: "Arms Behind Head",
        aliases:[],
        parents:[]
    },
    LEGS_BEHIND_HEAD:{
        name:"Legs Behind Head",
        aliases:[],
        parents:[]
    },
    SIXTY_NINE:{
        name:"69",
        aliases:["Sixty Nine", "Six Nine"],
        parents:[]
    },
    FULL_NELSON:{
        name:"Full Nelson",
        aliases:[],
        parents:["LEGS_PULLED_UP"]
    },

    //// Urination Fetish
    PISSED_ON: {
        name: "Pissed On",
        aliases: ["Urinated on", "Peed on"],
        parents: ["URINATION_FETISH"]
    },
    PISSING_ON_SELF: {
        name: "Pissing on Self",
        aliases: ["Peeing on Self", "Urinating on Self"],
        parents: ["URINATION_FETISH"]
    },
    PEEING_ON_OTHERS: {
        name: "Peeing on Others",
        aliases: ["Pissing on Others", "Urination on Others"],
        parents: ["URINATION_FETISH"]
    },
    PISS_DRINKING: {
        name: "Piss Drinking",
        aliases: ["Urine Drinking", "Pee Drinking", "Drinking Piss", "Drinking Urine", "Drinking Pee"],
        parents: ["URINATION_FETISH"]
    },
    INCONTINENCE:{
        name:"Incontinence",
        aliases:["Pissing Self", "Wetting Self", "Peeing Self"],
        parents:["URINATION_FETISH"]
    },

    //// Porn Production
    FILMING: {
        name: "Filming",
        aliases: ["Recording"],
        parents: ["PORN_PRODUCTION"]
    },
    LIVE_STREAMING: {
        name: "Live Streaming",
        aliases: ["Streaming", "Live Streaming Sex", "Streaming Sex", "Livestreaming", "Livestreaming Sex", "Live Streamed Sex", "Livestreamed Sex"],
        parents: ["FILMING"]
    },
    PHOTOGRAPHY:{
        name:"Photography",
        aliases:["Photo Taking", "Picture Taking", "Lewd Photography", "Lewd Photos", "Lewd Pictures"],
        parents:["PORN_PRODUCTION"]
    },
    AMATEUR_PORN_PRODUCTION: {
        name: "Amateur Porn Production",
        aliases: ["Amateur Production of Pornography", "Home Sex Video", "Amateur Sex Tape", "Underground Pornography", "Home Sex Tape", "Amateur Sex Video", "Underground Porn Production", "Underground Porn"],
        parents: ["PORN_PRODUCTION"]
    },
    PROFESSIONAL_PORN_PRODUCTION: {
        name: "Professional Porn Production",
        aliases: ["Professional Production of Pornography"],
        parents: ["PORN_PRODUCTION"]
    },

    //// Rape
    MONSTER_RAPE: {
        name: "Monster Rape",
        aliases: ["Creature Rape", "Rape by Monsters", "Rape by Creatures"],
        parents: ["RAPE"]
    },
    TENTACLE_RAPE: {
        name: "Tentacle Rape",
        aliases: [],
        parents: ["RAPE"]
    },
    ANAL_RAPE: {
        name: "Anal Rape",
        aliases: ["Ass Rape"],
        parents: ["RAPE", "ANAL"]
    },
    GANG_RAPE: {
        name: "Gang Rape",
        aliases: ["Pack Rape", "Group Rape", "Raped by Group", "Raped by Gang", "Raped by Pack"],
        parents: ["RAPE", "GROUP"]
    },
    REVERSE_RAPE: {
        name: "Reverse Rape",
        aliases: ["Female Rapes Male", "Female Rape", "Rape of Male by Female", "Female on Male Rape", "Raped Male"],
        parents: ["RAPE"]
    },
    RAPE_WITH_BLACKMAIL: {
        name: "Rape with Blackmail",
        aliases: ["Blackmail Rape"],
        parents: ["RAPE"]
    },
    RAPE_INVOLVING_DRUGS: {
        name: "Rape Involving Drugs",
        aliases: ["Drugged Rape", "Drug Rape", "Rape with Drugs", "Rape Drugs", "Drug-induced Rape", "Drug Induced Rape", "Drug Facilitated Rape", "Drug Facilitated Sexual Assault"],
        parents: ["RAPE", "DRUGS"]
    },

    //// Ryona
    RYONA: {
        name: "Ryona",
        aliases: ["Beating Up", "Beaten Up", "Beaten", "Battering", "Battered", "Assaulted", "Assault", "Abused"],
        parents: []
    },
    VAGINAL_BEATING:{
        name:"Vaginal Beating",
        aliases:[],
        parents:["RYONA"]
    },
    VAGINAL_PUNCHING:{
        name:"Vaginal Punching",
        aliases:["Cunt Punt"],
        parents:["VAGINAL_BEATING"]
    },
    VAGINAL_KICKING:{
        name:"Vaginal Kicking",
        aliases:[],
        parents:["VAGINAL_BEATING"]
    },

    //// Misc.
    ASPHYXIATION: {
        name: "Asphyxiation",
        aliases: ["Smoothering", "Choking", "Erotic Asphyxiation", "Breath Control Play", "Hypoxyphilia"],
        parents: []
    },
    BREAST_SMOOTHERING: {
        name: "Breast Smoothering",
        aliases: ["Drowning in Breasts", "Smoothering"],
        parents: ["ASPHYXIATION"]
    },
    HUMAN_CATTLE: {
        name: "Human Cattle",
        aliases: ["Human Livestock", "Human Ranch"],
        parents: []
    },
    MINDBREAK: {
        name: "Mindbreak",
        aliases: ["Mind Break", "Mind-break"],
        parents: []
    },
    MIND_CONTROL: {
        name: "Mind Control",
        aliases: ["Saimin"],
        parents:[]
    },
    PETRIFICATION: {
        name: "Petrification",
        aliases: ["Turned to Stone", "Turns to Stone", "Turn to Stone"],
        parents: []
    },
    AHEGAO: {
        name: "Ahegao",
        aliases: ["Ahe Gao", "Ahe-gao", "Ahegakoin", "Fucked Silly", "Sloppy Face Sex", "Orgasm Face", "O Face"],
        parents: []
    },
    PEACE_SIGN: {
        name: "Peace Sign",
        aliases: ["V Sign"],
        parents: []
    },
    PEACE_SIGN_AHEGAO: {
        name: "Peace Sign Ahegao",
        aliases: ["V Sign Ahegao"],
        parents: ["AHEGAO", "PEACE_SIGN"]
    },
    DOUBLE_PEACE_SIGN: {
        name: "Double Peace Sign",
        aliases: ["W Sign"],
        parents: ["PEACE_SIGN"]
    },
    DOUBLE_PEACE_SIGN_AHEGAO: {
        name: "Double Peace Sign Ahegao",
        aliases: ["W Sign Ahegao", "AWP"],
        parents: ["PEACE_SIGN_AHEGAO", "DOUBLE_PEACE_SIGN"]
    },
    LEGLOCK:{
        name:"Leglock",
        aliases:["Leg Lock"],
        parents:[]
    },
    CERVIX_PENETRATION:{
        name:"Cervix Penetration",
        aliases:["Womb Penetration"],
        parents:[]
    },
    STOMACH_INFLATION:{
        name:"Stomach Inflation",
        aliases:["Filled with Cum", "Filled with Sperm", "Filled with Semen", "Inflated Stomach"],
        parents:[]
    },
    STOMACH_DEFORMATION:{
        name:"Stomach Deformation",
        aliases:[],
        parents:[]
    },
    SALIVA:{
        name:"Saliva",
        aliases:["Spit"],
        parents:[]
    },
    VISIBLE_FEET:{
        name:"Visible Feet",
        aliases:["Footfag"],
        parents:[]
    },
    VISIBLE_SOLES:{
        name:"Visible Soles",
        aliases:[],
        parents:["VISIBLE_FEET"]
    },
    SPREAD_PUSSY:{
        name:"Spread Pussy",
        aliases:["Pussy Spread", "Spreading Pussy", "Pussy Spreading"],
        parents:[]
    },
    SPREAD_ASS:{
        name:"Spread Ass",
        aliases:["Spread Asshole", "Spreading Ass", "Spreading Asshole", "Ass Spread", "Asshole Spread", "Ass Spreading", "Asshole Spreading"],
        parents:[]
    },
    TEASING:{
        name:"Teasing",
        aliases:[],
        parents:[]
    },
    PROSTITUTION:{
        name:"Prostitution",
        aliases:[],
        parents:[]
    },
    DOUBLE_PENETRATION:{
        name:"Double Penetration",
        aliases:[],
        parents:[]
    },
    TRIPLE_PENETRATION:{
        name:"Triple Penetration",
        aliases:[],
        parents:["DOUBLE_PENETRATION"]
    },
    DOUBLE_PENIS_PENETRATION:{
        name:"Double Penis Penetration",
        aliases:["Penetrated by Two Penises", "Penetrated by Two Cocks", "Penetrated by Two Dicks", "Double Dick Penetration", "Double Cock Penetration"],
        parents:["DOUBLE_PENETRATION"]
    },
    TRIPLE_PENIS_PENETRATION:{
        name:"Triple Penis Penetration",
        aliases:["Penetrated by Three Penises", "Penetrated by Three Cocks", "Penetrated by Three Dicks", "Triple Dick Penetration", "Triple Cock Penetration"],
        parents:["TRIPLE_PENETRATION", "DOUBLE_PENIS_PENETRATION"]
    },
    HANDJOB:{
        name:"Handjob",
        aliases:[],
        parents:[]
    },
    HAIRJOB:{
        name:"Hairjob",
        aliases:[],
        parents:[]
    },
    LOTION:{
        name:"Lotion",
        aliases:["Oil"],
        parents:[]
    },
    MUCUS:{
        name:"Mucus",
        aliases:[],
        parents:[]
    },
    SWEATING:{
        name:"Sweating",
        aliases:[],
        parents:[]
    },
    SLEEPING_SEX:{
        name:"Sleeping Sex",
        aliases:["Sleeping"],
        parents:[]
    },
    FAKE_SLEEPING:{
        name:"Fake Sleeping",
        aliases:["Pretending to Sleep", "Pretending to be Asleep"],
        parents:["SLEEPING_SEX"]
    },
    KISSING:{
        name:"Kissing",
        aliases:[],
        parents:[]
    },
    MASTURBATION:{
        name:"Masturbation",
        aliases:[],
        parents:[]
    },
    BEASTIALITY:{
        name:"Beastiality",
        aliases:["Bestiality", "Fucking Animals"],
        parents:[]
    },
    FOOTJOB:{
        name:"Footjob",
        aliases:["Foot Job", "Foot-job"],
        parents:[]
    },
    CLIT_INJECTION:{
        name:"Clit Injection",
        aliases:[],
        parents:["CLIT_PLAY"]
    },
    VAGINAL_INJECTION:{
        name:"Vaginal Injection",
        aliases:[],
        parents:[]
    },
    CLIT_PLAY:{
        name:"Clit Play",
        aliases:[],
        parents:[]
    },
    URETHRA_INSERTION:{
        name:"Urethra Insertion",
        aliases:[],
        parents:[]
    },
    DRINK_BOTTLE_INSERTION:{
        name:"Drink Bottle Insertion",
        aliases:[],
        parents:[]
    },
    HAND_HOLDING:{
        name:"Hand Holding",
        aliases:["Absolute Degeneracy"],
        parents:[]
    },
    INTERCRURAL_SEX:{
        name:"Intercrural Sex",
        aliases:["Interfemoral Sex", "Thighjob", "Thigh Job", "Thigh-job", "Thigh Sex", "Sumata"],
        parents:[]
    },
    FOOT_LICKING:{
        name:"Foot Licking",
        aliases:["Foot Sucking"],
        parents:[]
    },
    TOE_SUCKING:{
        name:"Toe Sucking",
        aliases:["Toe Licking"],
        parents:[]
    },
    EAR_PENETRATION:{
        name:"Ear Penetration",
        aliases:["Ear Fuck"],
        parents:[]
    },
    NAVEL_PENETRATION:{
        name:"Navel Penetration",
        aliases:["Bellybutton Penetration", "Belly Button Penetration", "Navel Fuck", "Bellybutton Fuck", "Belly Button Fuck"],
        parents:[]
    },
    PREGNANT:{
        name:"Pregnant",
        aliases:["With Child", "Brown Nipples"],
        parents:[]
    },    

    // Appearance

    //// Hair

    ////// Color
    BLACK_HAIR: {
        name: "Black Hair",
        aliases: ["Dark Hair"],
        parents: []
    },
    BLUE_HAIR: {
        name: "Blue Hair",
        aliases: [],
        parents: []
    },
    GREEN_HAIR: {
        name: "Green Hair",
        aliases: [],
        parents: []
    },
    TEAL_HAIR: {
        name: "Teal Hair",
        aliases: [],
        parents: []
    },
    BLOND_HAIR: {
        name: "Blond Hair",
        aliases: ["Blonde Hair", "Blond", "Blonde"],
        parents: []
    },
    GOLDEN_BLOND_HAIR:{
        name: "Golden Blond Hair",
        aliases: ["Golden Hair", "Yellow Blond Hair", "Yellow Blond", "Golden Blond"],
        parents: ["BLOND_HAIR"]
    },
    PLATINUM_BLOND_HAIR:{
        name: "Platinum Blond Hair",
        aliases: ["Platinum Hair", "White Blond Hair", "White Blond"],
        parents: ["BLOND_HAIR"]
    },
    DIRTY_BLOND_HAIR:{
        name: "Dirty Blond Hair",
        aliases: ["Brown Blond Hair", "Brown Blond"],
        parents: ["BLOND_HAIR"]
    },
    BROWN_HAIR: {
        name: "Brown Hair",
        aliases: [],
        parents: []
    },
    GREY_HAIR: {
        name: "Grey Hair",
        aliases: ["Gray Hair", "Silver Hair"],
        parents: []
    },
    VIOLET_HAIR: {
        name: "Violet Hair",
        aliases: ["Purple Hair"],
        parents: []
    },
    RED_HAIR: {
        name: "Red Hair",
        aliases: ["Scarlet Hair"],
        parents: []
    },
    CLARET_HAIR: {
        name: "Claret Hair",
        aliases: [],
        parents: []
    },
    DYED_HAIR: {
        name: "Dyed Hair",
        aliases: ["Dyed", "Hair Coloring", "Hair Colouring", "Colored Hair", "Coloured Hair", "Hair Color Change", "Hair Colour Change"],
        parents: []
    },
    PINK_HAIR: {
        name: "Pink Hair",
        aliases: [],
        parents: []
    },
    MULTICOLORED_HAIR: {
        name: "Multicolored Hair",
        aliases: ["Multi-colored Hair", "Multicolor Hair", "Multicoloured Hair", "Multi-coloured Hair", "Multicolour Hair", "Striped Hair", "Gradient Hair"],
        parents: []
    },
    GRADIENT_HAIR: {
        name: "Gradient Hair",
        aliases: ["Ombre", "Ombré"],
        parents: []
    },
    CYAN_HAIR: {
        name: "Cyan Hair",
        aliases: ["Aqua Hair", "Aquamarine Hair", "Turquoise Hair"],
        parents: []
    },
    ORANGE_HAIR: {
        name: "Orange Hair",
        aliases: ["Ginger Hair", "Ginger"],
        parents: []
    },
    WHITE_HAIR: {
        name: "White Hair",
        aliases: ["Light Hair"],
        parents: []
    },

    ////// Length
    LONG_HAIR: {
        name: "Long Hair",
        aliases: [],
        parents: []
    },
    SHOULDER_LENGTH_HAIR: {
        name: "Shoulder Length Hair",
        aliases: ["Medium Hair"],
        parents: []
    },
    SHORT_HAIR: {
        name: "Short Hair",
        aliases: [],
        parents: []
    },

    ////// Style
    EYE_COVERING_BANGS: {
        name: "Eye Covering Bangs",
        aliases: ["Eye Covering Fringe"],
        parents: []
    },
    BLUNT_BANGS: {
        name: "Blunt Bangs",
        aliases: ["Blunt Fringes", "Blunt Fringe", "Straight Bangs"],
        parents: []
    },
    PONYTAIL: {
        name: "Ponytail",
        aliases: ["Pony Tail"],
        parents: []
    },
    SIDE_TAIL: {
        name: "Side Tail",
        aliases: ["Side Ponytail", "Side Pony Tail"],
        parents: []
    },
    TWIN_TAILS: {
        name: "Twin Tails",
        aliases: ["Pigtails", "Pig Tails", "Twintails", "Angel Wings", "Bunches"],
        parents: []
    },
    HAIR_BUN: {
        name: "Hair Bun",
        aliases: ["Bobtail"],
        parents: []
    },
    ODANGO: {
        name: "Odango",
        aliases: ["Pigtail Buns", "Double Bun", "Ox Horns", "Pig Tail Buns"],
        parents: ["HAIR_BUN", "TWIN_TAILS"]
    },
    HAIR_LOOPIES: {
        name: "Hair Loopies",
        aliases: ["Hair Loops", "Looped Twintails", "Hair Loopie", "Chigo Mage"],
        parents: []
    },
    HIME_CUT: {
        name: "Hime Cut",
        aliases: [],
        parents: []
    },
    BRAIDED_HAIR: {
        name: "Braided Hair",
        aliases: ["Braid", "Plait", "Plaited Hair"],
        parents: []
    },
    STRAIGHT_HAIR: {
        name: "Straight Hair",
        aliases: [],
        parents: []
    },
    SPIKY_HAIR: {
        name: "Spiky Hair",
        aliases: ["Spiked Hair"],
        parents: []
    },
    CURLY_HAIR: {
        name: "Curly Hair",
        aliases: ["Wavy Hair", "Twisted Hair", "Twisted Hair"],
        parents: []
    },
    SLICKED_BACK_HAIR: {
        name: "Slicked Back Hair",
        aliases: [],
        parents: []
    },

    ////// Eyebrows
    THICK_EYEBROWS: {
        name: "Thick Eyebrows",
        aliases: ["big Eyebrows", "Large Eyebrows"],
        parents: []
    },
    HIKIMAYU: {
        name: "Hikimayu",
        aliases: ["Round Drawn Japanese Heian Period Eyebrows", "Heian Period Eyebrows", "Heiyan Eyebrows", "Round Eyebrows"],
        parents: []
    },
    UNUSUAL_EYEBROWS: {
        name: "Unusual Eyebrows",
        aliases: ["Unnatural Eyebrows", "Strange Eyebrows"],
        parents: []
    },

    ////// Pubic Hair
    PUBIC_HAIR:{
        name:"Pubic Hair",
        aliases:["Pubes"],
        parents:[]
    },

    //// Eyes

    ////// Color
    BLUE_EYES: {
        name: "Blue Eyes",
        aliases: [],
        parents: []
    },
    CYAN_EYES: {
        name: "Cyan Eyes",
        aliases: ["Aqua Eyes", "Aquamarine Eyes", "Turquoise Eyes"],
        parents: []
    },
    BROWN_EYES: {
        name: "Brown Eyes",
        aliases: [],
        parents: []
    },
    WHITE_EYES: {
        name: "White Eyes",
        aliases: [],
        parents: []
    },
    GREEN_EYES: {
        name: "Green Eyes",
        aliases: [],
        parents: []
    },
    TEAL_EYES: {
        name: "Teal Eyes",
        aliases: [],
        parents: []
    },
    HETEROCHROMIA: {
        name: "Heterochromia",
        aliases: ["Multi Coloured Eyes", "Multi Colored Eyes", "Heterochromia Iridum", "Heterochromatic Eyes", "Differently Colored Eyes", "Differently Coloured Eyes"],
        parents: []
    },
    CENTRAL_HETEROCHROMIA: {
        name: "Central Heterochromia",
        aliases: ["Multi-colored Pupils", "Multi Colored Pupils", "Mulicolored Pupils", "Multi-coloured Pupils", "Multi Coloured Pupils", "Multicoloured Pupils"],
        parents: []
    },
    RED_EYES: {
        name: "Red Eyes",
        aliases: [],
        parents: []
    },
    GARNET_EYES: {
        name: "Garnet Eyes",
        aliases: ["Dark-red Eyes", "Dark Red eyes", "Murrey Eyes", "Cherry Eyes", "Ruby Eyes"],
        parents: []
    },
    GREY_EYES: {
        name: "Grey Eyes",
        aliases: ["Gray Eyes", "Silver Eyes"],
        parents: []
    },
    PINK_EYES: {
        name: "Pink Eyes",
        aliases: ["Rosy Eyes", "Rose Eyes"],
        parents: []
    },
    AMBER_EYES: {
        name: "Amber Eyes",
        aliases: ["Copper Eyes", "Golden Eyes", "Yellow Eyes", "Orange Eyes"],
        parents: []
    },
    BLACK_EYES: {
        name: "Black Eyes",
        aliases: [],
        parents: []
    },
    HAZEL_EYES: {
        name: "Hazel Eyes",
        aliases: [],
        parents: []
    },
    VIOLET_EYES: {
        name: "Violet Eyes",
        aliases: ["Purple Eyes"],
        parents: []
    },

    ////// Style
    SLIT_PUPILS: {
        name: "Slit Pupils",
        aliases: ["Cat Eyes", "Snake Eyes", "Demon Eyes"],
        parents: []
    },
    SYMBOL_PUPILS: {
        name: "Symbol Pupils",
        aliases: ["Sign Pupils", "Icon Pupils", "Shaped Pupils", "Shape Pupils"],
        parents: []
    },
    HEART_PUPILS:{
        name:"Heart Pupils",
        aliases:["Heart Eyes"],
        parents:["SYMBOL_PUPILS"]
    },
    UNNATURAL_SCLERA: {
        name: "Unnatural Sclera",
        aliases: ["Unnatural Eye White"],
        parents: []
    },
    EYE_BAGS: {
        name: "Eye Bags",
        aliases: ["Shadowed Eyes", "Bags Under Eyes", "Dark Circles"],
        parents: []
    },
    GLOWING_EYES: {
        name: "Glowing Eyes",
        aliases: [],
        parents: []
    },
    MULTIPLE_EYES: {
        name: "Multiple Eyes",
        aliases: [],
        parents: []
    },

    //// Ears
    KEMONOMIMI: {
        name: "Kemonomimi",
        aliases: ["Animal Ears"],
        parents: []
    },
    NEKOMIMI: {
        name: "Nekomimi",
        aliases: ["Cat Ears", "Kitten Ears"],
        parents: ["KEMONOMIMI"]
    },
    USAMIMI: {
        name: "Usamimi",
        aliases: ["Rabbit Ears", "Bunny Ears"],
        parents: ["KEMONOMIMI"]
    },
    INUMIMI: {
        name: "Inumimi",
        aliases: ["Dog Ears", "Puppy Ears"],
        parents: ["KEMONOMIMI"]
    },
    POINTED_EARS: {
        name: "Pointed Ears",
        aliases: ["Elf Ears", "Elf-like Ears", "Pointy Ears"],
        parents: []
    },

    //// TONGUE
    FORKED_TONGUE: {
        name: "Forked Tongue",
        aliases: ["Forked Tounge", "Split Tongue", "Split Tounge", "Reptile-like Tongue", "Reptile Like Tongue", "Reptile-like Tounge", "Reptile Like Tounge"],
        parents: []
    },
    LONG_TONGUE: {
        name: "Long Tongue",
        aliases: ["Long Tounge"],
        parents: []
    },

    ////Horns
    HORNS: {
        name: "Horns",
        aliases: ["Horn"],
        parents: []
    },

    ////Body

    ////// Type
    TINY: {
        name: "Tiny",
        aliases: ["Mini"],
        parents: []
    },
    CHUBBY: {
        name: "Chubby",
        aliases: ["Fat", "Chubby", "Obese", "Wide", "Girthy", "Overweight"],
        parents: []
    },
    MUSCULAR:{
        name: "Muscular",
        aliases: ["Mesomorphic", "Athletic", "Buff", "Muscle", "Muscly"],
        parents: []
    },

    ////// Age
    YOUNGER_APPEARANCE: {
        name: "Younger Appearance",
        aliases: ["Eternally Young", "Older than they Look", "Older than they Appear", "Lolibaba", "Loli Baba"],
        parents: []
    },
    ADULT:{
        name: "Adult",
        aliases: [],
        parents: []
    },
    MILF:{
        name: "Milf",
        aliases: ["Mom I'd Like to Fuck", "Mommy"],
        parents: ["ADULT"]
    },

    ////// Skin Tone
    DARK_SKIN: {
        name: "Dark Skin",
        aliases: [],
        parents: []
    },
    BROWN_SKIN: {
        name: "Brown Skin",
        aliases: [],
        parents: ["DARK_SKIN"]
    },
    BLACK_SKIN: {
        name: "Black Skin",
        aliases: [],
        parents: ["DARK_SKIN"]
    },
    LIGHT_SKIN: {
        name: "Light Skin",
        aliases: [],
        parents: []
    },
    ALBINO: {
        name: "Albino",
        aliases: ["White Skin"],
        parents: ["LIGHT_SKIN"]
    },
    TANNED_SKIN: {
        name: "Tanned",
        aliases: ["Tanned Skin"],
        parents: []
    },
    LIGHT_BROWN_SKIN:{
        name: "Light Brown Skin",
        aliases: ["Light Dark Skin", "Natural Tan", "Naturally Tanned Skin", "Olive Skin"],
        parents: []
    },
    TANLINES: {
        name: "Tanlines",
        aliases: ["Tanline"],
        parents: []
    },
    UNNATURAL_SKIN: {
        name: "Unnatural Skin Color",
        aliases: ["Unnatural Skin Colour", "Unnatural Skin"],
        parents: []
    },

    ////// Markings
    TATTOO: {
        name: "Tattoo",
        aliases: ["Inked", "Ink"],
        parents: []
    },
    MAGIC_TATTOO: {
        name: "Magic Tattoo",
        aliases: ["Magical Tattoo", "Magic Crest", "Stigmata"],
        parents: []
    },
    SLAVE_TATTOO: {
        name: "Slave Tattoo",
        aliases: ["BDSM Tattoo", "Barcode Tattoo", "Submissive BDSM Tattoo", "Submissive Tattoo"],
        parents: []
    },
    WOMB_TATTOO:{
        name:"Womb Tattoo",
        aliases:[],
        parents:[]
    },
    SCAR: {
        name: "Scar",
        aliases: ["Wound Mark"],
        parents: []
    },
    MAKEUP: {
        name: "Makeup",
        aliases: ["Make-up", "Cosmetics"],
        parents: []
    },
    LIPSTICK:{
        name:"Lipstick",
        aliases:["Lip Stick"],
        parents:["MAKEUP"]
    },
    EYESHADOW:{
        name:"Eyeshadow",
        aliases:["Eye Shadow"],
        parents:["MAKEUP"]
    },
    MOLE: {
        name: "Mole",
        aliases: ["Beauty Mark", "Beauty Spot"],
        parents: []
    },
    FRECKLES: {
        name: "Freckles",
        aliases: ["Ephelis", "Ephelides"],
        parents: []
    },
    BINDI: {
        name: "Bindi",
        aliases: ["Red Dot"],
        parents: []
    },
    NAIL_POLISH: {
        name: "Nail Polish",
        aliases: ["Polished Nails", "Fingernail Polish", "Toenail Polish", "Painted Nails", "Polished Fingernails", "Polished Toenails", "Painted Fingernails", "Painted Toenails"],
        parents: []
    },

    //// Features

    ////// Breasts
    FLAT_CHESTED: {
        name: "Flat Chested",
        aliases: ["Flat Chest", "Flat", "Perflat", "Pettanko", "Tiny Chest", "AA Cup", "DFC", "Delicious Flat Chest", "Tiny Tits", "Tiny Boobs"],
        parents: []
    },
    SMALL_BREASTS: {
        name: "Small Breasts",
        aliases: ["Small Chested", "Small Chest", "A Cup", "B Cup", "Modest Mounds", "Small Tits", "Small Boobs"],
        parents: []
    },
    AVERAGE_BREASTS: {
        name: "Average Breasts",
        aliases: ["Standard Breasts", "Standard Chest", "C Cup", "Standard Tits", "Standard Boobs", "Average Chest", "Average Tits", "Average Boobs"],
        parents: []
    },
    BIG_BREASTS: {
        name: "Big Breasts",
        aliases: ["Big Tits", "Big Boobs", "Well Endowed"],
        parents: []
    },
    HUGE_BREASTS: {
        name: "Huge Breasts",
        aliases: ["Huge Tits", "Huge Boobs", "Top Heavy"],
        parents: ["BIG_BREASTS"]
    },
    GIGANTIC_BREASTS: {
        name: "Gigantic Breasts",
        aliases: ["Gigantic Tits", "Gigantic Boobs", "Titty Monster"],
        parents: ["HUGE_BREASTS"]
    },
    SHORTSTACK:{
        name: "Shortstacks",
        aliases: ["Short Stack", "Short-stack", "Oppai Loli"],
        parents: ["BIG_BREASTS"]
    },
    INVERTED_NIPPLES:{
        name: "Inverted Nipples",
        aliases: ["Innie Nipples", "Hidden Nipples"],
        parents: []
    },
    BREAST_GROWTH:{
        name:"Breat Growth",
        aliases:["Breast Enlargement", "Breast Swelling"],
        parents:[]
    },

    ////// Piercings
    PIERCING: {
        name: "Piercing",
        aliases: [],
        parents: []
    },
    FACIAL_PIERCING: {
        name: "Facial Piercing",
        aliases: ["Eyebrow Piercing", "Nose Piercing", "Nose Ring", "Nose Rings", "Lip Piercing"],
        parents: ["PIERCING"]
    },
    TONGUE_PIERCING: {
        name: "Tongue Piercing",
        aliases: ["Tounge Piercing"],
        parents: ["PIERCING"]
    },
    NAVEL_PIERCING: {
        name: "Navel Piercing",
        aliases: ["Belly Button Piercing", "Bellybutton Piercing", "Belly Piercing", "Umbilical Dip Piercing", "Umbilical Piercing"],
        parents: ["PIERCING"]
    },
    LEWD_PIERCING: {
        name: "Lewd Piercing",
        aliases: ["Sexy Piercing"],
        parents: ["PIERCING"]
    },
    NIPPLE_PIERCING: {
        name: "Nipple Piercing",
        aliases: [],
        parents: ["LEWD_PIERCING"]
    },
    GENITAL_PIERCING: {
        name: "Genital Piercing",
        aliases: ["Genital Jewellery", "Clitoris Piercing", "Clit Piercing", "Anal Piercing", "Penis Piercing", "Dick Piercing", "Cock Piercing", "Balls Piercing", "Ball Piercing", "Scrotal Piercing", "Pussy Piercing", "Labia Piercing", "Vulva Piercing"],
        parents: ["LEWD_PIERCING"]
    },
    LINKED_PIERCINGS: {
        name: "Linked Piercings",
        aliases: ["Twin Piercings", "Joint Piercings", "Attached Piercings", "Conjoined Piercings"],
        parents: ["LEWD_PIERCING"]
    },

    ////// Teeth
    CUTENESS_FANG: {
        name: "Cuteness Fang",
        aliases: ["Fang", "Single Fang", "One Fang"],
        parents: []
    },
    FANGS: {
        name: "Fangs",
        aliases: ["Two Fangs", "Dual Fangs", "Vampire Fangs"],
        parents: []
    },
    SHARK_TEETH: {
        name: "Shark Teeth",
        aliases: ["Shark-like Teeth", "Sharkteeth", "Sharp Teeth", "Triangle Teeth"],
        parents: []
    },

    ////// Tail
    TAIL: {
        name: "Tail",
        aliases: [],
        parents: []
    },
    DEMON_TAIL: {
        name: "Demon Tail",
        aliases: ["Arrowhead Tail", "Arrow Head Tail", "Devil Tail", "Pointy Tail", "Pointed Tail"],
        parents: ["TAIL"]
    },
    FLUFFY_TAIL: {
        name: "Fluffy Tail",
        aliases: ["Furry Tail", "Woolly Tail", "Wolly Tail", "Mammalian Tail"],
        parents: ["TAIL"]
    },
    REPTILIAN_TAIL: {
        name: "Reptilian Tail",
        aliases: ["Dragon Tail", "Snake Tail", "Lamia Tail", "Lizard Tail", "Dinosaur Tail", "Dino Tail"],
        parents: ["TAIL"]
    },
    MULTIPLE_TAILS: {
        name: "Multiple Tails",
        aliases: ["Multi-tails", "Multi Tails"],
        parents: ["TAIL"]
    },

    ////// Wings
    WINGS: {
        name: "Wings",
        aliases: [],
        parents: []
    },
    BAT_WINGS: {
        name: "Bat Wings",
        aliases: ["Demon Wings", "Leathery Wings"],
        parents: ["WINGS"]
    },
    FEATHERY_WINGS: {
        name: "Feathery Wings",
        aliases: ["Angel Wings"],
        parents: ["WINGS"]
    },
    INSECT_WINGS: {
        name: "Insect Wings",
        aliases: ["Fairy Wings"],
        parents: ["WINGS"]
    },
    HEAD_WINGS: {
        name: "Head Wings",
        aliases: ["Wings on Head"],
        parents: ["WINGS"]
    },

    ////// Texture
    FEATHERS: {
        name: "Feathers",
        aliases: [],
        parents: []
    },
    FUR: {
        name: "Fur",
        aliases: [],
        parents: []
    },
    SCALES: {
        name: "Scales",
        aliases: ["Scaly"],
        parents: []
    },
    FISH_FINS: {
        name: "Fish Fins",
        aliases: [],
        parents: []
    },

    ////// Humanoid
    HUMANOID: {
        name: "Humanoid",
        aliases: ["Human-like", "Non-Human", "Not Human"],
        parents: []
    },
    BUNNYGIRL: {
        name: "Bunny Girl",
        aliases: ["Bunny-girl", "Bunnygirl", "Rabbit Girl", "Rabbit-girl", "Rabbitgirl"],
        parents: ["HUMANOID", "USAMIMI"]
    },
    DOGGIRL: {
        name: "Dog Girl",
        aliases: ["Dog-girl", "Doggirl", "Inukko", "Puppygirl", "Puppy-girl", "Puppy Girl"],
        parents: ["HUMANOID", "INUMIMI"]
    },
    CATGIRL: {
        name: "Cat Girl",
        aliases: ["Cat-girl", "Catgirl", "Nekokko", "Kittengirl", "Kitten-girl", "Kitten Girl"],
        parents: ["HUMANOID", "NEKOMIMI"]
    },
    FOXGIRL: {
        name: "Fox Girl",
        aliases: ["Fox-girl", "Foxgirl"],
        parents: ["HUMANOID", "KEMONOMIMI"]
    },
    WOLFGIRL: {
        name: "Wolf Girl",
        aliases: ["Wolf-girl", "Wolfgirl"],
        parents: ["HUMANOID", "KEMONOMIMI"]
    },
    ELF: {
        name: "Elf",
        aliases: [],
        parents: ["HUMANOID", "POINTED_EARS"]
    },
    FAIRY: {
        name: "Fairy",
        aliases: ["Faery", "Faerie", "Fay", "Fae"],
        parents: ["HUMANOID", "INSECT_WINGS"]
    },
    LIVING_DOLL: {
        name: "Living Doll",
        aliases: [],
        parents: ["HUMANOID"]
    },
    CYBORG: {
        name: "Cyborg",
        aliases: ["Android"],
        parents: ["HUMANOID"]
    },
    MONSTER_GIRL: {
        name: "Monster Girl",
        aliases: ["Monster-girl", "Monstergirl"],
        parents: ["HUMANOID"]
    },
    HARPY: {
        name: "Harpy",
        aliases: [],
        parents: ["MONSTER_GIRL", "FEATHERS", "FEATHERY_WINGS"]
    },
    INSECTGIRL: {
        name: "Insect Girl",
        aliases: ["Insect-girl", "Insectgirl"],
        parents: ["MONSTER_GIRL"]
    },
    SPIDERGIRL: {
        name: "Spider Girl",
        aliases: ["Spider-girl", "Spidergirl"],
        parents: ["INSECTGIRL"]
    },
    MERMAID: {
        name: "Mermaid",
        aliases: [],
        parents: ["MONSTER_GIRL", "FISH_FINS"]
    },
    UNDEAD: {
        name: "Undead",
        aliases: [],
        parents: ["HUMANOID", "MONSTER"]
    },
    VAMPRIE: {
        name: "Vampire",
        aliases: [],
        parents: ["UNDEAD", "FANGS"]
    },
    DEMON: {
        name: "Demon",
        aliases: [],
        parents: ["HUMANOID", "MONSTER"]
    },
    HALF_DEMON: {
        name: "Half-demon",
        aliases: ["Half Demon", "Halfdemon"],
        parents: ["HUMANOID"]
    },
    SUCCUBUS: {
        name: "Succubus",
        aliases: [],
        parents: ["DEMON"]
    },
    ANGEL: {
        name: "Angel",
        aliases: [],
        parents: ["HUMANOID", "FEATHERY_WINGS"]
    },
    ONI: {
        name: "Oni",
        aliases: [],
        parents: ["DEMON", "HORNS"]
    },
    TENTACLE:{
        name:"Tentacle",
        aliases:[],
        parents:["MONSTER"]
    },
    TENTACLE_CREATURE:{
        name:"Tentacle Creature",
        aliases:["Tentacle Monster"],
        parents:["TENTACLE"]
    },
    TENTACLE_ROBOT:{
        name:"Tentacle Robot",
        aliases:["Robotic Tentacles", "Mechanical Tentacles"],
        parents:["TENTACLE"]
    },
    ORC:{
        name:"Orc",
        aliases:[],
        parents:["UNNATURAL_SKIN", "MONSTER"]
    },
    OGRE:{
        name:"Ogre",
        aliases:[],
        parents:["UNNATURAL_SKIN", "MONSTER"]
    },
    MONSTER_BIRTH:{
        name:"Monster Birth",
        aliases:[],
        parents:[],
    },

    ////// Misc.
    PROSTHESIS: {
        name: "Prosthesis",
        aliases: ["Prosthetic Limb", "Artificial Limb"],
        parents: []
    },
    TENTACLE_APPENDAGE: {
        name: "Tentacle Appendage",
        aliases: ["Tentacle Arms"],
        parents: ["PROSTHESIS"]
    },
    CLAW:{
        name: "Claw",
        aliases: ["Claws", "Sharp Nails"],
        parents: []
    },
    FUTANARI: {
        name: "Futanari",
        aliases: ["Futa", "Hermaphrodite", "Dickgirl", "Dick-girl", "Dick Girl"],
        parents: []
    },
    ALL_THE_WAY_THROUGH:{
        name:"All the way Through",
        aliases:[],
        parents:[]
    },

    // Clothing

    //// Modifiers
    TIGHT_CLOTHING:{
        name:"Tight Clothing",
        aliases:[],
        parents:[]
    },
    VAGINAL_CUTOUT:{
        name:"Vaginal Cutout",
        aliases:["Vagina Cutout", "Pussy Cutout", "Vaginal Access Clothing", "Vagina Access Clothing", "Pussy Access Clothing"],
        parents:[]
    },
    ANAL_CUTOUT:{
        name:"Anal Cutout",
        aliases:["Anus Cutout", "Ass Cutout", "Anal Access Clothing", "Anus Access Clothing", "Ass Access Clothing"],
        parents:[]
    },
    CROTCHLESS_CLOTHING:{
        // Access to both anus or vagina
        name:"Crotchless Clothing",
        aliases:["Genital Access Clothing", "Crotch Cutout"],
        parents:["ANAL_CUTOUT", "VAGINAL_CUTOUT"]
    },
    NIPPLE_CUTOUTS:{
        // Nipple is accessible maybe some of the breast
        name:"Nipple Cutouts",
        aliases:["Nipple Access Clothing"],
        parents:[]
    },
    BREAST_CUTOUTS:{
        // Majority of the breast is outside of the clothing
        name:"Breast Cutouts",
        aliases:["Tit Cutouts", "Boob Cutouts", "Breast Access Clothing", "Tit Access Clothing", "Boob Access Clothing"],
        parents:["NIPPLE_CUTOUTS"]
    },
    BREASTS_OUT:{
        // Clothing has the ability to cover the breasts but isn't
        name:"Breasts Out",
        aliases:["Breasts Hanging Out", "Tits Out", "Boobs Out", "Tits Hanging Out", "Boobs Hanging Out"],
        parents:[]
    },
    OPEN_CUP_CLOTHING:{
        // No clothing over the breast
        name:"Open Cup Clothing",
        aliases:[],
        parents:["BREAST_CUTOUTS", "BREASTS_OUT"]
    },
    CUPLESS_CLOTHING:{
        // No clothing over the breast and no cup
        name:"Cupless Clothing",
        aliases:[],
        parents:["BREAST_CUTOUTS", "BREASTS_OUT"]
    },
    CLEAVAGE_CUTOUT:{
        // Majority of Cleavage visible, not applicable when ripped
        name:"Cleavage Cutout",
        aliases:[],
        parents:[]
    },
    PROTRUDING_NIPPLES:{
        name:"Protruding Nipples",
        aliases:["Visible Nipples", "Nipples Visible Through Clothes"],
        parents:[]
    },
    TRANSPARENT_CLOTHING:{
        name:"Transparent Clothing",
        aliases:["See-through Clothing", "Seethrough Clothing", "See Through Clothing"],
        parents:[]
    },
    PARTIALLY_TRANSPARENT_CLOTHING:{
        name:"Partially Transparent Clothing",
        aliases:[],
        parents:["TRANSPARENT_CLOTHING"]
    },
    COMPLETELY_TRANSPARENT_CLOTHING:{
        name:"Completely Transparent Clothing",
        aliases:["Fully Transparent Clothing"],
        parents:["TRANSPARENT_CLOTHING"]
    },
    PAINTED_ON_CLOTHES: {
        name: "Painted on Clothes",
        aliases: ["Painted on Clothing", "Painted Clothes", "Paint Clothing", "Paint Clothes", "Zenra ni Bodypainto"],
        parents: ["TRANSPARENT_CLOTHING"]
    },
    TOPLESS:{
        name:"Topless",
        aliases:["No Top"],
        parents:[]
    },
    PANTLESS:{
        name:"Pantless",
        aliases:["No Pants", "Bottomless", "No Bottoms", "Trouserless", "No Trousers"],
        parents:[]
    },
    PANTYLESS:{
        name:"Pantyless",
        aliases:["No Panties"],
        parents:[]
    },
    BRALESS:{
        name:"Braless",
        aliases:["No Bra"],
        parents:[]
    },
    NAKED:{
        // No clothes covering the breasts, crotch or most of the body except
        // for small accessories or extremely revealing clothing
        name:"Naked",
        aliases:["Nude"],
        parents:["TOPLESS", "PANTLESS", "PANTYLESS", "BRALESS"]
    },
    HALF_NAKED:{
        // Half of the body is clothed the other half isn't
        name:"Half-naked",
        aliases:["Half Naked"],
        parents:[]
    },
    COMPLETELY_NAKED:{
        // No clothes between shoulders and thighs
        name:"Completely Naked",
        aliases:["Completely Nude", "Stark Naked", "Fully Naked", "Fully Nude"],
        parents:["NAKED"]
    },
    MODIFIED_CLOTHING:{
        name:"Modified Clothing",
        aliases:["Modified Clothes"],
        parents:[]
    },
    RIPPED_CLOTHING:{
        name:"Ripped Clothing",
        aliases:["Ripped Clothes", "Torn Clothing", "Torn Clothes"],
        parents:["MODIFIED_CLOTHING"]
    },
    FRILLY_CLOTHING:{
        name:"Frilly Clothing",
        aliases:["Frills", "Frilly Clothes"],
        parents:[]
    },
    TWO_PIECE_CLOTHING:{
        name:"Two-piece Clothing",
        aliases:["Twopiece Clothing", "Two Piece Clothing", "Bikini-like Clothing", "Bikini Like Clothing"],
        parents:[]
    },
    MICRO_BIKINI_LIKE_CLOTHING:{
        name:"Micro Bikini-like Clothing",
        aliases:["Micro Bikini Like Clothing"],
        parents:[]
    },
    CASUAL_CLOTHING:{
       name:"Causal Clothing",
        aliases:["Casual Clothes", "Normal Clothing", "Normal Clothes", "Western Clothing", "Western Clothes"],
        parents:[] 
    },
    APRON:{
        name:"Apron",
        aliases:[],
        parents:[]
    },
    ANIMAL_PRINT_CLOTHING:{
        name:"Animal Print Clothing",
        aliases:["Animal Print"],
        parents:[],
    },
    ACCESSORIES:{
        name:"Accessories",
        aliases:[],
        parents:[]
    },

    //// Hair
    HAIR_ORNAMENTS:{
        name: "Hair Ornaments",
        aliases: ["Hair Accessories", "Hair Decorations"],
        parents: []
    },
    HAIR_BEADS: {
        name: "Hair Beads",
        aliases: ["Beads in Hair", "Bead in Hair", "Hair Bead"],
        parents: ["HAIR_ORNAMENTS"]
    },
    HAIR_RIBBON: {
        name: "Hair Ribbon",
        aliases: ["Hair Ribbons", "Hair Ribband", "Hair Ribbands", "Ribbon", "Ribbons", "Ribband", "Ribbands"],
        parents: ["HAIR_ORNAMENTS"]
    },
    HAIR_TIE_RIBBON:{
        name:"Ribbon Hair Tie",
        aliases:["Hair Tie Ribbon", "Ribband Hair Tie", "Hair Tie Ribband"],
        parents:["HAIR_RIBBON"]
    },
    HAIR_FLOWERS: {
        name: "Hair Flowers",
        aliases: ["Floral Headdress", "Floral Hairpin", "Flowers in Hair", "Hair Flower", "Flower in Hair"],
        parents: ["HAIR_ORNAMENTS"]
    },
    HAIRBAND: {
        name: "Hairband",
        aliases: ["Hair Band", "Hair Bands"],
        parents: ["HAIR_ORNAMENTS"]
    },
    UNUSUAL_HAIR_ORNAMENTS:{
        name: "Unusual Hair Ornaments",
        aliases: ["Unusual Hair Accessories", "Unusual Hair Decorations"],
        parents: ["HAIR_ORNAMENTS"]
    },

    //// Head
    HOOD:{
        name:"Hood",
        aliases:[],
        parents:[]
    },
    HAT:{
        name:"Hat",
        aliases:[],
        parents:[]
    },
    WITCH_HAT:{
        name:"Witch Hat",
        aliases:["Witches Hat", "Witch's Hat", "Witches' Hat"],
        parents:["HAT"]
    },
    HEADBAND:{
        name:"Headband",
        aliases:[],
        parents:[]
    },

    //// Face
    MASK:{
        name:"Mask",
        aliases:[],
        parents:[]
    },
    FACE_MASK:{
        name:"Face Mask",
        aliases:["Mask Covered Face", "Mask Covering Face"],
        parents:["MASK"]
    },
    EYE_MASK:{
        name:"Eye Mask",
        aliases:["Mask Covered Eyes", "Mask Covering Eyes"],
        parents:["MASK"]
    },
    GLASSES:{
        name:"Glasses",
        aliases:["Megane"],
        parents:[]
    },

    //// Neck
    NECK_ACCESSORIES:{
        name:"Neck Accessories",
        aliases:["Necklace"],
        parents:["ACCESSORIES"]
    },
    CHOKER:{
        name:"Choker",
        aliases:["Collar Choker", "Detatchable Shirt Collar", "Neck Band", "Neckband", "Neck-band"],
        parents:["NECK_ACCESSORIES"]
    },
    COLLAR:{
        name:"Collar",
        aliases:[],
        parents:["NECK_ACCESSORIES"]
    },
    PET_COLLAR:{
        name:"Pet Collar",
        aliases:["Animal Collar", "Cat Collar", "Dog Collar"],
        parents:["COLLAR"]
    },
    NECKTIE:{
        name:"Necktie",
        aliases:["Neck tie"],
        parents:["NECK_ACCESSORIES"]
    },
    RIBBON_TIE:{
        name:"Ribbon Tie",
        aliases:[],
        parents:["NECK_ACCESSORIES"]
    },

    //// Back
    CLOAK:{
        name:"Cloak",
        aliases:[],
        parents:[]
    },
    CAPE:{
        name:"Cape",
        aliases:[],
        parents:[]
    },
    CAPELET:{
        name:"Capelet",
        aliases:["Short Cape"],
        parents:[]
    },

    //// Top
    HOODIE:{
        name:"Hoodie",
        aliases:["Hooded Sweatshirt", "Hoody"],
        parents:[]
    },
    CORSET:{
        name:"Corset",
        aliases:["Bustier"],
        parents:[]
    },
    SUIT:{
        name:"Suit",
        aliases:[],
        parents:[]
    },
    BRA:{
        name:"Bra",
        aliases:[],
        parents:[]
    },
    NIPPLE_CUTOUT_BRA:{
        name:"Nipple Cutout Bra",
        aliases:["Nipple Cut-out Bra", "Nipple Cut out Bra", "Nipple Revealing Bra"],
        parents:["LINGERIE", "NIPPLE_CUTOUTS", "BRA"]
    },
    OPEN_CUP_BRA:{
        name:"Open Cup Bra",
        aliases:[],
        parents:["LINGERIE", "OPEN_CUP_CLOTHING", "BRA"]
    },
    SHIRT:{
        name:"Shirt",
        aliases:[],
        parents:[]
    },
    BLAZER:{
        name:"Blazer",
        aliases:[],
        parents:[]
    },
    TANK_TOP:{
        name:"Tank Top",
        aliases:["Tanktop", "Sleeveless Undershirt", "Sleeveless Shirt", "Singlet", "Sleeveless T-shirt", "Camisole", "Halter Top", "Wife Beater"],
        parents:[]
    },
    CROP_TOP:{
        name:"Crop Top",
        aliases:["Cropped Top", "Belly Shirt", "Half Shirt", "Midriff Shirt", "Tummy Top", "Cutoff Shirt", "Short Shirt", "Belly Top"],
        parents:[]
    },
    BLOUSE:{
        name:"Blouse",
        aliases:["Woman's shirt", "Poet Shirt", "Cassack Shirt"],
        parents:[]
    },
    T_SHIRT:{
        name:"T-Shirt",
        aliases:[],
        parents:[]
    },
    OFF_SHOULDER_TOP:{
        name:"Off-the-shoulder Top",
        aliases:["Off-shoulder Top"],
        parents:[]
    },
    TURTLE_NECK:{
        name:"Turtle Neck",
        aliases:["Turtle Neck Sweater", "Polo Neck", "Polo Neck Sweater", "Roll-neck", "Roll Neck", "Roll-neck Sweater", "Roll Neck Sweater", "Skivvy", "Skivvy Sweater"],
        parents:[]
    },

    //// Bottom
    SPATS:{
        name:"Spats",
        aliases:["Bicycle Shorts", "Bicycling Shorts", "Cycling Shorts"],
        parents:["TIGHT_CLOTHING"]
    },
    TROUSERS:{
        name:"Trousers",
        aliases:[],
        parents:[]
    },
    PANTIES:{
        name:"Panties",
        aliases:["Knickers"],
        parents:[]
    },
    RIPPED_PANTIES:{
        name:"Ripped Panties",
        aliases:[],
        parents:["PANTIES", "RIPPED_CLOTHING"]
    },
    PANTIES_PULLED_DOWN:{
        name:"Panties Pulled Down",
        aliases:["Panties Around Legs"],
        parents:["PANTIES"]
    },
    PANTIES_AROUND_LEG:{
        name:"Panties Around Leg",
        aliases:["Panties Hanging Off"],
        parents:["PANTIES"]
    },
    PANTIES_PUSHED_TO_SIDE:{
        name:"Panties Pushed To Side",
        aliases:[],
        parents:["PANTIES"]
    },
    SHIMPAN:{
        name:"Shimpan",
        aliases:["Shima-pantsu", "Striped Panties"],
        parents:["PANTIES"]
    },
    SIDE_TIE_PANTIES:{
        name:"Side-tie Panties",
        aliases:["Side Tie Panties"],
        parents:["PANTIES"]
    },
    THONG:{
        name:"Thong",
        aliases:["T-Back Panties", "T-Back", "G-String Panties", "G-String"],
        parents:["PANTIES"]
    },
    CROTCHLESS_PANTIES:{
        name:"Crotchless Panties",
        aliases:[],
        parents:["LINGERIE", "CROTCHLESS_CLOTHING", "PANTIES"]
    },
    SHORTS:{
        name:"Shorts",
        aliases:[],
        parents:[]
    },
    SHORT_SHORTS:{
        name:"Short Shorts",
        aliases:["Hotpants", "Hot Pants", "Daisy Dukes"],
        parents:["SHORTS"]
    },
    MICRO_SHORTS:{
        name:"Micro Shorts",
        aliases:["Micro Mini Shorts"],
        parents:["SHORT_SHORTS"]
    },
    BELT:{
        name:"Belt",
        aliases:[],
        parents:[]
    },
    DECORATIVE_BELT:{
        name:"Decorative Belt",
        aliases:["Fashionable Belt", "Stylish Belt"],
        parents:["BELT"]
    },
    SKIRT:{
        name:"Skirt",
        aliases:[],
        parents:[]
    },
    MINISKIRT:{
        name:"Miniskirt",
        aliases:["Mini-skirt", "Mini Skirt"],
        parents:["SKIRT"]
    },
    MICROSKIRT:{
        name:"Microskirt",
        aliases:["Micro-miniskirt"],
        parents:["MINISKIRT"]
    },

    //// Hands & Arms
    GLOVES:{
        name:"Gloves",
        aliases:["Glove"],
        parents:[]
    },
    FINGERLESS_GLOVES:{
        name:"Fingerless Gloves",
        aliases:[],
        parents:["GLOVES"]
    },
    EVENING_GLOVES:{
        name:"Evening Gloves",
        aliases:["Evening Glove"],
        parents:["GLOVES"]
    },
    FINGERLESS_EVENING_GLOVES:{
        name:"Fingerless Evening Gloves",
        aliases:["Fingerless Evening Glove"],
        parents:["EVENING_GLOVES", "FINGERLESS_GLOVES"]
    },
    BRIDAL_GAUNTLET:{
        name:"Bridal Gauntlet",
        aliases:["Bridal Gauntlets"],
        parents:["GLOVES"]
    },
    GAUNTLETS:{
        name:"Gauntlets",
        aliases:["Gauntlet"],
        parents:["GLOVES"]
    },
    ARM_CUFF:{
        name:"Arm Cuff",
        aliases:["Arm Cuffs"],
        parents:["ACCESSORIES"]
    },
    FIST_CLAWS:{
        name:"Fist Claws",
        aliases:["Tiger Claws", "Bagh Nakh"],
        parents:["GLOVES"]
    },
    SPAULDERS:{
        name:"Spaulders",
        aliases:["Pauldron"],
        parents:[]
    },

    //// Legs & Feet
    THIGH_BAND:{
        name:"Thigh Band",
        aliases:[],
        parents:["ACCESSORIES"]
    },
    BARE_FEET:{
        name:"Bare Feet",
        aliases:["Bare Footed", "Naked Feet"],
        parents:[]
    },
    STOCKINGS:{
        name:"Stockings",
        aliases:["Hose"],
        parents:[]
    },
    THIGH_HIGH_STOCKINGS:{
        name:"Thigh-high Stockings",
        aliases:["Hold-ups", "Stay-ups", "Holdups", "Stayups", "Thigh High Stockings"],
        parents:["STOCKINGS"]
    },
    THIGH_HIGH_SOCKS:{
        name:"Thigh-high Socks",
        aliases:["Thigh High Socks", "Over-the-knee Socks", "Over The Knee Socks", "Above The Knee Socks"],
        parents:[]
    },
    PANTYHOSE:{
        name:"Pantyhose",
        aliases:["Tights"],
        parents:[]
    },
    GARTER_BELT:{
        name:"Garter Belt",
        aliases:["Suspender Belt"],
        parents:["THIGH_HIGH_STOCKINGS"]
    },
    HIGH_HEELS:{
        name:"High Heels",
        aliases:["Stiletto Heels", "Platform Heels"],
        parents:[]
    },

    //// Top & Bottom
    LINGERIE:{
        name:"Lingerie",
        aliases:[],
        parents:[]
    },
    TOWEL:{
        name:"Towel",
        aliases:["Bath Towel"],
        parents:[]
    },
    BOOTS:{
        name:"Boots",
        aliases:[],
        parents:[]
    },

    //// Full Body
    FULL_BODY_OUTFIT:{
        name:"Full Body Outfit",
        aliases:["Full Body Clothing"],
        parents:[]
    },
    TACTICAL_SUIT:{
        name:"Tactical Suit",
        aliases:[],
        parents:["FULL_BODY_OUTFIT"]
    },
    FUTURISTIC_SUIT:{
        name:"Futuristic Suit",
        aliases:[],
        parents:["FULL_BODY_OUTFIT"]
    },
    TAIMANIN_OUTFIT:{
        name:"Taimanin Outfit",
        aliases:[],
        parents:["TIGHT_CLOTHING", "FULL_BODY_OUTFIT"]
    },
    BODYSTOCKING:{
        name:"Bodystocking",
        aliases:["Body Stocking"],
        parents:["TIGHT_CLOTHING", "FULL_BODY_OUTFIT"]
    },
    DRESS:{
        name:"Dress",
        aliases:["Frock", "Gown"],
        parents:[]
    },
    MINI_DRESS:{
        name:"Mini-dress",
        aliases:["Mini Dress", "Minidress"],
        parents:["DRESS"]
    },
    SLIT_DRESS:{
        name:"Slit Dress",
        aliases:["Slashed Dress"],
        parents:["DRESS"]
    },
    WEDDING_DRESS:{
        name:"Wedding Dress",
        aliases:[],
        parents:["DRESS"]
    },
    HALTERNECK_DRESS:{
        name:"Halterneck Dress",
        aliases:["Halterneck Gown", "Halter-neck Dress", "Halter-neck Gown", "Halter Neck Dress", "Halter Neck Gown"],
        parents:["DRESS"]
    },
    CHINESE_DRESS:{
        name:"Chinese Dress",
        aliases:["Qipao", "Chipao", "Cheongsam", "Mandarin Gown", "Free Hong Kong Dress", "Free HK Dress", "Taiwanese Dress", "Chinese Gown", "Free Hong Kong Gown", "Free HK Gown", "Taiwanese Gown"],
        parents:["DRESS"]
    },
    SWIMSUIT:{
        name:"Swimsuit",
        aliases:[],
        parents:[]
    },
    SCHOOL_SWIMSUIT:{
        name:"School Swimsuit",
        aliases:["School Mizugi"],
        parents:["SWIMSUIT"]
    },
    BIKINI:{
        name:"Bikini",
        aliases:[],
        parents:["SWIMSUIT"]
    },
    SLING_BIKINI:{
        name:"Sling Bikini",
        aliases:[],
        parents:["BIKINI"]
    },
    MICRO_BIKINI:{
        name:"Micro Bikini",
        aliases:["Tiny Bikini"],
        parents:["BIKINI"]
    },
    NAKED_RIBBON:{
        name:"Naked Ribbon",
        aliases:[],
        parents:[]
    },
    UNIFORM:{
        name:"Uniform",
        aliases:[],
        parents:[]
    },
    BUTLER_UNIFORM:{
        name:"Butler Uniform",
        aliases:["Butlers Uniform"],
        parents:["UNIFORM", "SUIT", "TROUSERS"]
    },
    LEOTARD:{
        name:"Leotard",
        aliases:[],
        parents:["TIGHT_CLOTHING"]
    },
    SCHOOL_UNIFORM:{
        name:"School Uniform",
        aliases:[],
        parents:["UNIFORM"],
    },
    BEDLAH:{
        name:"Bedlah",
        aliases:["Belly Dancer Costume", "Harem Costume"],
        parents:[]
    },
    KIMONO:{
        name:"Kimono",
        aliases:[],
        parents:[],
    },
    YUKATA:{
        name:"Yukata",
        aliases:[],
        parents:["KIMONO"]
    },
    FURISODE:{
        name:"Furisode",
        aliases:[],
        parents:["KIMONO"]
    },
    OFF_THE_SHOULDER_KIMONO:{
        name:"Off-the-shoulder Kimono",
        aliases:["Loose Kimono"],
        parents:["KIMONO"]
    },
    OFF_THE_SHOULDER_YUKATA:{
        name:"Off-the-shoulder Yukata",
        aliases:["Loose Yukata"],
        parents:["YUKATA"]
    },
    OFF_THE_SHOULDER_FURISODE:{
        name:"Off-the-shoulder Furisode",
        aliases:["Loose Furisode"],
        parents:["FURISODE"]
    },
    KIMONO_MINIDRESS:{
        name:"Kimono Minidress",
        aliases:["Kimono Mini-dress", "Kimono Mini Dress"],
        parents:["KIMONO"]
    },
    YUKATA_MINIDRESS:{
        name:"Yukata Minidress",
        aliases:["Yukata Mini-dress", "Yukata Mini Dress"],
        parents:["YUKATA"]
    },
    YUKATA_MINIDRESS:{
        name:"Furisode Minidress",
        aliases:["Furisode Mini-dress", "Furisode Mini Dress"],
        parents:["FURISODE"]
    },
    KIMONO_JACKET:{
        name:"Kimono Jacket",
        aliases:[],
        parents:["KIMONO"]
    },
    KIMONO_SKIRT:{
        name:"Kimono Skirt",
        aliases:[],
        parents:["KIMONO", "SKIRT"]
    },
    YUKATA_JACKET:{
        name:"Yukata Jacket",
        aliases:[],
        parents:["YUKATA"]
    },
    YUKATA_SKIRT:{
        name:"Yukata Skirt",
        aliases:[],
        parents:["YUKATA", "SKIRT"]
    },
    FURISODE_JACKET:{
        name:"Furisode Jacket",
        aliases:[],
        parents:["FURISODE"]
    },
    FURISODE_SKIRT:{
        name:"Furisode Skirt",
        aliases:[],
        parents:["FURISODE", "SKIRT"]
    },
    MIKO_DRESS:{
        name:"Miko Dress",
        aliases:[],
        parents:[]
    },
    MAID_DRESS:{
        name:"Maid Dress",
        aliases:["Maid Outfit"],
        parents:[]
    },
    CHRISTMAS_CLOTHING:{
        name:"Christmas Clothing",
        aliases:["Christmas", "Christmas Dress", "Christmas Clothes", "Festive Clothing", "Festive Dress", "Festive Clothes"],
        parents:[]
    },
    HALLOWEEN_OUTFIT:{
        name:"Halloween Outfit",
        aliases:[],
        parents:[]
    },
    BUNNYGIRL_OUTFIT:{
        name:"Bunnygirl Outfit",
        aliases:["Bunny Girl Outfit", "Bunny-girl Outfit", "Bunnygirl Dress", "Bunny Girl Dress", "Bunny-girl Dress", "Bunnygirl Costume", "Bunny Girl Costume", "Bunny-girl Costume"],
        parents:[]
    },
    TEACHER_OUTFIT:{
        name:"Teacher's Clothes",
        aliases:["Teacher Outfit"],
        parents:[]
    },
    BABY_DOLL:{
        name:"Baby Doll",
        aliases:[],
        parents:[]
    },
    CHEERLEADER_OUTFIT:{
        name:"Cheerleader Outfit",
        aliases:["Cheer Leader Outfit"],
        parents:["SKIRT", "CROP_TOP"]
    },

    // Misc.
    WEARING_CONDOMS:{
        name:"Wearing Condoms",
        aliases:["Condom Belt", "Used Condom Belt", "Wearing Used Condoms"],
        parents:["USED_CONDOMS_EXPOSITION"]
    },


    //// Stickers
    EROTIC_STICKER:{
        name:"Erotic Sticker",
        aliases:["Erotic Stickers"],
        parents:[]
    },
    CROTCH_STICKER:{
        name:"Crotch Sticker",
        aliases:["Crotch Stickers"],
        parents:["EROTIC_STICKER"]
    },
    VAGINAL_STICKER:{
        name:"Vaginal Sticker",
        aliases:["Pussy Sticker", "Genital Sticker"],
        parents:["CROTCH_STICKER"]
    },
    ANAL_STICKER:{
        name:"Anal Sticker",
        aliases:["Anus Sticker", "Ass Sticker"],
        parents:["CROTCH_STICKER"]
    },
    NIPPLE_STICKER:{
        name:"Nipple Sticker",
        aliases:["Pasties"],
        parents:["EROTIC_STICKER"]
    },

    CHASTITY_BELT:{
        name:"Chastity Belt",
        aliases:[],
        parents:[]
    },

    // Technical
    XRAY:{
        name:"X-ray",
        aliases:["Xray"],
        parents:[]
    },
    CUT_IN_XRAY:{
        name:"Cut-in X-ray",
        aliases:["Cutin X-ray", "Cut-in Xray", "Cutin Xray"],
        parents:["XRAY"]
    },
    OVERLAY_XRAY:{
        name:"Overlay X-ray",
        aliases:["Overlay Xray"],
        parents:["XRAY"]
    },
    NO_SEX:{
        name:"No Sex",
        aliases:[],
        parents:[]
    },
    FEMALE_INITIATOR:{
        name:"Female Initiator",
        aliases:["Female Sex Starter", "Female Starts Sex", "Female Sex Initiator", "Female Initiates Sex", "Woman Sex Starter", "Woman Starts Sex", "Woman Sex Initiator", "Woman Initiates Sex", "Girl Sex Starter", "Girl Starts Sex", "Girl Sex Initiator", "Girl Initiates Sex", "Heroine Sex Starter", "Heroine Starts Sex", "Heroine Sex Initiator", "Heroine Initiates Sex"],
        parents:[]
    },
    MALE_ON_FUTA:{
        name:"Male on Futa",
        aliases:["Male Fucking Futa", "Male Fucks Futa", "Male on Futanari", "Male Fucking Futanari", "Male Fucks Futanari"],
        parents:[]
    },
    YURI:{
        name:"Yuri",
        aliases:["Lesbian Sex", "Lesbians", "Gay girls"],
        parents:[]
    },
    SCAT:{
        name:"Scat",
        aliases:["Coprophilia", "Scatophilia", "Shitting", "Shit", "Poop", "Poo"],
        parents:[]
    },

    // Location
    OUTSIDE: {
        name: "Outside",
        aliases: [],
        parents: []
    },
    INSIDE: {
        name: "Inside",
        aliases: [],
        parents: []
    },
    PRIVATE:{
        // Nobody watching
        name:"Private",
        aliases:[],
        parents:[]
    },
    SEMI_PRIVATE:{
        // People watching in a location where sex is expected e.g. Brothel
        name:"Semi-private",
        aliases:["Semi Private"],
        parents:[]
    },
    PUBLIC:{
        // People watching and the location is open to the public
        name:"Public",
        aliases:[],
        parents:[]
    },
    SEMI_PUBLIC: {
        // Public place, nobody watching
        name:"Semi-Public",
        aliases:["Semi Public"],
        parents:[]
    },
    TOILET: {
        name: "Toilet",
        aliases: ["Toilets"],
        parents: ["INSIDE"]
    },
    BATHROOM:{
        name:"Bathroom",
        aliases:[],
        parents:["INSIDE"]
    },
    IN_BATH:{
        name:"In Bath",
        aliases:[],
        parents:["INSIDE", "IN_WATER"]
    },
    CLASSROOM: {
        name: "Classroom",
        aliases: [],
        parents: ["SCHOOL"]
    },
    ALLEYWAY: {
        name: "Alleyway",
        aliases: ["Back Alley"],
        parents: ["OUTSIDE"]
    },
    PARK: {
        name: "Park",
        aliases: ["Public Park"],
        parents: ["OUTSIDE"]
    },
    BEDROOM:{
        name:"Bedroom",
        aliases:[],
        parents:["INSIDE"]
    },
    ON_BED:{
        name:"On Bed",
        aliases:[],
        parents:[]
    },
    LABORATORY:{
        name:"Laboratory",
        aliases:["Lab"],
        parents:["INSIDE"]
    },
    WAREHOUSE:{
        name:"Warehouse",
        aliases:["Storehouse"],
        parents:["INSIDE"]
    },
    LIVING_ROOM:{
        name:"Living Room",
        aliases:["Main Room"],
        parents:["INSIDE"]
    },
    ONSEN:{
        name:"Onsen",
        aliases:["Hotsprings", "Hotspring", "Hot Spring", "Hot Spring"],
        parents:[]
    },
    CHURCH:{
        name:"Church",
        aliases:[],
        parents:["INSIDE"]
    },
    FLESH_ROOM:{
        name:"Flesh Room",
        aliases:["Meat Room", "Tentacle Room"],
        parents:["INSIDE"]
    },
    ON_CHAIR:{
        name:"On a Chair",
        aliases:["On Chair"],
        parents:[]
    },
    ON_DESK:{
        name:"On a Desk",
        aliases:["On Desk", "Over a Desk", "Over Desk"],
        parents:[]
    },
    SOAPLAND:{
        name:"Soapland",
        aliases:["Soap Land"],
        parents:["INSIDE"]
    },
    WOODS:{
        name:"Woods",
        aliases:["Forest"],
        parents:["OUTSIDE"]
    },
    CAVE:{
        name:"Cave",
        aliases:[],
        parents:["OUTSIDE"]
    },
    SCHOOL:{
        name:"School",
        aliases:[],
        parents:["INSIDE"]
    },
    PRISON:{
        name:"Prison",
        aliases:["Jail"],
        parents:["INSIDE"]
    },
    PRISON_CELL:{
        name:"Prison Cell",
        aliases:["Jail Cell"],
        parents:["PRISON"]
    },
    BEACH:{
        name:"Beach",
        aliases:["Seaside"],
        parents:["OUTSIDE"]
    },
    LOVE_HOTEL:{
        name:"Love Hotel",
        aliases:[],
        parents:["INSIDE"]
    },
    SKY:{
        name:"Sky",
        aliases:[],
        parents:["OUTSIDE"]
    },
    ARENA:{
        name:"Arena",
        aliases:[],
        parents:["INSIDE"]
    },
    FACILITY:{
        name:"Facility",
        aliases:[],
        parents:["INSIDE"]
    },
    IN_WATER:{
        name:"In Water",
        aliases:["Sex in Water"],
        parents:[]
    },
    UNDER_WATER:{
        name:"Under Water",
        aliases:["Sex Under Water"],
        parents:["IN_WATER"]
    },
    BROTHEL:{
        name:"Brothel",
        aliases:[],
        parents:[]
    },
    UNDER_EDEN:{
        name:"Under Eden",
        aliases:[],
        parents:["BROTHEL"]
    },
    DREAM:{
        name:"Dream",
        aliases:[],
        parents:[]
    },
    FUUMA_BASE:{
        name:"Fuuma Base",
        aliases:["Fuumas Base", "Fuuma HQ", "Fuumas HQ", "Fuuma's Base", "Fuuma's HQ"],
        parents:["INSIDE"]
    },
    TRAIN:{
        name:"Train",
        aliases:["Inside Train"],
        parents:["INSIDE"]
    },
    ALTERNATE_UNIVERSE:{
        name:"Alternate Universe",
        aliases:[],
        parents:[]
    },
    CASINO:{
        name:"Casino",
        aliases:[],
        parents:[]
    },
    SEX_DUNGEON:{
        name:"Sex Dungeon",
        aliases:[],
        parents:["INSIDE"]
    },
    BODY_MODIFICATION_ROOM:{
        name:"Body Modification Room",
        aliases:["Body Mod Room", "Body Modification Lab", "Body Mod Lab"],
        parents:["LABORATORY"]
    },

    // Various Male Tags
    OLD_MAN:{
        name:"Old Man",
        aliases:[],
        parents:[]
    },
    FAT_OLD_MAN:{
        name:"Fat Old Man",
        aliases:[],
        parents:["OLD_MAN"]
    },
    SHOTA:{
        name:"Shota",
        aliases:["Child", "Little Boy", "Young Boy"],
        parents:[]
    },
    MONSTER:{
        name:"Monster",
        aliases:[],
        parents:[]
    },
    SLIME:{
        name:"Slime",
        aliases:[],
        parents:["MONSTER"]
    },
    HORSE_MAN:{
        name:"Horse Man",
        aliases:["Horse Monster"],
        parents:["MONSTER"]
    },
    HORSE:{
        name:"Horse",
        aliases:[],
        parents:["BEASTIALITY"]
    },
};

var CHAR = {
    COCO_COOKIE: {
        base: {
            name: {
                eng: "Coco Cookie",
                engAlias: ["Coco"],
                jap: "可可曲奇",
                japAlias: ["可可"]
            },
            tags: [
                TAG.FLAT_CHESTED, TAG.TINY, TAG.LIGHT_SKIN
            ],
            gender: "female",
            originalCharacter: true,
            artist: ARTIST.NULL,
            cv: CV.NULL
        }
    },
    PRISCILLA: {
        base: {
            name: {
                eng: "Priscilla",
                engAlias: [],
                jap: "普利希亚",
                japAlias: []
            },
            tags: [
                TAG.FLAT_CHESTED, TAG.TINY, TAG.LIGHT_SKIN
            ],
            gender: "female",
            originalCharacter: true,
            artist: ARTIST.NULL,
            cv: CV.NULL
        }
    }
};

var SCENE = {
   "1601720121": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.ORAL_SEX, TAG.HANDJOB, TAG.PAIZURI],
            male: [],
            location: [TAG.INSIDE],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1601720122": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.VAGINAL_SEX, TAG.NAKADASHI, TAG.DEFLORATION],
            male: [],
            location: [TAG.INSIDE],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1601720131": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.VAGINAL_SEX, TAG.NAKADASHI, TAG.LIVING_DOLL],
            male: [],
            location: [TAG.LABORATORY],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1601720132": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.VAGINAL_SEX, TAG.NAKADASHI],
            male: [],
            location: [TAG.INSIDE],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1601720151": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.VAGINAL_SEX, TAG.ON_DESK, TAG.NAKADASHI],
            male: [],
            location: [TAG.INSIDE],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1601720221": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.ORAL_SEX, TAG.CUNNILINGUS, TAG.SIXTY_NINE, TAG.CUM_IN_MOUTH],
            male: [],
            location: [TAG.INSIDE],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1601720222": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.VAGINAL_SEX, TAG.NAKADASHI],
            male: [],
            location: [TAG.INSIDE],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1601720231": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.MASTURBATION, TAG.VAGINAL_INSERTION, TAG.SQUIRTING],
            male: [],
            location: [TAG.INSIDE],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1601720321": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.BLOWJOB, TAG.WEDDING_DRESS, TAG.CUM_IN_MOUTH, TAG.CUM_SWALLOWING],
            male: [],
            location: [TAG.CHURCH],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1601720322": {
        character: [CHAR.COCO_COOKIE],
        tags: {
            female: [TAG.VAGINAL_SEX, TAG.WEDDING_DRESS, TAG.NAKADASHI],
            male: [],
            location: [TAG.CHURCH],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1602110121": {
        character: [CHAR.PRISCILLA],
        tags: {
            female: [TAG.HANDJOB, TAG.BLOWJOB, TAG.NEKOMIMI, TAG.TAIL],
            male: [],
            location: [TAG.INSIDE],
            misc: []
        },
        ignoredCharacterTags: []
    },
    "1602110122": {
        character: [CHAR.PRISCILLA],
        tags: {
            female: [TAG.VAGINAL_SEX, TAG.NEKOMIMI, TAG.TAIL, TAG.NAKADASHI],
            male: [],
            location: [TAG.BEDROOM],
            misc: []
        },
        ignoredCharacterTags: []
    }
};





