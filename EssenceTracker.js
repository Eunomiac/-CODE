void MarkStart("EssenceTracker");
const EssenceTracker = (() => {

    // #region *** *** FRONT *** ***
    const SCRIPTNAME = "EssenceTracker";
    const STA = {get TE() { return C.RO.OT[SCRIPTNAME] }};
    const MAS = {get TER() { return C.RO.OT.MASTER }};

    const DEFAULTSTATE = {
        isSetup: false
    }; // Initial values for state storage.
    const DEFAULTMASTER = { // Initial Registry entry for this script.
        Players: {
            "-MbaQwWFrpaBekImVLM2": {
                name: "Storyteller",
                d20UserID: "248419"
            },
            "-Mb0PsT7Wb1g8M8hn5Zg": {
                name: "Crimson Zenith Warrior",
                charID: "-MavmPoKVIUExYbl63FS",
                d20UserID: "2336008"
            },
            "-MaVKCkJH5_JYKYqpS6k": {
                name: "Kainen",
                charID: "-MavmPq2v6Tec86-ce27",
                d20UserID: "630393"
            },
            "-MbXm9R6AOa51-mrgsd1": {
                name: "Lumi",
                charID: "-MavmPqHKDFBH6Jr7J5g",
                d20UserID: "110297"
            },
            "-Mb0Zs4WNDgkrjbnaptb": {
                name: "The Wanderer",
                charID: "-MavmPr-fS3zeBYqW6yC",
                d20UserID: "1809205"
            }
        },
        PCs: {}
    };

    // #region INITIALIZATION & EVENT HANDLERS
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => { // Initialize State, Trackers, Event Listeners
        if (isResettingState) { C.RO.OT[SCRIPTNAME] = {} }

        // Initialize state storage and master registry storage with DEFAULTSTATE/DEFAULTMASTER where needed.
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        Object.entries(DEFAULTSTATE).filter(([key]) => !(key in STA.TE)).forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });
        Object.entries(DEFAULTMASTER).filter(([key]) => !(key in MAS.TER)).forEach(([key, defaultVal]) => { MAS.TER[key] = defaultVal });

        // Initialize Essence Trackers for all players.
        if (STA.TE.isSetup) {
            setZIndices();
            for (const [charID, charData] of Object.entries(MAS.TER.PCs)) {
                for (const tracker of Object.keys(TRACKERS)) {
                    TRACKERS[tracker].syncHost(charID);
                }
            }
        }

        // Register event handlers for chat commands and character sheet attribute changes.
        if (isRegisteringEventListeners) {
            on("chat:message", handleMessage);
            on("change:attribute", handleAttrChange);
        }

        C.Flag(`... ${SCRIPTNAME}.js Ready!`, {force: true, direct: true});
        log(`${SCRIPTNAME}.js Ready!`);
    };
    const handleMessage = (msg) => {
        if (msg.content.startsWith("!etp") || msg.content.startsWith("!et") && playerIsGM(msg.playerid)) {
            let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
                .map((x) => x.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1"))
                .filter((x) => Boolean(x));
            if (call === "!et") {
                ({
                    reset: () => { Initialize(false, true); setupTrackers() },
                    preload: () => {
                        if (args.includes("clear")) {
                            clearImagePreloads();
                        } else {
                            preloadImages();
                        }
                    },
                    get: () => ({
                        textname: () => { C.Alert(findObjs({_type: "text", name: "TextShadow"}).map((textObj) => textObj.get("text")).join("<br>")) },
                        pos: () => { getImgPos(msg.selected.pop()) },
                        all: () => { C.Show([msg.selected[0]].map((data) => getObj(data._type, data._id)).pop()) },
                        allstate: () => { C.Show(state) },
                        flatimg: () => { C.Show(getAllImages(), "All Unique Images") }
                    }[(call = args.shift() || "").toLowerCase()] || (() => false))(),
                    set: () => ({
                        textname: () => {
                            msg.selected.filter((data) => data._type === "text").forEach((data) => getObj("text", data._id).set({name: "TextShadow"}));
                        },
                        pos: () => { setImgPos(msg.selected, ...args) },
                        name: () => { setImgName(msg.selected, args.join(" ")) }
                    }[(call = args.shift() || "").toLowerCase()] || (() => false))()
                }[(call = args.shift() || "").toLowerCase()] || (() => false))();
            } else if (call === "!etp") {
                ({
                    set: () => ({
                        sorc: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "sorcerous", ...args) },
                        sorcbanked: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "sorcerousbanked", ...args) },
                        anima: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "anima", ...args) },
                        peripheral: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "peripheral", ...args) },
                        personal: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "personal", ...args) }
                    }[(call = args.shift() || "").toLowerCase()] || (() => false))()
                }[(call = args.shift() || "").toLowerCase()] || (() => false))();
            }
        }
    };
    const handleAttrChange = (attrObj, prevData) => {
        const [attrName, charID] = [attrObj.get("name"), attrObj.get("_characterid")];
        if (attrName in TRACKEDATTRIBUTES && charID in MAS.TER.PCs) {
            TRACKERS[TRACKEDATTRIBUTES[attrName]].syncHost(charID);
        }
    };
    // #endregion

    // #region DEFINITIONS
    const PLAYERCONFIG = {
        "-MavmPoKVIUExYbl63FS": { // Crimson Zenith Warrior
            hosts: {
                ETI_Base: "https://s3.amazonaws.com/files.d20.io/images/227170171/SuVLyp6AHkLvAEJETTQoJA/thumb.png?1623063954",
                ETI_Overlay: "https://s3.amazonaws.com/files.d20.io/images/227170214/27VGZv0-JfgWZ_rFzMWE4A/thumb.png?1623063990"
            }
        },
        "-MavmPq2v6Tec86-ce27": { // Kainen
            animaClass: "solartwilightdarkling",
            hosts: {
                ETI_Base: "https://s3.amazonaws.com/files.d20.io/images/227170170/2nYiPrqWfow8Rl9O9QSuHA/thumb.png?1623063954",
                ETI_Overlay: "https://s3.amazonaws.com/files.d20.io/images/227170215/r22ibapt4OgUCNGX73hJDg/thumb.png?1623063989"
            }
        },
        "-MavmPqHKDFBH6Jr7J5g": { // Lumi
            hosts: {
                ETI_Base: "https://s3.amazonaws.com/files.d20.io/images/227170168/fIIFUV06D2i-UkfNcH6OXg/thumb.png?1623063953",
                ETI_Overlay: "https://s3.amazonaws.com/files.d20.io/images/227170216/Ei_wcqOvLAAWejkadpbn2g/thumb.png?1623063990"
            }
        },
        "-MavmPr-fS3zeBYqW6yC": { // The Wanderer
            hosts: {
                ETI_Base: "https://s3.amazonaws.com/files.d20.io/images/227170172/wEA0adX177S95Etw2cS9wQ/thumb.png?1623063952",
                ETI_Overlay: "https://s3.amazonaws.com/files.d20.io/images/227170213/Beq8Zv0oxYtpUGokP8zhcQ/thumb.png?1623063989"
            }
        }
    };
    const TRACKERCONFIG = {
        solar: {
            dawn: {
                animaClass: "solardawn",
                hosts: {
                    ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170192/XRcHFQARv8JUgadP6KIBTg/thumb.png?1623063964",
                    ETI_OuterRing2A: "sorcerous-25",
                    ETI_OuterRing2B: "sorcerousbanked-15",
                    ETI_OuterRing1A: "solarperipheral-33",
                    ETI_OuterRing1B: "solarperiphcommitted-33",
                    ETI_InnerRing1A_Solar: "solarpersonal-13",
                    ETI_InnerRing1B_Solar: "solarpersonalcommitted-13"
                }
            },
            twilight: {
                animaClass: "solartwilight",
                hosts: {
                    ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170189/Un662bJCnNa_tLERebHPgg/thumb.png?1623063963",
                    ETI_OuterRing2A: "sorcerous-25",
                    ETI_OuterRing2B: "sorcerousbanked-15",
                    ETI_OuterRing1A: "solarperipheral-33",
                    ETI_OuterRing1B: "solarperiphcommitted-33",
                    ETI_InnerRing1A_Solar: "solarpersonal-13",
                    ETI_InnerRing1B_Solar: "solarpersonalcommitted-13"
                }
            }
        },
        lunar: {
            "changing moon": {
                animaClass: "lunarchangingmoon",
                hosts: {
                    ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170191/izHLSljrqFCasXI9btzAcA/thumb.png?1623063964",
                    ETI_OuterRing2A: "sorcerous-25",
                    ETI_OuterRing2B: "sorcerousbanked-15",
                    ETI_OuterRing1A: "lunarperipheral-38",
                    ETI_OuterRing1B: "lunarperiphcommitted-38",
                    ETI_InnerRing1A_Lunar: "lunarpersonal-16",
                    ETI_InnerRing1B_Lunar: "lunarpersonalcommitted-16"
                }
            }
        }
    };
    const HOSTS = {
        "ETA_FullVortex": {
            height: 2.05717761557178,
            width: 2.05717761557178,
            leftShift: 0,
            topShift: 0
        },
        "ETI_Base": {
            height: 0.608272506082725,
            width: 0.608272506082725,
            leftShift: 0,
            topShift: -0.00182481751824818
        },
        "ETA_FullCorona": {
            height: 1.24574209245742,
            width: 1.42092457420925,
            leftShift: 0,
            topShift: 0
        },
        "ETI_Caste": {
            height: 0.222627737226277,
            width: 0.22323600973236,
            leftShift: 0,
            topShift: -0.197080291970803
        },
        "ETA_CasteFlare": {
            height: 0.657542579075426,
            width: 0.554136253041363,
            leftShift: 0,
            topShift: -0.180656934306569
        },
        "ETI_Overlay": {
            height: 0.773722627737226,
            width: 0.708029197080292,
            leftShift: 0,
            topShift: 0.041970802919708
        },
        "ETI_OuterRing2A": {
            height: 0.686131386861314,
            width: 0.802919708029197,
            leftShift: 0,
            topShift: -0.0535279805352798
        },
        "ETI_OuterRing2B": {
            height: 0.686131386861314,
            width: 0.802919708029197,
            leftShift: 0,
            topShift: -0.0535279805352798
        },
        "ETI_OuterRing1A": {
            height: 0.613138686131387,
            width: 0.700729927007299,
            leftShift: 0,
            topShift: -0.0371046228710462
        },
        "ETI_OuterRing1B": {
            height: 0.613138686131387,
            width: 0.700729927007299,
            leftShift: 0,
            topShift: -0.0371046228710462
        },
        "ETA_CasteCorona": {
            height: 0.423965936739659,
            width: 0.483576642335766,
            leftShift: 0,
            topShift: -0.197080291970803
        },
        "ETI_InnerRing1A_Solar": {
            height: 0.145985401459854,
            width: 0.233576642335766,
            leftShift: 0,
            topShift: -0.151459854014599
        },
        "ETI_InnerRing1B_Solar": {
            height: 0.145985401459854,
            width: 0.233576642335766,
            leftShift: 0,
            topShift: -0.151459854014599
        },
        "ETI_InnerRing1A_Lunar": {
            height: 0.165450121654501,
            width: 0.233576642335766,
            leftShift: 0,
            topShift: -0.170316301703163
        },
        "ETI_InnerRing1B_Lunar": {
            height: 0.165450121654501,
            width: 0.233576642335766,
            leftShift: 0,
            topShift: -0.170316301703163
        },
        "ETI_Willpower": {
            height: 0.0802919708029197,
            width: 0.37956204379562,
            leftShift: 0,
            topShift: 0.385036496350365
        },
        "ETI_Health": {
            height: 0.0656934306569343,
            width: 0.569343065693431,
            leftShift: 0,
            topShift: 0.352798053527981
        },
        "ETT_Initiative": {
            leftShift: -0.023,
            topShift: 0.11
        }
    };
    const IMAGES = {
        "blank": "https://s3.amazonaws.com/files.d20.io/images/32884580/bLNs57v4XUNsszxk9_hyTA/thumb.png?1494583268",
        "solardawn": [
            {
                ETA_CasteCorona: false,
                ETA_CasteFlare: false,
                ETA_FullCorona: false,
                ETA_FullVortex: false,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170192/XRcHFQARv8JUgadP6KIBTg/thumb.png?1623063964"
            },
            {
                ETA_CasteCorona: true,
                ETA_CasteFlare: false,
                ETA_FullCorona: false,
                ETA_FullVortex: false,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170188/FJOGtw5ErSHVQdWax7YUOg/thumb.png?1623063964"
            },
            {
                ETA_CasteCorona: true,
                ETA_CasteFlare: true,
                ETA_FullCorona: true,
                ETA_FullVortex: false,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170188/FJOGtw5ErSHVQdWax7YUOg/thumb.png?1623063964"
            },
            {
                ETA_CasteCorona: true,
                ETA_CasteFlare: true,
                ETA_FullCorona: true,
                ETA_FullVortex: true,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170188/FJOGtw5ErSHVQdWax7YUOg/thumb.png?1623063964"
            }
        ],
        "solartwilightdarkling": [
            {
                ETA_CasteCorona: false,
                ETA_CasteFlare: false,
                ETA_FullCorona: false,
                ETA_FullVortex: false,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170189/Un662bJCnNa_tLERebHPgg/thumb.png?1623063963"
            },
            {
                ETA_CasteCorona: true,
                ETA_CasteFlare: false,
                ETA_FullCorona: false,
                ETA_FullVortex: false,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170190/gAXptRB7Q-vKSlYChEQbLQ/thumb.png?1623063962"
            },
            {
                ETA_CasteCorona: true,
                ETA_CasteFlare: true,
                ETA_FullCorona: true,
                ETA_FullVortex: false,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170190/gAXptRB7Q-vKSlYChEQbLQ/thumb.png?1623063962"
            },
            {
                ETA_CasteCorona: true,
                ETA_CasteFlare: true,
                ETA_FullCorona: true,
                ETA_FullVortex: true,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170190/gAXptRB7Q-vKSlYChEQbLQ/thumb.png?1623063962"
            }
        ],
        "lunarchangingmoon": [
            {
                ETA_CasteCorona: false,
                ETA_CasteFlare: false,
                ETA_FullCorona: false,
                ETA_FullVortex: false,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170191/izHLSljrqFCasXI9btzAcA/thumb.png?1623063964"
            },
            {
                ETA_CasteCorona: true,
                ETA_CasteFlare: false,
                ETA_FullCorona: false,
                ETA_FullVortex: false,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170193/c8JSZSyTNTOCgzKxTnZdhQ/thumb.png?1623063964"
            },
            {
                ETA_CasteCorona: true,
                ETA_CasteFlare: true,
                ETA_FullCorona: true,
                ETA_FullVortex: false,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170193/c8JSZSyTNTOCgzKxTnZdhQ/thumb.png?1623063964"
            },
            {
                ETA_CasteCorona: true,
                ETA_CasteFlare: true,
                ETA_FullCorona: true,
                ETA_FullVortex: true,
                ETI_Caste: "https://s3.amazonaws.com/files.d20.io/images/227170193/c8JSZSyTNTOCgzKxTnZdhQ/thumb.png?1623063964"
            }
        ],
        "solarhealth-13411":[
            "https://s3.amazonaws.com/files.d20.io/images/225540437/rqAf8RKf30KR04hclhGgwQ/thumb.png?1622362362",
            "https://s3.amazonaws.com/files.d20.io/images/225540442/AEv5GP3wUDVhLL9oCP8ldg/thumb.png?1622362362",
            "https://s3.amazonaws.com/files.d20.io/images/225540446/D_zFFTT4GVgDH5Vy--NwEg/thumb.png?1622362363",
            "https://s3.amazonaws.com/files.d20.io/images/225540440/zEn9oGIRtcmt4xli05wpHg/thumb.png?1622362363",
            "https://s3.amazonaws.com/files.d20.io/images/225540438/cir9ZzZbkU5f_m4d9MOYAw/thumb.png?1622362363",
            "https://s3.amazonaws.com/files.d20.io/images/225540441/mABggUoFu0uh5dqxOK_-PQ/thumb.png?1622362363",
            "https://s3.amazonaws.com/files.d20.io/images/225540447/o2q7fNebh_GwEtdr1oEGXQ/thumb.png?1622362362",
            "https://s3.amazonaws.com/files.d20.io/images/225540439/GYvOWnVEsVPAbNAHsspqRA/thumb.png?1622362363",
            "https://s3.amazonaws.com/files.d20.io/images/225540443/JFQqb5BEqR_lyjQ1K1WtYA/thumb.png?1622362362",
            "https://s3.amazonaws.com/files.d20.io/images/225540445/SapsmOJjzKOmcFFiQPJ7rg/thumb.png?1622362363",
            "https://s3.amazonaws.com/files.d20.io/images/225540444/OQH4mr5b9vZMl_AjFokNiQ/thumb.png?1622362363"
        ],
        "solarhealth-23311":[
            "https://s3.amazonaws.com/files.d20.io/images/225540470/bCkbvkS6tPWhoGAeU1Ibmg/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540469/ZHucYU8zdN227G-ppCQSdw/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540465/XRaBZArJ6hBTd-6DeW7beA/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540466/Ja6HicTFdakUMM8Z1KqQ7w/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540468/8vI8OQV06KXI89Z5HkynkQ/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540460/KChAFw_U-sqfm5dSyJMTbA/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540461/5VhOViH0mwNltSl2hZ8YRA/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540462/LGTqPb9mwfWJjd8rJiaswA/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540463/cJn1fN-ujABuut4TzqiMpQ/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540467/-1cA75PRBzyD9kGEIpmjVA/thumb.png?1622362373",
            "https://s3.amazonaws.com/files.d20.io/images/225540464/b5osLUdqgCMi8OD_cO7jmQ/thumb.png?1622362373"
        ],
        "lunarhealth-12711":[
            "https://s3.amazonaws.com/files.d20.io/images/227063469/rJHwU6dpVLkfzW-UZmS6XA/thumb.png?1623011302",
            "https://s3.amazonaws.com/files.d20.io/images/227063471/CfQioejVW88ExpdfdJNs6Q/thumb.png?1623011305",
            "https://s3.amazonaws.com/files.d20.io/images/227063466/raKIRyY8eimQ7w67UxEvGw/thumb.png?1623011306",
            "https://s3.amazonaws.com/files.d20.io/images/227063465/PN41xVeVwCh4tRVyfjf-ag/thumb.png?1623011302",
            "https://s3.amazonaws.com/files.d20.io/images/227063464/y8OYYWD9RW7k9gzrbcjBYQ/thumb.png?1623011302",
            "https://s3.amazonaws.com/files.d20.io/images/227063476/IrYbpc8Q8zXJdxmhNxHwXg/thumb.png?1623011302",
            "https://s3.amazonaws.com/files.d20.io/images/227063474/n3amoEe4zbDLAPYniMhEKg/thumb.png?1623011302",
            "https://s3.amazonaws.com/files.d20.io/images/227063468/2WPVX0yA2gIkXkFAV2ZpTg/thumb.png?1623011302",
            "https://s3.amazonaws.com/files.d20.io/images/227063470/7lmS9EMcRqqAEVWMzyxosA/thumb.png?1623011302",
            "https://s3.amazonaws.com/files.d20.io/images/227063477/2D5pCEvfFvQdyGZ8KOCEMQ/thumb.png?1623011304",
            "https://s3.amazonaws.com/files.d20.io/images/227063473/EVU9-QCDkVVQdbrKN9bhsQ/thumb.png?1623011303",
            "https://s3.amazonaws.com/files.d20.io/images/227063467/xA3kTOY50ZvnZd4-68huug/thumb.png?1623011302",
            "https://s3.amazonaws.com/files.d20.io/images/227063475/mq1OzP3r7YgDTzydIIBaeg/thumb.png?1623011303"
        ],
        "solarperiphcommitted-33":[
            null,
            "https://s3.amazonaws.com/files.d20.io/images/225541245/OZ9gW-3vnbNLJWLt2dt7_w/thumb.png?1622362811",
            "https://s3.amazonaws.com/files.d20.io/images/225541241/MQRgIG1NZfyHNkSlJLtxLA/thumb.png?1622362808",
            "https://s3.amazonaws.com/files.d20.io/images/225541242/8eMQgjPbXfNLrw_5vMLbCQ/thumb.png?1622362807",
            "https://s3.amazonaws.com/files.d20.io/images/225541238/cuaNLlegeBuA7eJeoOzNzA/thumb.png?1622362810",
            "https://s3.amazonaws.com/files.d20.io/images/225541246/p6MP0Xb96YZQcPnBFBwygA/thumb.png?1622362811",
            "https://s3.amazonaws.com/files.d20.io/images/225541243/JpfHvEwKVsjQNq90Szhpxw/thumb.png?1622362809",
            "https://s3.amazonaws.com/files.d20.io/images/225541248/R6Xp8z1wTAQshHoNMneEEg/thumb.png?1622362810",
            "https://s3.amazonaws.com/files.d20.io/images/225541240/DyXGtvjGU3PELSpQda_1gA/thumb.png?1622362812",
            "https://s3.amazonaws.com/files.d20.io/images/225541218/zobAMTJAy7QxbnV310eTzg/thumb.png?1622362807",
            "https://s3.amazonaws.com/files.d20.io/images/225541217/t7YraFTTK-8ONJf5pWH1AQ/thumb.png?1622362807",
            "https://s3.amazonaws.com/files.d20.io/images/225541219/TwAwPqmgDvDdZaTjQTnH0A/thumb.png?1622362808",
            "https://s3.amazonaws.com/files.d20.io/images/225541221/1RFD9eevFnHL7xPji9mI7w/thumb.png?1622362813",
            "https://s3.amazonaws.com/files.d20.io/images/225541220/LtLWBy1FRlt2Oj--RzrFQg/thumb.png?1622362810",
            "https://s3.amazonaws.com/files.d20.io/images/225541222/HPrYHUS80ycCYCbDeUWVVg/thumb.png?1622362809",
            "https://s3.amazonaws.com/files.d20.io/images/225541223/tl9vPhoZLYK5MpWNrw2Srg/thumb.png?1622362812",
            "https://s3.amazonaws.com/files.d20.io/images/225541224/FtCAfK-hVi8QajoM_I46YA/thumb.png?1622362811",
            "https://s3.amazonaws.com/files.d20.io/images/225541225/1RwLtnkX2EMA7rX8onUsEw/thumb.png?1622362812",
            "https://s3.amazonaws.com/files.d20.io/images/225541227/fDA-mVOO4LYzOKYVG6mR6w/thumb.png?1622362812",
            "https://s3.amazonaws.com/files.d20.io/images/225541226/7wX7cpStBt8UfQ-t9rNQdg/thumb.png?1622362811",
            "https://s3.amazonaws.com/files.d20.io/images/225541229/M6743uI801zlDWY0KGwtyA/thumb.png?1622362813",
            "https://s3.amazonaws.com/files.d20.io/images/225541231/WiMI6vUUKe2xQWBbMToDIQ/thumb.png?1622362813",
            "https://s3.amazonaws.com/files.d20.io/images/225541228/OXUytEAVzfgAoARpclMFaA/thumb.png?1622362811",
            "https://s3.amazonaws.com/files.d20.io/images/225541230/r5EK_RLoYcYRDCn28paNcQ/thumb.png?1622362810",
            "https://s3.amazonaws.com/files.d20.io/images/225541233/SEkpEuGUaeQb1b1vhgGYfg/thumb.png?1622362813",
            "https://s3.amazonaws.com/files.d20.io/images/225541232/5epqAgWgNox1q_Yqxs7xnQ/thumb.png?1622362813",
            "https://s3.amazonaws.com/files.d20.io/images/225541234/ECVXLUCDnY3P_5z0vVs6_Q/thumb.png?1622362812",
            "https://s3.amazonaws.com/files.d20.io/images/225541235/OC4Pnzi-rPH209AudcFZqQ/thumb.png?1622362812",
            "https://s3.amazonaws.com/files.d20.io/images/225541236/uZ5aQx0ai4nHnNfANtLG2g/thumb.png?1622362813",
            "https://s3.amazonaws.com/files.d20.io/images/225541237/Y9xXCnL6IK1Vc2J5CSG4JQ/thumb.png?1622362811",
            "https://s3.amazonaws.com/files.d20.io/images/225541239/GGMx-7TELpzOc7vBON1GPg/thumb.png?1622362813",
            "https://s3.amazonaws.com/files.d20.io/images/225541247/OeYiiWtJeg2ww39zmriXfg/thumb.png?1622362813",
            "https://s3.amazonaws.com/files.d20.io/images/225541249/26e_Ln_3Ny7ctYW7znsaPA/thumb.png?1622362813",
            "https://s3.amazonaws.com/files.d20.io/images/225541244/nnyC3waAhyPusua2SYf1wA/thumb.png?1622362811"
        ],
        "solarperipheral-33":[
            null,
            "https://s3.amazonaws.com/files.d20.io/images/225541135/bPEaNzur9HbLZwJUrX3tAw/thumb.png?1622362795",
            "https://s3.amazonaws.com/files.d20.io/images/225541134/N2SMrdcnPCnu45jdRcEANg/thumb.png?1622362796",
            "https://s3.amazonaws.com/files.d20.io/images/225541136/jED4rHrwqi57H_wO1XL_SA/thumb.png?1622362795",
            "https://s3.amazonaws.com/files.d20.io/images/225541138/G9TjE-6vf9vTiMMoFBtYkA/thumb.png?1622362795",
            "https://s3.amazonaws.com/files.d20.io/images/225541137/YLrzx48Z1OLjdM0N7_xYgg/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541147/4J2gPN0HET_BPjhK9nI69Q/thumb.png?1622362797",
            "https://s3.amazonaws.com/files.d20.io/images/225541140/P87otTh9vFquq4YFWyfWAQ/thumb.png?1622362796",
            "https://s3.amazonaws.com/files.d20.io/images/225541142/wV2UfD4etNmsKaEDT__gcg/thumb.png?1622362795",
            "https://s3.amazonaws.com/files.d20.io/images/225541139/WutKFaiuIlv3kLd30Q-tSA/thumb.png?1622362795",
            "https://s3.amazonaws.com/files.d20.io/images/225541141/qAyMgnxnZkQyMFdkCu0DZQ/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541148/4xLn49962ndYo6RK70QrwA/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541150/uVztLxmuiejKyN9j5DwyYA/thumb.png?1622362799",
            "https://s3.amazonaws.com/files.d20.io/images/225541149/A7UKKk-N2FjEQ-02095iwg/thumb.png?1622362797",
            "https://s3.amazonaws.com/files.d20.io/images/225541143/pFnG9nLs_IxUA9qLbUteIA/thumb.png?1622362797",
            "https://s3.amazonaws.com/files.d20.io/images/225541158/PAOCYK-bd9esTc_sfDlckA/thumb.png?1622362799",
            "https://s3.amazonaws.com/files.d20.io/images/225541145/e2y7T8cqUHgM4L4hucPEsA/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541144/3a6nGOXEln-1yCx1Hxeqgg/thumb.png?1622362799",
            "https://s3.amazonaws.com/files.d20.io/images/225541154/n7a8A-0zftlUW3IMnHivzA/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541146/WhO2TJts3JnJnCKVOd8EFw/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541156/L676L0u--Q9Rd8X7jI-DIg/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541130/nbjrD9olqm-V0vI3ro7Xrg/thumb.png?1622362796",
            "https://s3.amazonaws.com/files.d20.io/images/225541127/lQeLpVXXlpFj5LmP96-tTw/thumb.png?1622362796",
            "https://s3.amazonaws.com/files.d20.io/images/225541129/FRPp330Bg7WCgxFsaj1HHw/thumb.png?1622362797",
            "https://s3.amazonaws.com/files.d20.io/images/225541126/nqlI6sFdIuBhIKsT04w-Xw/thumb.png?1622362797",
            "https://s3.amazonaws.com/files.d20.io/images/225541128/HE9E9DLxbGa2nLlZxIpVRg/thumb.png?1622362799",
            "https://s3.amazonaws.com/files.d20.io/images/225541132/ZSA5lqMNNsOa8aSIRHhH2g/thumb.png?1622362797",
            "https://s3.amazonaws.com/files.d20.io/images/225541131/Z498elD9Ud9vLTWCtlJCrw/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541133/kJ0xz5DZ8ugdVkN6VDzk0A/thumb.png?1622362797",
            "https://s3.amazonaws.com/files.d20.io/images/225541153/GmhjjV8L5MkeGGI8CiFHzA/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541157/E2r7MwcJrHtAfSHlJinOxA/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541151/Oka2nepXDPf-mWZtWFlnZQ/thumb.png?1622362798",
            "https://s3.amazonaws.com/files.d20.io/images/225541152/QyLXe31T2whTexc8uUs-KQ/thumb.png?1622362799",
            "https://s3.amazonaws.com/files.d20.io/images/225541155/SyhrAteYCV-XH9PgTyJdsA/thumb.png?1622362797"
        ],
        "solarpersonal-13":[
            null,
            "https://s3.amazonaws.com/files.d20.io/images/225540999/_19FoUAnBkwYd5OfTDr3FA/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225541007/TUzTY3724yeO_IHW_82iGQ/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225541005/zPAcutWRsgJ1hFTWdN18UQ/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225540996/0jT3YWfXLxfEeqwFAiy8BQ/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225541000/MN0qaUCzMhfJmfkxBZWm3Q/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225540998/eHrDWc3ALQBzgrr0nWvzzA/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225540995/k2JxwPCujuXHec4pLMZ75w/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225541006/kWcgxzNpWfCxiDQ4ivaZtw/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225541002/kvh_if1gIaZpo7i_QmxgjQ/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225540997/VBQGCZYNLXS6jcPsdUgvxQ/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225541001/GtkfnZtmmVXBu2Whb7x8cw/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225541003/QkNdHQx9UoyQiwFUkwZwxQ/thumb.png?1622362749",
            "https://s3.amazonaws.com/files.d20.io/images/225541004/2SfY5H1fnuchn6JE03svuQ/thumb.png?1622362749"
        ],
        "solarpersonalcommitted-13": [
            null,
            "https://s3.amazonaws.com/files.d20.io/images/225541042/0oBEoB-D3Cll_6EzT7Nppg/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541035/StQVdKJLNeB_5HcuFASW9A/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541046/-oh7HKnKBpa8auP0GU6qrg/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541044/TVDxgpOuJ_45bb1yzfhPjA/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541036/sW6IfC9Rto4VoHtKHslWDQ/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541043/L-fgr5FoXywqyRrnpeEYZg/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541047/b_gj0N0Nzr_QTBBYrjvPlQ/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541037/JY62oTjFZKn56ZTF_j_Q6A/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541045/Dk7ODRkMR0MEO2MH6fvdig/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541038/zIGEWL7sSA2O_AWvycxAvw/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541039/8vhAu2z1-7hnf_h5exM-kg/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541040/QHrzFDOsyNMPWvcUYajHvA/thumb.png?1622362764",
            "https://s3.amazonaws.com/files.d20.io/images/225541041/E-dfvtReS52iXBJBqAUCAA/thumb.png?1622362764"
        ],
        "lunarperipheral-38": [
            null,
            "https://s3.amazonaws.com/files.d20.io/images/227170634/cvPiCMk7AgHcOT5NymQFcg/thumb.png?1623064370",
            "https://s3.amazonaws.com/files.d20.io/images/227170635/v7AUXHT4NRqrKlADJQPO1w/thumb.png?1623064371",
            "https://s3.amazonaws.com/files.d20.io/images/227170636/rc2vj_exoPBOzbymb7rj2w/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170637/iZQWQmpJH7UjZMkPb0sfyw/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170649/jm7wpJBemzytGjLpBOL23A/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170638/emnT2ofPVNGrRjjSoKYTMg/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170639/0OoDZc7D-qDDdGmL1vw1lA/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170641/cZB0ZR0SSGe9-H-FeQHk0w/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170650/wjnrzR9cH7An6SvSbWRAPA/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170642/2x1eUV83uH0vpAPXsdoUWQ/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170652/wafN6sKMCeHm518MbY_cog/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170682/xy80KDQXJ4wjpu6HECWkeA/thumb.png?1623064377",
            "https://s3.amazonaws.com/files.d20.io/images/227170644/4bFXIUSAMlZjmVudzHP78w/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170653/82vswhdt5OAHsM_M-APRdg/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170643/j924HvTgkZQ9_WS7eWrJ0w/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170675/Ni3VHXvV6Udp4extjRrn5w/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170677/YSF_qgZHXhx29P3EcM169Q/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170683/zGEMR8qKFoKs2D_E-lFZSw/thumb.png?1623064376",
            "https://s3.amazonaws.com/files.d20.io/images/227170668/aWjYuFgyv0y2xXACjFSnHQ/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170663/YFJPRMNxtbfW0r0j0MkxdQ/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170679/j6P4Bpnuz8S0GQt7QQBehA/thumb.png?1623064376",
            "https://s3.amazonaws.com/files.d20.io/images/227170671/_Pj6uIvQZoGIe3iyKzHP1w/thumb.png?1623064376",
            "https://s3.amazonaws.com/files.d20.io/images/227170667/17yBcKTuo3PytZbioOE51Q/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170658/1HqijGAM4oQo8W3Ld-ScTA/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170662/3s8_3mEy6HSUBjFqedb4tg/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170647/_Aqs_aNgSpZeXkR0w9I3cQ/thumb.png?1623064371",
            "https://s3.amazonaws.com/files.d20.io/images/227170648/PolArXi-Qlg7hMOfkVQplw/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170685/RlngA71Ni5g1AtqwLsEkoA/thumb.png?1623064376",
            "https://s3.amazonaws.com/files.d20.io/images/227170666/QfOnIu7OSfdSnL-Jp97t9Q/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170676/pHL_wdwlWT4P1yfw-YAehw/thumb.png?1623064377",
            "https://s3.amazonaws.com/files.d20.io/images/227170678/HKh50NrWZvacws2lLIFbug/thumb.png?1623064376",
            "https://s3.amazonaws.com/files.d20.io/images/227170651/myMeoBXYA0osSc__kNhb3g/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170659/92s7JTPeZulTgDcU9hmpcA/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170681/iWKsZbZf-anqxabAuw3PvQ/thumb.png?1623064377",
            "https://s3.amazonaws.com/files.d20.io/images/227170665/0D0CEB8-PlbgN_8Ul493Nw/thumb.png?1623064377",
            "https://s3.amazonaws.com/files.d20.io/images/227170654/WdfWrPQJIYbMF6H6xkR2eQ/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170684/Sy477biKssa4mhp0M_CE6A/thumb.png?1623064376",
            "https://s3.amazonaws.com/files.d20.io/images/227170680/1E32KGb8PhbSRFus4X14CQ/thumb.png?1623064376"
        ],
        "lunarperiphcommitted-38": [
            null,
            "https://s3.amazonaws.com/files.d20.io/images/227170670/ytt23ki3vlqeQFS6H234CA/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170669/qr_QKqNO1josPkGHw4EejA/thumb.png?1623064376",
            "https://s3.amazonaws.com/files.d20.io/images/227170660/qM83mxjk18m0GDGLWblvzA/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170656/7zmEkKQDURJivJel5O9uuA/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170655/N0rM5D0WLrNHlONlL90PbQ/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170661/Y2QhUy52fgxjVSJSUJ_f5Q/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170673/6OFa7JX8HD7avVmG7LXEkQ/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170657/kZGpmN2dllT1Q_yLQYXWmQ/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170614/DMEPINcq7SgBfNJiQFQMWg/thumb.png?1623064370",
            "https://s3.amazonaws.com/files.d20.io/images/227170613/4Y587_Mc7s7dVUsJnS-bnw/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170609/_yjTmKu4xOTYFibL3TUsDw/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170610/rP-oxFDR4PsfMsMO8C1ZDg/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170616/E77Ie0kC0J4AANjh4gZfkg/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170615/hOt47VVddSmsMqNZwhfZOw/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170611/D-rW7fjov8_2XIZm6i_3qw/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170612/A0G0gbkZx83ZYU4CCzKw1w/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170618/k14xiHD-L1pTro8RKbBv1w/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170619/dku7sgetWs5brjpmy_Svxw/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170617/MZc0t-xRhGlEyad5K-SfPg/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170625/n3QWX_WPemPzc9MDiLF_ZQ/thumb.png?1623064377",
            "https://s3.amazonaws.com/files.d20.io/images/227170620/UyC5E1AxkZI1IPTWxGjNlQ/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170626/z80z2ORtVFOGl6KTucf2fw/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170624/TtaM7934SiUuL56X20lkLg/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170621/RX_mFYv1y833nq1keb3lCg/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170622/j4jqOEu01MXaggmCwA86ZA/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170623/kWtA5hXm0VkLq9mNhPP-zA/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170628/zlOsasCi9iukn5fvGDhybw/thumb.png?1623064375",
            "https://s3.amazonaws.com/files.d20.io/images/227170627/IbgHwh_iVm6SCudKsbA-TQ/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170631/ze5mUMwe5MKkkdJ14OyLSA/thumb.png?1623064371",
            "https://s3.amazonaws.com/files.d20.io/images/227170632/er11s_2Us6wakD2T0Bbe5Q/thumb.png?1623064378",
            "https://s3.amazonaws.com/files.d20.io/images/227170664/goFMrBGQGkG1OqYkgOog-g/thumb.png?1623064376",
            "https://s3.amazonaws.com/files.d20.io/images/227170633/wFB0fEaXuMtOGvUxC4ow2w/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170629/GwxC4OvVLV0g7mDFXf9czA/thumb.png?1623064374",
            "https://s3.amazonaws.com/files.d20.io/images/227170674/99njDTxYn4HXyTZFpejLlA/thumb.png?1623064376",
            "https://s3.amazonaws.com/files.d20.io/images/227170640/TdyPTUXPX0zMvmsFuxdzLQ/thumb.png?1623064373",
            "https://s3.amazonaws.com/files.d20.io/images/227170645/PtftUy4kTSXyFE895_abqA/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170646/zODaU-0tEf0zw0zRCzfqMw/thumb.png?1623064372",
            "https://s3.amazonaws.com/files.d20.io/images/227170672/3B4F4cWoI6kes1sjdIFZeg/thumb.png?1623064375"
        ],
        "lunarpersonal-16": [
            null,
            "https://s3.amazonaws.com/files.d20.io/images/227170143/gCe4QZrEZfpJZ2qXzlP9fQ/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170155/XPCb17ds_Md2iCrfgFWiUg/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170146/ilabI3A9a4KEmfl5rmbnWQ/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170142/2bUSNMDnXn5TVSbz8Qa3yg/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170148/MWgv1eEPIhlkw6e3fanC7Q/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170157/2aVGHOvdAJ0buuStNFJ_9Q/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170154/lW4luWVKy1NlmxJ96452_w/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170151/09waGXu66MpTsm3qfnNHHg/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170153/Qdm64eQnd7cCnHM48vGJDg/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170156/88RZX62qacYPOvy3z9yeCA/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170144/RPLa725mGRMkzhtDjFWIdw/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170150/pP2U-UTgzH2SW5VHKdmVfA/thumb.png?1623063941",
            "https://s3.amazonaws.com/files.d20.io/images/227170147/PKRDYFiJAyitDFU9ojXkeA/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170145/x9Ynfe7LA7BjuwJPHYT7WA/thumb.png?1623063941",
            "https://s3.amazonaws.com/files.d20.io/images/227170149/zdzcIp4H8JbFt01xKc64nA/thumb.png?1623063940",
            "https://s3.amazonaws.com/files.d20.io/images/227170152/Pc_gPl3jzV2b0omeLxl4TQ/thumb.png?1623063940"
        ],
        "lunarpersonalcommitted-16": [
            null,
            "https://s3.amazonaws.com/files.d20.io/images/227170105/2siFq9JzA3I_kFhrGw_APQ/thumb.png?1623063924",
            "https://s3.amazonaws.com/files.d20.io/images/227170093/nPgYq-93_kIjHlMkQOGuKw/thumb.png?1623063924",
            "https://s3.amazonaws.com/files.d20.io/images/227170101/gbs7kteGXJ490RrDWgoeog/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170103/75om4cfzXdjiDGvGS-P5tw/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170100/GukABi64TxpBrRoDzCs7jg/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170095/lCDG1HiBwDqkESdiBCVJng/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170091/gaWclPDUU0B7ylCkDu52Pw/thumb.png?1623063924",
            "https://s3.amazonaws.com/files.d20.io/images/227170104/ctHETHygEL0WQYxooWOzNA/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170094/NoYxo6cCCFfpEynj-cMrew/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170092/xoJMPXjwxlBPJaegwjQUCQ/thumb.png?1623063924",
            "https://s3.amazonaws.com/files.d20.io/images/227170099/SAHTC-75CjIg3C7fGFs1Kw/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170097/gUf3NS8UmlumCCo6-EGWyw/thumb.png?1623063924",
            "https://s3.amazonaws.com/files.d20.io/images/227170090/97RvQzK9-jI-BvhnEiwfNA/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170098/8g15edyF0ukiYgb0gOdrnQ/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170096/mtrofqx1WQ9oK4gSgaULVA/thumb.png?1623063925",
            "https://s3.amazonaws.com/files.d20.io/images/227170102/IxrQrizwV7Kc606z4JAPcg/thumb.png?1623063925"
        ],
        "sorcerous-25": [
            null,
            "https://s3.amazonaws.com/files.d20.io/images/225541372/3aIjvk6qZ1aCO95gSbw_Yg/thumb.png?1622362889",
            "https://s3.amazonaws.com/files.d20.io/images/225541366/A5y-d-te_t4oLZUixsRZGA/thumb.png?1622362887",
            "https://s3.amazonaws.com/files.d20.io/images/225541368/BC-mM9RMwKiAZ0nwaSVOFQ/thumb.png?1622362887",
            "https://s3.amazonaws.com/files.d20.io/images/225541367/bYaZx-JcVKYeqw-qwuvpKw/thumb.png?1622362889",
            "https://s3.amazonaws.com/files.d20.io/images/225541365/LWWMyzzfWeoWono9nTyBFg/thumb.png?1622362887",
            "https://s3.amazonaws.com/files.d20.io/images/225541364/YbDDxsxP3aFgT7mG0nLxlQ/thumb.png?1622362889",
            "https://s3.amazonaws.com/files.d20.io/images/225541369/mdxK5-CuR3AohUTOEIKdvA/thumb.png?1622362887",
            "https://s3.amazonaws.com/files.d20.io/images/225541370/mTWzAp1RqHHisjEBKxb2ow/thumb.png?1622362891",
            "https://s3.amazonaws.com/files.d20.io/images/225541375/hgUmo7ROfmem2SaZimNSmw/thumb.png?1622362890",
            "https://s3.amazonaws.com/files.d20.io/images/225541376/0OLBcFhNipIackJTiaEJyA/thumb.png?1622362891",
            "https://s3.amazonaws.com/files.d20.io/images/225541379/fxnlrywCMgufbO4g5XgR1g/thumb.png?1622362889",
            "https://s3.amazonaws.com/files.d20.io/images/225541371/5lvCNhPTP_TS4myEOdNteQ/thumb.png?1622362890",
            "https://s3.amazonaws.com/files.d20.io/images/225541373/P9XwCFNKp22PzJIwoWS6gA/thumb.png?1622362888",
            "https://s3.amazonaws.com/files.d20.io/images/225541380/qL0BH4k6fTqeMVTxdCwYvA/thumb.png?1622362890",
            "https://s3.amazonaws.com/files.d20.io/images/225541381/iD0MgFPQm51_9WepMpjOUg/thumb.png?1622362891",
            "https://s3.amazonaws.com/files.d20.io/images/225541383/GCr0Z5zDfrPY_iBoDPHwVA/thumb.png?1622362890",
            "https://s3.amazonaws.com/files.d20.io/images/225541386/nXJZ7J_u0sZp7_7SuTAxNA/thumb.png?1622362891",
            "https://s3.amazonaws.com/files.d20.io/images/225541378/bGMY8plNeXaBn1Te7eirQg/thumb.png?1622362889",
            "https://s3.amazonaws.com/files.d20.io/images/225541389/s0cc_IdVx8mzDkai4O-pHA/thumb.png?1622362891",
            "https://s3.amazonaws.com/files.d20.io/images/225541382/iJXZPQKusqKJp22XHKEIKQ/thumb.png?1622362889",
            "https://s3.amazonaws.com/files.d20.io/images/225541388/G36-6ZDe9xvZKjXTyQPszQ/thumb.png?1622362890",
            "https://s3.amazonaws.com/files.d20.io/images/225541384/czW6KS-b-O8GrhJyYYuzdw/thumb.png?1622362892",
            "https://s3.amazonaws.com/files.d20.io/images/225541385/mMu4AlT3pe7ODfrYcyWBTw/thumb.png?1622362892",
            "https://s3.amazonaws.com/files.d20.io/images/225541377/Rgga6vCJRcHyDBd1ynpDzQ/thumb.png?1622362892",
            "https://s3.amazonaws.com/files.d20.io/images/225541387/abw11tXYmU5Wk1UWkKnipQ/thumb.png?1622362892"
        ],
        "sorcerousbanked-15": [
            null,
            "https://s3.amazonaws.com/files.d20.io/images/225541430/xZPuEdNI_Bcfdn_B9Eg31w/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541419/D24R_HI8n4EFlOQCZhNsHQ/thumb.png?1622362897",
            "https://s3.amazonaws.com/files.d20.io/images/225541423/kvGja93jpehOz_DYG4z6OA/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541421/W72d8aXktOlcAilGrmtv_w/thumb.png?1622362897",
            "https://s3.amazonaws.com/files.d20.io/images/225541420/Fi3d5qTGgIj6zH7sXChBYQ/thumb.png?1622362897",
            "https://s3.amazonaws.com/files.d20.io/images/225541424/onzTc7UMSVkxN8Mmm7S7WQ/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541422/oKUb6DaZCe3lJPzkd4yKYQ/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541425/3OfpD6Rm74M52ockCZaYXA/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541427/LAgNqxqiqxRrUK-9RJLSfA/thumb.png?1622362899",
            "https://s3.amazonaws.com/files.d20.io/images/225541426/p1HUOk36InbHC2-GNVXkAw/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541432/IAlWH6cg8tcjYx-dy27bbg/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541428/340bRJ3ajwFV7Tm3aEN_vg/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541429/-YDRtS1CGsFuGd-1FxBD_g/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541431/NvXalg5RiCyiinL7CSzBUg/thumb.png?1622362898",
            "https://s3.amazonaws.com/files.d20.io/images/225541433/tQpKIVGuVm0-QGLOGDGqhw/thumb.png?1622362899"
        ],
        "solarwillpower-5": [
            "https://s3.amazonaws.com/files.d20.io/images/225543300/NrYQMFEK3BnybP-hspkPfg/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543302/DK4VvWgll0QPv_DMH6aEug/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543290/Rd2TYCJQh9O1QPCX9hPjZg/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543291/2OXbiy3wma3wg-Tc2mqjqw/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543303/ZF2kieCJNhulaha5ffHWDg/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543295/L8wMKCLpsHL-2Edw8jOk6Q/thumb.png?1622364127"
        ],
        "solarwillpower-6": [
            "https://s3.amazonaws.com/files.d20.io/images/225543298/qG3cEnwCVrVF6mG9MHmbXQ/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543297/1HH4z2KanL_MvKG5t1CXSw/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543308/_TrC_r7xzJAWvQdAPIl-PA/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543292/R_LfAM2UTZjXpl8NdAilIg/thumb.png?1622364126",
            "https://s3.amazonaws.com/files.d20.io/images/225543294/s9Htws9vn0zQzyvISSVpCA/thumb.png?1622364128",
            "https://s3.amazonaws.com/files.d20.io/images/225543301/pVLfMXpoYAvxLfeCt2JtGA/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543305/LVAvm1wZSMTqqStisd-8Dw/thumb.png?1622364128"
        ],
        "solarwillpower-7": [
            "https://s3.amazonaws.com/files.d20.io/images/225543309/9pGADUaBjWwTLfbXWiSTVw/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543296/scbASdyk9b0OLXpR7Y0ksA/thumb.png?1622364126",
            "https://s3.amazonaws.com/files.d20.io/images/225543304/IzZ-7u4Z2AGqNFTjJqtajQ/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543293/F9zSytoYAyk1O8IXlrGJoA/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543299/CiD3tGXsb1iLD2OxclFLyg/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543307/sV512mi1OIPZUwn1McpNVQ/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543306/q5lFtuRtnxcEl1ThHqSKhQ/thumb.png?1622364127",
            "https://s3.amazonaws.com/files.d20.io/images/225543289/Qx7qDm4Uyq9Yp6jeOw-8cA/thumb.png?1622364127"
        ],
        "lunarwillpower-6": [
            "https://s3.amazonaws.com/files.d20.io/images/227063562/y-gjEWMvrDDyPJMMh-z8mA/thumb.png?1623011320",
            "https://s3.amazonaws.com/files.d20.io/images/227063568/YzY-PDiJLR22jvvYDSBdiQ/thumb.png?1623011318",
            "https://s3.amazonaws.com/files.d20.io/images/227063565/_0WGGwWeYzO4rnNs5NkFGA/thumb.png?1623011318",
            "https://s3.amazonaws.com/files.d20.io/images/227063564/1AzKa8N6m4lWR9JAnfz6Yg/thumb.png?1623011318",
            "https://s3.amazonaws.com/files.d20.io/images/227063567/9Y7GZnLnkkcQYCSSHLDkgA/thumb.png?1623011318",
            "https://s3.amazonaws.com/files.d20.io/images/227063566/KUPXRbloVtQrLzTdVJ_NDw/thumb.png?1623011318",
            "https://s3.amazonaws.com/files.d20.io/images/227063563/GrujETfcLIIBYfSiRUHyjw/thumb.png?1623011318"
        ]
    };
    const TRACKERS = {
        sorcerous: {
            attrName: "sorcerous",
            hostName: "ETI_OuterRing2A",
            defaultVal: 0,
            getMin: (charID) => C.TRACKERS.sorcerous.min,
            getMax: (charID) => C.TRACKERS.sorcerous.max,
            getCur: (charID) => parseInt(getAttrByName(charID, TRACKERS.sorcerous.attrName)) || TRACKERS.sorcerous.defaultVal,
            setCur: (charID, val) => setAttrs(charID, {[TRACKERS.sorcerous.attrName]: parseInt(val)}),
            syncHost: (charID) => {
                const val = TRACKERS.sorcerous.getCur(charID);
                toggleHost(charID, TRACKERS.sorcerous.hostName, val > 0);
                if (val > 0) {
                    const imgClass = MAS.TER.PCs[charID].hosts[TRACKERS.sorcerous.hostName];
                    if (imgClass === "blank") {
                        toggleHost(charID, TRACKERS.sorcerous.hostName, false);
                    } else if (imgClass in IMAGES) {
                        const imgSrc = IMAGES[imgClass][val];
                        setHostImgSrc(charID, TRACKERS.sorcerous.hostName, imgSrc);
                    }
                }
            }
        },
        sorcerousbanked: {
            attrName: "sorcerousbanked",
            hostName: "ETI_OuterRing2B",
            defaultVal: 0,
            getMin: (charID) => C.TRACKERS.sorcerousbanked.min,
            getMax: (charID) => C.TRACKERS.sorcerousbanked.max,
            getCur: (charID) => parseInt(getAttrByName(charID, TRACKERS.sorcerousbanked.attrName)) || TRACKERS.sorcerousbanked.defaultVal,
            setCur: (charID, val) => setAttrs(charID, {[TRACKERS.sorcerousbanked.attrName]: parseInt(val)}),
            syncHost: (charID) => {
                const val = TRACKERS.sorcerousbanked.getCur(charID);
                toggleHost(charID, TRACKERS.sorcerousbanked.hostName, val > 0);
                if (val > 0) {
                    const imgClass = MAS.TER.PCs[charID].hosts[TRACKERS.sorcerousbanked.hostName];
                    if (imgClass === "blank") {
                        toggleHost(charID, TRACKERS.sorcerousbanked.hostName, false);
                    } else if (imgClass in IMAGES) {
                        const imgSrc = IMAGES[imgClass][val];
                        setHostImgSrc(charID, TRACKERS.sorcerousbanked.hostName, imgSrc);
                    }
                }
            }
        },
        anima: {
            attrName: "animalevel",
            defaultVal: 0,
            getMin: (charID) => C.TRACKERS.anima.min,
            getMax: (charID) => C.TRACKERS.anima.max,
            getCur: (charID) => parseInt(getAttrByName(charID, TRACKERS.anima.attrName)) || TRACKERS.anima.defaultVal,
            setCur: (charID, val) => setAttrs(charID, {[TRACKERS.anima.attrName]: parseInt(val)}),
            syncHost: (charID) => {
                const val = TRACKERS.anima.getCur(charID);
                const animData = IMAGES[MAS.TER.PCs[charID].animaClass][val];
                for (const [hostName, hostVal] of Object.entries(animData)) {
                    if (hostName.startsWith("ETA_")) {
                        toggleHost(charID, hostName, hostVal);
                    } else {
                        setHostImgSrc(charID, hostName, hostVal);
                    }
                }
            }
        },
        peripheral: {
            attrName: "peripheral-essence",
            hostName: "ETI_OuterRing1A",
            defaultVal: 0,
            getMin: (charID) => C.TRACKERS.peripheral.min,
            getMax: (charID) => getEssenceMax(charID, "peripheral"),
            getCur: (charID) => parseInt(getAttrByName(charID, TRACKERS.peripheral.attrName)) || TRACKERS.peripheral.defaultVal,
            setCur: (charID, val) => setAttrs(charID, {[TRACKERS.peripheral.attrName]: parseInt(val)}),
            syncHost: (charID) => {
                const val = TRACKERS.peripheral.getCur(charID);
                toggleHost(charID, TRACKERS.peripheral.hostName, val > 0);
                if (val > 0) {
                    const imgClass = MAS.TER.PCs[charID].hosts[TRACKERS.peripheral.hostName];
                    if (imgClass === "blank") {
                        toggleHost(charID, TRACKERS.peripheral.hostName, false);
                    } else if (imgClass in IMAGES) {
                        const imgSrc = IMAGES[imgClass][val];
                        setHostImgSrc(charID, TRACKERS.peripheral.hostName, imgSrc);
                    }
                } else {
                    toggleHost(charID);
                }
            }
        },
        periphcommitted: {
            attrName: "committedesstotal",
            hostName: "ETI_OuterRing1B",
            defaultVal: 0,
            getMin: (charID) => C.TRACKERS.peripheral.min,
            getMax: (charID) => getEssenceMax(charID, "peripheral"),
            getCur: (charID) => parseInt(getAttrByName(charID, TRACKERS.periphcommitted.attrName)) || TRACKERS.periphcommitted.defaultVal,
            setCur: (charID, val) => setAttrs(charID, {[TRACKERS.periphcommitted.attrName]: parseInt(val)}),
            syncHost: (charID) => {
                const val = TRACKERS.periphcommitted.getCur(charID);
                toggleHost(charID, TRACKERS.periphcommitted.hostName, val > 0);
                if (val > 0) {
                    const imgClass = MAS.TER.PCs[charID].hosts[TRACKERS.periphcommitted.hostName];
                    if (imgClass === "blank") {
                        toggleHost(charID, TRACKERS.periphcommitted.hostName, false);
                    } else if (imgClass in IMAGES) {
                        const imgSrc = IMAGES[imgClass][val];
                        setHostImgSrc(charID, TRACKERS.periphcommitted.hostName, imgSrc);
                    }
                }
            }
        },
        personal: {
            attrName: "personal-essence",
            getHostName: (charID) => `ETI_InnerRing1A_${{solar: "Solar", lunar: "Lunar"}[C.GetExaltType(charID)]}`,
            defaultVal: 0,
            getMin: (charID) => C.TRACKERS.personal.min,
            getMax: (charID) => getEssenceMax(charID, "personal"),
            getCur: (charID) => parseInt(getAttrByName(charID, TRACKERS.personal.attrName)) || TRACKERS.personal.defaultVal,
            setCur: (charID, val) => setAttrs(charID, {[TRACKERS.personal.attrName]: parseInt(val)}),
            syncHost: (charID) => {
                const val = TRACKERS.personal.getCur(charID);
                toggleHost(charID, TRACKERS.personal.getHostName(charID), val > 0);
                if (val > 0) {
                    const imgClass = MAS.TER.PCs[charID].hosts[TRACKERS.personal.getHostName(charID)];
                    if (imgClass === "blank") {
                        toggleHost(charID, TRACKERS.personal.getHostName(charID), false);
                    } else if (imgClass in IMAGES) {
                        const imgSrc = IMAGES[imgClass][val];
                        setHostImgSrc(charID, TRACKERS.personal.getHostName(charID), imgSrc);
                    }
                }
            }
        },
        personalcommitted: {
            getHostName: (charID) => `ETI_InnerRing1B_${{solar: "Solar", lunar: "Lunar"}[C.GetExaltType(charID)]}`,
            defaultVal: 0,
            getMin: (charID) => C.TRACKERS.personal.min,
            getMax: (charID) => getEssenceMax(charID, "personal"),
            getCur: (charID) => TRACKERS.personalcommitted.defaultVal,
            setCur: (charID, val) => null,
            syncHost: (charID) => {
                const val = TRACKERS.personalcommitted.getCur(charID);
                toggleHost(charID, TRACKERS.personalcommitted.getHostName(charID), val > 0);
                if (val > 0) {
                    const imgClass = MAS.TER.PCs[charID].hosts[TRACKERS.personalcommitted.getHostName(charID)];
                    if (imgClass === "blank") {
                        toggleHost(charID, TRACKERS.personalcommitted.getHostName(charID), false);
                    } else if (imgClass in IMAGES) {
                        const imgSrc = IMAGES[imgClass][val];
                        setHostImgSrc(charID, TRACKERS.personalcommitted.getHostName(charID), imgSrc);
                    }
                }
            }
        },
        willpower: {
            hostName: "ETI_Willpower",
            attrName: "willpower",
            defaultVal: 0,
            getMin: (charID) => C.TRACKERS.willpower.min,
            getMax: (charID) => getAttrByName(charID, TRACKERS.willpower.attrName),
            getCur: (charID) => TRACKERS.willpower.getMax(charID) - findObjs({
                _type: "attribute",
                _characterid: charID
            }).filter((obj) => obj.get("name").startsWith("willpower-spent") && parseInt(obj.get("current")) === 1).length,
            setCur: (charID, val) => {
                const amountSpent = TRACKERS.willpower.getMax(charID) - val;
                const deltaAttrs = {};
                for (let i = 1; i <= TRACKERS.willpower.getMax(charID); i++) {
                    deltaAttrs[`willpower-spent${i}`] = i <= amountSpent ? 1 : 0;
                }
                setAttrs(charID, deltaAttrs);
            },
            syncHost: (charID) => {
                const val = TRACKERS.willpower.getCur(charID);
                const imgClass = MAS.TER.PCs[charID].hosts[TRACKERS.willpower.hostName];
                if (imgClass === "blank") {
                    toggleHost(charID, TRACKERS.willpower.hostName, false);
                } else if (imgClass in IMAGES) {
                    const imgSrc = IMAGES[imgClass][val];
                    setHostImgSrc(charID, TRACKERS.willpower.hostName, imgSrc);
                }
            }
        },
        health: { // Actually measures DAMAGE
            hostName: "ETI_Health",
            defaultVal: 0,
            getCur: (charID) => findObjs({
                _type: "attribute",
                _characterid: charID
            }).filter((obj) => obj.get("name").startsWith("hl") && ["bashing", "lethal", "aggravated"].includes(obj.get("current"))).length,
            syncHost: (charID) => {
                const val = TRACKERS.health.getCur(charID);
                const imgClass = MAS.TER.PCs[charID].hosts[TRACKERS.health.hostName];
                if (imgClass === "blank") {
                    toggleHost(charID, TRACKERS.health.hostName, false);
                } else if (imgClass in IMAGES) {
                    const imgSrc = IMAGES[imgClass][val];
                    setHostImgSrc(charID, TRACKERS.health.hostName, imgSrc);
                }
            }
        }
    };
    const TRACKEDATTRIBUTES = (() => {
        const trackedAttrs = {
            sorcerous: "sorcerous",
            sorcerousbanked: "sorcerousbanked",
            animalevel: "anima",
            "peripheral-essence": "peripheral",
            committedesstotal: "periphcommitted",
            "personal-essence": "personal",
            willpower: "willpower"
        };
        _.range(1, 10, 1).forEach((i) => trackedAttrs[`willpower-spent${i}`] = "willpower");
        _.range(1, 32, 1).forEach((i) => trackedAttrs[`hl${i}-damage`] = "health");
        return trackedAttrs;
    })();
    const CUSTOMROUNDMARKER = "➖➖➖➖➖➖➖";
    // #endregion

    // #region UTILITY
    const getImgPos = (imgRef) => {
        if (imgRef) {
            const imgObj = getObj("graphic", imgRef._id);
            C.Show({
                id: imgObj.id,
                name: imgObj.get("name"),
                height: imgObj.get("height"),
                width: imgObj.get("width"),
                top: imgObj.get("top"),
                left: imgObj.get("left"),
                src: imgObj.get("imgsrc")
            });
        }
    };
    const setImgPos = (imgObjs, top, left, height, width) => {
        [imgObjs].flat().forEach((imgObj) => {
            imgObj = getObj("graphic", imgObj._id);
            imgObj.set({
                top: parseInt(top) || parseInt(imgObj.get("top")),
                left: parseInt(left) || parseInt(imgObj.get("top")),
                height: parseInt(height) || parseInt(imgObj.get("height")),
                width: parseInt(width) || parseInt(imgObj.get("width"))
            });
            getImgPos({_id: imgObj.id});
        });
    };
    const setImgName = (imgRefs, imgName) => {
        [imgRefs].flat().forEach((imgRef) => {
            const imgObj = getObj("graphic", imgRef._id);
            imgObj.set({name: imgName});
            getImgPos({_id: imgObj.id});
        });
    };
    const getEssenceMax = (charRef, essenceType) => {
        const charObj = C.GetChar(charRef);
        if (charObj) {
            const exaltType = C.GetExaltType(charObj.id);
            const committedEssence = parseInt(getAttrByName(charObj.id, "committedesstotal")) || 0;
            if (!["solar", "lunar"].includes(exaltType)) {
                return 0;
            }
            const essence = parseInt(getAttrByName(charObj.id, "essence")) || 0;
            return {
                solar: {
                    personal: (essence * 3) + 10,
                    peripheral: Math.max(0, (essence * 7) + 26 - committedEssence)
                },
                lunar: {
                    personal: essence + 15,
                    peripheral: Math.max(0, (essence * 4) + 34 - committedEssence)
                }
            }[exaltType][essenceType];
        }
        return 0;
    };
    const getHealthHost = (charID) => {
        const charObj = getObj("character", charID);
        const healthPenalties = [];
        for (let i = 1; i <= C.SHEETDATA.numHealthBoxes; i++) {
            const thisPenalty = getAttrByName(charID, `hl${i}-penalty`);
            if (thisPenalty) {
                healthPenalties.push(getAttrByName(charID, `hl${i}-penalty`));
            } else {
                break;
            }
        }
        return `${C.GetExaltType(charID)}health-${Object.values(_.countBy(healthPenalties, (penalty) => penalty)).join("")}`;
    };
    const getWillpowerHost = (charID) => `${C.GetExaltType(charID)}willpower-${getAttrByName(charID, "willpower")}`;
    // #endregion
    // #endregion

    // #region *** *** SETUP *** ***
    const getAllImages = () => _.unique(Object.entries(IMAGES).map(([key, val]) => {
        if ([true, false, null, undefined].includes(val)) {
            return [];
        }
        if (Array.isArray(val)) {
            return val.filter((v) => Boolean(v)).map((v) => typeof v === "object" ? Object.entries(v) : v);
        }
        if (typeof val === "object") {
            return Object.entries(val);
        }
        return val;
    }).flat(4).filter((v) => typeof v === "string" && v.startsWith("http")));
    const preloadImages = () => {
        DiceRoller.PreloadImages();
        const imgData = {
            _pageid: Campaign().get("playerpageid"),
            height: 300,
            width: 300,
            name: "Preloader",
            layer: "objects",
            isdrawing: true,
            controlledby: "",
            showname: false
        };
        const pad = 50;
        imgData.left = imgData.width / 2;
        imgData.top = imgData.height / 2;
        getAllImages().forEach((imgsrc) => {
            imgData.imgsrc = imgsrc;
            imgData.left += pad;
            if ((imgData.left + imgData.width / 2) > C.SANDBOX.width) {
                imgData.left = imgData.width / 2;
                imgData.height += pad;
            }
            createObj("graphic", imgData);
        });
        findObjs({_type: "graphic", name: "ETA_Preloader"}).forEach((obj) => obj.set({layer: "objects"}));
        findObjs({_type: "graphic", name: "ETA_Preloader"}).forEach((obj) => toFront(obj));
    };
    const clearImagePreloads = () => {
        findObjs({_type: "graphic", name: "Preloader"}).forEach((obj) => obj.remove());
        findObjs({_type: "graphic", name: "ETA_Preloader"}).forEach((obj) => obj.set({layer: "walls"}));
    };
    const setupTrackers = () => {
        const curDebugState = C.STA.TE.isShowingDebugMessages;
        C.STA.TE.isShowingDebugMessages = true;
        // 1) Setup Characters
        for (const [charID, charData] of Object.entries(MAS.TER.PCs)) {
            if (C.IsR20ID(charID)) {
                const charObj = C.GetChar(charID);
                if (charObj) {
                    MAS.TER.PCs[charID] = C.Merge(
                        C.Merge(
                            charData,
                            TRACKERCONFIG[charData.type][charData.caste]
                        ),
                        PLAYERCONFIG[charID]
                    );
                    MAS.TER.PCs[charID].hosts.ETI_Health = getHealthHost(charID);
                    MAS.TER.PCs[charID].hosts.ETI_Willpower = getWillpowerHost(charID);
                }
            }
        }

        // 2) Remove any existing trackers.
        findObjs({_type: "graphic"}).filter((obj) => (obj.get("name") || "").startsWith("ETI_")).forEach((obj) => obj.remove());
        findObjs({_type: "text"}).filter((obj) => (obj.get("name") || "").startsWith("ETT_")).forEach((obj) => obj.remove());

        // 3) From number of player chars, determine max width of each tracker:
        const maxTrackerWidth = Math.floor(C.SANDBOX.width / Object.keys(MAS.TER.PCs).length);
        // assume square layout
        const maxTrackerHeight = maxTrackerWidth;

        // 4) Determine positions and dimensions of each tracker's layout bounds:
        for (const [charID, charData] of Object.entries(MAS.TER.PCs)) {
            MAS.TER.PCs[charID].layout = {
                top: parseInt(C.SANDBOX.height - 0.5 * maxTrackerHeight),
                left: 0.5 * maxTrackerWidth + charData.index * maxTrackerWidth,
                height: maxTrackerHeight,
                width: maxTrackerWidth
            };
        }

        // 5) For each host, create it if it's an image, or set its position & dimensions if it's an animation:
        Object.keys(HOSTS)
            .filter((hostName) => hostName.startsWith("ETI_") || hostName.startsWith("ETA_"))
            .forEach((hostName) => {
                for (const [charID, charData] of Object.entries(MAS.TER.PCs)) {
                    const layout = charData.layout;
                    if (hostName.startsWith("ETI_")) {
                        if (hostName.endsWith("_Lunar") && C.GetExaltType(charID) !== "lunar"
                         || hostName.endsWith("_Solar") && C.GetExaltType(charID) !== "solar") {
                            continue;
                        }
                        const imgSrc = charData.hosts[hostName];
                        const params = {
                            name: hostName,
                            _pageid: Campaign().get("playerpageid"),
                            height: parseInt(layout.height * HOSTS[hostName].height),
                            width: parseInt(layout.width * HOSTS[hostName].width),
                            top: parseInt(layout.top + layout.height * HOSTS[hostName].topShift),
                            left: parseInt(layout.left + layout.width * HOSTS[hostName].leftShift),
                            imgsrc: (typeof imgSrc === "string" && imgSrc.startsWith("http")) ? imgSrc : IMAGES.blank,
                            layer: "map",
                            isdrawing: true,
                            controlledby: "",
                            showname: false
                        };
                        createObj("graphic", params);
                    } else if (hostName.startsWith("ETA_")) {
                        getHost(hostName, charID).set({
                            height: parseInt(layout.height * HOSTS[hostName].height),
                            width: parseInt(layout.width * HOSTS[hostName].width),
                            top: parseInt(layout.top + layout.height * HOSTS[hostName].topShift),
                            left: parseInt(layout.left + layout.width * HOSTS[hostName].leftShift)
                        });
                    }
                }
            });

        // 6) Sync host data to characters:
        for (const [charID, charData] of Object.entries(MAS.TER.PCs)) {
            for (const tracker of Object.keys(TRACKERS)) {
                TRACKERS[tracker].syncHost(charID);
            }
        }

        // 7) Fix z-indices
        setZIndices();

        // 8) Report success, show REGISTRY for confirmation, and set isSetup to true
        C.Show(MAS.TER.PCs, "C.MAS.TER REGISTRY");
        C.Flag("Essence Trackers Initialized!");
        STA.TE.isSetup = true;
        C.STA.TE.isShowingDebugMessages = curDebugState;
    };
    const setZIndices = () => {
        Object.keys(HOSTS)
            .forEach((hostName) => {
                if (hostName.startsWith("ETI") || hostName.startsWith("ETA")) {
                    findObjs({
                        _type: "graphic",
                        name: hostName
                    }).forEach((obj) => toFront(obj));
                } else if (hostName.startsWith("ETT")) {
                    findObjs({
                        _type: "text",
                        name: hostName
                    }).forEach((obj) => toFront(obj));
                }
            });
    };
    // #endregion

    // #region *** *** TRACKER CONTROL *** ***
    const getHost = (hostName, idOrIndex) => {
        const nameSearch = hostName.replace(/(_Lunar|_Solar)$/u, "");
        const hostImages = findObjs({_type: hostName.startsWith("ETT_") ? "text" : "graphic"})
            .filter((hostObj) => hostObj.get("name").startsWith(nameSearch))
            .sort((objA, objB) => objA.get("left") - objB.get("left"));
        if (idOrIndex in MAS.TER.PCs) {
            idOrIndex = MAS.TER.PCs[idOrIndex].index;
        }
        if (Number.isInteger(idOrIndex) && idOrIndex >= 0 && idOrIndex < hostImages.length) {
            return hostImages[idOrIndex];
        }
        return false;
    };
    const toggleHost = (charID, hostName, isActive) => {
        if ([true, false].includes(isActive)) {
            const host = getHost(hostName, charID);
            if (host) {
                if (host.get("layer") === "map" && !isActive) {
                    host.set({layer: "walls"});
                } else if (host.get("layer") === "walls" && isActive) {
                    host.set({layer: "map"});
                }
            }
        }
    };
    const setHostImgSrc = (charID, hostName, imgsrc) => {
        const hostImg = getHost(hostName, charID);
        if (hostImg && typeof imgsrc === "string") {
            hostImg.set({imgsrc});
        }
    };
    const setTrackerAttr = (charID, tracker, val, subVal) => {
        if (tracker in TRACKERS && "setCur" in TRACKERS[tracker]) {
            if (/^\+|-/g.test(`${val}`)) {
                val = TRACKERS[tracker].getCur(charID) + parseInt(val);
            } else {
                val = parseInt(val);
            }
            if ("getMin" in TRACKERS[tracker]) {
                val = Math.max(val, TRACKERS[tracker].getMin(charID));
            }
            if ("getMax" in TRACKERS[tracker]) {
                val = Math.min(val, TRACKERS[tracker].getMax(charID));
            }
            TRACKERS[tracker].setCur(charID, val);
            TRACKERS[tracker].syncHost(charID);
        }
    };
    // #endregion

    return {
        Initialize,
        Reset: setupTrackers
    };

})();

on("ready", () => EssenceTracker.Initialize(true));
void MarkStop("EssenceTracker");