# Skill: Docsify Math (KaTeX) and Diagram (Mermaid) Rendering

## Description
This skill documents the necessary configurations, dependencies, and markdown writing best practices to successfully render complex LaTeX mathematical formulas (matrices, calculus, etc.) and Mermaid diagrams in a Docsify project. 

## 1. HTML Configuration (index.html) Loading Order

**CRITICAL ISSUE**: When deploying to remote hosts like GitHub Pages, network latency can cause severe race conditions if script loading order is not carefully managed. 

To properly render KaTeX and Mermaid, the `index.html` must include specific dependencies **in a strict order**. 

### KaTeX Dependencies
`docsify-katex` overrides the built-in markdown compiler. Therefore, it **MUST be loaded BEFORE `docsify.js`**. If loaded after, Docsify will have already compiled the markdown on the first load using its default parser, breaking the LaTeX on GitHub Pages.

```html
<!-- 1. KaTeX Styles & Engine -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css" />
<script src="//cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.js"></script>

<!-- 2. marked@4 is required for docsify-katex to parse multiline blocks correctly -->
<script src="//cdn.jsdelivr.net/npm/marked@4"></script>

<!-- 3. Docsify KaTeX Plugin (BEFORE docsify.js) -->
<script src="//cdn.jsdelivr.net/npm/docsify-katex@latest/dist/docsify-katex.js"></script>

<!-- 4. Core Docsify loaded LAST -->
<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
```

### Mermaid Dependencies
`docsify-mermaid@2` calls `mermaid.run()`, which only exists in Mermaid v10+. Mermaid v9 throws `mermaid.run is not a function` and diagrams do not render.

Mermaid v10 still ships a classic (non-ESM) build at `dist/mermaid.min.js`. Load it synchronously with a pinned version so it is ready before the plugin runs:

```html
<!-- 1. Load Mermaid v10 classic build synchronously -->
<script src="//cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({ startOnLoad: false });
</script>

<!-- 2. Docsify Core -->
<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>

<!-- 3. Load docsify-mermaid plugin AFTER Docsify -->
<script src="//unpkg.com/docsify-mermaid@2.0.1/dist/docsify-mermaid.js"></script>
```

### Hosting Fallback (Sidebar / Navbar)
The site host returns `index.html` with HTTP 200 for any missing file. Docsify treats that as valid content, so a missing `ch01/_sidebar.md` or `_navbar.md` gets the whole `index.html` (including `<div id="app">加载中...</div>`) rendered into the page. Keep these settings in `index.html`:

```js
loadSidebar: true,
alias: { '/.*/_sidebar.md': '/_sidebar.md' }, // all pages use the root sidebar
// no loadNavbar: the project has no _navbar.md
```

## 2. Markdown Writing Rules

### LaTeX Math (KaTeX)

1. **Matrix and Line Breaks (The 4-Slash Rule)**: 
   Standard Markdown parsers often consume backslashes for text escaping. When writing matrices or multi-line equations, you MUST use four backslashes `\\\\` instead of two `\\` for line breaks.
   
   **Correct (renders perfectly):**
   ```markdown
   $$
   \begin{bmatrix} a & b \\\\ c & d \end{bmatrix}
   $$
   ```
   
   **Incorrect (will collapse into a single line):**
   ```markdown
   $$
   \begin{bmatrix} a & b \\ c & d \end{bmatrix}
   $$
   ```

2. **Inline vs Block Formulas**:
   - **Inline Formulas**: Use single dollar signs and keep them on the same line as the text. Example: `Alignment: $e_{i,j} = \frac{q_j}{\sqrt{D}}$`
   - **Block/Multiline Formulas**: Use double dollar signs `$$` on separate lines. Do not place text on the same line as `$$`.

### Mermaid Diagrams
Use standard markdown code blocks tagged with `mermaid`:
```markdown
    ```mermaid
    graph TD
        A[Input] --> B[Output]
    ```
```

## 3. Troubleshooting Guide

- **Symptom**: Multiline matrices render as a single line with raw backslashes showing (e.g., `\begin{bmatrix} q_0 \ q_1 \ q_2 \end{bmatrix}`).
- **Cause**: 
  1. Missing `marked@4` dependency in `index.html`, causing Docsify to use its default Markdown parser which strips the LaTeX newlines.
  2. The markdown file uses `\\` instead of `\\\\` for LaTeX newlines.
- **Solution**: Check `index.html` for `<script src="//cdn.jsdelivr.net/npm/marked@4"></script>` and globally replace `\\` with `\\\\` inside `$$...$$` math blocks.

- **Symptom**: Sidebar or page body shows "加载中..." forever, or a second copy of the site inside the page.
- **Cause**: Docsify fetched a missing `_sidebar.md` / `_navbar.md` and the host answered with `index.html`.
- **Solution**: Keep the `alias` rule above and do not enable `loadNavbar` without a real `_navbar.md`.