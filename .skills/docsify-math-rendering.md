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
Starting from Mermaid v10, it is ESM only (`type="module"`), which forces asynchronous (deferred) loading. This introduces a fatal race condition on GitHub Pages where `docsify-mermaid` attempts to initialize diagrams before the `mermaid` object has finished downloading.

**Solution**: Downgrade to **Mermaid v9.4.3**, which provides a classic synchronous UMD build. This guarantees Mermaid is available exactly when the plugin executes.

```html
<!-- 1. Load Mermaid v9 synchronously -->
<script src="//cdn.jsdelivr.net/npm/mermaid@9.4.3/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({ startOnLoad: false });
</script>

<!-- 2. Docsify Core -->
<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>

<!-- 3. Load docsify-mermaid plugin AFTER Docsify -->
<script src="//unpkg.com/docsify-mermaid@2.0.1/dist/docsify-mermaid.js"></script>
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