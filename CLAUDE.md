# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A hands-on workshop ("From Prompt to Web App") for Bauhaus InfAU staff. Participants use Claude Code (or OpenAI Codex CLI) to build an isovist web app during a 2-hour session. The default stack is **Vite + React + TypeScript** with react-three-fiber for 3D rendering and Tailwind CSS for styling. Everyone starts from the same baseline — a 3D Weimar city view with isovist visualization — then customizes and extends it. This repo contains the workshop guide, starter data, and a `results/` folder for the shared gallery.

**Target audience:** Non-developers without prior web experience. All prompts and instructions should be beginner-friendly.

## Repository Structure

- `workshop/README.md` - Main workshop guide (Parts 0–5), the primary file you'll edit
- `workshop/prompts/isovist-starter.md` - Starter prompt card and extension ideas
- `workshop/data/weimar/` - GeoJSON files (buildings, streets, plots) exported from Rhino via Heron plugin
- `workshop/cheatsheet.md` - Claude Code quick reference for participants
- `results/` - Participant projects, each in a subfolder (e.g., `results/alice/`). Deployed to GitHub Pages
- `results/index.html` - Auto-listing landing page (uses GitHub API, no maintenance needed)
- `.github/workflows/deploy-pages.yml` - Deploys `results/` to Pages on push to main

## Deployment

GitHub Pages serves `results/` at `https://bauhaus-infau.github.io/ai-lab/`. The workflow triggers only on changes to `results/**`. Repo settings must have Pages source set to "GitHub Actions".

## Data Notes

The Weimar GeoJSON files have coordinates near (0, 0) - not real-world lat/lon - because Heron exports from Rhino's local coordinate system. Projects using this data should use SVG/Canvas/Three.js rendering, not map libraries like Leaflet that expect geographic coordinates. In participant projects, GeoJSON files go in the `public/` folder so Vite serves them as static assets.

## Participant Publishing Flow

Participants create repos under the `bauhaus-infau` org with naming convention `isovist-<name>` (e.g., `bauhaus-infau/isovist-alice`), enable GitHub Pages, and deploy via a GitHub Actions workflow that runs `npm run build` and deploys the `dist/` folder. The Vite config must set `base: "./"` for GitHub Pages compatibility. Each participant's app lives at `https://bauhaus-infau.github.io/isovist-<name>/`. The shared `results/` gallery is optional — participants can also submit their work there via PR.
