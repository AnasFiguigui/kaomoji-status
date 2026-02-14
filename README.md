
# Kaomoji Status

> Fun, animated kaomojis in your VS Code status bar! (≧◡≦)

---

## Features

- Random kaomoji in the status bar
- Click to change the kaomoji (with animation)
- Set your own custom kaomojis in settings (overrides all)
- Choose a category: all, happy, angry, cute, nerdy
- Kaomojis auto-change every X minutes (configurable)
- Copy the current kaomoji using the command palette
- Settings update instantly—no reload needed
- On holidays (Christmas, Halloween, New Year, Valentine’s), special kaomojis appear automatically

---

## How to Make Changes

1. **Open VS Code Settings**
   - Press <kbd>Ctrl</kbd> + <kbd>,</kbd> (or <kbd>Cmd</kbd> + <kbd>,</kbd> on Mac)
2. **Search for "Kaomoji Status"**
3. **Edit your settings:**
   - **Custom Kaomojis:** Add your own list (array of kaomoji strings)
   - **Category:** Pick a theme (all, happy, angry, cute, nerdy)
   - **Interval:** Set how often the kaomoji changes (in minutes)
4. **Save**—changes apply instantly!

**Example for Custom Kaomojis:**
```json
[
  "(≧◡≦)",
  "(✿◠‿◠)",
  "(•‿•)",
  "(｡♥‿♥｡)"
]
```

---

## Commands

- **Change Kaomoji:** Click the status bar kaomoji or run `Kaomoji Status: Change Kaomoji` from the command palette
- **Copy Kaomoji:** Run `Kaomoji Status: Copy Kaomoji` from the command palette

---

## Example Settings

```json
{
  "kaomojiStatus.customKaomojis": ["(≧◡≦)", "(✿◠‿◠)"],
  "kaomojiStatus.interval": 10,
  "kaomojiStatus.category": "cute"
}
```

---

## Enjoy!

Thanks for using **Kaomoji Status**! Holiday kaomojis appear automatically on special days. (づ￣ 3￣)づ