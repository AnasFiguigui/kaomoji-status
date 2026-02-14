
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;
let interval: NodeJS.Timeout | undefined;
let isChanging = false; // Prevents rapid manual clicks

const defaultKaomojis: string[] = [
    "ψ(｀∇´)ψ", "(。・ω・。)", "(ง •̀_•́)ง", "(づ｡◕‿‿◕｡)づ",
    "(¬‿¬)", "(☞ﾟヮﾟ)☞", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "(╯°□°）╯︵ ┻━┻",
    "(•_•) ( •_•)>⌐■-■ (⌐■_■)", "(✿◠‿◠)", "(ʘ‿ʘ)", "(>_<)",
    "(^_^;)", "(o˘◡˘o)", "(~_^)", "(>ω<)", "(°ロ°)☝", "(¬_¬)",
    "(>o<)", "(^o^)", "(^_^)/", "(T_T)", "(^_^)v", "(>_<)o",
    "(￣(工)￣)", "(づ￣ 3￣)づ"
];

const kaomojiCategories: Record<string, string[]> = {
    happy: [
        "(≧◡≦)", "(✿◠‿◠)", "(^_^)/", "(^_^)v", "(o˘◡˘o)", "(^o^)", "(•‿•)"
    ],
    angry: [
        "(╯°□°）╯︵ ┻━┻", "ψ(｀∇´)ψ", "(¬_¬)", "(>_<)o", "(>o<)", "(ง •̀_•́)ง"
    ],
    cute: [
        "(｡♥‿♥｡)", "(づ｡◕‿‿◕｡)づ", "(づ￣ 3￣)づ", "(。・ω・。)", "(~_^)"
    ],
    nerdy: [
        "(•_•) ( •_•)>⌐■-■ (⌐■_■)", "(ʘ‿ʘ)", "(☞ﾟヮﾟ)☞"
    ],
    all: [] // Will be filled with all kaomojis below
};

// Fill 'all' with all unique kaomojis from categories and default
kaomojiCategories.all = Array.from(new Set(
    Object.values(kaomojiCategories).flat().concat(defaultKaomojis)
));

/**
 * Returns kaomojis for the current holiday, or a fallback if not a holiday.
 */
function getHolidayKaomojis(): string[] {
    const now = new Date();
    const month = now.getMonth() + 1; // JS months are 0-based
    const day = now.getDate();

    // Christmas: Dec 24-26
    if (month === 12 && day >= 24 && day <= 26) {
        return ["🎄", "(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"];
    }
    // Halloween: Oct 31
    if (month === 10 && day === 31) {
        return ["🎃", "(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"];
    }
    // New Year: Jan 1
    if (month === 1 && day === 1) {
        return ["🎆", "(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"];
    }
    // Valentine's Day: Feb 14
    if (month === 2 && day === 14) {
        return ["(❤️ ω ❤️)", "(｡♥‿♥｡)", "(づ￣ 3￣)づ", "❤️❤️❤️", "( *^-^)ρ(*╯^╰)"];
    }
    // Not a holiday: fallback to celebratory kaomojis
    return ["(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"];
}

/**
 * Returns the list of kaomojis to use, based on user settings.
 * Custom list always overrides category.
 * On holidays, the holiday kaomojis override the default (all) category automatically.
 */
function getKaomojis(): string[] {
    const config = vscode.workspace.getConfiguration("kaomojiStatus");
    const custom = config.get<string[]>("customKaomojis", []);
    if (Array.isArray(custom) && custom.length > 0) {
        return custom;
    }
    const category = config.get<string>("category", "all");
    // If user explicitly selects holiday, always use holiday kaomojis
    if (category === "holiday") {
        return getHolidayKaomojis();
    }
    // If user selects 'all', but today is a holiday, override with holiday kaomojis
    if (category === "all") {
        const holiday = getHolidayKaomojis();
        // If not fallback (i.e., it's a real holiday), use it
        if (!isFallbackHoliday(holiday)) {
            return holiday;
        }
    }
    return kaomojiCategories[category] || kaomojiCategories.all;
}

/**
 * Checks if the returned holiday kaomojis are just the fallback (not a real holiday).
 */
function isFallbackHoliday(holidayList: string[]): boolean {
    // Fallback is always ["(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"]
    return (
        Array.isArray(holidayList) &&
        holidayList.length === 2 &&
        holidayList[0] === "(*≧▽≦)" &&
        holidayList[1] === "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"
    );
}

/**
 * Picks a random kaomoji from the current list.
 */
function getRandomKaomoji(): string {
    const kaomojis = getKaomojis();
    if (kaomojis.length === 0) {
        return "(・_・;)"; // fallback if empty
    }
    return kaomojis[Math.floor(Math.random() * kaomojis.length)];
}


/**
 * Instantly change the status bar kaomoji (no animation).
 */
function changeKaomojiInstant() {
    statusBarItem.text = getRandomKaomoji();
}

/**
 * Starts or restarts the auto-change interval for kaomojis.
 */
function startInterval() {
    const config = vscode.workspace.getConfiguration("kaomojiStatus");
    const minutes = config.get<number>("interval", 10);
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => {
        changeKaomojiInstant();
    }, Math.max(1, minutes) * 60 * 1000); // Prevents 0 or negative intervals
}

/**
 * Smoothly change the kaomoji with a spinner animation (manual click).
 */
async function changeKaomojiSmooth() {
    if (isChanging) return;
    isChanging = true;
    statusBarItem.text = "$(sync~spin)";
    statusBarItem.tooltip = "Changing...";
    await new Promise(resolve => setTimeout(resolve, 200));
    statusBarItem.text = getRandomKaomoji();
    statusBarItem.tooltip = "Click to change kaomoji";
    isChanging = false;
}


export function activate(context: vscode.ExtensionContext) {
    // Create status bar item on LEFT, end of left section
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        -9999
    );
    statusBarItem.text = getRandomKaomoji();
    statusBarItem.tooltip = "Click to change kaomoji";
    statusBarItem.command = "kaomojiStatus.change";
    statusBarItem.show();

    // Start auto-change interval
    startInterval();

    // Command: change manually with smooth spinner
    const changeCommand = vscode.commands.registerCommand(
        "kaomojiStatus.change",
        () => {
            changeKaomojiSmooth();
        }
    );

    // Listen for setting changes (live update interval, custom list, and category)
    const configListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (
            e.affectsConfiguration("kaomojiStatus.interval") ||
            e.affectsConfiguration("kaomojiStatus.customKaomojis") ||
            e.affectsConfiguration("kaomojiStatus.category")
        ) {
            startInterval();
            changeKaomojiInstant();
        }
    });

    context.subscriptions.push(
        statusBarItem,
        changeCommand,
        configListener
    );
}


export function deactivate() {
    if (interval) {
        clearInterval(interval);
    }
}