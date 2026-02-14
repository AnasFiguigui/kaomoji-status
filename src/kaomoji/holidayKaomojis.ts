// Holiday kaomojis and logic

export function getHolidayKaomojis(): string[] {
    const now = new Date();
    const month = now.getMonth() + 1; // JS months are 0-based
    const day = now.getDate();

    // Christmas: Dec 24-26
    if (month === 12 && day >= 24 && day <= 26) {
        return [
            "🎄", "(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "(＾▽＾)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧🎄", "(⌒▽⌒)☆", "(ﾉ´ヮ)ﾉ*:･ﾟ✧", "(★^O^★)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧*｡🎄"
        ];
    }
    // Halloween: Oct 31
    if (month === 10 && day === 31) {
        return [
            "🎃", "(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "(¬‿¬)", "(ง •̀_•́)ง", "(ﾟДﾟ;)", "(ʘ‿ʘ)", "(ﾉ☉ヮ⚆)ﾉ ⊙▃⊙", "(ﾟдﾟ；)"
        ];
    }
    // New Year: Jan 1
    if (month === 1 && day === 1) {
        return [
            "🎆", "(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "(＾▽＾)", "(ﾉ´ヮ)ﾉ*:･ﾟ✧", "(★^O^★)", "(⌒▽⌒)☆", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧*｡🎆"
        ];
    }
    // Valentine's Day: Feb 14
    if (month === 2 && day === 14) {
        return [
            "(❤️ ω ❤️)", "(｡♥‿♥｡)", "(づ￣ 3￣)づ", "❤️❤️❤️", "( *^-^)ρ(*╯^╰)", "(｡♥‿♥｡)💌", "( ˘ ³˘)♥", "(♡°▽°♡)", "(｡･ω･｡)ﾉ♡"
        ];
    }
    // Not a holiday: fallback to celebratory kaomojis
    return ["(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"];
}

export function isFallbackHoliday(holidayList: string[]): boolean {
    // Fallback is always ["(*≧▽≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"]
    return (
        Array.isArray(holidayList) &&
        holidayList.length === 2 &&
        holidayList[0] === "(*≧▽≦)" &&
        holidayList[1] === "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"
    );
}
