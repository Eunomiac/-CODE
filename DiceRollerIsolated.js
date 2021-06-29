const NAMESPACE = "EunoE3DiceRoller";

state = state || {};
state[NAMESPACE] = state[NAMESPACE] || {};
state[NAMESPACE].REGISTRY = state[NAMESPACE].REGISTRY || {};
state[NAMESPACE].C = state[NAMESPACE].C || {};

const DiceRoller = (() => {

    // #region *** *** FRONT *** ***
    const SCRIPTNAME = "DiceRoller";
    const RO = {get OT() { return state[NAMESPACE] }};
    const STA = {get TE() { return RO.OT[SCRIPTNAME] }};
    const RE = {get G() { return RO.OT.REGISTRY }};

    // #region INITIALIZATION & EVENT HANDLERS
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => { // Initialize State, Trackers, Event Listeners
        if (isResettingState) { RO.OT[SCRIPTNAME] = {} }

        // Register event handlers for chat commands.
        if (isRegisteringEventListeners) {
            on("chat:message", handleMessage);
        }

        // Report Readiness
        Flag(`... ${SCRIPTNAME}.js Ready!`, {force: true, direct: true});
        log(`${SCRIPTNAME}.js Ready!`);

        // Schedule Image Preload Chat Message for After Sandbox Initialization
        setTimeout(preloadImages, 1200);
    };

    const handleMessage = (msg) => {
        if (/(^!r?help|^!rset|^!roll|^!raw|^!init)/u.test(msg.content)) {
            let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
                .map((x) => x.trim())
                .filter((x) => Boolean(x));
            switch (call) {
                case "!roll": displayRoll(resolveRoll(parseRollCommand(msg, args))); break;
                case "!raw": displayRoll(resolveRoll(parseRollCommand(msg, ["d0", ...args]))); break;
                case "!init": displayRoll(resolveRoll(parseRollCommand(msg, ["i", ...args]))); break;

                case "!rset": {
                    switch (call = args.shift()) {
                        case "preload": preloadImages(); break;
                        // no default
                    }
                    break;
                }

                case "!rhelp": displayHelp(); break;
                // no default
            }
        }
    };
    // #endregion

    // #region IMAGE DEFINITIONS & PRELOADING
    const DICE = {
        d: [
            null,
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/JVlasmN.png", title: "1: Success, Doubled"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/KoWXCrx.png", title: "2: Success, Doubled"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/6VP0Xyw.png", title: "3: Success, Doubled"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/yR4tfOu.png", title: "4: Success, Doubled"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/bWf8ahA.png", title: "5: Success, Doubled"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/1jFtq1g.png", title: "6: Success, Doubled"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/NgqhOYN.png", title: "7: Success, Doubled"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/gm4aEtF.png", title: "8: Success, Doubled"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/sb3rIQ3.png", title: "9: Success, Doubled"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/xPgi5O2.png", title: "10: Success, Doubled"}
        ],
        s: [
            null,
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/Ervu8Ev.png", title: "1: Success"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/sGoSXli.png", title: "2: Success"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/T4cv3pE.png", title: "3: Success"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/qw8XPlS.png", title: "4: Success"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/qW5M7DQ.png", title: "5: Success"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/kXqjz3j.png", title: "6: Success"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/V6Q6vRp.png", title: "7: Success"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/xv22Yyz.png", title: "8: Success"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/h2ttG5w.png", title: "9: Success"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/gDmMrcM.png", title: "10: Success"}
        ],
        f: [
            null,
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/gmbAnub.png", title: "1: Failure"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/wG7yMSU.png", title: "2: Failure"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/FEM1xV6.png", title: "3: Failure"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/15ysERm.png", title: "4: Failure"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/YTH6G5i.png", title: "5: Failure"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/yDJobFb.png", title: "6: Failure"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/XzScIvV.png", title: "7: Failure"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/BUWuj7P.png", title: "8: Failure"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/MnQuoZS.png", title: "9: Failure"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/nHUBhOG.png", title: "10: Failure"}
        ],
        b: [
            null,
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/YOjXaSw.png", title: "1: Botch"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/49jg7Ma.png", title: "2: Botch"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/Ian7lXv.png", title: "3: Botch"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/p2VdOh0.png", title: "4: Botch"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/56XmXuQ.png", title: "5: Botch"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/cTpxHbU.png", title: "6: Botch"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/dLuTS7n.png", title: "7: Botch"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/JFdY4SK.png", title: "8: Botch"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/84vtdpG.png", title: "9: Botch"},
            {tag: "img", class: "dieImg", src: "https://i.imgur.com/09Sy5y7.png", title: "10: Botch"}
        ],
        special: {
            auto: {tag: "img", class: "dieImg", src: "https://i.imgur.com/9AdCW5c.png", title: "1 Automatic Success"},
            stunt2: {tag: "img", class: "dieImg", src: "https://i.imgur.com/lX3V81i.png", title: "Stunt II: +1 Success"},
            stunt3: {tag: "img", class: "dieImg", src: "https://i.imgur.com/No5Ri8v.png", title: "Stunt III: +2 Successes"},
            init: {tag: "img", class: "dieImg", src: "https://i.imgur.com/s352Zeu.png", title: "Initiative: +3 Successes"},
            willpower: {tag: "img", class: "dieImg", src: "https://i.imgur.com/YmJdfWt.png", title: "Willpower: +1 Success"}
        }
    };

    const preloadImages = () => {
        const imageHTML = JSON.stringify(DICE).match(/http[^"]+/gu).map((url) => HTML({tag: "img", class: "preloadImg", src: url})).join("");
        Direct(`<div style="display: block ; margin: -26px 0 -7px -45px ; width: auto ; min-width: 283px ; height: auto ; min-height: 39px ; position: relative ; border: none ; text-shadow: none ; box-shadow: none ; outline: 2px solid black ; padding: 0; overflow: hidden;"><div style="background: #666;outline: 2px solid black;padding: 5px;position:  relative;z-index: 3;opacity: 0.8;"><span style="display: block;color: white;font-variant: small-caps;font-size: 20px;line-height: 24px;font-family: sans-serif;position: relative;z-index: 2;font-weight: bold; text-align: center;">Preloading Images</span></div><div style="background: white; margin-top: -40px; position: relative; z-index: 1;">${imageHTML}</div></div>`, {force: true});
    };
    // #endregion
    // #endregion *** *** FRONT *** ***

    // #region *** *** UTILITY *** ***

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
    const CHATWIDTH = 281; // The minimum width of the chat panel, in pixels. Be sure to subtract twice any border widths.

    const UPSHIFT = -26;   // Constants governing how the chat box is positioned in the chat panel: By default, everything
    const LEFTSHIFT = -45; // shifts up and to the left to cover the standard chat output with the custom styles below.
    const BOTTOMSHIFT = -7;

    const JS = (val) => JSON.stringify(val, null, 2).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
    const JC = (val) => CodeBlock(JS(val));
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

    // #region HTML Styling
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
            "padding": "0 0 2px 0",
            "color": COLORS.palegold,
            "text-align": "center",
            "position": "relative",
            "text-shadow": "none", "box-shadow": "none", "border": "none",
            "overflow": "hidden",
            "cursor": "default"
        }/*
            "min-width": "270px",
            "margin": "-25px 0 0 -42px",
            "position": "relative",
            "font-size": "0",
            "background": "#FFF",
            "cursor": "default"
        } */,
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
        shortLines: {
            "line-height": "18px"
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
        noVertPad: {
            "padding-top": "0 !important",
            "padding-bottom": "0 !important"
        },
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
        const styleData =(html.match(/class=.([^"']+)./u) || [""]).shift().split(" ").map((classRef) => CLASSES[classRef]);
        return html.replace(/class=.([^"']+)./u, ParseStyleData(styleData));
    };
    const HTML = (data = {}, content = false) => {
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

    const Box = (content) => `<div style=" display: block; margin: ${UPSHIFT}px 0 ${BOTTOMSHIFT}px ${LEFTSHIFT}px; width: auto; min-width: ${CHATWIDTH}px; height: auto; min-height: 39px; color: black; text-align: center; text-align-last: center; position: relative; border: none; text-shadow: none; box-shadow: none; outline: none; padding: 0 0 2px 0; overflow: hidden; cursor: default;">${content}</div>`;
    const Header = (content, bgColor = "rgba(80,80,80,1)") => `<span style=" display: block; height: auto; width: auto; margin: 0; padding: 0 5px; text-align: left; text-align-last: left; color: white; background-color: ${bgColor}; border: none; text-shadow: none; box-shadow: none; font-variant: small-caps;font-size: 16px;line-height: 24px; font-family: sans-serif; ">${content}</span>`;
    const Block = (content, bgColor = "white", fontFamily = "Sura", fontWeight = "normal", fontSize = 14, lineHeight) => `<div style=" width: 100%; background: ${bgColor}; outline: 2px solid black; font-family: '${fontFamily}'; font-weight: ${fontWeight}; font-size: ${fontSize}px; line-height: ${lineHeight ? lineHeight : fontSize + 4}px; margin-top: 2px; text-align: left; text-align-last: left; padding: 5px;">${content}</div>`;
    const CodeBlock = (content, bgColor = "white") => Block(content, bgColor, "Fira Code", "bold", 8);
    const Button = (name, command, style = {}) => `<span style="display: inline-block; width: ${style.width}; background: grey; color: white;"><a href="${command}">${name}</a></span>`;
    // #endregion
    // #endregion *** *** UTILITY *** ***
    // #region Initial Command Parsing to Create Roll Flags
    const parseRollCommand = (msg, args) => {
        /** RETURNS:
         * {
         *      charObj: Roll20 Character Object
         *      message: String (quoted argument)
         *      flags: Array[flags] (each flag begins with a SINGLE letter, then some number of digits or X's)
         *      pool: Int,
         *      diff: Int
         * }
         */
        let name = false;
        if (msg.selected) {
            const tokenObj = getObj("graphic", msg.selected.filter((sel) => sel._type === "graphic").map((sel) => sel._id).shift());
            if (tokenObj && tokenObj.get("represents")) {
                const charObj = getObj("character", tokenObj.get("represents"));
                if (charObj) {
                    name = charObj.get("name");
                }
            }
        }
        if (!name && msg.playerid in RE.G.Players) {
            const playerData = RE.G.Players[msg.playerid];
            if (playerData.charID) {
                const charObj = getObj("character", playerData.charID);
                if (charObj) {
                    name = charObj.get("name");
                }
            }
            if (!name) {
                name = playerData.name;
            }
        }
        if (Array.isArray(args) && args.length) {
            const message = (args.find((arg) => /^".*"$/u.test(arg)) || "").replace(/"/gu, "");
            const flags = args.filter((arg) => /^\w(p|X|\d)*$/u.test(arg)).map((val) => val.replace(/10/gu, "X"));
            const [pool, diff] = (args.find((arg) => /^\d+(v\D*\d+)?$/u.test(arg)) || "0").match(/^(\d+)v?\D*(\d+)?/u).slice(1,3).map((x) => x ? parseInt(x) : 0);
            return {
                name,
                message,
                flags,
                pool,
                diff
            };
        }
        return false;
    };
    // #endregion

    // #region Basic Dice Rolling
    const displayHelp = () => {
        Direct(HTML({tag: "div", class: "boxDiv"}, HTML({tag: "div", class: "blockDiv"}, [
            HTML({tag: "div", class: "headerDiv"}, "Euno's Exalted 3E Dice Roller"),
            HTML({tag: "div", class: ["simpleLineDiv", "shortLines"]}, [
                HTML({tag: "span", class: "bigGoldSpan"}, "Syntax"),
                HTML({tag: "div", class: "alignLeft"}, [
                    HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll &lt;<span style=\"color: gold;\">pool</span>&gt;[v&lt;<span style=\"color: gold;\">diff</span>&gt;] [<span style=\"color: gold;\">flags</span>] \"[<span style=\"color: gold;\">title</span>]\""),
                    HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!raw &lt;<span style=\"color: gold;\">pool</span>&gt;[v&lt;<span style=\"color: gold;\">diff</span>&gt;] [<span style=\"color: gold;\">flags</span>] \"[<span style=\"color: gold;\">title</span>]\""),
                    HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!init &lt;<span style=\"color: gold;\">pool</span>&gt; [<span style=\"color: gold;\">flags</span>]")
                ])
            ]),
            HTML({tag: "div", class: ["simpleLineDiv"]}, HTML({tag: "span", class: "bigGoldSpan"}, "Flags")),
            HTML({tag: "div", class: ["col2Div", "alignLeft", "shortLines"]}, [
                [HTML({tag: "span", class: "bigWhiteSpan"}, "sp"), HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Specialty")].join(""),
                [HTML({tag: "span", class: "bigWhiteSpan"}, "wp"), HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Willpower")].join(""),
                [HTML({tag: "span", class: "bigWhiteSpan"}, "d#"), HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Double #+")].join(""),
                [HTML({tag: "span", class: "bigWhiteSpan"}, "r###"), HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Reroll #'s")].join("")
            ].join("<br>")),
            HTML({tag: "div", class: ["col2Div", "alignLeft", "shortLines"]}, [
                [HTML({tag: "span", class: "bigWhiteSpan"}, "s#"), HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Stunt Tier")].join(""),
                [HTML({tag: "span", class: "bigWhiteSpan"}, "a#"), HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Auto-Succ's")].join(""),
                [HTML({tag: "span", class: "bigWhiteSpan"}, "t#"), HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Target #")].join(""),
                [HTML({tag: "span", class: "bigWhiteSpan"}, "b###"), HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Botch #'s")].join("")
            ].join("<br>")),
            HTML({tag: "div", class: ["simpleLineDiv", "shortLines"]}, HTML({tag: "span", class: "bigGoldSpan"}, "Examples")),
            HTML({tag: "div", class: "alignLeft"}, [
                [HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3"), HTML({tag: "span", class: "smallGoldSpan"}, "\"Simple roll of 3 dice\"")].join(""),
                [HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3v4"), HTML({tag: "span", class: "smallGoldSpan"}, "\"Roll 3 dice vs. difficulty 4\"")].join(""),
                [HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3v4 wp sp"), HTML({tag: "span", class: "smallGoldSpan"}, "\"Specialty & Spending WP\"")].join(""),
                [HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3 r123 a3"), HTML({tag: "span", class: "smallGoldSpan"}, "\"Reroll 1s, 2s & 3s, Add 3 Succs\"")].join(""),
                [HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3 s3"), HTML({tag: "span", class: "smallGoldSpan"}, "\"Once-in-a-lifetime Stunt\"")].join(""),
                [HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3 b25"), HTML({tag: "span", class: "smallGoldSpan"}, "\"Flag 2's & 5's as Botches\"")].join("")
            ].join("<br>"))
        ])), {force: true});
    };
    const rollDie = () => Math.ceil(Math.random() * 10);
    const rollDice = (numDice) => new Array(parseInt(numDice) || 0).fill(null).map(() => rollDie());
    const resolveRoll = ({name, message, flags, pool, diff} = {}) => {
        /** RETURNS:
         * {
         *      name: string|falsy
         *      message: String (quoted argument)
         *      pool: Int,
         *      usedSpec: bool,
         *      stuntTier: Int,
         *      stuntDice: Int,
         *      finalPool: Int,
         *      targetNum: Int,
         *      rerollNums: Array[Int],
         *      doublesNum: Int,
         *      botchNums: Array[Int],
         *      diceVals: Array[Int],
         *      rerollVals: Array[Array[Int]], (corresponds with indices of diceVals; holds rerolled values)
         *      autoSuccs: Int,
         *      stuntSuccs: Int,
         *      wpSuccs: Int,
         *      initSuccs: Int,
         *      total: Int,
         *      diff: Int,
         *      margin: Int,
         *      isBotch: bool,
         *      isSuccess: bool,
         *      hasThreshold: bool
         * }
         */
        Show({name, message, flags, pool, diff});
        const rollResults = {
            name: name ? name : false,
            message: message ? message : false,
            pool
        };
        diff = diff || 0;
        const rerollNums = (flags.find((flag) => /^r(0|([1-9X])+|10)$/u.test(flag)) || "").slice(1).split("").map((num) => parseInt(num.replace(/X/gu, "10")));
        const botchNums = (flags.find((flag) => /^b(0|([1-9X])+|10)$/u.test(flag)) || "b1").slice(1).split("").map((num) => parseInt(num.replace(/X/gu, "10")));
        const targetNum = parseInt((flags.find((flag) => /^t([0-9]|10|X)$/u.test(flag)) || "t7").replace(/X/gu, "10").slice(1));
        const autoSuccs = parseInt((flags.find((flag) => /^a\d+$/u.test(flag)) || "a0").slice(1));
        const doublesNum = parseInt((flags.find((flag) => /^d([0-9]|10|X)$/u.test(flag)) || "dX").replace(/X/gu, "10").replace(/d0/u, "d11").slice(1));
        const specVal = _.some(flags, (flag) => /^sp$/u.test(flag)) ? 1 : 0;
        const stuntVal = parseInt((flags.find((flag) => /^[S|s][0123]$/u.test(flag)) || "S0").slice(1));
        const initSuccs = _.some(flags, (flag) => /^i$/u.test(flag)) ? 3 : 0;
        const wpSuccs = _.some(flags, (flag) => /^wp$/u.test(flag)) ? 1 : 0;
        const [stuntDice, stuntSuccs] = [
            [0, 0],
            [2, 0],
            [2, 1],
            [2, 2]
        ][stuntVal];

        rollResults.usedSpec = specVal > 0;
        rollResults.stuntTier = stuntVal;
        rollResults.stuntDice = stuntDice;
        rollResults.finalPool = pool + stuntDice + specVal;

        rollResults.targetNum = targetNum;
        rollResults.rerollNums = rerollNums;
        rollResults.doublesNum = doublesNum;
        rollResults.botchNums = botchNums;

        rollResults.diceVals = rollDice(rollResults.finalPool);
        rollResults.rerollVals = [];

        // Handle Rerolls
        if (rerollNums.length) {
            rollResults.diceVals.forEach((val, i) => {
                while (rerollNums.includes(val)) {
                    rollResults.rerollVals[i] = rollResults.rerollVals[i] || [];
                    rollResults.rerollVals[i].push(val);
                    val = rollDie();
                    rollResults.diceVals[i] = val;
                }
            });
        }

        // Apply Dice Types
        rollResults.diceTypes = rollResults.diceVals.map((val) => {
            if (val < targetNum) {
                if (botchNums.includes(val)) {
                    return `b${val}`;
                }
                return `f${val}`;
            } else if (val >= doublesNum) {
                return `d${val}`;
            }
            return `s${val}`;
        });

        // Apply Special Dice
        rollResults.autoSuccs = autoSuccs;
        rollResults.diceTypes.push(...new Array(autoSuccs).fill("auto"));
        rollResults.stuntSuccs = stuntSuccs;
        if (stuntSuccs > 0) {
            rollResults.diceTypes.push(`stunt${stuntSuccs + 1}`);
        }
        rollResults.wpSuccs = wpSuccs;
        if (wpSuccs > 0) {
            rollResults.diceTypes.push("willpower");
        }
        rollResults.initSuccs = initSuccs;
        if (initSuccs > 0) {
            rollResults.diceTypes.push("init");
        }

        rollResults.total = rollResults.diceVals.filter((val) => val >= targetNum).length + autoSuccs + stuntSuccs + wpSuccs + initSuccs;

        // Apply Doubled Successes
        if (doublesNum > 0) {
            rollResults.diceVals.forEach((val, i) => {
                if (val >= targetNum && val >= doublesNum) {
                    rollResults.total++;
                }
            });
        }

        rollResults.diff = diff;
        rollResults.margin = rollResults.total - diff;
        if (rollResults.total === 0 && rollResults.diceVals.find((val) => parseInt(Math.abs(val)) === 1)) {
            rollResults.isBotch = true;
        } else if (rollResults.total > 0 && rollResults.margin >= 0) {
            rollResults.isSuccess = true;
        }
        rollResults.hasThreshold = rollResults.isSuccess && diff > 0;

        return rollResults;
    };
    const getDiceCount = (num, isProperCase = false) => (`${num}` === "1" ? "1 die" : `${num} dice`).replace(/d/gu, isProperCase ? "D" : "d");
    const getDieHTML = (diceVal) => {
        try {
            if (/^\w\d+$/u.test(diceVal)) {
                const [dieType, dieNum] = diceVal.match(/^(\w)(\d+)$/u).slice(1);
                return HTML(DICE[dieType][parseInt(dieNum)]);
            } else {
                return HTML(DICE.special[diceVal]);
            }
        } catch (err) {
            Alert(`Error processing diceVal <b>${diceVal}</b>`);
            return false;
        }
    };
    const HTMLParts = {
        nameDiv: (rollResults) => HTML({tag: "div", class: "nameDiv"}, rollResults.name),
        dicePoolAssemblyDiv: (rollResults) => [
            HTML(
                {tag: "div", class: "dicePoolAssemblyDiv"},
                [
                    HTML(
                        {tag: "div", class: ["col2Div", "alignRight"]},
                        [
                            HTML({tag: "span", class: "bigWhiteSpan"}, "Rolling "),
                            HTML({tag: "div", class: "bigGoldSpan", title: `Player submitted a roll of ${getDiceCount(rollResults.pool)}`}, `${rollResults.pool}`)
                        ]
                    ),
                    HTML(
                        {tag: "div", class: ["col2Div", "alignLeft"]},
                        [
                            rollResults.usedSpec
                                ? HTML({tag: "div", class: "dicePoolAddedFlagDiv", title: "+1 die from applied Specialty."}, [
                                    HTML({tag: "span", class: "medGoldSpan"}, "+1"),
                                    HTML({tag: "span", class: "goldSpan"}, "Specialty")
                                ])
                                : false,
                            rollResults.stuntTier > 0
                                ? HTML({tag: "div", class: `dicePool${rollResults.usedSpec ? "Last" : "Added"}FlagDiv`, title: `+${getDiceCount(rollResults.stuntDice)} from Tier ${"I".repeat(rollResults.stuntTier)} Stunt.`}, [
                                    HTML({tag: "span", class: "medGoldSpan"}, `+${rollResults.stuntDice}`),
                                    HTML({tag: "span", class: "goldSpan"}, `Tier ${"I".repeat(rollResults.stuntTier)} Stunt.`)
                                ])
                                : false
                        ]
                    )
                ]
            ),
            HTML({tag: "div", class: "simpleLineDiv"}, [
                HTML({tag: "div", class: "col2Div"}, "&nbsp;"),
                HTML(
                    {tag: "div", class: ["col2Div", "alignLeft"]},
                    HTML({tag: "span", class: "bigWhiteSpan", title: [
                        `${rollResults.pool} (Submitted)`,
                        rollResults.usedSpec ? "+ 1 (Specialty)" : false,
                        rollResults.stuntTier > 0 ? `+ ${rollResults.stuntDice} (Stunt ${"I".repeat(rollResults.stuntTier)})` : false,
                        `= ${rollResults.finalPool} Total Dice.`
                    ].filter((part) => Boolean(part)).join(" ")}, `${getDiceCount(rollResults.finalPool, true)}:`)
                )
            ])
        ].join(""),
        rollNotesDiv: (rollResults) => {
            const rollNotes = [];
            if (rollResults.doublesNum === 11) {
                rollNotes.push(["No dice count as two successes for this roll.", "◆ <u>NOT</u> Doubling 10s"]);
            } else if (rollResults.doublesNum < 10) {
                const doubledNums = [];
                let thisDNum = rollResults.doublesNum;
                while (thisDNum < 10) {
                    doubledNums.push(`${thisDNum}s`);
                    thisDNum++;
                }
                rollNotes.push([`${doubledNums.join(", ")} and 10s count as two successes.`, `◆ Doubling ${doubledNums.join(", ")} & 10s`]);
            }
            if (rollResults.rerollNums.length) {
                const rerollNums = rollResults.rerollNums.map((num) => `${num}s`);
                const lastNum = rerollNums.pop();
                if (rerollNums.length) {
                    rollNotes.push([`Rerolling ${rerollNums.join(", ")} and ${lastNum} until they no longer appear.`, `◆ Rerolling ${rerollNums.join(", ")} & ${lastNum}`]);
                } else {
                    rollNotes.push([`Rerolling ${lastNum} until they no longer appear.`, `◆ Rerolling ${lastNum}`]);
                }
            }
            if (rollResults.targetNum !== 7) {
                rollNotes.push([`Rolls of ${rollResults.targetNum} or higher are successes.`, `◆ Target Number is ${rollResults.targetNum}`]);
            }
            if (rollResults.autoSuccs > 0) {
                rollNotes.push([`Player adding ${rollResults.autoSuccs} automatic success${rollResults.autoSuccs > 1 ? "es" : ""}.`, `◆ Adding ${rollResults.autoSuccs} Automatic Success${rollResults.autoSuccs > 1 ? "es" : ""}.`]);
            }
            if (rollNotes.length) {
                return HTML(
                    {tag: "div", class: "rollNotesDiv"},
                    rollNotes.map(([title, span]) => HTML({tag: "span", class: ["smallGoldSpan", "noVertPad"], title}, span))
                );
            }
            return false;
        },
        rerollSpanDiv: (rerollNums, finalRoll) => HTML(
            {tag: "span", class: "dieRerollSpan", title: `Rerolled ${rerollNums.join(", ")} ▸ ${finalRoll}`},
            rerollNums.map((num) => `${num}${HTML({tag: "span", class: "arrowSpan"}, "▸")}`)
        ),
        diceLineDiv: (rollResults) => HTML(
            {tag: "div", class: "diceLineDiv"},
            rollResults.diceTypes.map((die, i) => HTML({tag: "div", class: "dieDiv"}, [
                rollResults.rerollVals[i] ? HTMLParts.rerollSpanDiv(rollResults.rerollVals[i], die.slice(1)) : false,
                getDieHTML(die)
            ]))
        ),
        resultDiv: (rollResults) => rollResults.diff
            ? HTML(
                {tag: "div", class: "simpleLineDiv"},
                [
                    HTML({tag: "span", class: "bigGoldSpan"}, "="),
                    HTML({tag: "span", class: "bigWhiteSpan"}, `${rollResults.total} Success${rollResults.total === 1 ? "" : "es"}`),
                    rollResults.diff
                        ? [
                            HTML({tag: "span", class: "goldSpan"}, "vs."),
                            HTML({tag: "span", class: "bigWhiteSpan"}, rollResults.diff)
                        ].join("")
                        : false
                ]
            )
            : "",
        outcomeDiv: (rollResults) => {
            const htmlParts = [];
            if (rollResults.initSuccs) {
                return HTML({tag: "div", class: ["headerDiv", "alignCenter", "shortLines"]}, `Joined with ${HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, rollResults.total)} Initiative!`);
            }
            if (rollResults.isBotch) {
                htmlParts.push(HTML({tag: "div", class: ["headerDiv", "alignCenter", "redBG"]}, HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, "BOTCH!")));
            } else if (rollResults.isSuccess) {
                htmlParts.push(HTML({tag: "div", class: ["headerDiv", "alignCenter", "shortLines"]}, [
                    rollResults.diff
                        ? HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, "Success!")
                        : HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, `${rollResults.total} Successes!`),
                    rollResults.diff
                        ? `<br>${HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, `${rollResults.margin}`)} Threshold Success${rollResults.margin === 1 ? "" : "es"}`
                        : false
                ]));
            } else {
                htmlParts.push(HTML({tag: "div", class: ["headerDiv", "alignCenter", "whiteText", "blackBG"]}, "Failure!"));
            }
            return htmlParts.join("");
        }
    };
    const displayRoll = (rollResults) => {
        Show(rollResults);
        if (rollResults.finalPool === 0) {
            Flag("Roller Error: Zero Dice Submitted.", {force: true, direct: true});
        } else {
            const innerHTML = [];
            const headerClasses = ["headerDiv", "alignCenter"];
            if (rollResults.isBotch) {
                headerClasses.push(...["redBG", "whiteText"]);
            } else if (!rollResults.isSuccess) {
                headerClasses.push(...["blackBG", "whiteText"]);
            }
            if (rollResults.message) {
                innerHTML.push(HTML({tag: "div", class: headerClasses}, rollResults.message));
            } else if (rollResults.initSuccs > 0) {
                innerHTML.push(HTML({tag: "div", class: headerClasses}, "Joining Battle"));
            }
            if (rollResults.pool === rollResults.finalPool) {
                innerHTML.push(HTML({tag: "div", class: "simpleLineDiv"}, HTML({tag: "span", class: "bigWhiteSpan"}, `Rolling ${getDiceCount(rollResults.pool, true)}:`)));
            } else {
                innerHTML.push(HTMLParts.dicePoolAssemblyDiv(rollResults));
            }
            innerHTML.push(HTMLParts.rollNotesDiv(rollResults));
            innerHTML.push(HTMLParts.diceLineDiv(rollResults));
            innerHTML.push(HTMLParts.resultDiv(rollResults));
            innerHTML.push(HTMLParts.outcomeDiv(rollResults));
            Direct(HTML(
                {tag: "div", class: "boxDiv"},
                [
                    rollResults.name
                        ? HTML({tag: "div", class: "nameDiv"}, `${rollResults.name}:`)
                        : false,
                    HTML({tag: "div", class: "blockDiv"}, innerHTML)
                ]
            ), {force: true, noarchive: false});
        }
    };

    // #endregion

    // #endregion

    // #endregion

    return {
        Initialize,
        PreloadImages: preloadImages
    };

})();

on("ready", () => DiceRoller.Initialize(true));
void MarkStop("DiceRoller");