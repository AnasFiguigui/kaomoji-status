

import * as vscode from 'vscode';
import { kaomojiCategories } from './kaomoji/kaomojiData';
import { getHolidayKaomojis, isFallbackHoliday } from './kaomoji/holidayKaomojis';

let statusBarItem: vscode.StatusBarItem;
let interval: NodeJS.Timeout | undefined;
let isChanging = false; // Prevents rapid manual clicks


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
 * Instantly change the kaomoji (manual click, no spinner), never repeats the current kaomoji.
 */
function changeKaomojiSmooth() {
    if (isChanging) {
        return;
    }
    isChanging = true;
    const current = statusBarItem.text;
    let next = getRandomKaomoji();
    // If more than 1 kaomoji, avoid repeating the current one
    const kaomojis = getKaomojis();
    if (kaomojis.length > 1) {
        let tries = 0;
        while (next === current && tries < 10) {
            next = getRandomKaomoji();
            tries++;
        }
    }
    statusBarItem.text = next;
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