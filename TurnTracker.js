void MarkStart("TurnTracker");
const TurnTracker = (() => {

    // #region *** *** FRONT *** ***
    const SCRIPTNAME = "TurnTracker";
    const STA = {get TE() { return C.RO.OT[SCRIPTNAME] }};
    const MAS = {get TER() { return C.RO.OT.MASTER }};

    const DEFAULTSTATE = { // Initial values for state storage.
        currentBattle: false,
        roundDividerString: "➖➖➖➖➖➖➖"
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
            on("change:attribute:initiative", handleAttrChange);
            on("change:campaign:turnorder", handleTurnChange);
            on("change:campaign:initiativepage", handleBattleToggle);
        }

        if (STA.TE.currentBattle) {
            Battle.InitCurrentBattle(STA.TE.currentBattle);
        }

        C.Flag(`... ${SCRIPTNAME}.js [TEST] Ready!`, {force: true, direct: true});
        log(`${SCRIPTNAME}.js [TEST] Ready!`);
    };

    const handleMessage = (msg) => {
        if (msg.content.startsWith("!ttp") || msg.content.startsWith("!tt") && playerIsGM(msg.playerid)) {
            let [call, ...args] = (msg.content.match(/!\S*|\s@"[^"]*"|\s@[^\s]*|\s"[^"]*"|\s[^\s]*/gu) || [])
                .map((x) => x.replace(/^\s*(@)?"?|"?"?\s*$/gu, "$1"))
                .filter((x) => Boolean(x));
            if (call === "!tt") {
                ({
                    reset: () => { Initialize(false, true) },
                    // setup: () => { setupTrackers() },
                    // clear: () => { clearTrackers() },
                    get: () => ({
                        turns: () => { C.ShowCampaign() },
                        state: () => { C.Show(STA.TE) }
                    }[(call = args.shift() || "").toLowerCase()] || (() => false))(),
                    set: () => ({
                    //     pos: () => { setImgPos(msg.selected, ...args) },
                    //     name: () => { setTurnName(...args) }
                    }[(call = args.shift() || "").toLowerCase()] || (() => false))()
                }[(call = args.shift() || "").toLowerCase()] || (() => false))();
            } else if (call === "!ttp") {
                ({
                    // set: () => ({
                    //     sorc: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "sorcerous", ...args) },
                    //     sorcbanked: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "sorcerousbanked", ...args) },
                    //     anima: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "anima", ...args) },
                    //     peripheral: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "peripheral", ...args) },
                    //     personal: () => { setTrackerAttr(C.GetPlayerChar(msg.playerid).id, "personal", ...args) }
                    // }[(call = args.shift() || "").toLowerCase()] || (() => false))()
                }[(call = args.shift() || "").toLowerCase()] || (() => false))();
            }
        }
    };

    const handleAttrChange = (attrObj, prevData) => {
        if (prevData.name === "initiative") {
            C.Show({attrObj, prevData}, "HandleAttrChange");
            const [attrName, charID] = [attrObj.get("name"), attrObj.get("_characterid")];
        } else {
            C.Flag("Should Never See This: HandleAttr on non-Initiative");
        }
    };

    const handleTurnChange = (cmpObj, prevData) => {
        // Changing Initiative Values in Turn Tracker
        // Changing Turn Order
        // Adding New Combatant (must ALWAYS serialize names to ensure they're unique!)
        // Removing Combatant
        const curTurnOrder = JSON.parse(cmpObj.get("turnorder") || "[]").map((x) => _.omit(x, "_pageid"));
        const prevTurnOrder = JSON.parse(prevData.turnorder || "[]").map((x) => _.omit(x, "_pageid"));
        const curCombatants = curTurnOrder.map((x) => JSON.stringify(x));
        const prevCombatants = prevTurnOrder.map((x) => JSON.stringify(x));
        // C.Show({curTurnOrder, prevTurnOrder});

        if (curTurnOrder.length > prevTurnOrder.length) { // Combatant Added
            // Filter out combatants already in list _sequentially_ so dupes aren't missed:
            const prevIndexCheck = prevCombatants.findIndex((prevCombatant) => prevCombatant === curCombatants[0]);
            // C.Show({curCombatants, prevCombatants, prevIndexCheck});
            for (let i = 0; i < curCombatants.length; i++) {
                const prevIndex = prevCombatants.findIndex((prevCombatant) => prevCombatant === curCombatants[i]);
                if (prevIndex >= 0) {
                    prevCombatants[prevIndex] = false;
                    curCombatants[i] = false;
                }
            }
            const addedCombatants = curCombatants.filter((x) => Boolean(x)).map((x) => JSON.parse(x));
            showTurnOrder(curTurnOrder, "Current Turn Order");
            C.Alert(addedCombatants.map((x) => x.custom || x.id).join(", "), "Combatant(s) ADDED:");
        } else if (curTurnOrder.length < prevTurnOrder.length) { // Combatant Removed
            // Filter out combatants already in list _sequentially_ so dupes aren't missed:
            const curCombatants = curTurnOrder.map((x) => JSON.stringify(x));
            const prevCombatants = prevTurnOrder.map((x) => JSON.stringify(x));
            for (let i = 0; i < prevCombatants.length; i++) {
                const curIndex = curCombatants.findIndex((curCombatant) => curCombatant === prevCombatants[i]);
                if (curIndex >= 0) {
                    curCombatants[curIndex] = false;
                    prevCombatants[i] = false;
                }
            }
            const removedCombatants = prevCombatants.filter((x) => Boolean(x)).map((x) => JSON.parse(x));
            showTurnOrder(curTurnOrder, "Current Turn Order");
            C.Alert(removedCombatants.map((x) => x.custom || x.id).join(", "), "Combatant(s) REMOVED:");
        } else if (curCombatants.join("|") !== prevCombatants.join("|")) {
            const diffCombatants = _.difference(curCombatants, prevCombatants);
            if (diffCombatants.length) { // Initiative Changed in Turn Tracker
                const deltaCombatantIndices = diffCombatants.map((x) => curCombatants.findIndex((xx) => xx === x));
                showTurnOrder(curTurnOrder, "Current Turn Order");
                C.Flag(`Initiative Changed at [${deltaCombatantIndices.join(", ")}]`);
            } else { // Turn Order Changed.
                if ([...prevCombatants.slice(1), prevCombatants[0]].join("|") === curCombatants.join("|")) { // Turn Advanced by One
                    showTurnOrder(curTurnOrder, "Turn Order ADVANCED");
                } else { // Ambiguous Turn Order Change
                    showTurnOrder(curTurnOrder, "Turn Order CHANGED");
                }
            }
        } else {
            C.Flag("Something Happened!");
            showTurnOrder(prevTurnOrder, "Previous");
            showTurnOrder(curTurnOrder, "Current");
        }
    };
    const handleBattleToggle = (cmpObj, prevData) => {
        if (Campaign().get("initiativepage")) {
            showCampaign(cmpObj, prevData, "HandleBattleToggle", "Battle toggled <u>ON</u>");
        } else {
            showCampaign(cmpObj, prevData, "HandleBattleToggle", "Battle toggled <u>OFF</u>");
        }
    };
    // #endregion

    // #region DEFINITIONS

    // #endregion

    // #region UTILITY
    let colorVal;
    const getTurnName = (turnObj) => {
        if (turnObj.id === "-1") {
            return turnObj.custom || false;
        }
        const tokenObj = getObj("graphic", turnObj.id);
        if (tokenObj) {
            return (getObj("character", tokenObj.get("represents")) || {get: () => false}).get("name");
        }
    };
    const parseTurn = (turnObj, isTextOnly = false) => {
        const name = getTurnName(turnObj);
        if (isTextOnly) {
            return `[${turnObj.pr}]: ${name} (${turnObj.id})`;
        } else {
            colorVal = colorVal || 220;
            colorVal -= 20;
            const bgColor = `rgb(${colorVal}, ${colorVal}, ${colorVal})`;
            return `<div style="display: block; height: 32px; background: ${bgColor}; line-height: 32px; font-family: sura; font-size: 20px;"><span style="display: inline-block;background: #aaa;font-weight: bold;padding: 0 3px;width: 20px;text-align: center;border-radius: 15px;border: 2px outset grey;height: 26px;line-height: 28px;" title=${turnObj.id}>${turnObj.pr}</span><span style="vertical-align:top;">${name || "Unknown Combatant"}</span></div>`;
        }
    };
    const showTurnOrder = (turnData, title = "Turn Order") => {
        colorVal = 220;
        C.Alert(turnData.map((turn) => parseTurn(turn)).join(""), title);
    };
    const showCampaign = (cmpObj = Campaign(), prev, title = "Campaign", message) => {
        const [cmpObjData, prevData] = [{}, {}];
        ["_type", "initiativepage", "playerpageid", "playerspecificpages"].forEach((key) => {
            cmpObjData[key] = cmpObj.get(key);
            if (prev) {
                prevData[key] = prev[key];
            }
        });
        ["turnorder"].forEach((key) => {
            cmpObjData[key] = JSON.parse(cmpObj.get(key) || "[]");
            if (prev) {
                prevData[key] = JSON.parse(prev[key]);
            }
        });
        cmpObjData.turnorder = cmpObjData.turnorder.map((turn) => parseTurn(turn, true));
        prevData.turnorder = prevData.turnorder.map((turn) => parseTurn(turn, true));
        const alertLines = [
            "<h3>Campaign Object</h3>",
            C.JC(cmpObjData)
        ];
        if (prev) {
            alertLines.push(...[
                "<h3>Prev Campaign Object</h3>",
                C.JC(prevData)
            ]);
        }
        if (message) {
            alertLines.push(`<h3>${message}</h3>`);
        }
        C.Alert(alertLines.join(""), title);
    };
    // #endregion
    // #endregion

    const TURNSYMBOLS = { // ✖♻❌📛🛑🚫⚡🔴🟠🟡🟢🔵🟣🟤⚫⚪
        waitingForTurn: "🟢",
        turnTaken: "",
        turnInterrupt: "⚡",
        delayedTurn: "🕓"
    };

    // #region *** *** CLASSES *** ***
    class Combatant {
        /* DATA STRUCTURES
         *
         * Turn Order Parsed from Campaign():
         *
         * {
         *   id: "-MbQtphI-HR5X9naDs4K",
         *   pr: "33",
         *   custom: "",
         *   _pageid: "-MaVKAqCGswBuzhXlfot"
         * }
         *
         * Turn Order Held in Turn Class:
         *
         * {
         *   id: "-MbQtphI-HR5X9naDs4K",
         *   pr: "33",
         *   custom: "",
         *   _pageid: "-MaVKAqCGswBuzhXlfot"
         * }
         *      */
        get cmpTurnEntry() { return {
            id: this._graphicID,
            pr: `${this.initiative}${this.stateSymbol}`,
            custom: this._custom,
            _pageid: this._pageid
        };};
        get id() { return this._charID || this._graphicID }
        get UID() { return `${this._charID}${this._graphicID}${this.custom}`}
        get index() { return Battle.TurnOrder.findIndex((turn) => ["id", "pr", "custom"].reduce((isValid, key) => isValid && turn[key] === this[key], true)) }
        get isChar() { return this.id !== "-1" }
        get name() { return this._name || (this.isChar ? (getObj("character", this.id) || {get: () => "Combatant"}).get("name") : this.custom) }
        get canTakeTurn() { return Boolean(this.stateSymbol) }

        get initiative() { return this._initiative || 0}
        set initiative(v) {
            const [initVal, stateSymbol] = v.match(/(\d+)?(\D+)?/u).slice(1, 3);
            this._initiative = parseInt(initVal) || 0;
            this._stateSymbol = stateSymbol || "";
            if (this.isChar) {
                setAttrs(this.id, {initiative: this._initiative});
            }
        }

        get stateSymbol() { return this._stateSymbol || "" }
        set stateSymbol(v) { this._stateSymbol = v }

        get nextTick() { return this._nextActionTick || this.initiative }
        set nextTick(v) {
            if (v === false) {
                delete this._nextActionTick;
            } else {
                this._nextActionTick = parseInt(v);
            }
        }

        constructor(cmpTurnData, battle) {
            this._graphicID = cmpTurnData.id;
            this._custom = cmpTurnData.custom;
            this._pageid = cmpTurnData._pageid;
            if (cmpTurnData.id === "-1") { // A custom turn entry.
                this._name = battle.SerializeName(cmpTurnData.custom);
            } else { // A character turn entry.
                const tokenObj = getObj("graphic", cmpTurnData.id);
                if (tokenObj) {
                    this._charID = tokenObj.get("represents");
                    this._name = battle.SerializeName(getObj("character", this._charID).get("name"));
                } else {
                    this._name = battle.SerializeName("Combatant");
                }

            }
            this.initiative = cmpTurnData.pr;
            battle.RegisterCombatant(this);
        }


    }
    class Battle {
        // #region STATIC Getters, Setters, Methods
        static InitCurrentBattle(battleData) {
            this._currentBattle = new Battle(battleData);

        }
        static get current() { return this._currentBattle }
        static get TurnOrder() { return JSON.parse(Campaign().get("turnorder") || "[]") }
        static set TurnOrder(turnOrder) { Campaign().set({turnorder: JSON.stringify(turnOrder)}) }

        constructor(battleData) {
            this._roundNumber = 0;
            this._processCombatants(battleData); // Initializes combatants from battleData, instantiates them as Combatant class (which registers them with the battle)
            this._applyTurnOrder();
        }
        // #endregion

        // #region GETTERS & SETTERS
        get names() { return this._combatants.map((combatant) => combatant.name) }

        // #endregion

        // #region PUBLIC Methods
        SerializeName(name) {
            if (/ #\d+/u.test(name)) { // Name already has a number: Check to make sure there are no dupes, but leave untouched.
                if (this.names.filter((name) => new RegExp(`^${name}$`).test(name)).length <= 1) {
                    return name;
                }
            }
            const nameNum = this.names.filter((name) => new RegExp(`^${name} ?#?\d*$`).test(name)).length + 1;
            if (nameNum > 1) {
                return `${name} #${nameNum}`;
            }
            return name;
        }
        RegisterCombatant(combatant) {
            this._combatants.push(combatant);
        }

        // #endregion

        // #region PRIVATE Methods
        _processCombatants(battleData) {
            this._combatants = [];
        }
        _applyTurnOrder() {
            this._combatants = this._combatants || [];
        }

        // #endregion

    }

    // #endregion

    // #region *** *** SETUP *** ***

    // #endregion

    // #region *** *** TURN ORDER CONTROL *** ***
    // #endregion

    // #region *** *** INITIATIVE & TURN CONTROL *** ***

    // #endregion
    return {Initialize};

})();

on("ready", () => TurnTracker.Initialize(true));
void MarkStop("TurnTracker");