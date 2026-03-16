# Isovist App — Starter Prompt

Copy this entire prompt into Claude Code. It creates the project from scratch and builds the full app in one shot:

---

```
Create a new Vite + React + TypeScript project called isovist-app in this folder.
Install three, @types/three, @react-three/fiber, @react-three/drei, and Tailwind CSS.

Copy the GeoJSON files from ../ai-lab/workshop/data/weimar/ into the project's
public/ folder: weimar-buildings-3d.geojson and weimar-streets.geojson.
(If that path doesn't work, look for a nearby ai-lab folder or download them from
the GitHub repo: https://github.com/bauhaus-infau/ai-lab/tree/main/workshop/data/weimar)

Then build an isovist analysis app using React and Three.js (react-three-fiber).
Use the two GeoJSON files in the public/ folder:

- weimar-buildings-3d.geojson — 3D building geometry
- weimar-streets.geojson — street center lines with "length" property

IMPORTANT: The coordinates are from Rhino's local coordinate system (exported via Heron),
NOT real-world lat/lon.

The app should have:
1. 3D buildings rendered from the GeoJSON faces (the geometry already includes z-coordinates for top and bottom edges — build meshes from these faces rather than extruding flat footprints)
2. Street network rendered as lines on the ground plane
3. OrbitControls for camera navigation (rotate, zoom, pan)
4. A ground plane underneath the buildings
5. An isovist visualization from a single viewpoint:
   - Cast rays from the viewpoint in all directions on the 2D ground plane
   - Stop each ray when it hits a building footprint (2D polygon edge) or reaches max radius
   - Draw the resulting isovist polygon as a semi-transparent colored shape on the ground
6. A draggable viewpoint marker (click on the ground to move it)
7. A radius slider (50–200 units) that controls the maximum isovist distance
8. Display the isovist area as a number on screen

Use shadcn for the UI controls.

Start the dev server when done.
```

---

## Extension Ideas

Once the baseline is working, pick any of these and ask Claude to add them:

### UI & Styling

- *"Add a sidebar that shows isovist statistics (area, perimeter, number of visible buildings)"*
- *"Use a gradient color for the isovist polygon based on distance from viewpoint"*
- *"Make the layout responsive with the controls in a collapsible panel"*
- *"Add a minimap in the corner showing a top-down 2D view"*

### Analysis & Data

- *"Color each building by whether it's visible from the viewpoint — orange if visible, gray if hidden"*
- *"Show a percentage: how many buildings are visible out of total"*
- *"Calculate and display the compactness ratio (area / perimeter²) of the isovist"*

### Interaction

- *"Let me right-click to place a second viewpoint and compare two isovists side by side"*
- *"Add an 'animate' button that moves the viewpoint along the nearest street"*
- *"Add a heatmap mode that shows visibility intensity across a grid of sample points"*

### Advanced

- *"Show how the isovist changes along a path — let me draw a path and animate the viewpoint along it"*
- *"Add a 3D isovist volume (extrude the 2D isovist polygon upward to the viewpoint height)"*
- *"Generate a visibility graph: connect all pairs of points that can see each other"*
