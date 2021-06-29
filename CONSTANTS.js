void MarkStart("C");
const NAMESPACE = "Euno";

state = state || {};
state[NAMESPACE] = state[NAMESPACE] || {};
state[NAMESPACE].MASTER = state[NAMESPACE].MASTER || {};
state[NAMESPACE].C = state[NAMESPACE].C || {isShowingDebugMessages: true};

const curDebugState = state[NAMESPACE].C.isShowingDebugMessages;
state[NAMESPACE].C.isShowingDebugMessages = true;

const C = (() => {
    // #region *** *** FRONT *** ***
    const SCRIPTNAME = "C";
    state[NAMESPACE][SCRIPTNAME] = state[NAMESPACE][SCRIPTNAME] || {};

    const STA = {get TE() { return state[NAMESPACE][SCRIPTNAME] }};
    const MAS = {get TER() { return C.RO.OT.MASTER }};

    const DEFAULTSTATE = {isShowingDebugMessages: true}; // Initial values for state storage.

    // #region INITIALIZATION & EVENT HANDLERS
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => { // Initialize State, Trackers, Event Listeners
        if (isResettingState) { C.RO.OT[SCRIPTNAME] = {} }

        // Initialize state storage with DEFAULTSTATE where needed.
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        Object.entries(DEFAULTSTATE).filter(([key]) => !(key in STA.TE)).forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

        // Register event handlers for chat commands and character sheet attribute changes.
        if (isRegisteringEventListeners) {
            // Event listeners go here.
        }
        C.Flag(`... ${SCRIPTNAME}ONSTANTS.js Ready!`, {force: true, direct: true});
        log(`${SCRIPTNAME}ONSTANTS.js Ready!`);
    };
    // #endregion

    // #region *** *** CONSTANTS *** ***

    // #region Basic References
    const TEXTCHARS = "0123456789LMNQSOPRUWXTVZY-=●(+ABCFHDEGJIKalmnqsopruwxtvzyfhdegjikbc )?![]:;,.○~♠◌‡⅓°♦\"'`Ծ►/&—ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯ█_@";
    const NUMBERWORDS = {
        low: [
            "Zero",
            "One",
            "Two",
            "Three",
            "Four",
            "Five",
            "Six",
            "Seven",
            "Eight",
            "Nine",
            "Ten",
            "Eleven",
            "Twelve",
            "Thirteen",
            "Fourteen",
            "Fifteen",
            "Sixteen",
            "Seventeen",
            "Eighteen",
            "Nineteen",
            "Twenty"
        ],
        tens: ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
        tiers: [
            "",
            "Thousand",
            "Million",
            "Billion",
            "Trillion",
            "Quadrillion",
            "Quintillion",
            "Sextillion",
            "Septillion",
            "Octillion",
            "Nonillion",
            "Decillion",
            "Undecillion",
            "Duodecillion",
            "Tredecillion",
            "Quattuordecillion",
            "Quindecillion",
            "Sexdecillion",
            "Septendecillion",
            "Octodecillion",
            "Novemdecillion",
            "Vigintillion",
            "Unvigintillion",
            "Duovigintillion",
            "Trevigintillion",
            "Quattuorvigintillion",
            "Quinvigintillion",
            "Sexvigintillion",
            "Septenvigintillion",
            "Octovigintillion",
            "Novemvigintillion",
            "Trigintillion",
            "Untrigintillion",
            "Duotrigintillion",
            "Tretrigintillion",
            "Quattuortrigintillion"
        ]
    };
    const ORDINALSUFFIX = {
        zero: "zeroeth",
        one: "first",
        two: "second",
        three: "third",
        four: "fourth",
        five: "fifth",
        eight: "eighth",
        nine: "ninth",
        twelve: "twelfth",
        twenty: "twentieth",
        thirty: "thirtieth",
        forty: "fortieth",
        fifty: "fiftieth",
        sixty: "sixtieth",
        seventy: "seventieth",
        eighty: "eightieth",
        ninety: "ninetieth"
    };
    const COLORS = {
        white: "rgba(255, 255, 255, 1)",
        brightbrightgrey: "rgba(200, 200, 200, 1)",
        brightgrey: "rgba(175, 175, 175, 1)",
        grey: "rgba(130, 130, 130, 1)",
        midgrey: "rgba(100, 100, 100, 1)",
        darkgrey: "rgba(80, 80, 80, 1)",
        darkdarkgrey: "rgba(40, 40, 40, 1)",
        black: "rgba(0, 0, 0, 1)",

        halfwhite: "rgba(255,255,255,0.5)",
        fadedblack: "rgba(0, 0, 0, 0.2)",
        fadedgrey: "rgba(0, 0, 0, 0.1)",
        transparent: "rgba(0,0,0,0)",

        purered: "rgba(255, 0, 0, 1)",
        palered: "rgba(255, 175, 175, 1)",
        palepalered: "rgba(255, 200, 200, 1)",
        brightred: "rgba(255, 31, 34, 1)",
        lightred: "rgba(255, 60, 60, 1)",
        red: "rgba(209,0,3,1)",
        darkred: "rgba(132, 0, 2,1)",
        darkdarkred: "rgba(55, 0, 1, 1)",
        brightcrimson: "rgba(234, 9, 67, 1)",
        crimson: "rgba(160, 6, 46, 1)",
        darkcrimson: "rgba(86, 3, 25, 1)",

        fadedred: "rgba(255, 0, 0, 0.2)",

        // palegold: "rgba( 255 , 220 , 180 , 1 )",
        palegold: "#ffe775",
        brightgold: "rgba(255,223,0,1)",
        gold: "rgba(255,190,0,1)",
        midgold: "rgba(255,165,0,1)",
        darkgold: "rgba(167,97,0,1)",

        orange: "rgba(255,140,0,1)",
        orangered: "rgba(255,69,0,1)",
        lightorange: "rgba(255,165,0,1)",
        paleorange: "rgba(255, 202, 138,1)",

        yellow: "rgba(255,255,0,1)",
        khaki: "rgba(240,230,140,1)",
        tan: "rgba(255,216,164,1)",

        puregreen: "rgba(0, 255, 0, 1)",
        palegreen: "rgba(175, 255, 175, 1)",
        palepalegreen: "rgba(200, 255, 200, 1)",
        brightgreen: "rgba(35, 255, 35, 1)",
        green: "rgba(0, 200, 0, 1)",
        darkgreen: "rgba(0, 125, 0, 1)",

        palecyan: "rgba(161, 255, 255, 1)",
        cyan: "rgba(0, 255, 255, 1)",
        darkcyan: "rgba(0,150,150,1)",

        pureblue: "rgba(0,0,255,1)",
        paleblue: "rgba(175, 175, 255, 1)",
        palepaleblue: "rgba(200, 200, 255, 1)",
        brightblue: "rgba(150, 150, 255, 1)",
        blue: "rgba(100, 100, 255, 1)",
        darkblue: "rgba(50, 50, 150, 1)",

        magenta: "rgba(255,20,147,1)",
        palemagenta: "rgba(255,105,180,1)",
        palepalemagenta: "rgba(255,192,203,1)",
        darkmagenta: "rgba(199,21,133,1)",

        palepurple: "rgba(255, 175, 255, 1)",
        brightpurple: "rgba(200, 100, 200, 1)",
        purple: "rgba(150, 0, 150, 1)",
        darkpurple: "rgba(100, 0, 100, 1)"
    };
    // #endregion

    // #region Sandbox Specifications
    const UNITSIZE = 10;
    const CHATWIDTH = 281; // The minimum width of the chat panel, in pixels. Be sure to subtract twice any border widths.

    const UPSHIFT = -26;   // Constants governing how the chat box is positioned in the chat panel: By default, everything
    const LEFTSHIFT = -45; // shifts up and to the left to cover the standard chat output with the custom styles below.
    const BOTTOMSHIFT = -7;
    const SANDBOX = {
        get height() { return parseInt(getObj("page", Campaign().get("playerpageid")).get("height")) * 70 },
        get width() { return parseInt(getObj("page", Campaign().get("playerpageid")).get("width")) * 70 },
        get top() { return this.height / 2 },
        get left() { return this.width / 2 }
    };
    // #endregion

    // #region Exalted System Specifications
    const TRACKERS = {
        sorcerous: {
            min: 0,
            max: 25
        },
        sorcerousbanked: {
            min: 0,
            max: 15
        },
        anima: {
            min: 0,
            max: 3
        },
        peripheral: {min: 0},
        personal: {min: 0}
    };

    // #endregion

    // #region Character Sheet Specifications
    const DEFAULTATTRS = {
        "hl1-penalty": 0,
        "hl2-penalty": -1,
        "hl3-penalty": -1,
        "hl4-penalty": -2,
        "hl5-penalty": -2,
        "hl6-penalty": -4,
        "hl7-penalty": "I",
        "animalevel": 0,
        "sorcerous": 0,
        "sorcerousbanked": 0,
        "initiative": 0
    };
    const ATTRREF = {
        STR: "strength",
        DEX: "dexterity",
        STA: "stamina",
        CHA: "charisma",
        MAN: "manipulation",
        APP: "appearance",
        PER: "perception",
        INT: "intelligence",
        WIT: "wits",
        arc: "archery",
        ath: "athletics",
        awa: "awareness",
        bra: "brawl",
        bur: "bureaucracy",
        dod: "dodge",
        int: "integrity",
        inv: "investigation",
        lar: "larceny",
        lin: "linguistics",
        lor: "lore",
        med: "medicine",
        mel: "melee",
        occ: "occult",
        per: "performance",
        pre: "presence",
        res: "resistance",
        rid: "ride",
        sai: "sail",
        soc: "socialize",
        ste: "stealth",
        sur: "survival",
        thr: "thrown",
        war: "war"
    };
    const SUBATTRREF = {
        ma: {
            bc: "ma-claw",
            bla: "ma-claw",
            cla: "ma-claw",
            cs: "ma-crane",
            cra: "ma-crane",
            rd: "ma-devil",
            rig: "ma-devil",
            es: "ma-ebon",
            ebo: "ma-ebon",
            sha: "ma-ebon",
            sv: "ma-nightingale",
            sil: "ma-nightingale",
            nig: "ma-nightingale",
            dp: "ma-pearl",
            dre: "ma-pearl",
            pea: "ma-pearl",
            cou: "ma-pearl",
            wr: "ma-reaper",
            rea: "ma-reaper",
            whi: "ma-reaper",
            ss: "ma-snake",
            sna: "ma-snake",
            sd: "ma-steel",
            ste: "ma-steel",
            ts: "ma-tiger",
            tig: "ma-tiger",
            sp: "ma-void",
            sin: "ma-void",
            voi: "ma-void"
        },
        cr: {
            arm: "cr-armoring",
            af: "cr-armoring",
            art: "cr-artifact",
            coo: "cr-cooking",
            fir: "cr-artifice",
            fa: "cr-artifice",
            faa: "cr-artifice",
            gem: "cr-gemcutting",
            geo: "cr-geomancy",
            jew: "cr-jewelry",
            tai: "cr-tailoring",
            wea: "cr-forging",
            wf: "cr-forging"
        }
    };
    const ATTRNAMEREF = {
        "strength": "Strength",
        "dexterity": "Dexterity",
        "stamina": "Stamina",
        "charisma": "Charisma",
        "manipulation": "Manipulation",
        "appearance": "Appearance",
        "perception": "Perception",
        "intelligence": "Intelligence",
        "wits": "Wits",
        "archery": "Archery",
        "athletics": "Athletics",
        "awareness": "Awareness",
        "brawl": "Brawl",
        "bureaucracy": "Bureaucracy",
        "cr-armoring": "Craft (Armoring)",
        "cr-artifact": "Craft (Artifact)",
        "cr-artifice": "Craft (First Age Artifice)",
        "cr-cooking": "Craft (Cooking)",
        "cr-forging": "Craft (Weapon-Forging)",
        "cr-gemcutting": "Craft (Gemcutting)",
        "cr-geomancy": "Craft (Geomancy)",
        "cr-jewelry": "Craft (Jewelry)",
        "cr-tailoring": "Craft (Tailoring)",
        "dodge": "Dodge",
        "integrity": "Integrity",
        "investigation": "Investigation",
        "larceny": "Larceny",
        "linguistics": "Linguistics",
        "lore": "Lore",
        "ma-claw": "MA (Black Claw)",
        "ma-crane": "MA (Crane)",
        "ma-devil": "MA (Righteous Devil)",
        "ma-ebon": "MA (Ebon Shadow)",
        "ma-nightingale": "MA (Nightingale)",
        "ma-pearl": "MA (Dreaming Pearl)",
        "ma-reaper": "MA (White Reaper)",
        "ma-snake": "MA (Snake)",
        "ma-steel": "MA (Steel Devil)",
        "ma-tiger": "MA (Tiger)",
        "ma-void": "MA (Void)",
        "medicine": "Medicine",
        "melee": "Melee",
        "occult": "Occult",
        "performance": "Performance",
        "presence": "Presence",
        "resistance": "Resistance",
        "ride": "Ride",
        "sail": "Sail",
        "socialize": "Socialize",
        "stealth": "Stealth",
        "survival": "Survival",
        "thrown": "Thrown",
        "war": "War",
        "moterecharge": "Mote Recharge per Hour",
        "animalevel": "Anima",
        "moterechargepartialtime": "Partial Mote Recharge Time"
    };
    const SHEETDATA = {
        numHealthBoxes: 32
    };
    // #endregion

    // #region HTML Style Data
    const IMGROOT = {
        general: "https://raw.githubusercontent.com/Eunomiac/-EunosTextControls/ClassRefactor/images/",
        texture: "https://raw.githubusercontent.com/Eunomiac/-EunosTextControls/ClassRefactor/images/textures/",
        button: "https://raw.githubusercontent.com/Eunomiac/-EunosTextControls/ClassRefactor/images/buttons/"
    };
    const GetImgURL = (imgFileName, imgType = "general") => `${IMGROOT[imgType]}${imgFileName}`;
    const CLASSES = {
        boxDiv: {
            "display": "block",
            "width": "auto", "min-width": `${CHATWIDTH}px`,
            "height": "auto", "min-height": "39px",
            "margin": `${UPSHIFT}px 0 ${BOTTOMSHIFT}px ${LEFTSHIFT}px`,
            "padding": "0 0 5px 0",
            "color": COLORS.palegold,
            "text-align": "center",
            "position": "relative",
            "text-shadow": "none", "box-shadow": "none", "border": "none",
            "overflow": "hidden",
            "cursor": "default"
        },
        nameDiv: {
            "padding": "2px",
            "color": "red",
            "font-family": "'Envision'",
            "font-size": "26px",
            "line-height": "26px",
            "font-weight": "bold",
            "text-align": "left",
            "background": "#FFF",
            "text-shadow": "1px 1px 1px black, 1px 1px 1px black, 1px 1px 1px black"
        },
        blockDiv: {
            "min-height": "24px",
            "background-image": "url('https://i.imgur.com/6QmcWW0.jpg')",
            "color": "gold",
            "font-family": "'Friz Quadrata TT'",
            "line-height": "24px",
            "text-align": "center",
            "text-shadow": "2px 2px 1px black, 2px 2px 1px black, 2px 2px 1px black",
            "border": "2px solid black",
            "border-radius": "10px",
            "box-shadow": "none",
            "overflow": "hidden"
        },
        headerDiv: {
            "padding": "4px",
            "background-image": "url('https://i.imgur.com/7D7v1ET.jpg')",
            "color": "black",
            "font-size": "18px",
            "text-shadow": "none",
            "font-weight": "bold",
            "outline": "2px solid black"
        },
        bigWhiteSpan: {
            "display": "inline-block",
            "padding": "3px",
            "color": "white",
            "font-family": "'Futura PT'",
            "font-weight": "bolder",
            "font-size": "24px",
            "line-height": "inherit"
        },
        bigGoldSpan: {
            "display": "inline-block",
            "padding": "3px",
            "font-family": "'Futura PT'",
            "font-weight": "bolder",
            "font-size": "24px",
            "line-height": "inherit"
        },
        medGoldSpan: {
            "display": "inline-block",
            "padding": "3px",
            "font-family": "'Futura PT'",
            "font-weight": "bolder",
            "font-size": "18px",
            "line-height": "inherit"
        },
        goldSpan: {
            "display": "inline-block",
            "padding": "3px",
            "vertical-align": "top",
            "line-height": "inherit",
            "font-size": "14px"
        },
        smallGoldSpan: {
            "display": "inline-block",
            "padding": "3px",
            "vertical-align": "top",
            "line-height": "inherit",
            "font-size": "11px"
        },
        dicePoolAssemblyDiv: {
            "width": "100%",
            "margin": "5px 0",
            "font-size": "0",
            "text-align": "left",
            "border-bottom": "3px inset gold",
            "overflow": "hidden",
            "white-space": "nowrap"
        },
        dicePoolAddedFlagDiv: {
            "margin-bottom": "-10px"
        },
        dicePoolLastFlagDiv: { },
        col2Div: {
            "display": "inline-block",
            "vertical-align": "top",
            "width": "50%"
        },
        simpleLineDiv: {
            "width": "90%",
            "font-size": "0",
            "margin": "5px 5%"
        },
        rollNotesDiv: {
            "margin-top": "-12px",
            "padding": "3px 0",
            "line-height": "18px"
        },
        diceLineDiv: {
            "margin": "5px 0 15px 0",
            "padding": "5px 0 0 0",
            "background-image": "url('https://i.imgur.com/rjfInxn.jpg')",
            "box-shadow": "0px -5px 5px rgba(0,0,0,0.75), 0px 5px 5px rgba(255,255,255,0.5)"
        },
        dieDiv: {
            display: "inline-block"
        },
        dieImg: {
            "display": "inline-block",
            "height": "50px",
            "width": "50px",
            "max-width": "300%",
            "margin": "-12px -5px 0 -10px"
        },
        dieRerollSpan: {
            "display": "inline-block",
            "height": "5px",
            "line-height": "0px",
            "margin": "-4px -10px 0 -3px",
            "padding": "10px 0 0 0",
            "color": "white",
            "font-family": "'Oswald'",
            "font-size": "10px",
            "font-weight": "bold",
            "vertical-align": "top",
            "text-shadow": "1px 1px 0px black, 1px 1px 0px black, 1px 1px 0px black",
            "position": "relative"
        },
        arrowSpan: {
            "color": "black",
            "text-shadow": "none"
        },
        addTextShadow: {
            "text-shadow": "2px 2px 1px black, 2px 2px 1px black, 2px 2px 1px black"
        },
        alignLeft: {
            "text-align": "left"
        },
        alignCenter: {
            "text-align": "center"
        },
        alignRight: {
            "text-align": "right"
        },
        centerWidth75: {
            "width": "75%",
            "margin": "0 auto 0 auto"
        },
        floatRight: {
            "float": "right"
        },
        shortLines: {
            "line-height": "18px"
        },
        veryShortLines: {
            "line-height": "14px"
        },
        fontSize12: {
            "font-size": "12px"
        },
        indent12: {
            "margin-left": "12px"
        },
        redBG: {
            "background-image": "url('https://i.imgur.com/Dbe0qwL.jpg')"
        },
        blackBG: {
            "background-image": "none",
            "background-color": "black"
        },
        whiteText: {
            "color": "white"
        },
        futuraFont: {
            "font-family": "Futura PT",
            "font-weight": "bolder"
        },
        trebuchetFont: {
            "font-family": "Trebuchet MS",
            "font-weight": "bold"
        },
        noVertPad: {
            "padding-top": "0 !important",
            "padding-bottom": "0 !important"
        },
        fullWidth: {"width": "100%"},
        block: {"display": "block"},
        baseline: {"vertical-align": "baseline"},
        boratImg: {
            width: "90%",
            height: "auto",
            // "min-height": "250px",
            "object-fit": "cover",
            border: "6px outset gold",
            "margin": "5px 0",
            "box-shadow": "3px 3px 5px black, 3px 3px 5px black, 3px 3px 5px black"
        },
        preloadImg: {
            width: "5px",
            height: "5px"
            // "object-fit": "100%",
        }
    };
    // #endregion
    // #endregion

    // #region *** *** FUNCTIONS *** ***

    // #region Utility Functions
    const ResetState = () => {
        state = {};
        state[NAMESPACE] = {};
        state[NAMESPACE][SCRIPTNAME] = C.Clone(DEFAULTSTATE);
        state[NAMESPACE].MASTER = {};
    };
    const IsR20Obj = (val) => _.isObject(val) && val.id && "get" in val;
    const IsR20ID = (val) => typeof val === "string" && /^-[-a-zA-Z0-9_]{19}$/u.test(val);
    const GetR20Type = (val) => {
        if (IsR20Obj(val)) {
            const type = val.get("_type");
            if (type === "graphic") {
                if (val.get("represents")) {
                    return "token";
                }
                if (val.get("_subtype") === "card") {
                    return "card";
                }
                if (/\.webm/u.test(val.get("imgsrc"))) {
                    return "animation";
                }
                return "graphic";
            }
            if (type === "character") {
                if (val.id in MAS.TER.PCs) {
                    return "PC";
                }
                return "NPC";
            }
            return type;
        }
        return false;
    };
    const JS = (val) => JSON.stringify(val, null, 2).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
    const JC = (val) => C.CodeBlock(JS(val));
    const randStr = (length = 10) => _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), length).join("");


    const Alert = (content, title, {direct = false, force = false, noarchive = true, target = "gm"} = {}) => { // Simple alert to the GM. Style depends on presence of content, title, or both.
        const randStr = () => _.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), 4).join("");
        if (force || STA.TE.isShowingDebugMessages) {
            if (content || title) {
                if (title) {
                    if (content === null) {
                        sendChat(randStr(), `${direct ? "/direct" : `/w ${target}`} ${C.Box([
                            C.Block(C.Header(title, 3), "#666")
                        ].join(""))}`, null, {noarchive});
                    } else {
                        sendChat(randStr(), `${direct ? "/direct" : `/w ${target}`} ${C.Box([
                            C.Block(C.Header(title, 3), "#666"),
                            C.Block(content)
                        ].join(""))}`, null, {noarchive});
                    }
                } else {
                    sendChat(randStr(), `${direct ? "/direct" : `/w ${target}`} ${content}`, null, {noarchive});
                }
            }
        }
    };
    const Direct = (htmlContent, options = {}) => Alert(htmlContent, null, Object.assign(options, {direct: true}));
    const Show = (obj, title = "Showing ...", options = {}) => Alert(JC(obj), title, options);
    const Flag = (msg, options = {}) => Alert(null, msg, options);
    const CapGroups = (str, regExp) => str.match(new RegExp(regExp), "u").slice(1);
    const KeyMapObj = (obj, keyFunc = (x) => x, valFunc = undefined) => {
        /*
         * An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
         *      If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
         */
        [valFunc, keyFunc] = [valFunc, keyFunc].filter((x) => typeof x === "function" || typeof x === "boolean");
        keyFunc = keyFunc || ((k) => k);
        valFunc = valFunc || ((v) => v);
        const newObj = {};
        Object.entries(obj).forEach(([key, val]) => {
            newObj[keyFunc(key, val)] = valFunc(val, key);
        });
        return newObj;
    };
    const Clone = (obj) => {
        let cloneObj;
        try {
            cloneObj = JSON.parse(JSON.stringify(obj));
        } catch (err) {
            // THROW({obj, err}, "ERROR: U.Clone()");
            cloneObj = {...obj};
        }
        return cloneObj;
    };
    const Merge = (target, source, {isMergingArrays = true, isOverwritingArrays = true} = {}) => {
        target = Clone(target);
        const isObject = (obj) => obj && typeof obj === "object";

        if (!isObject(target) || !isObject(source)) {
            return source;
        }

        Object.keys(source).forEach((key) => {
            const targetValue = target[key];
            const sourceValue = source[key];

            if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                if (isMergingArrays) {
                    target[key] = targetValue.map((x, i) =>
                        (sourceValue.length <= i ? x : Merge(x, sourceValue[i], {isMergingArrays, isOverwritingArrays})));
                    if (sourceValue.length > targetValue.length) {
                        target[key] = target[key].concat(sourceValue.slice(targetValue.length));
                    }
                } else if (isOverwritingArrays) {
                    target[key] = sourceValue;
                } else {
                    target[key] = targetValue.concat(sourceValue);
                }
            } else if (isObject(targetValue) && isObject(sourceValue)) {
                target[key] = Merge({...targetValue}, sourceValue, {isMergingArrays, isOverwritingArrays});
            } else {
                target[key] = sourceValue;
            }
        });

        return target;
    };
    // #endregion

    // #region System Data Retrieval
    const GetExaltType = (charID) => (
        {
            none: false,
            Dawn: "solar",
            Zenith: "solar",
            Twilight: "solar",
            Night: "solar",
            Eclipse: "solar",
            Dusk: "abyssal",
            Midnight: "abyssal",
            Daybreak: "abyssal",
            Day: "abyssal",
            Moonshadow: "abyssal",
            Air: "dragon",
            Earth: "dragon",
            Fire: "dragon",
            Water: "dragon",
            Wood: "dragon",
            "Full Moon": "lunar",
            "Changing Moon": "lunar",
            "No Moon": "lunar",
            Casteless: "lunar",
            Journeys: "sidereal",
            Serenity: "sidereal",
            Battles: "sidereal",
            Secrets: "sidereal",
            Endings: "sidereal",
            Blood: "liminal",
            Breath: "liminal",
            Flesh: "liminal",
            Marrow: "liminal",
            Soil: "liminal",
            Exigent: "exigent",
            Slayer: "infernal",
            Malefactor: "infernal",
            Defiler: "infernal",
            Scourge: "infernal",
            Fiend: "infernal",
            Custom: "infernal",
            Orichalcum: "alchemical",
            Soulsteel: "alchemical",
            Moonsilver: "alchemical",
            Starmetal: "alchemical",
            Jade: "alchemical"
        }[getAttrByName(charID, "caste") || "none"]);
    const GetPlayerChar = (playerID) => {
        const chars = findObjs({
            _type: "character"
        }).filter((char) => new RegExp(playerID).test(char.get("controlledby")));
        if (chars.length === 1) {
            return chars.pop();
        }
        Alert(`${chars.length} Characters found for player ID ${playerID}`);
        return false;
    };
    const GetChar = (charRef) => {
        switch (GetR20Type(charRef)) {
            case "PC": case "NPC": return charRef;
            case "token": return getObj("character", charRef.get("represents"));
            case "player": return GetPlayerChar(charRef.id);
            default: {
                if (IsR20ID(charRef)) {
                    const charObj = getObj("character", charRef);
                    if (charObj) {
                        return charObj;
                    }
                    const graphicObj = getObj("graphic", charRef);
                    if (graphicObj) {
                        return GetChar(graphicObj);
                    }
                    const playerObj = getObj("player", charRef);
                    if (playerObj) {
                        return GetChar(playerObj);
                    }
                } else if (typeof charRef === "string") { // Assume non-ID strings are names.
                    const charObj = findObjs({_type: "character"}).find((obj) => obj.get("name") === charRef);
                    if (charObj) {
                        return charObj;
                    }
                } else if (charRef && _.isObject(charRef) && "selected" in charRef) { // Check for selected message objects.
                    const charObjs = charRef.selected.map((tokenRef) => getObj("character", getObj("graphic", tokenRef._id).get("represents"))).filter((charObj) => Boolean(charObj));
                    if (charObjs.length === 1) {
                        return charObjs.pop();
                    }
                    if (charObjs.length > 1) {
                        return charObjs;
                    }
                }
                return false;
            }
        }
    };
    const GetRepSecSummary = (charRef, repSec) => { // repeating_${secName}_${rowID}_${attrName}
        const parseRepAttrName = (repAttrName) => C.CapGroups(repAttrName || "", /^repeating_(.+)_(.{20})_(.+)$/u);
        const charObj = GetChar(charRef);
        if (charObj && typeof repSec === "string") {
            const attrObjs = findObjs({
                _type: "attribute",
                _characterid: charObj.id
            }).filter((attrObj) => new RegExp(`repeating_${repSec.toLowerCase()}`).test(attrObj.get("name")));
            if (attrObjs.length) {
                const repSecSummary = {};
                Object.values(_.groupBy(attrObjs.map((attrObj) => {
                    const [section, rowID, name] = parseRepAttrName(attrObj.get("name"));
                    return {section, rowID, name, value: attrObj.get("current")};
                }), "rowID")).forEach((rowData) => {
                    const nameData = rowData.find((attrData) => /name$/u.test(attrData.name));
                    const valData = rowData.find((attrData) => !/name$/u.test(attrData.name));
                    if (/\d+/u.test(valData.value)) {
                        valData.value = parseInt(valData.value);
                    }
                    repSecSummary[nameData.value] = {
                        name: nameData.value,
                        value: valData.value,
                        rowID: nameData.rowID,
                        section: nameData.section,
                        attrNames: {
                            name: `repeating_${nameData.section}_${nameData.rowID}_${nameData.name}`,
                            value: `repeating_${valData.section}_${valData.rowID}_${valData.name}`
                        }
                    };
                });
                return repSecSummary;
            }
        }
        return false;
    };
    const GetAttrNameByRef = (attrRef, subRef, charRef) => {
        let attrName = false;
        if (typeof attrRef === "string") {
            if (attrRef.toLowerCase() in ATTRNAMEREF) {
                attrName = attrRef;
            } else if (subRef && `${attrRef.toLowerCase()}-${subRef.toLowerCase()}` in ATTRNAMEREF) {
                attrName = `${attrRef.toLowerCase()}-${subRef.toLowerCase()}`;
            } else if (attrRef.length === 3) {
                attrName = ATTRREF[attrRef];
                if (!attrName) {
                    const attrNames = [ATTRREF[attrRef.toUpperCase()], ATTRREF[attrRef.toLowerCase()]].filter((attrName) => Boolean(attrName));
                    if (attrNames.length > 1) {
                        Alert(`Trait reference '<b>${attrRef}</b>' is ambiguous. Please instead specify one of the following:<ul><li>'<b>${attrRef.toUpperCase()}</b>' for '${attrNames[0]}'<li>'<b>${attrRef.toLowerCase()}</b>' for '${attrNames[1]}'</ul>`, "Error: Ambiguous Trait", true);
                    } else if (attrNames.length === 1) {
                        attrName = attrNames.pop();
                    }
                }
            } else if (/^..-.+/u.test(attrRef)) {
                [attrRef, subRef] = attrRef.split("-");
                subRef = subRef.slice(0, 3);
                if (attrRef in SUBATTRREF && subRef in SUBATTRREF[attrRef]) {
                    attrName = SUBATTRREF[attrRef][subRef];
                }
            }
            if (charRef && !attrName) {
                if (attrRef === attrRef.toLowerCase() && /^(cr|ma)/u.test(attrRef)) {
                    const charObj = GetChar(charRef);
                    const attrMainRef = attrRef.slice(0, 2);
                    const repStats = Object.values(GetRepSecSummary(charObj, {cr: "crafts", ma: "martialarts"}[attrMainRef])).filter((attrData) => attrData.value > 0);
                    const subStats = findObjs({
                        _type: "attribute",
                        _characterid: charObj.id
                    }).filter((attrObj) => attrObj.get("name").startsWith(attrMainRef) && parseInt(attrObj.get("current")) > 0);
                    if (/^..-.+/u.test(attrRef)) {
                        subRef = subRef || CapGroups(attrRef, /^..-(.+)$/u).shift();
                    }
                    if (subRef) {
                        if (`${attrMainRef}-${subRef}` in ATTRNAMEREF) {
                            attrName = `${attrMainRef}-${subRef}`;
                        } else {
                            const [repAttrData] = repStats.filter((attrData) => subRef.slice(0, 3).toLowerCase() === attrData.name.slice(0, 3).toLowerCase());
                            if (repAttrData) {
                                attrName = repAttrData.attrNames.value;
                            }
                        }
                    } else {
                        if (repStats.length + subStats.length === 1) {
                            if (repStats.length) {
                                attrName = repStats[0].attrNames.value;
                            } else if (subStats.length) {
                                attrName = subStats[0].get("name");
                            }
                        } else {
                            const mainAttrName = {ma: "MA", cr: "Craft"}[attrMainRef];
                            const syntaxLines = [
                                ...subStats.map((subAttrObj) => `<li>'<b>${subAttrObj.get("name")}</b>' for '${ATTRNAMEREF[subAttrObj.get("name")]}'`),
                                ...repStats.map((repData) => `<li>'<b>${attrMainRef}-${repData.name.toLowerCase().slice(0, 3)}</b>' for '${mainAttrName} (${repData.name})`)
                            ];
                            Alert(`Trait reference '<b>${attrRef}</b>' is ambiguous. Please instead specify one of the following:<ul>${syntaxLines.join("")}</ul>`, "Error: Ambiguous Trait", true);
                        }
                    }
                }
            }
        }
        if (attrName) {
            return attrName;
        }
        Alert(`'<b>${`${JS(attrRef)}${subRef ? `-${JS(subRef)}` : ""}`.replace(/"/gu, "")}</b>' is not recognized as a valid trait reference.<br><i>(If referencing Craft or Martial Arts sub-disciplines, include a character reference.)</i>`, "Error: Unrecognized Trait", true);
        return false;
    };
    // #endregion

    // #region HTML Styling
    const ParseStyleData = (styleData) => {
        if (Array.isArray(styleData)) { // Multiple styles to be assigned consecutively.
            const mergedStyleData = {};
            while (styleData.length) {
                Object.assign(mergedStyleData, styleData.shift());
            }
            styleData = mergedStyleData;
        }
        const styleLine = [];
        for (const [prop, value] of Object.entries(styleData)) {
            styleLine.push(`${prop}: ${value};`);
        }
        return `style="${styleLine.join(" ")}"`;
    };
    const ConvertClassToStyle = (html) => {
        const styleData = (CapGroups(html, /class=.([^"']+)./u) || [""]).shift().split(" ").map((classRef) => CLASSES[classRef]);
        return html.replace(/class=.([^"']+)./u, ParseStyleData(styleData));
    };
    const MakeHTML = (data = {}, content = false) => {
        if ("class" in data) {
            data["class"] = [data["class"]].flat().join(" ");
        }
        let htmlElement = ConvertClassToStyle(`<${data.tag} class="${data["class"]}"`);
        if ("src" in data) {
            htmlElement += ` src="${data.src}"`;
        }
        if ("title" in data) {
            htmlElement += ` title="${data.title}"`;
        }
        if (content) {
            htmlElement += `>${[content].flat().filter((line) => Boolean(line)).join("")}</${data.tag}`;
        }
        htmlElement += ">";
        return htmlElement;
    };

    /*
    const UPSHIFT = -25;
    const LEFTSHIFT = -42;
    const BOTTOMSHIFT = 0; */
    const Box = (content) => `<div style=" display: block; margin: ${UPSHIFT}px 0 ${BOTTOMSHIFT}px ${LEFTSHIFT}px; width: auto; min-width: ${CHATWIDTH}px; height: auto; min-height: 39px; color: black; text-align: center; text-align-last: center; position: relative; border: none; text-shadow: none; box-shadow: none; outline: none; padding: 0 0 2px 0; overflow: hidden; cursor: default;">${content}</div>`;
    const Header = (content, bgColor = "rgba(80,80,80,1)") => `<span style=" display: block; height: auto; width: auto; margin: 0; padding: 0 5px; text-align: left; text-align-last: left; color: white; background-color: ${bgColor}; border: none; text-shadow: none; box-shadow: none; font-variant: small-caps;font-size: 16px;line-height: 24px; font-family: sans-serif; ">${content}</span>`;
    const Block = (content, bgColor = "white", fontFamily = "Sura", fontWeight = "normal", fontSize = 14, lineHeight) => `<div style=" width: 100%; background: ${bgColor}; outline: 2px solid black; font-family: '${fontFamily}'; font-weight: ${fontWeight}; font-size: ${fontSize}px; line-height: ${lineHeight ? lineHeight : fontSize + 4}px; margin-top: 2px; text-align: left; text-align-last: left; padding: 5px;">${content}</div>`;
    const CodeBlock = (content, bgColor = "white") => Block(content, bgColor, "Fira Code", "bold", 8);
    const Button = (name, command, style = {}) => `<span style="display: inline-block; width: ${style.width}; background: grey; color: white;"><a href="${command}">${name}</a></span>`;
    // #endregion
    // #endregion


    return {
        Initialize,
        RO: {get OT() { return state[NAMESPACE] }},
        STA,

        // Basic References
        TEXTCHARS,
        NUMBERWORDS,
        ORDINALSUFFIX,
        COLORS,
        // Sandbox Specifications
        UNITSIZE,
        CHATWIDTH,
        SANDBOX,
        // Exalted System Specifications
        TRACKERS,
        // Character Sheet Specifications
        DEFAULTATTRS,
        ATTRREF,
        SHEETDATA,
        // HTML Style Data
        CLASSES,

        // Utility Functions
        ResetState,
        IsR20Obj,
        IsR20ID,
        GetR20Type,
        JS,
        JC,
        Direct,
        Alert,
        Show,
        Flag,
        CapGroups,
        KeyMapObj,
        Clone,
        Merge,

        // System Data Retrieval
        GetExaltType,
        GetChar,
        GetPlayerChar,
        GetRepSecSummary,
        GetAttrNameByRef,

        // HTML Styling Functions
        ParseStyleData,
        STYLE: ConvertClassToStyle,
        HTML: MakeHTML,
        Box,
        Header,
        Block,
        CodeBlock,
        Button
    };
})();

on("ready", () => {
    C.Initialize(true);
    setTimeout(() => {
        sendChat(_.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), 4).join(""), `/direct ${AlertFlag("API Operational")}`);
        state[NAMESPACE].C.isShowingDebugMessages = curDebugState;
    }, 1000);
});
void MarkStop("C");