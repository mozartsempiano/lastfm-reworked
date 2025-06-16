// Remove elementos de propaganda
document.querySelectorAll(".advert, .ad").forEach((el) => el.remove());

// Observers
let chartlistObserver = null;
let bodyObserver = null;

// ===================
// Funções de formatação e observação
// ===================

function formatArtistTrackRows() {
  const rows = document.getElementsByClassName("chartlist-row--with-artist chartlist-row");
  for (const row of Array.from(rows)) {
    const artist = row.getElementsByClassName("chartlist-artist")[0],
      name = row.getElementsByClassName("chartlist-name")[0];
    if (!artist || !name) continue;
    if (!row.classList.contains("debloat-artist-first")) {
      name.innerHTML = `${artist.innerHTML} – ${name.innerHTML}`;
      artist.remove();
      row.classList.add("debloat-artist-first");
    }
  }
}

function observeChartlist() {
  if (chartlistObserver) chartlistObserver.disconnect();
  const chartlist = document.querySelector(".chartlist");
  if (chartlist) {
    chartlistObserver = new MutationObserver(() => {
      formatArtistTrackRows();
      applyAllHides();
    });
    chartlistObserver.observe(chartlist, { childList: true, subtree: true });
    formatArtistTrackRows();
    applyAllHides();
  }
}

