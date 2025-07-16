const browserAPI = typeof chrome !== "undefined" ? chrome : browser;

const defaultSettings = {
  roundedBorders: true,
  squareAvatars: true,
  hidePlayButtons: true,
  hideBuyButtons: true,
  hideSidebarContent: true,
  hideUpsells: true,
  hideNavReports: false,
  hideNavPlaylists: false,
  hideNavLoved: false,
  hideNavObsessions: false,
  hideNavEvents: false,
  hideNavNeighbours: false,
  hideNavTags: false,
  hideNavShouts: false,
  hideActions: false,
  largerStats: false,
  useHelvetica: true,
  compactMode: true,
  compactTags: false,
  mainColor: "default",
};

// Remove ad elements
document.querySelectorAll(".advert, .ad").forEach((el) => el.remove());

// Observers
let chartlistObserver = null;
let bodyObserver = null;

// ===================
// Formatting and observation functions
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
// Visual configuration functions
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

  // Esconde as divs com id="tracks-play-all"
  // document.querySelectorAll("#tracks-play-all").forEach((el) => {
  //   el.style.display = enabled ? "none" : "";
  // });
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

  // Adiciona/remover margin-top: 0 para .mpu-subscription-upsell
  // document.querySelectorAll(".mpu-subscription-upsell").forEach((el) => {
  //   if (enabled) {
  //     el.style.setProperty("margin-top", "0", "important");
  //   } else {
  //     el.style.removeProperty("margin-top");
  //   }
  // });
}

function sethideUpsells(enabled) {
  document
    .querySelectorAll(
      ".subscribe-cta, .auth-upgrade-cta, .mpu-subscription-upsell, .mpu-subscription-upsell--mpu, .lazy-features-footer, .user-dashboard-history-subscribe-banner-cta, .buffer-2, .music-section-rediscover-subscribe-banner-cta, .listening-report-row--upsell"
    )
    .forEach((el) => {
      el.style.display = enabled ? "none" : "";
    });

  // Also set margin-top: 0 !important for section.share-desktop only if hideSidebarContent is also enabled
  browserAPI.storage.local.get({ hideSidebarContent: null }, (data) => {
    if (data.hideSidebarContent !== null ? data.hideSidebarContent : true) {
      document.querySelectorAll("section.share-desktop").forEach((el) => {
        if (enabled) {
          el.style.setProperty("margin-top", "0", "important");
        } else {
          el.style.removeProperty("margin-top");
        }
      });
    } else {
      // If hideSidebarContent is not enabled, always remove margin-top
      document.querySelectorAll("section.share-desktop").forEach((el) => {
        el.style.removeProperty("margin-top");
      });
    }
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
    // el.style.gap = enabled ? "8px" : "";
  });
  document.querySelectorAll(".header-metadata-tnew-display").forEach((el) => {
    el.style.fontSize = enabled ? "32px" : "";
    el.style.marginTop = enabled ? "8px" : "";
  });
  document.querySelectorAll(".header-metadata-tnew-item").forEach((el) => {
    el.style.marginBottom = enabled ? "21px" : "";
  });
  document.querySelectorAll(".header-metadata-tnew").forEach((el) => {
    el.style.gap = enabled ? "16px" : "";
  });
}

function setUseHelvetica(enabled) {
  document.body.classList.toggle("use-helvetica", enabled);
}

function setCompactMode(enabled) {
  document.body.classList.toggle("compact-mode", enabled);
}

function setMainColor(value) {
  const root = document.documentElement;
  switch (value) {
    case "softer-red":
      root.style.setProperty("--red", "#BE3144");
      root.style.setProperty("--red-dark", "#872341");
      break;
    case "blue":
      root.style.setProperty("--red", "#5C809E");
      root.style.setProperty("--red-dark", "#3282B8");
      break;
    default: // Default
      root.style.setProperty("--red", "#BA0000");
      root.style.setProperty("--red-dark", "#8E0000");
      break;
  }
}

function setCompactTags(enabled) {
  document.body.classList.toggle("compact-tags", enabled);
}

// ===================
// Navigation functions (navbar)
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
  browserAPI.storage.local.get(
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
// Function to apply all main hides
// ===================

function applyAllHides() {
  browserAPI.storage.local.get(
    {
      hidePlayButtons: null,
      hideBuyButtons: null,
      hideSidebarContent: null,
      hideUpsells: null,
    },
    (localData) => {
      setHidePlayButtons(localData.hidePlayButtons !== null ? localData.hidePlayButtons : true);
      setHideBuyButtons(localData.hideBuyButtons !== null ? localData.hideBuyButtons : true);
      setHideSidebarContent(localData.hideSidebarContent !== null ? localData.hideSidebarContent : true);
      sethideUpsells(localData.hideUpsells !== null ? localData.hideUpsells : true);
    }
  );
}

// ===================
// Popup message listeners
// ===================

browserAPI.runtime.onMessage.addListener((msg) => {
  if (msg.type === "setSquareAvatars") setSquareAvatars(msg.enabled);
  if (msg.type === "setRoundedBorders") setRoundedBorders(msg.enabled);
  if (msg.type === "setHidePlayButtons") setHidePlayButtons(msg.enabled);
  if (msg.type === "setHideBuyButtons") setHideBuyButtons(msg.enabled);
  if (msg.type === "setHideSidebarContent") setHideSidebarContent(msg.enabled);
  if (msg.type === "sethideUpsells") sethideUpsells(msg.enabled);
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
  if (msg.type === "setMainColor") setMainColor(msg.value);
  if (msg.type === "setCompactTags") setCompactTags(msg.enabled);
});

// ===================
// Intercept pushState and replaceState
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
// Initialization
// ===================

onPageChange();

// Function to reapply all settings
function applyAllSettings() {
  browserAPI.storage.local.get(
    {
      roundedBorders: null,
      squareAvatars: null,
      hidePlayButtons: null,
      hideBuyButtons: null,
      hideSidebarContent: null,
      hideUpsells: null,
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
      compactTags: null,
      mainColor: "default",
    },
    (localData) => {
      setRoundedBorders(localData.roundedBorders !== null ? localData.roundedBorders : true);
      setSquareAvatars(localData.squareAvatars !== null ? localData.squareAvatars : true);
      setHidePlayButtons(localData.hidePlayButtons !== null ? localData.hidePlayButtons : true);
      setHideBuyButtons(localData.hideBuyButtons !== null ? localData.hideBuyButtons : true);
      setHideSidebarContent(localData.hideSidebarContent !== null ? localData.hideSidebarContent : true);
      sethideUpsells(localData.hideUpsells !== null ? localData.hideUpsells : true);
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
      setMainColor(localData.mainColor || "default");
      setCompactTags(localData.compactTags !== null ? localData.compactTags : true);
    }
  );
}

// Function to monitor DOM changes
function observeDOMChanges() {
  const observer = new MutationObserver(() => {
    applyAllSettings(); // Reapply settings whenever the DOM changes
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialization
applyAllSettings(); // Apply settings when the page loads
observeDOMChanges(); // Monitor DOM changes
