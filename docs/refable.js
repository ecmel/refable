var refable = (function (t) {
  "use strict";
  function e(t, e, a, r) {
    if ("a" === a && !r)
      throw new TypeError("Private accessor was defined without a getter");
    if ("function" == typeof e ? t !== e || !r : !e.has(t))
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      );
    return "m" === a ? r : "a" === a ? r.call(t) : r ? r.value : e.get(t);
  }
  function a(t, e, a, r, s) {
    if ("m" === r) throw new TypeError("Private method is not writable");
    if ("a" === r && !s)
      throw new TypeError("Private accessor was defined without a setter");
    if ("function" == typeof e ? t !== e || !s : !e.has(t))
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    return "a" === r ? s.call(t, a) : s ? (s.value = a) : e.set(t, a), a;
  }
  var r, s, o, i, n, c, l, h, d, u, f, p, g, m, w, E, b, v;
  (s = new WeakMap()),
    (o = new WeakMap()),
    (i = new WeakMap()),
    (n = new WeakMap()),
    (c = new WeakMap()),
    (r = new WeakSet()),
    (l = function (t) {
      t.forEach((t) => {
        t.removedNodes.forEach((t) => e(this, r, "m", d).call(this, t)),
          t.addedNodes.forEach((t) => e(this, r, "m", h).call(this, t));
      });
    }),
    (h = function (t) {
      if (t.nodeType === Node.ELEMENT_NODE) {
        const a = t;
        a.hasAttribute("data-controller") && e(this, r, "m", u).call(this, a),
          a
            .querySelectorAll("[data-controller]")
            .forEach((t) => e(this, r, "m", u).call(this, t)),
          a.hasAttribute("data-target") && e(this, r, "m", p).call(this, a),
          a
            .querySelectorAll("[data-target]")
            .forEach((t) => e(this, r, "m", p).call(this, t)),
          a.hasAttribute("data-action") && e(this, r, "m", m).call(this, a),
          a
            .querySelectorAll("[data-action]")
            .forEach((t) => e(this, r, "m", m).call(this, t));
      }
    }),
    (d = function (t) {
      if (t.nodeType === Node.ELEMENT_NODE) {
        const a = t;
        a
          .querySelectorAll("[data-action]")
          .forEach((t) => e(this, r, "m", w).call(this, t)),
          a.hasAttribute("data-action") && e(this, r, "m", w).call(this, a),
          a
            .querySelectorAll("[data-target]")
            .forEach((t) => e(this, r, "m", g).call(this, t)),
          a.hasAttribute("data-target") && e(this, r, "m", g).call(this, a),
          a
            .querySelectorAll("[data-controller]")
            .forEach((t) => e(this, r, "m", f).call(this, t)),
          a.hasAttribute("data-controller") && e(this, r, "m", f).call(this, a);
      }
    }),
    (u = function (t) {
      const a = t.parentElement.closest("[data-controller]");
      let r = null;
      a && (r = e(this, o, "f").get(a));
      const i = t.getAttribute("data-controller");
      let n = e(this, o, "f").get(t);
      if (n) n.parent = r;
      else {
        const a = e(this, s, "f").get(i);
        (n = new a(t, this)),
          (n.parent = r),
          e(this, o, "f").set(t, n),
          queueMicrotask(() => n.created());
      }
      if ("dataset" in t)
        for (const e in t.dataset)
          if (e.endsWith("Value")) {
            const a = `${e}Changed`;
            Object.defineProperty(n, e, {
              get: () => t.dataset[e],
              set: (r) => {
                (t.dataset[e] = r),
                  queueMicrotask(() => {
                    n[a] && n[a](r);
                  });
              },
            }),
              queueMicrotask(() => {
                n[a] && n[a](t.dataset[e]);
              });
          }
      if (r) {
        const t = `${i}Controllers`;
        r[t]
          ? r[t].push(n)
          : ((r[t] = [n]),
            Object.defineProperty(r, `${i}Controller`, { get: () => r[t][0] }));
        const e = `${i}ControllerConnected`;
        queueMicrotask(() => {
          r[e] && r[e](n);
        });
      }
      queueMicrotask(() => n.connected());
    }),
    (f = function (t) {
      const a = e(this, o, "f").get(t),
        r = t.getAttribute("data-controller"),
        s = a.parent;
      if (s) {
        const t = s[`${r}Controllers`];
        for (var i = 0; i < t.length; i++)
          if (t[i] === a) {
            t.splice(i, 1);
            break;
          }
        const e = `${r}ControllerDisconnected`;
        queueMicrotask(() => {
          s[e] && s[e](a);
        });
      }
      queueMicrotask(() => a.disconnected());
    }),
    (p = function (t) {
      const a = t.getAttribute("data-target"),
        r = t.closest("[data-controller]"),
        s = e(this, o, "f").get(r);
      e(this, i, "f").set(t, s);
      const n = `${a}Targets`;
      s[n]
        ? s[n].push(t)
        : ((s[n] = [t]),
          Object.defineProperty(s, `${a}Target`, { get: () => s[n][0] }));
      const c = `${a}TargetConnected`;
      queueMicrotask(() => {
        s[c] && s[c](t);
      });
    }),
    (g = function (t) {
      const a = t.getAttribute("data-target"),
        r = e(this, i, "f").get(t),
        s = r[`${a}Targets`];
      for (var o = 0; o < s.length; o++)
        if (s[o] === t) {
          s.splice(o, 1);
          break;
        }
      e(this, i, "f").delete(t);
      const n = `${a}TargetDisconnected`;
      queueMicrotask(() => {
        r[n] && r[n](t);
      });
    }),
    (m = function (t) {
      const a = t.getAttribute("data-action"),
        r = t.closest("[data-controller]"),
        s = e(this, o, "f").get(r);
      a.split(" ").forEach((a) => {
        const [r, o] = a.split("->"),
          i = o.split(":"),
          c = {};
        if (i.length > 1) for (let t = 1; t < i.length; t++) c[i[t]] = !0;
        const l = {
          event: r,
          options: c,
          listener: (t) => {
            "stop" in c && t.stopPropagation(),
              "prevent" in c && t.preventDefault(),
              s[i[0]](t);
          },
        };
        t.addEventListener(l.event, l.listener, l.options);
        const h = e(this, n, "f").get(t);
        h ? h.push(l) : e(this, n, "f").set(t, [l]);
      });
    }),
    (w = function (t) {
      e(this, n, "f")
        .get(t)
        .forEach((e) => t.removeEventListener(e.event, e.listener, e.options)),
        e(this, n, "f").delete(t);
    });
  return (
    (E = new WeakMap()),
    (b = new WeakMap()),
    (v = new WeakMap()),
    (t.Application = class {
      constructor() {
        r.add(this),
          s.set(this, new Map()),
          o.set(this, new WeakMap()),
          i.set(this, new Map()),
          n.set(this, new Map()),
          c.set(this, void 0),
          a(
            this,
            c,
            new MutationObserver((t) => e(this, r, "m", l).call(this, t)),
            "f"
          );
      }
      register(t, a) {
        e(this, s, "f").set(t, a);
      }
      ready(t) {
        "loading" == document.readyState
          ? document.addEventListener("DOMContentLoaded", () => t())
          : t();
      }
      run() {
        this.ready(() => {
          document
            .querySelectorAll("[data-controller]")
            .forEach((t) => e(this, r, "m", u).call(this, t)),
            document
              .querySelectorAll("[data-target]")
              .forEach((t) => e(this, r, "m", p).call(this, t)),
            document
              .querySelectorAll("[data-action]")
              .forEach((t) => e(this, r, "m", m).call(this, t)),
            e(this, c, "f").observe(document, { childList: !0, subtree: !0 });
        });
      }
    }),
    (t.Controller = class {
      constructor(t, e) {
        E.set(this, void 0),
          b.set(this, void 0),
          v.set(this, void 0),
          a(this, E, t, "f"),
          a(this, v, e, "f");
      }
      get element() {
        return e(this, E, "f");
      }
      get application() {
        return e(this, v, "f");
      }
      get parent() {
        return e(this, b, "f");
      }
      set parent(t) {
        a(this, b, t, "f");
      }
      nextTick(t) {
        queueMicrotask(t);
      }
      dispatch(t, a = {}) {
        const r = new CustomEvent(t, {
          detail: a,
          bubbles: !0,
          cancelable: !0,
        });
        return e(this, E, "f").dispatchEvent(r), r;
      }
      created() {}
      connected() {}
      disconnected() {}
    }),
    t
  );
})({});
//# sourceMappingURL=refable.js.map
