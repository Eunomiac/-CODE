void MarkStart("DiceRoller");
const DiceRoller = (() => {

    // #region *** *** FRONT *** ***
    const SCRIPTNAME = "DiceRoller";
    const STA = {get TE() { return C.RO.OT[SCRIPTNAME] }};
    const MAS = {get TER() { return C.RO.OT.MASTER }};

    const DEFAULTSTATE = { // Initial values for state storage.
    };

    // #region INITIALIZATION & EVENT HANDLERS
    const Initialize = (isRegisteringEventListeners = false, isResettingState = false) => { // Initialize State, Trackers, Event Listeners
        if (isResettingState) { C.RO.OT[SCRIPTNAME] = {} }

        // Initialize state storage with DEFAULTSTATE where needed.
        C.RO.OT[SCRIPTNAME] = C.RO.OT[SCRIPTNAME] || {};
        Object.entries(DEFAULTSTATE).filter(([key]) => !(key in STA.TE)).forEach(([key, defaultVal]) => { STA.TE[key] = defaultVal });

        // Register event handlers for chat commands and character sheet attribute changes.
        if (isRegisteringEventListeners) {
            on("chat:message", handleMessage);
        }
        C.Flag(`... ${SCRIPTNAME} Ready!`);
        log(`${SCRIPTNAME} Ready!`);
    };

    const handleMessage = (msg) => {
        if (/(^!rhelp|^!rset|^!roll|^!raw|^!init)/u.test(msg.content)) {
            let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
                .map((x) => x.trim())
                .filter((x) => Boolean(x));
            switch (call) {
                case "!rhelp": displayHelp(); break;
                case "!rset": {
                    switch (call = args.shift()) {
                        case "borat": {
                            if (args.includes("true")) {
                                STA.TE.isShowingBorat = true;
                                C.Flag("Success is Great!", true);
                            } else {
                                STA.TE.isShowingBorat = false;
                                C.Flag("Success is Just OK.", true);
                            }
                            break;
                        }
                        // no default
                    }
                    break;
                }
                case "!roll": displayRoll(resolveRoll(parseRollCommand(msg, args))); break; // Standard Roll:  !roll 7vs3 d10 r1 a3 "casts fireball!"
                case "!raw": {
                    args.unshift("d0");
                    displayRoll(resolveRoll(parseRollCommand(msg, args)));
                    break;
                }
                case "!init": {
                    args.unshift("i3");
                    displayRoll(resolveRoll(parseRollCommand(msg, args)));
                    break;
                }
                // no default
            }
        }
    };
    // #endregion
    // #endregion

    // #region IMAGE DEFINITIONS
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
    const BORAT = {
        get succ() { return _.sample([
            "https://thumbs.gfycat.com/HastyKeenHake-max-1mb.gif",
            "https://thumbs.gfycat.com/CourageousGlaringAffenpinscher-size_restricted.gif",
            "https://24.media.tumblr.com/tumblr_m67x5jOJh31r5u6eso1_400.gif",
            "https://media1.tenor.com/images/53226b8dfa8b251a042dc6de0a029219/tenor.gif",
            "https://media1.tenor.com/images/fe796d8cb87b85966df560d8772aef16/tenor.gif",
            "https://i.pinimg.com/originals/92/b7/88/92b788b44692b36e7cb671b4155bda96.gif",
            "https://thumbs.gfycat.com/ActualRigidAltiplanochinchillamouse-size_restricted.gif",
            "https://i.pinimg.com/originals/9b/65/fa/9b65fa0f1ba6fd4c696dd924f067d76e.gif"
        ]);},
        get fail() { return _.sample([
            "https://y.yarn.co/130804d7-a839-4789-9221-27aa3a35f138_text.gif",
            "https://thumbs.gfycat.com/HighlevelVeneratedEider-small.gif",
            "https://thumbs.gfycat.com/PoorDeliriousAfricanaugurbuzzard-size_restricted.gif",
            "https://img.broadwaybox.com/photo/image/giphy_1_4.gif",
            "https://media.giphy.com/media/NFGInnajctGvLKxXSY/giphy.gif",
            "https://i.gifer.com/9lvL.gif",
            "https://i.gifer.com/7P7G.gif",
            "https://media.giphy.com/media/O5xChSjqUIxsk/giphy.gif",
            "https://media.giphy.com/media/PkKr55wVrfVd78XeDb/giphy.gif"
        ]);}
    };
    // #endregion
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
        if (!name && msg.playerid in MAS.TER.Players) {
            const playerData = MAS.TER.Players[msg.playerid];
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
            const flags = args.filter((arg) => /^\w(X|\d)+$/u.test(arg)).map((val) => val.replace(/10/gu, "X"));
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
        C.Direct(C.HTML({tag: "div", class: "boxDiv"}, C.HTML({tag: "div", class: "blockDiv"}, [
            C.HTML({tag: "div", class: "headerDiv"}, "Euno's Exalted 3E Dice Roller"),
            C.HTML({tag: "div", class: ["simpleLineDiv", "shortLines"]}, [
                C.HTML({tag: "span", class: "bigGoldSpan"}, "Syntax"),
                C.HTML({tag: "div", class: "alignLeft"}, [
                    C.HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll &lt;<span style=\"color: gold;\">pool</span>&gt;[v&lt;<span style=\"color: gold;\">diff</span>&gt;] [<span style=\"color: gold;\">flags</span>] \"[<span style=\"color: gold;\">title</span>]\""),
                    C.HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!raw &lt;<span style=\"color: gold;\">pool</span>&gt;[v&lt;<span style=\"color: gold;\">diff</span>&gt;] [<span style=\"color: gold;\">flags</span>] \"[<span style=\"color: gold;\">title</span>]\""),
                    C.HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!init &lt;<span style=\"color: gold;\">pool</span>&gt; [<span style=\"color: gold;\">flags</span>]")
                ])
            ]),
            C.HTML({tag: "div", class: ["simpleLineDiv"]}, C.HTML({tag: "span", class: "bigGoldSpan"}, "Flags")),
            C.HTML({tag: "div", class: ["col2Div", "alignLeft", "shortLines"]}, [
                [C.HTML({tag: "span", class: "bigWhiteSpan"}, "s1"), C.HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Specialty")].join(""),
                [C.HTML({tag: "span", class: "bigWhiteSpan"}, "w1"), C.HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Willpower")].join(""),
                [C.HTML({tag: "span", class: "bigWhiteSpan"}, "d#"), C.HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Double-#'s")].join(""),
                [C.HTML({tag: "span", class: "bigWhiteSpan"}, "r###"), C.HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Reroll #'s")].join("")
            ].join("<br>")),
            C.HTML({tag: "div", class: ["col2Div", "alignLeft", "shortLines"]}, [
                [C.HTML({tag: "span", class: "bigWhiteSpan"}, "S#"), C.HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Stunt Tier")].join(""),
                [C.HTML({tag: "span", class: "bigWhiteSpan"}, "a#"), C.HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Auto-Succ's")].join(""),
                [C.HTML({tag: "span", class: "bigWhiteSpan"}, "t#"), C.HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Target #")].join(""),
                [C.HTML({tag: "span", class: "bigWhiteSpan"}, "b###"), C.HTML({tag: "span", class: ["smallGoldSpan", "alignLeft"]}, "Botch #'s")].join("")
            ].join("<br>")),
            C.HTML({tag: "div", class: ["simpleLineDiv", "shortLines"]}, C.HTML({tag: "span", class: "bigGoldSpan"}, "Examples")),
            C.HTML({tag: "div", class: "alignLeft"}, [
                [C.HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3"), C.HTML({tag: "span", class: "smallGoldSpan"}, "\"Simple roll of 3 dice\"")].join(""),
                [C.HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3v4"), C.HTML({tag: "span", class: "smallGoldSpan"}, "\"Roll 3 dice vs. difficulty 4\"")].join(""),
                [C.HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3v4 w1 s1"), C.HTML({tag: "span", class: "smallGoldSpan"}, "\"Specialty & Spending WP\"")].join(""),
                [C.HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3 r123 a3"), C.HTML({tag: "span", class: "smallGoldSpan"}, "\"Reroll 1s, 2s & 3s, Add 3 Succs\"")].join(""),
                [C.HTML({tag: "span", class: ["goldSpan", "whiteText", "alignLeft", "futuraFont"]}, "!roll 3 b25"), C.HTML({tag: "span", class: "smallGoldSpan"}, "\"Flag 2's & 5's as Botches\"")].join("")
            ].join("<br>"))
        ])));
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
        const rollResults = {
            name: name ? name : false,
            message: message ? message : false,
            pool
        };
        diff = diff || 0;
        const rerollNums = (flags.find((flag) => /^r(\d|X)+/u.test(flag)) || "").slice(1).split("").map((num) => parseInt(num.replace(/X/gu, "10")));
        const botchNums = (flags.find((flag) => /^b(\d|X)+/u.test(flag)) || "b1").slice(1).split("").map((num) => parseInt(num.replace(/X/gu, "10")));
        const targetNum = parseInt((flags.find((flag) => /^t(\d|X)+/u.test(flag)) || "t7").replace(/X/gu, "10").slice(1));
        const autoSuccs = parseInt((flags.find((flag) => /^a\d+/u.test(flag)) || "a0").slice(1));
        const doublesNum = parseInt((flags.find((flag) => /^d(\d|X)+/u.test(flag)) || "dX").replace(/X/gu, "10").replace(/d0/u, "d11").slice(1));
        const specVal = parseInt((flags.find((flag) => /^s\d+/u.test(flag)) || "s0").slice(1));
        const stuntVal = parseInt((flags.find((flag) => /^S\d+/u.test(flag)) || "S0").slice(1));
        const initSuccs = parseInt((flags.find((flag) => /^i\d+/u.test(flag)) || "i0").slice(1));
        const wpSuccs = parseInt((flags.find((flag) => /^w\d+/u.test(flag)) || "w0").slice(1));
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
                return C.HTML(DICE[dieType][parseInt(dieNum)]);
            } else {
                return C.HTML(DICE.special[diceVal]);
            }
        } catch (err) {
            C.Alert(`Error processing diceVal <b>${diceVal}</b>`);
            return false;
        }
    };
    const HTMLParts = {
        nameDiv: (rollResults) => C.HTML({tag: "div", class: "nameDiv"}, rollResults.name),
        dicePoolAssemblyDiv: (rollResults) => [
            C.HTML(
                {tag: "div", class: "dicePoolAssemblyDiv"},
                [
                    C.HTML(
                        {tag: "div", class: ["col2Div", "alignRight"]},
                        [
                            C.HTML({tag: "span", class: "bigWhiteSpan"}, "Rolling "),
                            C.HTML({tag: "div", class: "bigGoldSpan", title: `Player submitted a roll of ${getDiceCount(rollResults.pool)}`}, `${rollResults.pool}`)
                        ]
                    ),
                    C.HTML(
                        {tag: "div", class: ["col2Div", "alignLeft"]},
                        [
                            rollResults.usedSpec
                                ? C.HTML({tag: "div", class: "dicePoolAddedFlagDiv", title: "+1 die from applied Specialty."}, [
                                    C.HTML({tag: "span", class: "medGoldSpan"}, "+1"),
                                    C.HTML({tag: "span", class: "goldSpan"}, "Specialty")
                                ])
                                : false,
                            rollResults.stuntTier > 0
                                ? C.HTML({tag: "div", class: "dicePoolAddedFlagDiv", title: `+${getDiceCount(rollResults.stuntDice)} from Tier ${"I".repeat(rollResults.stuntTier)} Stunt.`}, [
                                    C.HTML({tag: "span", class: "medGoldSpan"}, `+${rollResults.stuntDice}`),
                                    C.HTML({tag: "span", class: "goldSpan"}, `Tier ${"I".repeat(rollResults.stuntTier)} Stunt.`)
                                ])
                                : false
                        ]
                    )
                ]
            ),
            C.HTML({tag: "div", class: "simpleLineDiv"}, [
                C.HTML({tag: "div", class: "col2Div"}, "&nbsp;"),
                C.HTML(
                    {tag: "div", class: ["col2Div", "alignLeft"]},
                    C.HTML({tag: "span", class: "bigWhiteSpan", title: [
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
                return C.HTML(
                    {tag: "div", class: "rollNotesDiv"},
                    rollNotes.map(([title, span]) => C.HTML({tag: "span", class: "smallGoldSpan", title}, span))
                );
            }
            return false;
        },
        rerollSpanDiv: (rerollNums, finalRoll) => C.HTML(
            {tag: "span", class: "dieRerollSpan", title: `Rerolled ${rerollNums.join(", ")} ▸ ${finalRoll}`},
            rerollNums.map((num) => `${num}${C.HTML({tag: "span", class: "arrowSpan"}, "▸")}`)
        ),
        diceLineDiv: (rollResults) => C.HTML(
            {tag: "div", class: "diceLineDiv"},
            rollResults.diceTypes.map((die, i) => C.HTML({tag: "div", class: "dieDiv"}, [
                rollResults.rerollVals[i] ? HTMLParts.rerollSpanDiv(rollResults.rerollVals[i], die.slice(1)) : false,
                getDieHTML(die)
            ]))
        ),
        resultDiv: (rollResults) => rollResults.diff
            ? C.HTML(
                {tag: "div", class: "simpleLineDiv"},
                [
                    C.HTML({tag: "span", class: "bigGoldSpan"}, "="),
                    C.HTML({tag: "span", class: "bigWhiteSpan"}, `${rollResults.total} Success${rollResults.total === 1 ? "" : "es"}`),
                    rollResults.diff
                        ? [
                            C.HTML({tag: "span", class: "goldSpan"}, "vs."),
                            C.HTML({tag: "span", class: "bigWhiteSpan"}, rollResults.diff)
                        ].join("")
                        : false
                ]
            )
            : "",
        outcomeDiv: (rollResults) => {
            const htmlParts = [];
            if (rollResults.initSuccs) {
                return C.HTML({tag: "div", class: ["headerDiv", "alignCenter", "shortLines"]}, `Joined with ${C.HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, rollResults.total)} Initiative!`);
            }
            if (rollResults.isBotch) {
                htmlParts.push(C.HTML({tag: "div", class: ["headerDiv", "alignCenter", "redBG"]}, C.HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, "BOTCH!")));
            } else if (rollResults.isSuccess) {
                htmlParts.push(C.HTML({tag: "div", class: ["headerDiv", "alignCenter", "shortLines"]}, [
                    rollResults.diff
                        ? C.HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, "Success!")
                        : C.HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, `${rollResults.total} Successes!`),
                    rollResults.diff
                        ? `<br>${C.HTML({tag: "span", class: ["bigWhiteSpan", "addTextShadow"]}, `${rollResults.margin}`)} Threshold Success${rollResults.margin === 1 ? "" : "es"}`
                        : false
                ]));
            } else {
                htmlParts.push(C.HTML({tag: "div", class: ["headerDiv", "alignCenter", "whiteText", "blackBG"]}, "Failure!"));
            }
            if (STA.TE.isShowingBorat) {
                if (rollResults.isBotch) {
                    htmlParts.push(HTMLParts.boratFailure());
                } else if (rollResults.isSuccess) {
                    if (rollResults.margin >= 7) {
                        htmlParts.push(HTMLParts.boratSuccess());
                    }
                } else if (rollResults.margin <= -4) {
                    htmlParts.push(HTMLParts.boratFailure());
                }
            }
            return htmlParts.join("");
        },
        boratSuccess: () => C.HTML({tag: "img", class: "boratImg", src: BORAT.succ, title: "GREAT SUCCESS!"}),
        boratFailure: () => C.HTML({tag: "img", class: "boratImg", src: BORAT.fail, title: "What? You joke?"})
    };
    const displayRoll = (rollResults) => {
        C.Show(rollResults);
        if (rollResults.finalPool === 0) {
            C.Flag("Roller Error: Zero Dice Submitted.", true);
        } else {
            const innerHTML = [];
            const headerClasses = ["headerDiv", "alignCenter"];
            if (rollResults.isBotch) {
                headerClasses.push(...["redBG", "whiteText"]);
            } else if (!rollResults.isSuccess) {
                headerClasses.push(...["blackBG", "whiteText"]);
            }
            if (rollResults.message) {
                innerHTML.push(C.HTML({tag: "div", class: headerClasses}, rollResults.message));
            } else if (rollResults.initSuccs > 0) {
                innerHTML.push(C.HTML({tag: "div", class: headerClasses}, "Joining Battle"));
            }
            if (rollResults.pool === rollResults.finalPool) {
                innerHTML.push(C.HTML({tag: "div", class: "simpleLineDiv"}, C.HTML({tag: "span", class: "bigWhiteSpan"}, `Rolling ${getDiceCount(rollResults.pool, true)}:`)));
            } else {
                innerHTML.push(HTMLParts.dicePoolAssemblyDiv(rollResults));
            }
            innerHTML.push(HTMLParts.rollNotesDiv(rollResults));
            innerHTML.push(HTMLParts.diceLineDiv(rollResults));
            innerHTML.push(HTMLParts.resultDiv(rollResults));
            innerHTML.push(HTMLParts.outcomeDiv(rollResults));
            C.Direct(C.HTML(
                {tag: "div", class: "boxDiv"},
                [
                    rollResults.name
                        ? C.HTML({tag: "div", class: "nameDiv"}, `${rollResults.name}:`)
                        : false,
                    C.HTML({tag: "div", class: "blockDiv"}, innerHTML)
                ]
            ));
        }
    };

    // #endregion

    const runMsg = (content) => {
        const [call, ...args] = (content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
            .map((x) => x.trim())
            .filter((x) => Boolean(x));
        console.log();
    };
    [
        "!roll 7vs3 d10 r1 a3 \"casts fireball!\"",
        "!roll 17vs3 d5 t8 a4 r1 r2 \"casts fireball!\""
    ].forEach((content) => runMsg(content));


    // #endregion

    // #endregion

    return {Initialize};

})();

on("ready", () => DiceRoller.Initialize(true));
void MarkStop("DiceRoller");