# Claude Code - Quick Reference

## Giving Claude Context

| Action | How |
|--------|-----|
| Reference a file | Type `@filename` in your prompt |
| Reference a folder | Type `@foldername` to give Claude the full directory |
| Share an error | Copy-paste the error message into the chat |
| Share a screenshot | Drag and drop an image into the terminal, or paste with `Ctrl+V` |

## Useful Phrases

| When you want to... | Say... |
|----------------------|--------|
| Fix a bug | *"fix this"* / *"this broke, fix it"* |
| Improve design | *"make it look better"* / *"make it more professional"* |
| Add a feature | *"add a button that..."* / *"add a sidebar with..."* |
| Undo the last change | *"undo that"* / *"revert the last change"* |
| Understand code | *"explain what this does"* / *"walk me through this file"* |
| Get alternatives | *"try a different approach"* |
| Adjust styling | *"make the background darker"* / *"use a larger font"* |
| Add interactivity | *"when I click X, do Y"* / *"add hover effects"* |

## Skills (Slash Commands)

Type a slash command **before** your prompt to activate a specialized mode:

| Command | What it does |
|---------|-------------|
| `/frontend-design` | Activates design-focused mode for distinctive, production-grade UIs |

Just type the command, press Enter, then type your prompt as usual.

---

## When You're Stuck

1. **Tell Claude what went wrong:** *"I see a blank page instead of the map"*
2. **Ask Claude to explain:** *"explain what went wrong"*
3. **Ask for a different approach:** *"try a different approach"*
4. **Start fresh:** Type `/clear` for a new conversation (your files stay)

## Keyboard Shortcuts (Terminal)

| Shortcut | Action |
|----------|--------|
| `Escape` | Interrupt Claude / cancel current action |
| `Ctrl+C` | Exit Claude Code |
| `/clear` | Clear conversation and start fresh |
| `/quit` | Quit Claude Code |

## Remember

- **Start simple, iterate.** Get the basic version working before adding features.
- **One thing at a time.** Don't ask for 5 features in one prompt.
- **Read what Claude writes.** You'll learn web development along the way.
- **Approve or reject.** You're in control - Claude asks before changing files.
