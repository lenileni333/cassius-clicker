/* VARIABLES */
const audCount = document.getElementById("audCount");
const nzdLabel = document.querySelector(".nzdCount");
const nzdCount = document.getElementById("nzdCount");
const btcLabel = document.querySelector(".btcCount");
const btcCount = document.getElementById("btcCount");
const clicker = document.getElementById("clicker");
const wipeBtn = document.getElementById("confirmWipe");
const saveBtn = document.getElementById("saveBtn");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const audShopBtn = document.getElementById("audShopBtn");
const nzdShopBtn = document.getElementById("nzdShopBtn");
const btcShopBtn = document.getElementById("btcShopBtn");
const bgOST = document.getElementById("bgSong");

/* ARRAYS */
const UPGRADE_ARRAY = [ // this array contains all possible upgrades
    /* AUD UPGRADES */
    {id: "aussieSpirit", name: "Aussie Spirit", cost: 50, currency: "AUD", effect: () => {gameState.audMulti *= 2;}, shop: "audShop"},
    {id: "sausageSizzle", name: "Host a Sausage Sizzle", cost: 100, currency: "AUD", effect: () => {}, shop: "audShop"},
    {id: "didgeridoo", name: "Buy $ didgeridoo", cost: 200, currency: "AUD", effect: () => gameState.audMulti *= 4, shop: "audShop"},
    {id: "bunnings", name: "Buy Bunnings", cost: 1000, currency: "AUD", effect: () => gameState.audMulti *= 4, shop: "audShop"},
    {id: "annexNZ", name: "Annex NZ", cost: 10000, currency: "AUD", effect: () => { gameState.nzdMulti = 150; nzdLabel.hidden = false; nzdShopBtn.hidden = false; }, shop: "audShop"},
    {id: "rebootCard", name: "Irwin's Reboot Card", cost: 1000000, currency: "AUD", effect: () => {}, shop: "audShop"},
    /* NZD UPGRADES */
    {id: "raro", name: "Build raro factories", cost: 500, currency: "NZD", effect: () => {gameState.nzdMulti *= 2;}, shop: "nzdShop"},
    {id: "peterjackson", name: "Make a movie with Peter Jackson", cost: 1500, currency: "NZD", effect: () => {gameState.nzdMulti *= 2;}, shop: "nzdShop"},
    {id: "chocolate", name: "Own Whittakers", cost: 4444, currency: "NZD", effect: () => {gameState.nzdMulti *= 2;}, shop: "nzdShop"}, // originally bluey
    {id: "timezone", name: "Open a Timezone", cost: 7500, currency: "NZD", effect: () => {gameState.nzdMulti *= 2;}, shop: "nzdShop"}, 
    {id: "btcMiner", name: "Build BTC miners", cost: 15000, currency: "NZD", effect: () => {gameState.btcMulti = 1000; btcLabel.hidden = false; btcShopBtn.hidden = false;}, shop: "nzdShop"},
    /* BTC UPGRADES */
    {id: "chaos", name: "Partner with the Chaos Insurgency", cost: 20000, currency: "BTC", effect: () => {gameState.btcMulti *= 2;}, shop: "btcShop"},
    {id: "hitman", name: "Start a Hitman Business", cost: 50000, currency: "BTC", effect: () => {gameState.btcMulti *= 2;}, shop: "btcShop"},
    {id: "gear", name: "Tactical Gear", cost: 500000, currency: "BTC", effect: () => {}, shop: "btcShop"},
    {id: "insurgency", name: "Start a group", cost: 400000, currency: "BTC", requires: "gear", effect: () => {}, shop: "btcShop"}, // unfinished
];

const PLAYLIST = ["aussie.wav", "jiggleBalls.wav", "entersandman.wav"];
let currentSong = 0;

/* SAVE */
let gameState = { // this contains all the variables that are saved into localStorage.
    AUD: 0,
    NZD: 0,
    BTC: 0,
    audMulti: 1,
    nzdMulti: 0,
    btcMulti: 0,
    upgradesBought: {
        aussieSpirit: false,
        sausageSizzle: false,
        didgeridoo: false,
        bunnings: false,
        annexNZ: false,
        rebootCard: false,
        raro: false,
        peterjackson: false,
        chocolate: false,
        btcMiner: false,
        chaos: false,
        hitman: false,
        gear: false,
        insurgency: false
    }
};

function save() {
    localStorage.setItem("gameState", JSON.stringify(gameState)); // saves gameState to localStorage as a string
}

function load() {
    const savedState = localStorage.getItem("gameState"); // the save state from localStorage is retrieved & stored in a const variable
    if (savedState) {
        gameState = JSON.parse(savedState); // converts the string back ino an object and stores it in gameState
    }
    updateDisplay(); // add the loaded values on-screen
}

function updateDisplay() { // Single place that syncs gameState -> screen
    if (audCount) audCount.textContent = gameState.AUD;
    if (nzdCount) nzdCount.textContent = gameState.NZD;
    if (btcCount) btcCount.textContent = gameState.BTC;
};

function exportSave() {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const defName = `cassius-clicker-save-on-${dateStr}`;
    
    const chosName = prompt("What is the name or your save?:", defName);
    if (!chosName) return;

    const dataStr = JSON.stringify(gameState, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${chosName}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

function importSave(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);

            if (typeof imported.AUD !== "number" || !imported.upgradesBought) {
                alert("Bradar pak is this, this is not save file. Give JSON save file, stupid follower.");
                return;
            }

            gameState = imported;
            save();
            updateDisplay();
            alert("Imported successfully!");
            location.reload();
        } catch(err) {
            alert("Stupid follower, give me Sson Jex.");
        }
    };
    reader.readAsText(file);
}

