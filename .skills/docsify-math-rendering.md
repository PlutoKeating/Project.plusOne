# Skill: Docsify Math (KaTeX) and Diagram (Mermaid) Rendering

## Description
This skill documents the necessary configurations, dependencies, and markdown writing best practices to successfully render complex LaTeX mathematical formulas (matrices, calculus, etc.) and Mermaid diagrams in a Docsify project. 

## 1. HTML Configuration (index.html)

To properly render KaTeX and Mermaid, the `index.html` must include specific dependencies. Missing core dependencies is the #1 cause of unparsed or collapsed LaTeX syntax.

### KaTeX Dependencies
`docsify-katex` relies on the core KaTeX engine and a specific markdown parser (`marked@4`) to avoid markdown escaping issues.
```html
<!-- KaTeX Styles -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css" />
<!-- KaTeX Engine -->
<script src="//cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.js"></script>
<!-- CRITICAL: marked@4 is required for docsify-katex to parse multiline blocks correctly -->
<script src="//cdn.jsdelivr.net/npm/marked@4"></script>
<!-- Docsify KaTeX Plugin -->
<script src="//cdn.jsdelivr.net/npm/docsify-katex@latest/dist/docsify-katex.js"></script>
```

### Mermaid Dependencies
For Mermaid to work with Docsify, initialize the ESM module and bind it to the window object before loading the docsify plugin.
```html
<script type="module">
  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
  mermaid.initialize({ startOnLoad: true });
  window.mermaid = mermaid;
</script>
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