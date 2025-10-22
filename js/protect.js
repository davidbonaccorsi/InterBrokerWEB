(function() {
  const isLocal = /^http:\/\/127\.0\.0\.1:\d+$/.test(location.origin);

  // Modifică toate linkurile <a>
  document.querySelectorAll("a").forEach(link => {
    if (isLocal) {
      const originalHref = link.getAttribute("href");

      if (originalHref === "https://euteasigur.ro") {
        link.setAttribute("href", "../index.html");
        return;
      }

      const stripped = originalHref.replace(/^https:\/\/euteasigur\.ro/, "");
      link.setAttribute("href", `..${stripped}.html`);
    }
  });

  // Modifică toate elementele cu onclick care conțin location.href
  document.querySelectorAll("[onclick]").forEach(el => {
    if (isLocal) {
      const onclickValue = el.getAttribute("onclick");

      const match = onclickValue.match(/location\.href='(https:\/\/euteasigur\.ro[^']*)'/);
      if (match && match[1]) {
        let newHref = match[1].replace(/^https:\/\/euteasigur\.ro/, "");
        if (newHref === "") {
          newHref = "/index";
        }
        el.setAttribute("onclick", `location.href='..${newHref}.html'`);
      }
    }
  });

  // 🔒 Core Protections
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', function(e) {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === 'U')
    ) {
      e.preventDefault();
    }
  });

  ["log", "debug", "warn", "error", "dir", "dirxml", "assert", "table"].forEach(func => {
    console[func] = () => null;
  });

  // 🎭 Random reload trap
  if (Math.random() === Math.random() === Math.random()) {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    location.reload();
  }

  // 🧨 DevTools detection
  function isNative(func) {
    return typeof func === "function" &&
      !window.eval.toString().includes("return") &&
      window.eval.toString().includes("[native code]") &&
      window.eval.toString().length < 40;
  }

  const antiDevToolsInterval = setInterval(() => {
    if (!isNative(Date.now) || !isNative(window.eval) || window.eval("2+2") !== 4) {
      alert("Do not spoof functions!");
      document.head.innerHTML = "";
      document.body.innerHTML = "";
      location.reload();
      clearInterval(antiDevToolsInterval);
    }

    const started = Date.now();
    window.eval("debugger");
    const end = Date.now();

    if ((end - started) > 50) {
      alert("DevTools not allowed!");
      document.head.innerHTML = "";
      document.body.innerHTML = "";
      location.reload();
      clearInterval(antiDevToolsInterval);
    }
  }, 150);

  // 👀 Console bait
  const baitScript = document.createElement("script");
  baitScript.innerText = `for (var i = 111; i < 222; i++) {
    console.error("%c[" + i.toString(16) + "] HTML Guard sees you!", 
    "font-size: 25px; text-shadow: 0 0 1px black; color: red;");
  }`;
  document.head.appendChild(baitScript);

  // 🚀 DOM Ready
  document.addEventListener("DOMContentLoaded", () => {
    // 🖼️ Restore _src attributes
    ['img', 'iframe', 'video'].forEach(tag => {
      document.querySelectorAll(`${tag}[_src]`).forEach(el => {
        const actualSrc = el.getAttribute('_src');
        if (actualSrc) el.setAttribute('src', actualSrc);
      });
    });

    // 🧪 Obfuscate page source
    const attributeName = "html-guard-attribute";
    const notGuardedSelector = `:not([${attributeName}])`;

    function generateRandomString(min, max) {
      const length = Math.floor(Math.random() * (max - min + 1)) + min;
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }

    function randomByRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function obfuscatePageSource() {
      document.querySelectorAll("*" + notGuardedSelector).forEach(el => {
        // Junk comments
        for (let i = 0; i < randomByRange(5, 15); i++) {
          let comment = "";
          for (let o = 0; o < randomByRange(10, 20); o++) {
            comment += generateRandomString(1, 5) + "\n";
          }
          el.parentNode.insertBefore(document.createComment(comment), el);
        }

        // Junk classes
        for (let i = 0; i < randomByRange(1, 8); i++) {
          el.classList.add(generateRandomString(6, 20));
        }

        // Junk attributes
        for (let i = 0; i < randomByRange(10, 55); i++) {
          el.setAttribute(generateRandomString(6, 12), randomByRange(0, 1) ? generateRandomString(1, 5) : "");
        }

        el.setAttribute(attributeName, "");
      });

      // Fake IDs
      document.querySelectorAll(":not([id])" + notGuardedSelector).forEach(el => {
        el.id = generateRandomString(5, 15);
      });

      // Protected attributes (_src → src, _id → id, etc.)
      document.querySelectorAll("*").forEach(el => {
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.startsWith("_")) {
            el.setAttribute(attr.name.substring(1), attr.value);
            el.removeAttribute(attr.name);
          }
        });
      });
    }

    obfuscatePageSource();
    setInterval(obfuscatePageSource, 2000);
  });
})();