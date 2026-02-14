
# Kaomoji Status

> Bring a smile to your VS Code status bar with fun, animated kaomojis! (≧◡≦)

---

## ✨ Features

- Shows a random kaomoji in the status bar
- Click to change the kaomoji (with a cute animation)
- Set your own custom list of kaomojis in settings
- Choose a category/theme: all, happy, angry, cute, nerdy
- Kaomojis auto-change every X minutes (you choose the interval)
- Right-click or use the command palette to copy the current kaomoji to your clipboard
- Settings update live—no need to reload VS Code
- Manual changes show a random animation (spinner or pop)

---

## 🎨 How to Customize Your Kaomojis

1. **Open VS Code Settings**
   - Press <kbd>Ctrl</kbd> + <kbd>,</kbd> (or <kbd>Cmd</kbd> + <kbd>,</kbd> on Mac)
2. **Search for "Kaomoji Status"**
3. **Customize your experience:**
   - **Custom Kaomojis:** Add your own list (array of kaomoji strings)
   - **Category:** Pick a theme (all, happy, angry, cute, nerdy)
   - **Interval:** Set how often the kaomoji changes automatically (in minutes)
4. **Save your changes**—they take effect instantly!

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

## 🛠️ Commands Available

- **Change Kaomoji**: Click the status bar kaomoji or run `Kaomoji Status: Change Kaomoji` from the command palette
- **Copy Kaomoji**: Right-click the status bar kaomoji or run `Kaomoji Status: Copy Kaomoji` from the command palette

---

## 📝 Example Settings

```json
{
  "kaomojiStatus.customKaomojis": ["(≧◡≦)", "(✿◠‿◠)"],
  "kaomojiStatus.interval": 10,
  "kaomojiStatus.category": "cute"
}
```

---

## 💖 Enjoy!

Thanks for using **Kaomoji Status**! We hope it brightens your coding day. (｡♥‿♥｡)

Have fun and feel free to share your favorite kaomojis!