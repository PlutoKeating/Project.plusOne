// 页面视觉组件：每次 Docsify 渲染完页面后，把代码块、引用块、故事段落、表格包装成卡片。
// 样式见 assets/site.css。
(function () {
  // 代码块分类：根据语言和内容决定卡片的标题、颜色和提示
  function classifyCode(pre) {
    var lang = (pre.getAttribute('data-lang') || '').toLowerCase();
    var text = codeText(pre);
    if (/角色[:：]|任务[:：]|要求[:：]/.test(text)) return { kind: 'prompt', label: '💬 Prompt 模板', hint: '复制后替换方括号里的内容' };
    if (text.trim().split('\n').length === 1 && text.trim().length <= 60) return { kind: 'formula', label: '📌 记住这一行', hint: '' };
    if (lang === 'json') return { kind: 'data', label: '📦 数据格式', hint: '' };
    if (lang === 'bash' || lang === 'sh' || lang === 'shell') return { kind: 'example', label: '⌨️ 命令', hint: '' };
    if (/[→↓▼│└├]|-->|──/.test(text)) return { kind: 'flow', label: '🔀 流程图', hint: '顺着箭头读' };
    if (lang === 'python' || lang === 'py' || /^\s*(for|if|循环|如果|def)\b/m.test(text)) {
      return { kind: 'pseudo', label: '🧩 伪代码', hint: '只看结构，不必运行' };
    }
    return { kind: 'example', label: '📝 示例', hint: '' };
  }

  // 只取代码正文，避开复制按钮插进 pre 的文字
  function codeText(pre) {
    var code = pre.querySelector('code');
    return (code || pre).textContent || '';
  }

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // 行内 `代码`、**加粗** 和 [链接](https://…)
  function inline(t) {
    return esc(t)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(((?:https?:\/\/|#\/|\/)[^)\s"]+)\)/g, function (_, label, href) {
        var ext = /^https?:/.test(href);
        return '<a href="' + href + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + label + '</a>';
      });
  }

  // 把 "key: value" 行按空行分组
  function parseGroups(text) {
    return text.split(/\n\s*\n/).map(function (chunk) {
      var o = {};
      chunk.split('\n').forEach(function (line) {
        var m = line.match(/^\s*-?\s*([a-z]+)\s*[:：]\s*(.*)$/);
        if (m) o[m[1]] = m[2].trim();
      });
      return o;
    }).filter(function (o) { return o.title; });
  }

  var COLORS = ['blue', 'green', 'orange', 'purple', 'red'];

  // ```cards 概念卡片：icon / title / what / like / use / color
  function renderCards(pre) {
    var items = parseGroups(codeText(pre));
    var grid = document.createElement('div');
    grid.className = 'concept-grid';
    // 按数量选列数，避免最后一行只剩一张卡
    var n = items.length;
    var cols = n <= 3 ? n : (n % 3 === 0 ? 3 : (n % 2 === 0 ? 2 : 3));
    grid.style.setProperty('--cols', cols);
    items.forEach(function (it, i) {
      var color = COLORS.indexOf(it.color) >= 0 ? it.color : COLORS[i % COLORS.length];
      var html = '<div class="concept-head"><span class="concept-icon">' + esc(it.icon || '🔹') + '</span>' +
        '<span class="concept-title">' + inline(it.title) + '</span></div>';
      if (it.what) html += '<div class="concept-what">' + inline(it.what) + '</div>';
      if (it.like) html += '<div class="concept-row concept-like"><span>🍎 打个比方</span>' + inline(it.like) + '</div>';
      if (it.use) html += '<div class="concept-row concept-use"><span>🎯 用在哪</span>' + inline(it.use) + '</div>';
      var card = document.createElement('div');
      card.className = 'concept-card reveal';
      card.setAttribute('data-color', color);
      card.innerHTML = html;
      grid.appendChild(card);
    });
    pre.parentNode.replaceChild(grid, pre);
  }

  // ```steps 步骤时间线：title / desc / icon
  function renderSteps(pre) {
    var items = parseGroups(codeText(pre));
    var ol = document.createElement('ol');
    ol.className = 'step-line';
    items.forEach(function (it, i) {
      var li = document.createElement('li');
      li.className = 'reveal';
      li.innerHTML = '<span class="step-no">' + (it.icon ? esc(it.icon) : i + 1) + '</span>' +
        '<div class="step-body"><div class="step-title">' + inline(it.title) + '</div>' +
        (it.desc ? '<div class="step-desc">' + inline(it.desc) + '</div>' : '') + '</div>';
      ol.appendChild(li);
    });
    pre.parentNode.replaceChild(ol, pre);
  }

  function renderBlocks(root) {
    root.querySelectorAll('pre[data-lang="cards"]').forEach(renderCards);
    root.querySelectorAll('pre[data-lang="steps"]').forEach(renderSteps);
  }

  function wrapCode(root) {
    root.querySelectorAll('pre[data-lang]').forEach(function (pre) {
      var lang = (pre.getAttribute('data-lang') || '').toLowerCase();
      if (lang === 'mermaid' || pre.closest('.code-card')) return;
      var info = classifyCode(pre);
      var card = document.createElement('div');
      card.className = 'code-card reveal';
      card.setAttribute('data-kind', info.kind);
      var head = document.createElement('div');
      head.className = 'code-card-head';
      head.innerHTML = '<span class="code-card-dot"></span><span></span><span class="code-card-hint"></span>';
      head.children[1].textContent = info.label;
      head.children[2].textContent = info.hint;
      pre.parentNode.insertBefore(card, pre);
      card.appendChild(head);
      card.appendChild(pre);
    });
  }

  // 引用块分类：看开头的加粗文字
  var CALLOUTS = [
    { re: /加一说|加一的/, cls: 'callout-plusone', icon: '🤖' },
    { re: /向 ?AI ?提问|概念不理解|需要练习|提问/, cls: 'callout-ask', icon: '💬' },
    { re: /注意|警告|小心|风险/, cls: 'callout-warn', icon: '⚠️' },
    { re: /建议|提示|技巧|经验/, cls: 'callout-tip', icon: '💡' }
  ];

  function decorateQuotes(root) {
    root.querySelectorAll('.markdown-section blockquote').forEach(function (bq) {
      if (bq.classList.contains('callout')) return;
      var lead = bq.querySelector('strong');
      var key = (lead ? lead.textContent : bq.textContent.slice(0, 20)) || '';
      // 没有明确前缀时，参考所在小节的标题
      var h = bq.previousElementSibling;
      while (h && !/^H[23]$/.test(h.tagName)) h = h.previousElementSibling;
      if (h) key += ' ' + h.textContent;
      var hit = null;
      for (var i = 0; i < CALLOUTS.length; i++) {
        if (CALLOUTS[i].re.test(key)) { hit = CALLOUTS[i]; break; }
      }
      bq.classList.add('callout', 'reveal', hit ? hit.cls : 'callout-note');
      bq.setAttribute('data-icon', hit ? hit.icon : 'ℹ️');
    });
  }

  // "## 故事……" 下面直到下一个标题或分割线的段落，包成故事卡
  function wrapStory(root) {
    root.querySelectorAll('.markdown-section h2').forEach(function (h2) {
      if (!/^故事/.test(h2.textContent.trim())) return;
      var next = h2.nextElementSibling;
      if (!next || next.classList.contains('story-card')) return;
      var card = document.createElement('div');
      card.className = 'story-card reveal';
      h2.parentNode.insertBefore(card, next);
      while (card.nextElementSibling && !/^(H[1-3]|HR)$/.test(card.nextElementSibling.tagName)) {
        card.appendChild(card.nextElementSibling);
      }
    });
  }

  function wrapTables(root) {
    root.querySelectorAll('.markdown-section table').forEach(function (t) {
      if (t.parentNode.classList.contains('table-card')) return;
      var card = document.createElement('div');
      card.className = 'table-card reveal';
      t.parentNode.insertBefore(card, t);
      card.appendChild(t);
    });
  }

  var io = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 })
    : null;

  function reveal(root) {
    root.querySelectorAll('.reveal:not(.in-view)').forEach(function (el) {
      if (io) io.observe(el); else el.classList.add('in-view');
    });
  }

  window.PlusOneDecorate = function (root) {
    root = root || document;
    wrapStory(root);
    renderBlocks(root);
    wrapCode(root);
    decorateQuotes(root);
    wrapTables(root);
    reveal(root);
  };
})();
