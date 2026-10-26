// 术语悬浮卡：给正文里的行话加下划线，悬停或点击时在词下方弹出大白话解释。
// 词典在 assets/terms.json：{ terms: { 术语: { aka: [别名], plain: 解释, like: 类比, link: 章节链接 } } }
(function () {
  var dictPromise = null;
  var matcher = null; // { re, lookup }

  function loadDict() {
    if (!dictPromise) {
      dictPromise = fetch('assets/terms.json', { cache: 'no-cache' })
        .then(function (r) { return r.json(); })
        .then(function (data) { buildMatcher(data.terms || {}); })
        .catch(function () { matcher = null; });
    }
    return dictPromise;
  }

  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function buildMatcher(terms) {
    var lookup = {};
    var words = [];
    Object.keys(terms).forEach(function (key) {
      var t = terms[key];
      t.name = key;
      [key].concat(t.aka || []).forEach(function (w) {
        if (!w) return;
        lookup[w.toLowerCase()] = t;
        words.push(w);
      });
    });
    // 长词优先，避免 "API Key" 被 "API" 抢先匹配
    words.sort(function (a, b) { return b.length - a.length; });
    if (!words.length) return;
    matcher = { re: new RegExp(words.map(escRe).join('|'), 'gi'), lookup: lookup };
  }

  // 英文术语要求前后不是字母数字，避免 "API" 匹配到 "RAPID"
  function boundaryOk(text, start, end, word) {
    if (!/^[A-Za-z0-9]/.test(word)) return true;
    var before = text.charAt(start - 1);
    var after = text.charAt(end);
    return !/[A-Za-z0-9_]/.test(before) && !/[A-Za-z0-9_]/.test(after);
  }

  var SKIP = 'pre, code, a, h1, h2, h3, h4, h5, script, style, .mermaid, [data-anim], .katex, .term, ' +
    '.code-card-head, .concept-title, .concept-label, .step-no, .footer-feedback';
  var BLOCK = 'p, li, td, th, blockquote, .concept-what, .concept-row, .step-title, .step-desc';

  function markTerms(section) {
    if (!matcher || !section) return;
    var walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    // 同一个段落/卡片里，同一个术语只标第一次
    var seen = new WeakMap();
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var block = node.parentElement.closest(BLOCK) || node.parentElement;
      var used = seen.get(block);
      if (!used) { used = {}; seen.set(block, used); }
      var frag = null;
      var last = 0;
      var m;
      matcher.re.lastIndex = 0;
      while ((m = matcher.re.exec(text))) {
        var word = m[0];
        var term = matcher.lookup[word.toLowerCase()];
        if (!term || used[term.name] || !boundaryOk(text, m.index, m.index + word.length, word)) continue;
        used[term.name] = true;
        frag = frag || document.createDocumentFragment();
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var span = document.createElement('span');
        span.className = 'term';
        span.tabIndex = 0;
        span.setAttribute('role', 'button');
        span.setAttribute('data-term', term.name);
        span.textContent = word;
        frag.appendChild(span);
        last = m.index + word.length;
      }
      if (frag) {
        frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    });
  }

  // ---------- 悬浮卡 ----------
  var pop = null;
  var current = null;
  var hideTimer = null;

  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement('div');
    pop.className = 'term-pop';
    pop.setAttribute('role', 'tooltip');
    pop.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    pop.addEventListener('mouseleave', scheduleHide);
    document.body.appendChild(pop);
    return pop;
  }

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function show(el) {
    var name = el.getAttribute('data-term');
    var term = null;
    Object.keys(matcher.lookup).some(function (k) {
      if (matcher.lookup[k].name === name) { term = matcher.lookup[k]; return true; }
      return false;
    });
    if (!term) return;
    clearTimeout(hideTimer);
    var p = ensurePop();
    var aka = (term.aka || []).filter(function (a) { return a !== el.textContent; });
    p.innerHTML =
      '<div class="term-pop-title">' + esc(term.name) +
        (aka.length ? '<span class="term-pop-aka">' + esc(aka.slice(0, 2).join(' / ')) + '</span>' : '') + '</div>' +
      '<div class="term-pop-plain">' + esc(term.plain) + '</div>' +
      (term.like ? '<div class="term-pop-like"><span>🍎 打个比方</span>' + esc(term.like) + '</div>' : '') +
      '<div class="term-pop-links">' +
        (term.link ? '<a href="' + esc(term.link) + '">详细讲解 →</a>' : '') +
        '<a href="#/glossary">术语表</a></div>';
    current = el;
    p.classList.add('show');
    place(el, p);
  }

  function place(el, p) {
    var r = el.getBoundingClientRect();
    var pw = p.offsetWidth;
    var ph = p.offsetHeight;
    var left = Math.min(Math.max(8, r.left + r.width / 2 - pw / 2), window.innerWidth - pw - 8);
    var top = r.bottom + 10;
    var above = false;
    if (top + ph > window.innerHeight - 8 && r.top - ph - 10 > 8) { top = r.top - ph - 10; above = true; }
    p.style.left = left + 'px';
    p.style.top = top + 'px';
    p.classList.toggle('above', above);
    p.style.setProperty('--arrow-x', (r.left + r.width / 2 - left) + 'px');
  }

  function hide() {
    if (pop) pop.classList.remove('show');
    current = null;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 180);
  }

  var hoverCapable = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  document.addEventListener('mouseover', function (e) {
    if (!hoverCapable || !matcher) return;
    var el = e.target.closest && e.target.closest('.term');
    if (el) show(el);
  });
  document.addEventListener('mouseout', function (e) {
    if (!hoverCapable) return;
    var el = e.target.closest && e.target.closest('.term');
    if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) scheduleHide();
  });
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('.term');
    if (el && matcher) {
      if (current === el && !hoverCapable) hide(); else show(el);
      return;
    }
    if (pop && !pop.contains(e.target)) hide();
  });
  document.addEventListener('keydown', function (e) {
    var el = e.target.closest && e.target.closest('.term');
    if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); show(el); }
    if (e.key === 'Escape') hide();
  });
  window.addEventListener('scroll', function () { if (current) place(current, pop); }, { passive: true });
  window.addEventListener('resize', hide);

  window.PlusOneTerms = function () {
    hide();
    // 术语表页面本身就是解释，不再标注
    if (/#\/glossary/.test(location.hash)) return Promise.resolve();
    return loadDict().then(function () {
      markTerms(document.querySelector('.markdown-section'));
    });
  };
})();
