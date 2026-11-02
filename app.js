const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

function renderEvents(data) {
  const visitContainer = document.getElementById("besoeg");
  if (!visitContainer) return;
  visitContainer.replaceChildren();
  if (data.besoeg?.active !== false) {
    const outer = createElement("div", "container");
    const card = createElement("div", "visit-card");
    const text = createElement("div");
    text.append(createElement("div", "label", data.besoeg.label));
    const title = createElement("h2", "", data.besoeg.title);
    title.id = "naeste-besoeg";
    text.append(title, createElement("p", "", data.besoeg.text));
    card.append(text);

    if (data.besoeg.button?.url && data.besoeg.button?.text) {
      const button = createElement("a", "btn", data.besoeg.button.text);
      button.href = data.besoeg.button.url;
      card.append(button);
    }

    outer.append(card);
    visitContainer.append(outer);
  } else {
    visitContainer.hidden = true;
  }
}

async function loadEvents() {
  try {
    const response = await fetch("./arrangementer.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderEvents(await response.json());
  } catch (error) {
    console.warn("Besøgsoplysninger kunne ikke indlæses", error);
  }
}

loadEvents();

const modalContent = {
  venskab: {
    title: "Venskab og fortrolighed",
    text: `I logen opstår venskaber, der rækker ud over det sædvanlige.
Her mødes vi i respekt og tillid, hvor der er plads til ærlige samtaler og forskelligheder.

Fortroligheden skaber trygge rammer, hvor man kan være sig selv –
og venskaber, der varer ved.`
  },
  etik: {
    title: "Etik og personlig udvikling",
    text: `I logen arbejder vi med refleksion og værdier, der giver retning i hverdagen.
Gennem samtaler, traditioner og eftertanke udvikler vi os – ikke for at blive perfekte, men for at blive mere bevidste mennesker.

Det er en personlig rejse, hvor man hele tiden kan vokse.`
  },
  respekt: {
    title: "Respekt for forskellighed",
    text: `Vi er forskellige – i alder, baggrund og livssyn.
Netop derfor mødes vi med nysgerrighed og respekt for hinandens perspektiver.

I logen er der plads til at være sig selv, og styrken ligger i det, vi ikke er ens om.`
  },
  lokalt: {
    title: "Et lokalt fællesskab med dybe rødder",
    text: `Logen er en del af lokalmiljøet og bygger på mange års historie og traditioner.
Her mødes mennesker med tilknytning til området i et fællesskab, der både rækker bagud og fremad.

Det er et sted, hvor relationer skabes – og føres videre.`
  }
};

function openModal(key) {
  const modal = document.getElementById("featureModal");
  const title = document.getElementById("featureModalTitle");
  const text = document.getElementById("featureModalText");
  const content = modalContent[key];

  if (!content) return;

  title.textContent = content.title;
  text.textContent = content.text;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("featureModal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
    closeInstallGuide();
  }
});


let deferredInstallPrompt = null;
const installAppBtn = document.getElementById("installAppBtn");
const nativeInstallBtn = document.getElementById("nativeInstallBtn");

function openInstallGuide() {
  const modal = document.getElementById("installGuideModal");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeInstallGuide() {
  const modal = document.getElementById("installGuideModal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

async function runNativeInstallPrompt() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  if (nativeInstallBtn) {
    nativeInstallBtn.classList.remove("visible");
  }
}

window.addEventListener("beforeinstallprompt", function (event) {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (nativeInstallBtn) {
    nativeInstallBtn.classList.add("visible");
  }
});

if (installAppBtn) {
  installAppBtn.addEventListener("click", openInstallGuide);
}

if (nativeInstallBtn) {
  nativeInstallBtn.addEventListener("click", runNativeInstallPrompt);
}

window.addEventListener("appinstalled", function () {
  deferredInstallPrompt = null;
  if (nativeInstallBtn) {
    nativeInstallBtn.classList.remove("visible");
  }
  closeInstallGuide();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./service-worker.js").catch(function (error) {
      console.warn("Service worker kunne ikke registreres", error);
    });
  });
}


