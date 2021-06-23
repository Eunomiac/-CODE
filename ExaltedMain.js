void MarkStart("ExaltedMain");
const ExaltedMain = (() => {

    // #region *** *** FRONT *** ***
    const SCRIPTNAME = "ExaltedMain";
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
            on("add:character", (charObj) => initChar(charObj));
            // on("change:attribute:initiative", handleAttrChange);
            // on("change:campaign:turnorder", handleTurnChange);
            // on("change:campaign:initiativepage", handleInitToggle);
        }
        C.Flag(`... ${SCRIPTNAME} Ready!`);
        log(`${SCRIPTNAME} Ready!`);
    };

    const handleMessage = (msg) => {
        if ((msg.content.startsWith("!ex") || msg.content.startsWith("!etest")) && playerIsGM(msg.playerid)) {
            let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
                .map((x) => x.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1"))
                .filter((x) => Boolean(x));
            ({
                list: () => ({
                    images: () => C.Show(findObjs({_type: "graphic"}).map((obj) => `${obj.id}: ${obj.get("name")} at ${parseInt(obj.get("left"))}x, ${parseInt(obj.get("top"))}y`)),
                    repsecs: () => {
                        if (msg.selected && msg.selected.length) {
                            let charObj = C.GetChar(msg);
                            if (Array.isArray(charObj)) {
                                [charObj] = charObj;
                            }
                            if (charObj) {
                                C.Show(C.GetRepSecSummary(charObj, args[0]));
                            } else {
                                C.Flag("No Character Found.");
                            }
                        } else {
                            C.Flag("No Selection.");
                        }
                    },
                    repref: () => {
                        let charObj;
                        if (msg.selected && msg.selected.length) {
                            charObj = C.GetChar(msg);
                            if (Array.isArray(charObj)) {
                                [charObj] = charObj;
                            }
                        }
                        C.Alert(C.GetAttrNameByRef(args[0], args[1], charObj));
                    },
                    players: () => {
                        C.Show(findObjs({_type: "player"}).map((obj) => `<b>${obj.get("_displayname")}</b>: ${obj.id}, d20UserID: ${obj.get("_d20userid")} (${typeof obj.get("_d20userid")})`));
                    }
                }[(call = args.shift() || "").toLowerCase()] || (() => false))(),
                // !ex
                reset: () => {
                    const debugStatus = C.STA.TE.isShowingDebugMessages;
                    C.STA.TE.isShowingDebugMessages = true;
                    C.ResetState();
                    Initialize(false, true);
                    EssenceTracker.Initialize(false, true);
                    TurnTracker.Initialize(false, true);
                    resetPlayerCharacters();
                    EssenceTracker.Reset();
                    setTimeout(() => C.STA.TE.isShowingDebugMessages = debugStatus, 1000);
                },
                init: () => ({
                    chars: initializeChars,
                    char: () => { initChar(args.shift()) }
                }[(call = args.shift() || "").toLowerCase()] || (() => false))(),
                debug: () => {
                    C.STA.TE.isShowingDebugMessages = true;
                    C.Alert(`Debug Messages <b>${args[0] === "true" ? "ON" : "OFF"}</b>`, "Debug");
                    C.STA.TE.isShowingDebugMessages = args.shift() === "true";
                }
            }[(call = args.shift() || "").toLowerCase()] || (() => false))();
        }
    };
    // #endregion

    // #region DEFINITIONS
    const PLAYERCONFIG = {
        "-MavmPoKVIUExYbl63FS": {}, // Crimson Zenith Warrior
        "-MavmPq2v6Tec86-ce27": {}, // Kainen
        "-MavmPqHKDFBH6Jr7J5g": {}, // Lumi
        "-MavmPr-fS3zeBYqW6yC": {} //  The Wanderer
    };
    // #endregion
    // #endregion

    // #region *** SETUP & INITIALIZATION ***
    const resetPlayerCharacters = () => {
        MAS.TER.PCs = {};
        for (const [charID, charData] of Object.entries(PLAYERCONFIG)) {
            const exaltType = C.GetExaltType(charID);
            const caste = getAttrByName(charID, "caste").toLowerCase();
            const charObj = C.GetChar(charID);
            if (exaltType && caste && charObj) {
                MAS.TER.PCs[charID] = {
                    id: charID,
                    name: charObj.get("name"),
                    type: exaltType,
                    caste,
                    index: Object.keys(MAS.TER.PCs).length
                };
            }
        }
    };
    const initializeChars = () => findObjs({_type: "character"}).forEach((charObj) => initChar(charObj));
    const initChar = (charRef) => {
        const charObj = C.GetChar(charRef);
        const charAttrNames = findObjs({_type: "attribute", _characterid: charObj.id}).map((attr) => attr.get("name"));
        C.Show(charAttrNames);
        const deltaAttrs = {};
        for (const [attrName, defaultVal] of Object.entries(C.DEFAULTATTRS)) {
            if (attrName in charAttrNames) {
                continue;
            }
            deltaAttrs[attrName] = defaultVal;
        }
        if (!_.isEmpty(deltaAttrs)) {
            setAttrs(charObj.id, deltaAttrs);
        }
    };
    // #endregion

    return {Initialize};

})();

on("ready", () => ExaltedMain.Initialize(true));
void MarkStop("ExaltedMain");