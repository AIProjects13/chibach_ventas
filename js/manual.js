(function () {
    var doc = document;
    var btn = doc.getElementById('indiceBtn');
    var nav = doc.getElementById('indiceNav');
    if (btn && nav) {
        btn.addEventListener('click', function () {
            var abierto = nav.classList.toggle('abierto');
            btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) { nav.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); }
        });
    }

    var enlaces = Array.prototype.slice.call(doc.querySelectorAll('.indice-nav a[href^="#"]'));
    var capitulos = enlaces.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); });
    if (enlaces.length && 'IntersectionObserver' in window) {
        var visibles = {};
        var obs = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (en) { visibles[en.target.id] = en.isIntersecting; });
            var actual = null;
            capitulos.forEach(function (c) { if (c && visibles[c.id]) actual = c.id; });
            enlaces.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + actual ? 'true' : 'false'); });
        }, { rootMargin: '-80px 0px -60% 0px' });
        capitulos.forEach(function (c) { if (c) obs.observe(c); });
    }

    var imprimir = function () {
        doc.querySelectorAll('details').forEach(function (d) { d.setAttribute('data-abierto', d.open ? '1' : '0'); d.open = true; });
    };
    var restaurar = function () {
        doc.querySelectorAll('details[data-abierto]').forEach(function (d) { d.open = d.getAttribute('data-abierto') === '1'; });
    };
    window.addEventListener('beforeprint', imprimir);
    window.addEventListener('afterprint', restaurar);
})();
