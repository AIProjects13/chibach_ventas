(function () {
    if (window.top === window.self) return;
    try {
        if (window.top.location.origin === window.location.origin) return;
    } catch (e) { }
    document.documentElement.style.display = 'none';
    try { window.top.location = window.self.location; } catch (e) { }
})();
