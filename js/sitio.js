(function () {
    var doc = document;
    doc.documentElement.classList.add('js');
    var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var btn = doc.getElementById('menuBtn');
    var nav = doc.getElementById('menuNav');
    if (btn && nav) {
        btn.addEventListener('click', function () {
            var abierto = nav.classList.toggle('abierto');
            btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) { nav.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); }
        });
    }

    function contar(el) {
        var fin = parseInt(el.getAttribute('data-fin'), 10);
        if (!isFinite(fin) || fin < 1) return;
        var t0 = null;
        el.textContent = '0';
        function paso(t) {
            if (t0 === null) t0 = t;
            var p = Math.min(1, (t - t0) / 900);
            el.textContent = String(Math.round(fin * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(paso); else el.textContent = String(fin);
        }
        requestAnimationFrame(paso);
    }
    var cifras = doc.querySelectorAll('.cifra-n[data-fin]');
    if (cifras.length && 'IntersectionObserver' in window && !reducir) {
        var obsCifras = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (en) {
                if (en.isIntersecting) { obsCifras.unobserve(en.target); contar(en.target); }
            });
        }, { threshold: 0.4 });
        cifras.forEach(function (c) { obsCifras.observe(c); });
    }

    var pista = doc.getElementById('galeria-pista');
    var ctl = doc.getElementById('galeria-ctl');
    if (pista && ctl) {
        var diapos = Array.prototype.slice.call(pista.querySelectorAll('.diapo'));
        var cont = doc.getElementById('galeria-cont');
        var puntos = doc.getElementById('galeria-puntos');
        var actual = 0;
        ctl.hidden = false;
        diapos.forEach(function (d, i) {
            var b = doc.createElement('button');
            b.type = 'button';
            b.className = 'punto';
            b.setAttribute('aria-label', 'Ir a la captura ' + (i + 1));
            b.addEventListener('click', function () { ir(i); });
            puntos.appendChild(b);
        });
        var botones = puntos.querySelectorAll('.punto');
        function marcar(i) {
            actual = i;
            cont.textContent = (i + 1) + ' de ' + diapos.length;
            botones.forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
        }
        function ir(i) {
            i = (i + diapos.length) % diapos.length;
            pista.scrollTo({ left: diapos[i].offsetLeft - pista.offsetLeft - (pista.clientWidth - diapos[i].clientWidth) / 2, behavior: reducir ? 'auto' : 'smooth' });
            marcar(i);
        }
        doc.getElementById('galeria-ant').addEventListener('click', function () { ir(actual - 1); });
        doc.getElementById('galeria-sig').addEventListener('click', function () { ir(actual + 1); });
        var temporizador = null;
        pista.addEventListener('scroll', function () {
            clearTimeout(temporizador);
            temporizador = setTimeout(function () {
                var centro = pista.scrollLeft + pista.clientWidth / 2, mejor = 0, dist = Infinity;
                diapos.forEach(function (d, k) {
                    var c = d.offsetLeft - pista.offsetLeft + d.clientWidth / 2;
                    if (Math.abs(c - centro) < dist) { dist = Math.abs(c - centro); mejor = k; }
                });
                if (mejor !== actual) marcar(mejor);
            }, 80);
        });
        pista.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); ir(actual - 1); }
        });
        marcar(0);
    }

    var marco = doc.getElementById('demo-marco');
    var iframe = doc.getElementById('demo-iframe');
    var espera = doc.getElementById('demo-espera');
    function cargarDemo() {
        if (!iframe || iframe.getAttribute('src')) return;
        iframe.addEventListener('load', function () { iframe.hidden = false; if (espera) espera.hidden = true; });
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
    }
    if (marco && iframe) {
        if ('IntersectionObserver' in window) {
            var obsDemo = new IntersectionObserver(function (entradas) {
                if (entradas.some(function (e) { return e.isIntersecting; })) { obsDemo.disconnect(); cargarDemo(); }
            }, { rootMargin: '200px 0px' });
            obsDemo.observe(marco);
        }
    }
    var pantalla = doc.getElementById('demo-pantalla');
    if (pantalla && iframe && iframe.requestFullscreen) {
        pantalla.addEventListener('click', function (e) {
            e.preventDefault();
            cargarDemo();
            iframe.hidden = false;
            iframe.requestFullscreen().catch(function () { window.open(pantalla.href, '_blank', 'noopener'); });
        });
    }
})();