/* NZD & BTC GENERATION */

const generation = setInterval(() => {

    if (gameState.upgradesBought.sausageSizzle === true) {
        gameState.AUD += gameState.audMulti;
    }
    gameState.NZD += gameState.nzdMulti;
    gameState.BTC += gameState.btcMulti;
    updateDisplay();
    save();
}, 1000);

/* OST */
function playTrack() {
    bgOST.src = PLAYLIST[currentSong];
    bgOST.play();
}

function nextTrack() {
    currentSong = (currentSong + 1) % PLAYLIST.length;
    playTrack();
}

if (bgOST) {
    bgOST.addEventListener("ended", nextTrack);
}

/* CLICKER */
load();

if (clicker && gameState.upgradesBought.aussieSpirit) {
    document.body.style.backgroundImage = "url('australia.svg')";
    document.querySelectorAll(".header, .shops, .ana").forEach(el => {
        el.classList.add("white-text");
    });
}

if (clicker && gameState.upgradesBought.annexNZ == true) {
    nzdLabel.hidden = false;
    nzdShopBtn.hidden = false;
}

if (clicker && gameState.upgradesBought.btcMiner == true) {
    btcLabel.hidden = false;
    btcShopBtn.hidden = false;
}


let musicStarted = false;

if (clicker) {
    clicker.addEventListener("click", () => {
        gameState.AUD += gameState.audMulti;
        updateDisplay();
        save();

        const clickSFX = document.getElementById("clickSFX");
        clickSFX.currentTime = 0;
        clickSFX.play();

        if (bgOST && gameState.upgradesBought.aussieSpirit && musicStarted == false) {
            musicStarted = true;
            playTrack();
        }
    });
}

/* WIPE DATA */
if (wipeBtn) {
    wipeBtn.addEventListener("click", () => {
        if (wipeBtn) {
            clearInterval(generation);
            localStorage.clear();
            location.reload();
        }
    });
};

/* SAVE BUTTONS */
if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        save();
        alert("Game saved!");
    });
};

if (exportBtn) {
    exportBtn.addEventListener("click", exportSave);
}

/* SHOP BUTTONS */
if (audShopBtn) {
    audShopBtn.addEventListener("click", ( ) => {
        window.location.href = "aud.html";
    });
};
if (nzdShopBtn) {
    nzdShopBtn.addEventListener("click", ( ) => {
        window.location.href = "nzd.html";
    });
};

if (btcShopBtn) {
    btcShopBtn.addEventListener("click", ( ) => {
        window.location.href = "btc.html";
    });
};


/* BUY MECHANIC */

function buyUpgrade(id) {
    const upgrade = UPGRADE_ARRAY.find(u => u.id === id);
    console.log("Trying to buy:", id, "cost:", upgrade.cost, "have:", gameState[upgrade.currency]);

    if (gameState.upgradesBought[id]) {
        return;
    }

    if (upgrade.requires && !gameState.upgradesBought[upgrade.requires]) {
        console.warn(`You need to buy "${upgrade.requires}" first.`);
        return;
    }

    if (gameState[upgrade.currency] >= upgrade.cost) {
        gameState[upgrade.currency] -= upgrade.cost;
        gameState.upgradesBought[id] = true;
        upgrade.effect();
        updateDisplay();
        save();
    }
};

document.querySelectorAll(".upgrade").forEach(upgrade => {
    const id = upgrade.id;
    const btn = upgrade.querySelector("button");
    if (btn) {
        if (gameState.upgradesBought[id]) {
            btn.textContent = "Bought";
            btn.disabled = true;
        }

        btn.addEventListener("click", () => {
            buyUpgrade(id);

            if (gameState.upgradesBought[id]) {
                btn.textContent = "Bought";
                btn.disabled = true;
            }
        });
    };
});

/* LOAD IMPORT JSON */
if (importInput) {
    importInput.addEventListener("change", importSave);
}

/* DEV TOOLS - DO NOT TOUCH */

function devBuyUpgrade(id) { // use dev tools using the console (F12)
    const upgrade = UPGRADE_ARRAY.find(u => u.id === id);
    if (!upgrade) {
        console.warn("This upgrade doesn't exist");
        return;
    }
    if (gameState.upgradesBought[id] == true) {
        console.warn("You already bought it");
        return;
    }

    gameState.upgradesBought[id] = true;
    upgrade.effect();
    console.log("Upgrade bought!")
    updateDisplay();
    save();
}

function devAddCurrency(currency, amount) { // use dev tools using the console (F12)
    if (!(currency in gameState)) {
        console.warn("This is an invalid currency.");
        return;
    }
    
    gameState[currency] += amount;
    updateDisplay();
    save();
}

function devUpgradeAll(shop) { // use dev tools using the console (F12)
    const upgrades = UPGRADE_ARRAY.filter(upgrade => upgrade.shop === shop);

    if (upgrades.length === 0) {
        console.warn("The shop doesn't exist");
        return;
    }
    upgrades.forEach(upgrade => {
        gameState.upgradesBought[upgrade.id] = true;
        upgrade.effect();
    });
    updateDisplay();
    save();
    console.log(`all upgrades in ${shop} have been bought!`);
}
