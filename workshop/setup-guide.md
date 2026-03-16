# Complete these 6 steps before the workshop so we can jump straight into building.

**Time needed:** ~15 minutes

---

### Step 1: Install Git for Windows

Claude Code requires Git for Windows to run commands.

**Download:** [https://git-scm.com/downloads/win](https://git-scm.com/downloads/win)

Use the default settings during installation.

> **Verify:** Open PowerShell and run `git --version` — you see a version number.

---

### Step 2: Install VS Code

VS Code is a free code editor. We'll use it to view and edit the files that Claude creates for us.

**Download:** [https://code.visualstudio.com/download](https://code.visualstudio.com/download)

> **Verify:** You can open VS Code from your Start menu (Windows) or Applications folder (Mac).

---

### Step 3: Install Node.js

Node.js runs JavaScript outside the browser. We need it to create and run our web app.
Download the **LTS** (Long Term Support) version.

**Download:** [https://nodejs.org/](https://nodejs.org/)

After installing, open a terminal and run:

```
node --version
```

> **Verify:** You see a version number like `v22.x.x` (any recent version is fine).

---

### Step 4: Install Claude Code

Claude Code is the AI coding tool we'll use throughout the workshop. It runs in your terminal and writes code for you.

**Windows** — open PowerShell and run:

```powershell
irm <https://claude.ai/install.ps1> | iex
```

Then verify it installed:

```
claude --version
```

> **Verify:** You see a version number. Feel free to try it out

---

### Step 5: Sign Up for Claude

Claude Code requires a paid Claude account. You need either:

* **Pro** — $20/month (plenty for the workshop)
* **Max** — $100/month (more usage, not needed today)

**Sign up:** [https://claude.ai/pricing](https://claude.ai/pricing)

> ⚠️ Free accounts don't include Claude Code access. You need Pro or Max.

---

### Step 6: Create a GitHub Account

GitHub is where we'll publish your finished app so anyone can see it with a link. It's free.

**Sign up:** [https://github.com/signup](https://github.com/signup)

> **Verify:** You can log in at [github.com](http://github.com/) and see your profile.

### **All set!** That's everything. We'll do the rest together at the workshop.