function observeBodyForChartlist() {
  if (bodyObserver) bodyObserver.disconnect();
  bodyObserver = new MutationObserver(() => {
    if (document.querySelector(".chartlist")) {
      observeChartlist();
    }
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}

function onPageChange() {
  observeChartlist();
  observeBodyForChartlist();
  observeSecondaryNav();
}

// ===================
// Funções de configuração visual
// ===================

function setSquareAvatars(enabled) {
  document.body.classList.toggle("square-avatars", enabled);
}

function setRoundedBorders(enabled) {
  document.body.classList.toggle("no-radius", !enabled);
}

function setCircularAvatars(enabled) {
  document.body.classList.toggle("circular-avatars", enabled);
}

function setHidePlayButtons(enabled) {
  document.querySelectorAll("table td.chartlist-play").forEach((el) => {
    el.style.display = enabled ? "none" : "";
  });
}

function setHideBuyButtons(enabled) {
  document.querySelectorAll("table td.chartlist-buylinks").forEach((el) => {
    el.style.display = enabled ? "none" : "";
  });
}

function setHideSidebarContent(enabled) {
  document.querySelectorAll(".col-sidebar .stationlinks, .col-sidebar .your-progress, .col-sidebar .labs-cta").forEach((el) => {
    el.style.display = enabled ? "none" : "";
  });
}

function setHideAds(enabled) {
  document
    .querySelectorAll(
      ".subscribe-cta, .mpu-subscription-upsell, .mpu-subscription-upsell--mpu, .lazy-features-footer, .user-dashboard-history-subscribe-banner-cta, .buffer-2"
    )
    .forEach((el) => {
      el.style.display = enabled ? "none" : "";
    });
}

function setHideActions(enabled) {
  document.querySelectorAll(".header-new-actions").forEach((el) => {
    el.style.display = enabled ? "none" : "";
  });
  document.querySelectorAll(".header-metadata-tnew").forEach((el) => {
    el.style.margin = enabled ? "0" : "";
  });
}

function setLargerStats(enabled) {
  document.querySelectorAll(".header-metadata-tnew-title").forEach((el) => {
    el.style.fontSize = enabled ? "16px" : "";
    el.style.gap = enabled ? "8px" : "";
  });
  document.querySelectorAll(".header-metadata-tnew-display").forEach((el) => {
    el.style.fontSize = enabled ? "32px" : "";
    el.style.marginTop = enabled ? "8px" : "";
  });
}

function setUseHelvetica(enabled) {
  document.body.classList.toggle("use-helvetica", enabled);
}

function setCompactMode(enabled) {
  document.body.classList.toggle("compact-mode", enabled);
}

function setUseSofterRed(enabled) {
  const root = document.documentElement;
  if (enabled) {
    root.style.setProperty("--vermelho", "#BE3144");
    root.style.setProperty("--vermelho-escuro", "#872341");
  } else {
    root.style.setProperty("--vermelho", "#ba0000");
    root.style.setProperty("--vermelho-escuro", "#8e0000");
  }
}

function setCompactTags(enabled) {
  document.body.classList.toggle("compact-tags", enabled);
}

// ===================
// Funções de navegação (navbar)
// ===================

function hideNavItemByHref(hrefEndsWith, enabled) {
  document.querySelectorAll(`.secondary-nav a[href$="${hrefEndsWith}"]`).forEach((a) => {
    if (a.closest("li")) a.closest("li").style.display = enabled ? "none" : "";
  });
  document.querySelectorAll(`.navlist-hidden-list a[href$="${hrefEndsWith}"]`).forEach((a) => {
    if (a.closest("li")) a.closest("li").style.display = enabled ? "none" : "";
  });
}

function setHideNavReports(enabled) {
  hideNavItemByHref("/listening-report", enabled);
  updateMoreButtonVisibility();
}
function setHideNavPlaylists(enabled) {
  hideNavItemByHref("/playlists", enabled);
  updateMoreButtonVisibility();
}
function setHideNavLoved(enabled) {
  hideNavItemByHref("/loved", enabled);
  updateMoreButtonVisibility();
}
function setHideNavObsessions(enabled) {
  hideNavItemByHref("/obsessions", enabled);
  updateMoreButtonVisibility();
}
function setHideNavEvents(enabled) {
  hideNavItemByHref("/events", enabled);
  updateMoreButtonVisibility();
}
function setHideNavNeighbours(enabled) {
  hideNavItemByHref("/neighbours", enabled);
  updateMoreButtonVisibility();
}
function setHideNavTags(enabled) {
  hideNavItemByHref("/tags", enabled);
  updateMoreButtonVisibility();
}
function setHideNavShouts(enabled) {
  hideNavItemByHref("/shoutbox", enabled);
  updateMoreButtonVisibility();
}

function updateMoreButtonVisibility() {
  const hiddenList = document.querySelector(".navlist-hidden-list");
  const moreButton = document.querySelector(".navlist-more");
  if (!hiddenList || !moreButton) return;
  const hasVisible = Array.from(hiddenList.querySelectorAll("li")).some((li) => li.style.display !== "none");
  moreButton.style.display = hasVisible ? "" : "none";
}

function applyAllNavHides() {
  chrome.storage.local.get(
    {
      hideNavReports: null,
      hideNavPlaylists: null,
      hideNavLoved: null,
      hideNavObsessions: null,
      hideNavEvents: null,
      hideNavNeighbours: null,
      hideNavTags: null,
      hideNavShouts: null,
    },
    (localData) => {
      setHideNavReports(localData.hideNavReports !== null ? localData.hideNavReports : false);
      setHideNavPlaylists(localData.hideNavPlaylists !== null ? localData.hideNavPlaylists : false);
      setHideNavLoved(localData.hideNavLoved !== null ? localData.hideNavLoved : false);
      setHideNavObsessions(localData.hideNavObsessions !== null ? localData.hideNavObsessions : false);
      setHideNavEvents(localData.hideNavEvents !== null ? localData.hideNavEvents : false);
      setHideNavNeighbours(localData.hideNavNeighbours !== null ? localData.hideNavNeighbours : false);
      setHideNavTags(localData.hideNavTags !== null ? localData.hideNavTags : false);
      setHideNavShouts(localData.hideNavShouts !== null ? localData.hideNavShouts : false);
    }
  );
}

function observeSecondaryNav() {
  let nav = document.querySelector(".secondary-nav");
  if (!nav) return;
  const navObserver = new MutationObserver(() => {
    applyAllNavHides();
  });
  navObserver.observe(nav, { childList: true, subtree: true });
  applyAllNavHides();
}

// ===================
// Função para aplicar todas as hides principais
// ===================

function applyAllHides() {
  chrome.storage.local.get(
    {
      hidePlayButtons: null,
      hideBuyButtons: null,
      hideSidebarContent: null,
      hideAds: null,
    },
    (localData) => {
      setHidePlayButtons(localData.hidePlayButtons !== null ? localData.hidePlayButtons : true);
      setHideBuyButtons(localData.hideBuyButtons !== null ? localData.hideBuyButtons : true);
      setHideSidebarContent(localData.hideSidebarContent !== null ? localData.hideSidebarContent : true);
      setHideAds(localData.hideAds !== null ? localData.hideAds : true);
    }
  );
}

// ===================
// Carregar configurações ao iniciar
// ===================

chrome.storage.local.get(
  {
    roundedBorders: null,
    squareAvatars: null,
    hidePlayButtons: null,
    hideBuyButtons: null,
    hideSidebarContent: null,
    hideAds: null,
    hideNavReports: null,
    hideNavPlaylists: null,
    hideNavLoved: null,
    hideNavObsessions: null,
    hideNavEvents: null,
    hideNavNeighbours: null,
    hideNavTags: null,
    hideNavShouts: null,
    hideActions: null,
    largerStats: null,
    useHelvetica: null,
    compactMode: null,
    useSofterRed: null,
    compactTags: null,
  },
  (localData) => {
    setRoundedBorders(localData.roundedBorders !== null ? localData.roundedBorders : true);
    setSquareAvatars(localData.squareAvatars !== null ? localData.squareAvatars : true);
    setHidePlayButtons(localData.hidePlayButtons !== null ? localData.hidePlayButtons : true);
    setHideBuyButtons(localData.hideBuyButtons !== null ? localData.hideBuyButtons : true);
    setHideSidebarContent(localData.hideSidebarContent !== null ? localData.hideSidebarContent : true);
    setHideAds(localData.hideAds !== null ? localData.hideAds : true);
    setHideNavReports(localData.hideNavReports !== null ? localData.hideNavReports : false);
    setHideNavPlaylists(localData.hideNavPlaylists !== null ? localData.hideNavPlaylists : false);
    setHideNavLoved(localData.hideNavLoved !== null ? localData.hideNavLoved : false);
    setHideNavObsessions(localData.hideNavObsessions !== null ? localData.hideNavObsessions : false);
    setHideNavEvents(localData.hideNavEvents !== null ? localData.hideNavEvents : false);
    setHideNavNeighbours(localData.hideNavNeighbours !== null ? localData.hideNavNeighbours : false);
    setHideNavTags(localData.hideNavTags !== null ? localData.hideNavTags : false);
    setHideNavShouts(localData.hideNavShouts !== null ? localData.hideNavShouts : false);
    setHideActions(localData.hideActions !== null ? localData.hideActions : false);
    setLargerStats(localData.largerStats !== null ? localData.largerStats : false);
    setUseHelvetica(localData.useHelvetica !== null ? localData.useHelvetica : true);
    setCompactMode(localData.compactMode !== null ? localData.compactMode : true);
    setUseSofterRed(localData.useSofterRed !== null ? localData.useSofterRed : true);
    setCompactTags(localData.compactTags !== null ? localData.compactTags : true);
  }
);

// ===================
// Listeners de mensagens do popup
// ===================

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "setSquareAvatars") setSquareAvatars(msg.enabled);
  if (msg.type === "setRoundedBorders") setRoundedBorders(msg.enabled);
  if (msg.type === "setHidePlayButtons") setHidePlayButtons(msg.enabled);
  if (msg.type === "setHideBuyButtons") setHideBuyButtons(msg.enabled);
  if (msg.type === "setHideSidebarContent") setHideSidebarContent(msg.enabled);
  if (msg.type === "setHideAds") setHideAds(msg.enabled);
  if (msg.type === "setHideNavReports") setHideNavReports(msg.enabled);
  if (msg.type === "setHideNavPlaylists") setHideNavPlaylists(msg.enabled);
  if (msg.type === "setHideNavLoved") setHideNavLoved(msg.enabled);
  if (msg.type === "setHideNavObsessions") setHideNavObsessions(msg.enabled);
  if (msg.type === "setHideNavEvents") setHideNavEvents(msg.enabled);
  if (msg.type === "setHideNavNeighbours") setHideNavNeighbours(msg.enabled);
  if (msg.type === "setHideNavTags") setHideNavTags(msg.enabled);
  if (msg.type === "setHideNavShouts") setHideNavShouts(msg.enabled);
  if (msg.type === "setHideActions") setHideActions(msg.enabled);
  if (msg.type === "setLargerStats") setLargerStats(msg.enabled);
  if (msg.type === "setUseHelvetica") setUseHelvetica(msg.enabled);
  if (msg.type === "setCompactMode") setCompactMode(msg.enabled);
  if (msg.type === "setUseSofterRed") setUseSofterRed(msg.enabled);
  if (msg.type === "setCompactTags") setCompactTags(msg.enabled);
});

// ===================
// Intercepta pushState e replaceState
// ===================

["pushState", "replaceState"].forEach((type) => {
  const orig = history[type];
  history[type] = function () {
    orig.apply(this, arguments);
    onPageChange();
  };
});
window.addEventListener("popstate", onPageChange);

// ===================
// Inicialização
// ===================

onPageChange();
