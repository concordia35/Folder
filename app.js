const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

function createInfoItem(label, value) {
  const item = createElement("div", "contact-item");
  item.append(createElement("div", "contact-label", label));
  item.append(createElement("div", "contact-value", value));
  return item;
}

function createEventCard(event) {
  const card = createElement("article", "event-card section-grid");
  const content = createElement("div");
  content.append(createElement("div", "label", event.label || "Arrangement"));
  content.append(createElement("h2", "", event.title));
  content.append(createElement("p", "", event.intro));

  const details = createElement("div", "contact-box");
  (event.details || []).forEach(detail => {
    details.append(createInfoItem(detail.label, detail.value));
  });

  if (event.link?.url && event.link?.text) {
    const linkItem = createElement("div", "contact-item");
    linkItem.append(createElement("div", "contact-label", event.link.label || "Læs mere"));
    const value = createElement("div", "contact-value");
    const link = createElement("a", "", event.link.text);
    link.href = event.link.url;
    if (/^https?:/i.test(event.link.url)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    value.append(link);
    linkItem.append(value);
    details.append(linkItem);
  }

  content.append(details);
  card.append(content);

  if (event.image) {
    const imageCard = createElement("div", "flyer-card");
    const image = createElement("img");
    image.src = event.image;
    image.alt = event.imageAlt || event.title;
    image.loading = "lazy";
    image.decoding = "async";
    imageCard.append(image);
    card.append(imageCard);
  }

  return card;
}

function renderEvents(data) {
  const eventContainer = document.getElementById("arrangementerIndhold");
  const visitContainer = document.getElementById("besoeg");
  if (!eventContainer || !visitContainer) return;

  eventContainer.replaceChildren();
  const events = (data.arrangementer || []).filter(event => event.active !== false);

  if (events.length === 0) {
    eventContainer.append(createElement("div", "label", "Arrangementer"));
    eventContainer.append(createElement("h2", "", "Nye arrangementer er på vej"));
    eventContainer.append(createElement("p", "", "Følg med her eller på vores sociale medier."));
  } else {
    const list = createElement("div", "event-list");
    events.forEach(event => list.append(createEventCard(event)));
    eventContainer.append(list);
  }

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
    const container = document.getElementById("arrangementerIndhold");
    if (container) {
      container.replaceChildren(
        createElement("div", "label", "Arrangementer"),
        createElement("h2", "", "Arrangementerne kunne ikke indlæses"),
        createElement("p", "", "Prøv at genindlæse siden, når du har forbindelse igen.")
      );
    }
    console.warn("Arrangementer kunne ikke indlæses", error);
  }
}

loadEvents();

function closeMobileMenu() {
  if (!mobileMenuBtn || !mobileNav) return;
  mobileNav.classList.remove("open");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
  mobileMenuBtn.setAttribute("aria-label", "Åbn menu");
}

if (mobileMenuBtn && mobileNav) {
  mobileMenuBtn.addEventListener("click", function () {
    const isOpen = mobileNav.classList.toggle("open");
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    mobileMenuBtn.setAttribute("aria-label", isOpen ? "Luk menu" : "Åbn menu");
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMobileMenu);
  });
}

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
    closeMobileMenu();
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