// A paged brochure: only the current spread is exposed to readers.
(() => {
  const main = document.querySelector('main');
  const sections = [...main.children].filter(el => el.tagName === 'SECTION');
  const motto = document.querySelector('.brochure-motto');
  if (motto) sections[0].append(motto);
  const labels = ['Velkommen', 'Om Concordia', 'Er du nysgerrig?', 'En aften i logen', 'Fællesskabet', 'Velgørenhed', 'Besøg os', 'Kontakt', 'Tag brochuren med'];
  sections.forEach((page, i) => {
    page.classList.add('brochure-page');
    page.dataset.pageTitle = labels[i];
    if (!page.id) page.id = 'brochureside-' + (i + 1);
    page.setAttribute('aria-label', labels[i]);
  });
  // Give the longer introduction its own second page rather than shrinking type.
  const about = document.getElementById('om');
  const paragraphs = about.querySelectorAll('.section-grid > div:first-child > p');
  if (paragraphs.length > 1) {
    const continuation = document.createElement('section');
    continuation.className = 'section brochure-page';
    continuation.id = 'vores-faellesskab';
    continuation.dataset.pageTitle = 'Vores fællesskab';
    continuation.setAttribute('aria-label', 'Vores fællesskab');
    const content = createElement('div', 'container reading-page');
    content.append(createElement('div', 'label', 'Menneskene i Concordia'), createElement('h2', '', 'Plads til forskellighed og nærvær'));
    [...paragraphs].slice(1).forEach(p => content.append(p));
    const features = about.querySelector('.feature-grid');
    if (features) content.append(features);
    continuation.append(content);
    about.after(continuation);
  }
  const pages = [...main.querySelectorAll(':scope > .brochure-page')];
  const bar = createElement('nav', 'page-controls');
  bar.setAttribute('aria-label', 'Bladr i brochuren');
  const prev = createElement('button', 'page-arrow', '←');
  prev.type = 'button'; prev.setAttribute('aria-label', 'Forrige side');
  const middle = createElement('div', 'page-position');
  const counter = createElement('span', 'page-counter');
  counter.setAttribute('aria-live', 'polite');
  const dots = createElement('div', 'page-dots');
  middle.append(counter, dots);
  const next = createElement('button', 'page-arrow', '→');
  next.type = 'button'; next.setAttribute('aria-label', 'Næste side');
  bar.append(prev, middle, next);
  main.after(bar);
  let current = 0;
  const available = () => pages.filter(page => !page.hidden && page.childElementCount > 0);
  function show(index, updateHash = true) {
    const list = available();
    current = Math.max(0, Math.min(list.length - 1, index));
    pages.forEach(page => { page.classList.remove('current-page'); page.inert = true; page.setAttribute('aria-hidden', 'true'); });
    const page = list[current];
    if (!page) return;
    page.classList.add('current-page'); page.inert = false; page.removeAttribute('aria-hidden');
    page.scrollTop = 0;
    counter.textContent = `${current + 1} af ${list.length} · ${page.dataset.pageTitle}`;
    prev.disabled = current === 0; next.disabled = current === list.length - 1;
    dots.replaceChildren(...list.map((p, i) => {
      const dot = createElement('button', 'page-dot');
      dot.type = 'button'; dot.setAttribute('aria-label', `Side ${i + 1}: ${p.dataset.pageTitle}`);
      if (i === current) dot.setAttribute('aria-current', 'page');
      dot.addEventListener('click', () => show(i));
      return dot;
    }));
    if (updateHash) history.replaceState(null, '', '#' + page.id);
  }
  const openHash = () => {
    let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const page = target?.closest('.brochure-page');
    if (page && available().includes(page)) show(available().indexOf(page), false);
  };
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    const page = target?.closest('.brochure-page');
    if (!page) return;
    event.preventDefault(); show(available().indexOf(page));
  });
  document.addEventListener('keydown', event => {
    if (document.querySelector('.modal.active') || event.target.closest('input, textarea, select, button, a')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
  });
  let start = null;
  main.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('a,button,input,.modal')) { start = null; return; }
    start = { x:event.touches[0].clientX, y:event.touches[0].clientY };
  }, {passive:true});
  main.addEventListener('touchend', event => {
    if (!start || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
    start = null;
  }, {passive:true});
  main.addEventListener('touchcancel', () => { start = null; }, {passive:true});
  window.addEventListener('hashchange', openHash);
  new MutationObserver(() => {
    const active = pages.find(p => p.classList.contains('current-page'));
    show(Math.max(0, available().indexOf(active)), false);
  }).observe(document.getElementById('besoeg'), {childList:true, attributes:true, attributeFilter:['hidden']});
  document.body.classList.add('paged-brochure');
  show(0, false); openHash();
})();
