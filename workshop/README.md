# AI Lab - InfAU Workshop

**A hands-on workshop for InfAU - 2 hours**

Build an interactive isovist web application using AI-assisted coding. No web development experience needed.

>  You can follow this guide self-paced from anywhere. If a file path doesn't resolve locally, grab the data files directly from GitHub: [workshop/data/weimar/](https://github.com/bauhaus-infau/ai-lab/tree/main/workshop/data/weimar)

---

## Part 0: Pre-workshop Setup

To hit the ground running, please complete these steps before we meet:

1. **Install VS Code** - [https://code.visualstudio.com/download](https://code.visualstudio.com/download) (for viewing and editing files)
2. **Install Node.js** (LTS version) - [https://nodejs.org/](https://nodejs.org/)
3. **Install Claude Code** - Open a terminal and run: `npm install -g @anthropic-ai/claude-code`
4. **Sign up for Claude** ($20/mo Pro or $100/mo Max) - [https://claude.ai/pricing](https://claude.ai/pricing)
5. **Create a GitHub account** (free) - [https://github.com/signup](https://github.com/signup)

That's it. We'll do the rest together. If you're joining remotely, continue to Part 1 — each step is self-contained.

---

## Part 1: Setup (20 min)

### Start Claude Code

```
1. Open a terminal (PowerShell, Command Prompt, or VS Code's built-in terminal)
2. cd to the folder where you want to create your project
3. Run: claude
4. Sign in with your Claude account when prompted
```

You'll see a `>` prompt — this is where you talk to Claude. It reads your files, writes code, and runs commands. You approve or reject each action.

### Set Up Playwright MCP (Optional)

This lets Claude see and interact with your browser — useful for debugging visual issues. Run this in a separate terminal (not inside Claude Code):

```
claude mcp add playwright npx @anthropic-ai/mcp-server-playwright
```

Then restart Claude Code (`/quit` and run `claude` again) to pick up the new MCP server.

### Create the Project + Build the Isovist App

This single prompt creates the project from scratch and builds the full isovist app. Copy the entire block into Claude Code:

> The full prompt is also available as a printable card in [`workshop/prompts/isovist-starter.md`](prompts/isovist-starter.md).

```
Create a new Vite + React + TypeScript project called isovist-app in this folder.
Install three, @types/three, @react-three/fiber, @react-three/drei, and Tailwind CSS.

Copy the GeoJSON files from ../ai-lab/workshop/data/weimar/ into the project's
public/ folder: weimar-buildings-3d.geojson and weimar-streets.geojson.
(If that path doesn't work, look for a nearby ai-lab folder or download them from
the GitHub repo: https://github.com/bauhaus-infau/ai-lab/tree/main/workshop/data/weimar)

Then build an isovist analysis app using React and Three.js (react-three-fiber).
Use the two GeoJSON files in the public/ folder:

- weimar-buildings-3d.geojson — 3D building geometry (faces with z-coordinates) plus "Height" property
- weimar-streets.geojson — street center lines with "length" property

IMPORTANT: The coordinates are from Rhino's local coordinate system (exported via Heron),
NOT real-world lat/lon. They are small decimal numbers near (0, 0). Do NOT use a map
library like Leaflet. Use Three.js and scale the coordinates so the scene is a reasonable
size (e.g., multiply by a large factor or normalize to fit a ~500-unit bounding box).

The app should have:
1. 3D buildings rendered from the GeoJSON faces (the geometry already includes z-coordinates
   for top and bottom edges — build meshes from these faces rather than extruding flat footprints)
2. Street network rendered as lines on the ground plane
3. OrbitControls for camera navigation (rotate, zoom, pan)
4. A ground plane underneath the buildings
5. An isovist visualization from a single viewpoint:
   - Cast rays from the viewpoint in all directions on the 2D ground plane
   - Stop each ray when it hits a building footprint (2D polygon edge) or reaches max radius
   - Draw the resulting isovist polygon as a semi-transparent colored shape on the ground
6. A draggable viewpoint marker (click on the ground to move it)
7. A radius slider (50–500 units) that controls the maximum isovist distance
8. Display the isovist area as a number on screen

Use a dark background, subtle grid on the ground plane, and professional styling.
Use Tailwind CSS for the UI controls.

Start the dev server when done.
```

Vite gives you a local dev server with **hot reload** — changes appear instantly in the browser without refreshing. This prompt will take a few minutes — Claude needs to create the project, install dependencies, and write all the code.

### Sanity Check

Once the dev server is running, open [http://localhost:5173](http://localhost:5173) in your browser. You should see:

- A 3D city model with extruded buildings
- Streets drawn on the ground
- A colored isovist polygon spreading from a viewpoint
- Ability to click to move the viewpoint
- A radius slider that changes the isovist size

**Don't worry if it's not perfect** — if buildings look flat, the isovist doesn't appear, or controls feel off, just describe the problem to Claude and ask it to fix it. Paste a screenshot or error message so Claude has full context.

---

## Part 2: Orientation (10 min)

**What Claude Code does:**

- Reads your files, writes code, runs commands
- You approve or reject each action
- Talk to it like a colleague: *"make the background darker"*, *"add a button that..."*

**Key tips:**

- **Be specific** about what you want
- **Iterate** - start simple, add features one by one
- **If something breaks**, just tell Claude *"this broke, fix it"*
- **Use `@filename`** to point Claude at specific files

---

## Part 2b: Power-Up Your Prompts (5 min)

These optional tips help Claude produce more polished results. Skim now, refer back later.

### A) Skills - Claude's Hidden Superpowers

Type a **slash command** before your prompt to activate a specialized mode:

```
/frontend-design

Create a dashboard that shows isovist analysis results with charts and a 3D view
```

The `/frontend-design` skill shifts Claude into a design-focused mode that produces **distinctive, production-grade UIs** instead of generic-looking ones. It's the single biggest quality upgrade you can use.

### B) Prompt Tricks That Make a Difference

Drop these phrases into any prompt to improve the output:

| Phrase                                      | What it does                               |
| ------------------------------------------- | ------------------------------------------ |
| `"use shadcn components"`                 | Polished UI components instead of raw HTML |
| `"use a dark theme with rounded corners"` | Cohesive, modern aesthetic                 |
| `"make it responsive"`                    | Works on mobile and desktop                |
| `"add smooth animations"`                 | Micro-interactions and transitions         |
| `"use Tailwind CSS for styling"`          | Utility-first, consistent design           |
| `"add loading states"`                    | Professional feel while data loads         |

**Describe the vibe you want** - *"minimal and clean"*, *"data-dense dashboard"*, *"playful and colorful"* all work.

**Use references** - *"make it look like the Stripe dashboard"* or paste a screenshot and say *"match this style"*.

---

## Part 3: Make It Your Own (75 min)

Your baseline isovist app is running from Part 1. Now the fun part — pick any extensions that interest you and ask Claude to add them. Here are ideas grouped by category:

**UI & Styling:**

- *"Add a dark sidebar that shows isovist statistics (area, perimeter, number of visible buildings)"*
- *"Use a gradient color for the isovist polygon based on distance from viewpoint"*
- *"Make the layout responsive with the controls in a collapsible panel"*
- *"Add a minimap in the corner showing a top-down 2D view"*

**Analysis & Data:**

- *"Color each building by whether it's visible from the viewpoint — orange if visible, gray if hidden"*
- *"Show a percentage: how many buildings are visible out of total"*
- *"Calculate and display the compactness ratio (area / perimeter²) of the isovist"*

**Interaction:**

- *"Let me right-click to place a second viewpoint and compare two isovists side by side"*
- *"Add an 'animate' button that moves the viewpoint along the nearest street"*
- *"Add a heatmap mode that shows visibility intensity across a grid of sample points"*

**Advanced:**

- *"Show how the isovist changes along a path — let me draw a path and animate the viewpoint along it"*
- *"Add a 3D isovist volume (extrude the 2D isovist polygon upward to the viewpoint height)"*
- *"Generate a visibility graph: connect all pairs of points that can see each other"*

Mix and match, or come up with your own ideas. The goal is to make something you find interesting.

---

## Part 4: Show & Tell (15 min)

Everyone shows their screen for 1–2 minutes. No slides needed - just show what you built and what surprised you.

---

## Part 5: Publish Your App (15 min)

Let's put your project online so you can share it with a link.

### Step 1: Create a GitHub Repository

Ask Claude:

```
Create a new GitHub repo called isovist-<your-name> under the bauhaus-infau
organization and push my code to it.
```

Claude will create the repo on GitHub and push your files. If it asks you to authenticate with `gh auth login`, follow the prompts.

### Step 2: Enable GitHub Pages

1. Go to your repo on GitHub: `https://github.com/bauhaus-infau/isovist-<your-name>`
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions**

### Step 3: Add a Deploy Workflow

Ask Claude:

```
Update vite.config.ts to set base: "./" so relative paths work on GitHub Pages.
Then create a GitHub Actions workflow that runs npm run build and deploys
the dist/ folder to GitHub Pages. Put it in .github/workflows/deploy.yml.
```

### Step 4: Push and Go Live

```
Commit and push all changes including the workflow file.
```

After the workflow runs (about 1 minute), your app will be live at:

**`https://bauhaus-infau.github.io/isovist-<your-name>/`**

---

## Going Further

Want to keep experimenting? Try feeding Claude your own data:

- **OpenStreetMap exports** via [Overpass API](https://overpass-turbo.eu/) - buildings, roads for any city
- **Open 3D city models** from CityGML repositories (Berlin, Helsinki, NYC all have open data)
- **NASA POWER API** for solar radiation data - free, no key needed
- **CSV datasets** from your own research - Claude can parse and visualize anything

See also: [`workshop/cheatsheet.md`](cheatsheet.md) for a Claude Code quick reference.
