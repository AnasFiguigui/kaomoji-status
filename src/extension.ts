import * as vscode from 'vscode';


let statusBarItem: vscode.StatusBarItem;
let interval: NodeJS.Timeout | undefined;
let isChanging = false; // Block spam clicks during manual change

const defaultKaomojis = [
    "ψ(｀∇´)ψ",
    "(。・ω・。)",
    "(ง •̀_•́)ง",
    "(づ｡◕‿‿◕｡)づ",
    "(¬‿¬)",
    "(☞ﾟヮﾟ)☞",
    "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
    "(╯°□°）╯︵ ┻━┻",
    "(•_•) ( •_•)>⌐■-■ (⌐■_■)",
    "(✿◠‿◠)",
    "(ʘ‿ʘ)",
    "(>_<)",
    "(^_^;)",
    "(o˘◡˘o)",
    "(~_^)",
    "(>ω<)",
    "(°ロ°)☝",
    "(¬_¬)",
    "(>o<)",
    "(^o^)",
    "(^_^)/",
    "(T_T)",
    "(^_^)v",
    "(>_<)o",
    "(￣(工)￣)",
    "(づ￣ 3￣)づ",
];

function getKaomojis(): string[] {
    const config = vscode.workspace.getConfiguration("kaomojiStatus");
    const custom = config.get<string[]>("customKaomojis", []);
    return (custom && custom.length > 0) ? custom : defaultKaomojis;
}

function getRandomKaomoji(): string {
    const kaomojis = getKaomojis();
    return kaomojis[Math.floor(Math.random() * kaomojis.length)];
}

// Auto-change without spinner
function changeKaomojiInstant() {
    statusBarItem.text = getRandomKaomoji();
}

// Start the interval for auto-changing kaomoji
function startInterval() {
    const config = vscode.workspace.getConfiguration("kaomojiStatus");
    const minutes = config.get<number>("interval", 10);

    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(() => {
        changeKaomojiInstant(); // instant change, no spinner
    }, minutes * 60 * 1000);
}

// Smooth change with spinner and click-block (manual click)
async function changeKaomojiSmooth() {
    if (isChanging) return; // Block spam clicks
    isChanging = true;

    // Show spinner for 300ms
    statusBarItem.text = "$(sync~spin)";
    statusBarItem.tooltip = "Changing...";

    await new Promise(resolve => setTimeout(resolve, 200));

    // Show new kaomoji
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

    // Listen for setting changes (live update interval and custom kaomojis)
    const configListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (
            e.affectsConfiguration("kaomojiStatus.interval") ||
            e.affectsConfiguration("kaomojiStatus.customKaomojis")
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