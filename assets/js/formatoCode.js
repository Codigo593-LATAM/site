var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
  Prism = function(u) {
    var c = /\blang(?:uage)?-([\w-]+)\b/i,
      n = 0,
      e = {},
      M = {
        manual: u.Prism && u.Prism.manual,
        disableWorkerMessageHandler: u.Prism && u.Prism.disableWorkerMessageHandler,
        util: {
          encode: function e(n) {
            return n instanceof W ? new W(n.type, e(n.content), n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
          },
          type: function(e) {
            return Object.prototype.toString.call(e).slice(8, -1)
          },
          objId: function(e) {
            return e.__id || Object.defineProperty(e, "__id", {
              value: ++n
            }), e.__id
          },
          clone: function t(e, r) {
            var a, n;
            switch (r = r || {}, M.util.type(e)) {
              case "Object":
                if (n = M.util.objId(e), r[n]) return r[n];
                for (var i in a = {}, r[n] = a, e) e.hasOwnProperty(i) && (a[i] = t(e[i], r));
                return a;
              case "Array":
                return n = M.util.objId(e), r[n] ? r[n] : (a = [], r[n] = a, e.forEach(function(e, n) {
                  a[n] = t(e, r)
                }), a);
              default:
                return e
            }
          },
          getLanguage: function(e) {
            for (; e && !c.test(e.className);) e = e.parentElement;
            return e ? (e.className.match(c) || [, "none"])[1].toLowerCase() : "none"
          },
          currentScript: function() {
            if ("undefined" == typeof document) return null;
            if ("currentScript" in document) return document.currentScript;
            try {
              throw new Error
            } catch (e) {
              var n = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(e.stack) || [])[1];
              if (n) {
                var t = document.getElementsByTagName("script");
                for (var r in t)
                  if (t[r].src == n) return t[r]
              }
              return null
            }
          },
          isActive: function(e, n, t) {
            for (var r = "no-" + n; e;) {
              var a = e.classList;
              if (a.contains(n)) return !0;
              if (a.contains(r)) return !1;
              e = e.parentElement
            }
            return !!t
          }
        },
        languages: {
          plain: e,
          plaintext: e,
          text: e,
          txt: e,
          extend: function(e, n) {
            var t = M.util.clone(M.languages[e]);
            for (var r in n) t[r] = n[r];
            return t
          },
          insertBefore: function(t, e, n, r) {
            var a = (r = r || M.languages)[t],
              i = {};
            for (var l in a)
              if (a.hasOwnProperty(l)) {
                if (l == e)
                  for (var o in n) n.hasOwnProperty(o) && (i[o] = n[o]);
                n.hasOwnProperty(l) || (i[l] = a[l])
              }
            var s = r[t];
            return r[t] = i, M.languages.DFS(M.languages, function(e, n) {
              n === s && e != t && (this[e] = i)
            }), i
          },
          DFS: function e(n, t, r, a) {
            a = a || {};
            var i = M.util.objId;
            for (var l in n)
              if (n.hasOwnProperty(l)) {
                t.call(n, l, n[l], r || l);
                var o = n[l],
                  s = M.util.type(o);
                "Object" !== s || a[i(o)] ? "Array" !== s || a[i(o)] || (a[i(o)] = !0, e(o, t, l, a)) : (a[i(o)] = !0, e(o, t, null, a))
              }
          }
        },
        plugins: {},
        highlightAll: function(e, n) {
          M.highlightAllUnder(document, e, n)
        },
        highlightAllUnder: function(e, n, t) {
          var r = {
            callback: t,
            container: e,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          M.hooks.run("before-highlightall", r), r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)), M.hooks.run("before-all-elements-highlight", r);
          for (var a, i = 0; a = r.elements[i++];) M.highlightElement(a, !0 === n, r.callback)
        },
        highlightElement: function(e, n, t) {
          var r = M.util.getLanguage(e),
            a = M.languages[r];
          e.className = e.className.replace(c, "").replace(/\s+/g, " ") + " language-" + r;
          var i = e.parentElement;
          i && "pre" === i.nodeName.toLowerCase() && (i.className = i.className.replace(c, "").replace(/\s+/g, " ") + " language-" + r);
          var l = {
            element: e,
            language: r,
            grammar: a,
            code: e.textContent
          };

          function o(e) {
            l.highlightedCode = e, M.hooks.run("before-insert", l), l.element.innerHTML = l.highlightedCode, M.hooks.run("after-highlight", l), M.hooks.run("complete", l), t && t.call(l.element)
          }
          if (M.hooks.run("before-sanity-check", l), (i = l.element.parentElement) && "pre" === i.nodeName.toLowerCase() && !i.hasAttribute("tabindex") && i.setAttribute("tabindex", "0"), !l.code) return M.hooks.run("complete", l), void (t && t.call(l.element));
          if (M.hooks.run("before-highlight", l), l.grammar)
            if (n && u.Worker) {
              var s = new Worker(M.filename);
              s.onmessage = function(e) {
                o(e.data)
              }, s.postMessage(JSON.stringify({
                language: l.language,
                code: l.code,
                immediateClose: !0
              }))
            } else o(M.highlight(l.code, l.grammar, l.language));
          else o(M.util.encode(l.code))
        },
        highlight: function(e, n, t) {
          var r = {
            code: e,
            grammar: n,
            language: t
          };
          return M.hooks.run("before-tokenize", r), r.tokens = M.tokenize(r.code, r.grammar), M.hooks.run("after-tokenize", r), W.stringify(M.util.encode(r.tokens), r.language)
        },
        tokenize: function(e, n) {
          var t = n.rest;
          if (t) {
            for (var r in t) n[r] = t[r];
            delete n.rest
          }
          var a = new i;
          return I(a, a.head, e),
            function e(n, t, r, a, i, l) {
              for (var o in r)
                if (r.hasOwnProperty(o) && r[o]) {
                  var s = r[o];
                  s = Array.isArray(s) ? s : [s];
                  for (var u = 0; u < s.length; ++u) {
                    if (l && l.cause == o + "," + u) return;
                    var c = s[u],
                      g = c.inside,
                      f = !!c.lookbehind,
                      h = !!c.greedy,
                      d = c.alias;
                    if (h && !c.pattern.global) {
                      var p = c.pattern.toString().match(/[imsuy]*$/)[0];
                      c.pattern = RegExp(c.pattern.source, p + "g")
                    }
                    for (var v = c.pattern || c, m = a.next, y = i; m !== t.tail && !(l && y >= l.reach); y += m.value.length, m = m.next) {
                      var b = m.value;
                      if (t.length > n.length) return;
                      if (!(b instanceof W)) {
                        var k, x = 1;
                        if (h) {
                          if (!(k = z(v, y, n, f)) || k.index >= n.length) break;
                          var w = k.index,
                            A = k.index + k[0].length,
                            P = y;
                          for (P += m.value.length; P <= w;) m = m.next, P += m.value.length;
                          if (P -= m.value.length, y = P, m.value instanceof W) continue;
                          for (var E = m; E !== t.tail && (P < A || "string" == typeof E.value); E = E.next) x++, P += E.value.length;
                          x--, b = n.slice(y, P), k.index -= y
                        } else if (!(k = z(v, 0, b, f))) continue;
                        var w = k.index,
                          S = k[0],
                          O = b.slice(0, w),
                          L = b.slice(w + S.length),
                          N = y + b.length;
                        l && N > l.reach && (l.reach = N);
                        var j = m.prev;
                        O && (j = I(t, j, O), y += O.length), q(t, j, x);
                        var C = new W(o, g ? M.tokenize(S, g) : S, d, S);
                        if (m = I(t, j, C), L && I(t, m, L), 1 < x) {
                          var _ = {
                            cause: o + "," + u,
                            reach: N
                          };
                          e(n, t, r, m.prev, y, _), l && _.reach > l.reach && (l.reach = _.reach)
                        }
                      }
                    }
                  }
                }
            }(e, a, n, a.head, 0),
            function(e) {
              var n = [],
                t = e.head.next;
              for (; t !== e.tail;) n.push(t.value), t = t.next;
              return n
            }(a)
        },
        hooks: {
          all: {},
          add: function(e, n) {
            var t = M.hooks.all;
            t[e] = t[e] || [], t[e].push(n)
          },
          run: function(e, n) {
            var t = M.hooks.all[e];
            if (t && t.length)
              for (var r, a = 0; r = t[a++];) r(n)
          }
        },
        Token: W
      };

    function W(e, n, t, r) {
      this.type = e, this.content = n, this.alias = t, this.length = 0 | (r || "").length
    }

    function z(e, n, t, r) {
      e.lastIndex = n;
      var a = e.exec(t);
      if (a && r && a[1]) {
        var i = a[1].length;
        a.index += i, a[0] = a[0].slice(i)
      }
      return a
    }

    function i() {
      var e = {
        value: null,
        prev: null,
        next: null
      },
        n = {
          value: null,
          prev: e,
          next: null
        };
      e.next = n, this.head = e, this.tail = n, this.length = 0
    }

    function I(e, n, t) {
      var r = n.next,
        a = {
          value: t,
          prev: n,
          next: r
        };
      return n.next = a, r.prev = a, e.length++, a
    }

    function q(e, n, t) {
      for (var r = n.next, a = 0; a < t && r !== e.tail; a++) r = r.next;
      (n.next = r).prev = n, e.length -= a
    }
    if (u.Prism = M, W.stringify = function n(e, t) {
      if ("string" == typeof e) return e;
      if (Array.isArray(e)) {
        var r = "";
        return e.forEach(function(e) {
          r += n(e, t)
        }), r
      }
      var a = {
        type: e.type,
        content: n(e.content, t),
        tag: "span",
        classes: ["token", e.type],
        attributes: {},
        language: t
      },
        i = e.alias;
      i && (Array.isArray(i) ? Array.prototype.push.apply(a.classes, i) : a.classes.push(i)), M.hooks.run("wrap", a);
      var l = "";
      for (var o in a.attributes) l += " " + o + '="' + (a.attributes[o] || "").replace(/"/g, "&quot;") + '"';
      return "<" + a.tag + ' class="' + a.classes.join(" ") + '"' + l + ">" + a.content + "</" + a.tag + ">"
    }, !u.document) return u.addEventListener && (M.disableWorkerMessageHandler || u.addEventListener("message", function(e) {
      var n = JSON.parse(e.data),
        t = n.language,
        r = n.code,
        a = n.immediateClose;
      u.postMessage(M.highlight(r, M.languages[t], t)), a && u.close()
    }, !1)), M;
    var t = M.util.currentScript();

    function r() {
      M.manual || M.highlightAll()
    }
    if (t && (M.filename = t.src, t.hasAttribute("data-manual") && (M.manual = !0)), !M.manual) {
      var a = document.readyState;
      "loading" === a || "interactive" === a && t && t.defer ? document.addEventListener("DOMContentLoaded", r) : window.requestAnimationFrame ? window.requestAnimationFrame(r) : window.setTimeout(r, 16)
    }
    return M
  }(_self);
"undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism);
Prism.languages.python = {
  comment: {
    pattern: /(^|[^\\])#.*/,
    lookbehind: !0
  },
  "string-interpolation": {
    pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
        lookbehind: !0,
        inside: {
          "format-spec": {
            pattern: /(:)[^:(){}]+(?=\}$)/,
            lookbehind: !0
          },
          "conversion-option": {
            pattern: /![sra](?=[:}]$)/,
            alias: "punctuation"
          },
          rest: null
        }
      },
      string: /[\s\S]+/
    }
  },
  "triple-quoted-string": {
    pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
    greedy: !0,
    alias: "string"
  },
  string: {
    pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    greedy: !0
  },
  function: {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    lookbehind: !0
  },
  "class-name": {
    pattern: /(\bclass\s+)\w+/i,
    lookbehind: !0
  },
  decorator: {
    pattern: /(^[\t ]*)@\w+(?:\.\w+)*/im,
    lookbehind: !0,
    alias: ["annotation", "punctuation"],
    inside: {
      punctuation: /\./
    }
  },
  keyword: /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
  builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
  boolean: /\b(?:False|None|True)\b/,
  number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
  operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  punctuation: /[{}[\];(),.:]/
}, Prism.languages.python["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.python, Prism.languages.py = Prism.languages.python;
! function() {
  if ("undefined" != typeof Prism && "undefined" != typeof document && document.querySelector) {
    var t, o = "line-numbers",
      s = "linkable-line-numbers",
      l = function() {
        if (void 0 === t) {
          var e = document.createElement("div");
          e.style.fontSize = "13px", e.style.lineHeight = "1.5", e.style.padding = "0", e.style.border = "0", e.innerHTML = "&nbsp;<br />&nbsp;", document.body.appendChild(e), t = 38 === e.offsetHeight, document.body.removeChild(e)
        }
        return t
      },
      a = !0;
    Prism.plugins.lineHighlight = {
      highlightLines: function(u, e, c) {
        var t = (e = "string" == typeof e ? e : u.getAttribute("data-line") || "").replace(/\s+/g, "").split(",").filter(Boolean),
          d = +u.getAttribute("data-line-offset") || 0,
          h = (l() ? parseInt : parseFloat)(getComputedStyle(u).lineHeight),
          f = Prism.util.isActive(u, o),
          i = u.querySelector("code"),
          p = f ? u : i || u,
          g = [],
          m = i && p != i ? function(e, t) {
            var i = getComputedStyle(e),
              n = getComputedStyle(t);

            function r(e) {
              return +e.substr(0, e.length - 2)
            }
            return t.offsetTop + r(n.borderTopWidth) + r(n.paddingTop) - r(i.paddingTop)
          }(u, i) : 0;
        t.forEach(function(e) {
          var t = e.split("-"),
            i = +t[0],
            n = +t[1] || i,
            r = u.querySelector('.line-highlight[data-range="' + e + '"]') || document.createElement("div");
          if (g.push(function() {
            r.setAttribute("aria-hidden", "true"), r.setAttribute("data-range", e), r.className = (c || "") + " line-highlight"
          }), f && Prism.plugins.lineNumbers) {
            var o = Prism.plugins.lineNumbers.getLine(u, i),
              s = Prism.plugins.lineNumbers.getLine(u, n);
            if (o) {
              var l = o.offsetTop + m + "px";
              g.push(function() {
                r.style.top = l
              })
            }
            if (s) {
              var a = s.offsetTop - o.offsetTop + s.offsetHeight + "px";
              g.push(function() {
                r.style.height = a
              })
            }
          } else g.push(function() {
            r.setAttribute("data-start", String(i)), i < n && r.setAttribute("data-end", String(n)), r.style.top = (i - d - 1) * h + m + "px", r.textContent = new Array(n - i + 2).join(" \n")
          });
          g.push(function() {
            r.style.width = u.scrollWidth + "px"
          }), g.push(function() {
            p.appendChild(r)
          })
        });
        var n = u.id;
        if (f && Prism.util.isActive(u, s) && n) {
          y(u, s) || g.push(function() {
            u.classList.add(s)
          });
          var r = parseInt(u.getAttribute("data-start") || "1");
          v(".line-numbers-rows > span", u).forEach(function(e, t) {
            var i = t + r;
            e.onclick = function() {
              var e = n + "." + i;
              a = !1, location.hash = e, setTimeout(function() {
                a = !0
              }, 1)
            }
          })
        }
        return function() {
          g.forEach(b)
        }
      }
    };
    var u = 0;
    Prism.hooks.add("before-sanity-check", function(e) {
      var t = e.element.parentElement;
      if (c(t)) {
        var i = 0;
        v(".line-highlight", t).forEach(function(e) {
          i += e.textContent.length, e.parentNode.removeChild(e)
        }), i && /^(?: \n)+$/.test(e.code.slice(-i)) && (e.code = e.code.slice(0, -i))
      }
    }), Prism.hooks.add("complete", function e(t) {
      var i = t.element.parentElement;
      if (c(i)) {
        clearTimeout(u);
        var n = Prism.plugins.lineNumbers,
          r = t.plugins && t.plugins.lineNumbers;
        if (y(i, o) && n && !r) Prism.hooks.add("line-numbers", e);
        else Prism.plugins.lineHighlight.highlightLines(i)(), u = setTimeout(d, 1)
      }
    }), window.addEventListener("hashchange", d), window.addEventListener("resize", function() {
      v("pre").filter(c).map(function(e) {
        return Prism.plugins.lineHighlight.highlightLines(e)
      }).forEach(b)
    })
  }

  function v(e, t) {
    return Array.prototype.slice.call((t || document).querySelectorAll(e))
  }

  function y(e, t) {
    return e.classList.contains(t)
  }

  function b(e) {
    e()
  }

  function c(e) {
    return !(!e || !/pre/i.test(e.nodeName)) && (!!e.hasAttribute("data-line") || !(!e.id || !Prism.util.isActive(e, s)))
  }

  function d() {
    var e = location.hash.slice(1);
    v(".temporary.line-highlight").forEach(function(e) {
      e.parentNode.removeChild(e)
    });
    var t = (e.match(/\.([\d,-]+)$/) || [, ""])[1];
    if (t && !document.getElementById(e)) {
      var i = e.slice(0, e.lastIndexOf(".")),
        n = document.getElementById(i);
      if (n) n.hasAttribute("data-line") || n.setAttribute("data-line", ""), Prism.plugins.lineHighlight.highlightLines(n, t, "temporary ")(), a && document.querySelector(".temporary.line-highlight").scrollIntoView()
    }
  }
}();


Prism.languages.c = {
  comment: {
    pattern: /(^|[^\\]|)#.*/,
    lookbehind: !0
  },
  "string-interpolation": {
    pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
        lookbehind: !0,
        inside: {
          "format-spec": {
            pattern: /(:)[^:(){}]+(?=\}$)/,
            lookbehind: !0
          },
          "conversion-option": {
            pattern: /![sra](?=[:}]$)/,
            alias: "punctuation"
          },
          rest: null
        }
      },
      string: /[\s\S]+/
    }
  },
  "triple-quoted-string": {
    pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
    greedy: !0,
    alias: "string"
  },
  string: {
    pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    greedy: !0
  },
  function: {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    lookbehind: !0
  },
  "class-name": {
    pattern: /(\bclass\s+)\w+/i,
    lookbehind: !0
  },
  decorator: {
    pattern: /(^[\t ]*)@\w+(?:\.\w+)*/im,
    lookbehind: !0,
    alias: ["annotation", "punctuation"],
    inside: {
      punctuation: /\./
    }
  },
  keyword: /\b(?:_(?=\s*:)|break|case|class|continue|if|else|except|finally|global|if|import|in|is|scanf|printf|return|try|while|with|yield|for)\b/,
  builtin: /\b(?:abs|bool|char|int|float|file|int|open|pow|round|string|tuple|type)\b/,
  boolean: /\b(?:False|None|True)\b/,
  number: /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
  operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  punctuation: /[{}[\];(),.:]/
}, Prism.languages.c["string-interpolation"].inside.interpolation.inside.rest = Prism.languages.c;