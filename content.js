// Import custom font (Outfit)
(function injectGoogleFonts() {
  if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Outfit"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap";
    document.head.appendChild(link);
  }
})();

// Bootstrap
// const link = document.createElement("link");
// link.rel = "stylesheet";
// link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
// document.head.appendChild(link);
// const script = document.createElement("script");
// script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js";
// document.head.appendChild(script);

const browserAPI = typeof chrome !== "undefined" ? chrome : browser;

const defaultSettings = {
  roundedBorders: true,
  squareAvatars: true,
  hidePlayButtons: true,
  hideBuyButtons: true,
  hideDetailsGrid: false,
  hideSidebarLabs: true,
  hideSidebarProgress: true,
  hideSidebarStations: true,
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
  useCustomFont: true,
  compactMode: true,
  compactTags: false,
  compactButtons: true,
  hideDeletedShouts: false,
  invertShoutActions: true,
  mainColor: "default",
};

// Remove ad elements
document.querySelectorAll(".advert, .ad").forEach((el) => el.remove());

// Observers
let chartlistObserver = null;
let bodyObserver = null;
let shoutObserver = null;
let bodyClassObserver = null;

// Store current settings state
let currentSettings = {
  hideDeletedShouts: false,
  invertShoutActions: true,
};

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
      // artist.remove();
      artist.style.display = "none"; // Hide the artist element instead of removing it
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
  try {
    // Initialize all observers with error handling
    observeChartlist();
    observeBodyForChartlist();
    observeSecondaryNav();
    observeShoutChanges();
    observeCharacterCount();

    // Start body class protection
    startBodyClassObserver();

    // Ensure shout settings are applied after page change
    setTimeout(() => {
      reapplyShoutSettings();
    }, 200);

    // Additional safety check after longer delay
    setTimeout(() => {
      if (currentSettings.hideDeletedShouts || currentSettings.invertShoutActions) {
        reapplyShoutSettings();
      }
    }, 1000);
  } catch (error) {
    console.warn("Error in onPageChange:", error);
  }
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

function setHideDetailsGrid(enabled) {
  // Hide details if enabled, otherwise show
  document.querySelectorAll(".grid-items-item-details").forEach((el) => {
    el.style.opacity = enabled ? "0" : "1";
    el.style.visibility = enabled ? "hidden" : "visible";
  });

  // Remove any previous style tag we injected
  const prevStyle = document.getElementById("hide-details-grid-style");
  if (prevStyle) prevStyle.remove();

  // Use CSS :hover instead of JS events for better performance and no flicker
  if (enabled) {
    const style = document.createElement("style");
    style.id = "hide-details-grid-style";
    style.textContent = `
      .grid-items-item-details {
        opacity: 0;
        visibility: hidden;
        transition: opacity 2s ease, visibility 2s ease !important;
      }
      .grid-items-item:hover .grid-items-item-details {
        opacity: 1 !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function setHideSidebarLabs(enabled) {
  document.querySelectorAll(".col-sidebar .labs-cta").forEach((el) => {
    el.style.display = enabled ? "none" : "";
  });
}

function setHideSidebarProgress(enabled) {
  document.querySelectorAll(".col-sidebar .your-progress").forEach((el) => {
    el.style.display = enabled ? "none" : "";
  });
}

function setHideSidebarStations(enabled) {
  document.querySelectorAll(".col-sidebar .stationlinks").forEach((el) => {
    el.style.display = enabled ? "none" : "";
  });
}

function setHideUpsells(enabled) {
  document
    .querySelectorAll(
      ".subscribe-cta, .auth-upgrade-cta, .mpu-subscription-upsell, .mpu-subscription-upsell--mpu, .lazy-features-footer, .user-dashboard-history-subscribe-banner-cta, .buffer-2, .music-section-rediscover-subscribe-banner-cta, .listening-report-row--upsell"
    )
    .forEach((el) => {
      el.style.display = enabled ? "none" : "";
    });

  // Set margin-top: 0 !important for section.share-desktop if any sidebar content is hidden
  browserAPI.storage.local.get(
    {
      hideSidebarLabs: null,
      hideSidebarProgress: null,
      hideSidebarStations: null,
    },
    (data) => {
      const anyHidden =
        (data.hideSidebarLabs !== null ? data.hideSidebarLabs : true) ||
        (data.hideSidebarProgress !== null ? data.hideSidebarProgress : true) ||
        (data.hideSidebarStations !== null ? data.hideSidebarStations : true);

      if (anyHidden) {
        document.querySelectorAll("section.share-desktop").forEach((el) => {
          if (enabled) {
            el.style.setProperty("margin-top", "0", "important");
          } else {
            el.style.removeProperty("margin-top");
          }
        });
      } else {
        // If no sidebar content is hidden, always remove margin-top
        document.querySelectorAll("section.share-desktop").forEach((el) => {
          el.style.removeProperty("margin-top");
        });
      }
    }
  );
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

function setUseCustomFont(enabled) {
  document.body.classList.toggle("use-helvetica", enabled);
}

function setCompactMode(enabled) {
  document.body.classList.toggle("compact-mode", enabled);
}

function setMainColor(value) {
  const root = document.documentElement;
  switch (value) {
    default:
      root.style.setProperty("--clr-main", "#BE3144");
      root.style.setProperty("--clr-main-dark", "#872341");
      break;
    case "brighter-red":
      root.style.setProperty("--clr-main", "#BA0000");
      root.style.setProperty("--clr-main-dark", "#8E0000");
      break;
    case "blue":
      // root.style.setProperty("--clr-main", "#5C809E");
      // root.style.setProperty("--clr-main-dark", "#3282B8");
      root.style.setProperty("--clr-main", "#3282B8");
      root.style.setProperty("--clr-main-dark", "#00AAFF");
      break;
    case "pink":
      root.style.setProperty("--clr-main", "#C562AF");
      root.style.setProperty("--clr-main-dark", "#B33791");
      break;
  }
}

function setCompactTags(enabled) {
  document.body.classList.toggle("compact-tags", enabled);
}

function setCompactButtons(enabled) {
  document.body.classList.toggle("compact-buttons", enabled);
}

function setHideDeletedShouts(enabled) {
  currentSettings.hideDeletedShouts = enabled;
  document.body.classList.toggle("hide-deleted-shouts", enabled);

  // Ensure body class observer is active to prevent unwanted removals
  startBodyClassObserver();
}

function setInvertShoutActions(enabled) {
  currentSettings.invertShoutActions = enabled;
  document.body.classList.toggle("invert-shout-actions", enabled);

  // Ensure body class observer is active to prevent unwanted removals
  startBodyClassObserver();
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
// Shout settings reapplication and observation
// ===================

function reapplyShoutSettings() {
  // Force reapplication of current settings to maintain state after DOM changes
  try {
    // Remove existing classes first to ensure clean state
    document.body.classList.remove("hide-deleted-shouts", "invert-shout-actions");

    // Reapply based on current settings
    if (currentSettings.hideDeletedShouts) {
      document.body.classList.add("hide-deleted-shouts");
    }
    if (currentSettings.invertShoutActions) {
      document.body.classList.add("invert-shout-actions");
    }

    // Verify application and retry if needed
    setTimeout(() => {
      let retryNeeded = false;

      if (currentSettings.hideDeletedShouts && !document.body.classList.contains("hide-deleted-shouts")) {
        document.body.classList.add("hide-deleted-shouts");
        retryNeeded = true;
      }

      if (currentSettings.invertShoutActions && !document.body.classList.contains("invert-shout-actions")) {
        document.body.classList.add("invert-shout-actions");
        retryNeeded = true;
      }

      if (retryNeeded) {
        // Final verification after additional delay
        setTimeout(() => {
          if (currentSettings.hideDeletedShouts && !document.body.classList.contains("hide-deleted-shouts")) {
            document.body.classList.add("hide-deleted-shouts");
          }
          if (currentSettings.invertShoutActions && !document.body.classList.contains("invert-shout-actions")) {
            document.body.classList.add("invert-shout-actions");
          }
        }, 100);
      }
    }, 50);
  } catch (error) {
    console.warn("LastFM Reworked: Error reapplying shout settings:", error);

    // Fallback retry
    setTimeout(() => {
      try {
        if (currentSettings.hideDeletedShouts) {
          document.body.classList.add("hide-deleted-shouts");
        }
        if (currentSettings.invertShoutActions) {
          document.body.classList.add("invert-shout-actions");
        }
      } catch (fallbackError) {
        console.warn("LastFM Reworked: Fallback retry also failed:", fallbackError);
      }
    }, 200);
  }
}

function observeShoutChanges() {
  // Stop existing observer if any
  if (shoutObserver) {
    shoutObserver.disconnect();
    shoutObserver = null;
  }

  // Look for multiple possible shout containers
  const possibleContainers = [
    ".shout-list",
    ".shoutbox",
    "#shoutbox",
    ".shout-container",
    ".shoutbox-container",
    "[data-shout-container]",
    '[class*="shout"]',
    ".js-shout-list",
  ];

  let shoutContainer = null;
  for (const selector of possibleContainers) {
    shoutContainer = document.querySelector(selector);
    if (shoutContainer) {
      // console.log(`LastFM Reworked: Found shout container using selector: ${selector}`);
      break;
    }
  }

  // Fallback to document.body if no specific container found
  if (!shoutContainer) {
    shoutContainer = document.body;
    // console.log("LastFM Reworked: Using document.body as shout container fallback");
  }

  if (shoutContainer) {
    let reapplyTimeout = null;
    let lastMutationTime = Date.now();

    shoutObserver = new MutationObserver((mutations) => {
      let shouldReapply = false;
      const currentTime = Date.now();

      mutations.forEach((mutation) => {
        // Check if shout-related elements were added, removed, or modified
        if (mutation.type === "childList") {
          // Check added nodes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (isShoutRelatedElement(node)) {
                shouldReapply = true;
                // console.log("LastFM Reworked: Detected shout-related element added");
              }
            }
          });

          // Check removed nodes (might affect styling)
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (isShoutRelatedElement(node)) {
                shouldReapply = true;
                // console.log("LastFM Reworked: Detected shout-related element removed");
              }
            }
          });
        }

        // Check attribute changes that might affect shout elements
        if (mutation.type === "attributes" && mutation.target.nodeType === 1) {
          if (isShoutRelatedElement(mutation.target) || mutation.attributeName === "class" || mutation.attributeName === "data-shout-id") {
            shouldReapply = true;
            // console.log("LastFM Reworked: Detected shout-related attribute change");
          }
        }
      });

      if (shouldReapply && currentTime - lastMutationTime > 100) {
        lastMutationTime = currentTime;

        // Clear previous timeout to avoid multiple rapid reapplications
        if (reapplyTimeout) {
          clearTimeout(reapplyTimeout);
        }

        // Debounce reapplication to avoid performance issues
        reapplyTimeout = setTimeout(() => {
          // console.log("LastFM Reworked: Reapplying shout settings due to DOM changes");
          reapplyShoutSettings();
          reapplyTimeout = null;
        }, 100);
      }
    });

    shoutObserver.observe(shoutContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-shout-id", "style"],
    });
    // console.log("LastFM Reworked: Shout observer started successfully");
  }
}

function isShoutRelatedElement(element) {
  if (!element || !element.classList) return false;

  const shoutRelatedClasses = [
    "shout",
    "shout-list-item",
    "shout-container",
    "shout-actions",
    "shout--deleted",
    "vote-button-toggle",
    "shout-more-actions",
    "js-shout",
    "shout-reply",
    "shout-vote",
  ];

  // Check if element has shout-related classes
  for (const className of shoutRelatedClasses) {
    if (element.classList.contains(className)) {
      return true;
    }
  }

  // Check if element contains shout-related children
  for (const className of shoutRelatedClasses) {
    if (element.querySelector(`.${className}`)) {
      return true;
    }
  }

  return false;
}

function startBodyClassObserver() {
  // Stop existing body class observer if any
  if (bodyClassObserver) {
    bodyClassObserver.disconnect();
    bodyClassObserver = null;
  }

  // Create observer to monitor body class changes
  bodyClassObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        // Check if our critical classes were removed
        const bodyClasses = document.body.classList;

        let needsReapplication = false;

        if (currentSettings.hideDeletedShouts && !bodyClasses.contains("hide-deleted-shouts")) {
          needsReapplication = true;
        }

        if (currentSettings.invertShoutActions && !bodyClasses.contains("invert-shout-actions")) {
          needsReapplication = true;
        }

        if (needsReapplication) {
          // Reapply settings immediately
          setTimeout(() => {
            reapplyShoutSettings();
          }, 10);
        }
      }
    });
  });

  bodyClassObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

// ===================
// Function to apply all main hides
// ===================

function applyAllHides() {
  browserAPI.storage.local.get(
    {
      hidePlayButtons: null,
      hideBuyButtons: null,
      hideDetailsGrid: null,
      hideSidebarLabs: null,
      hideSidebarProgress: null,
      hideSidebarStations: null,
      hideUpsells: null,
    },
    (localData) => {
      setHidePlayButtons(localData.hidePlayButtons !== null ? localData.hidePlayButtons : true);
      setHideBuyButtons(localData.hideBuyButtons !== null ? localData.hideBuyButtons : true);
      setHideDetailsGrid(localData.hideDetailsGrid !== null ? localData.hideDetailsGrid : false);
      setHideSidebarLabs(localData.hideSidebarLabs !== null ? localData.hideSidebarLabs : true);
      setHideSidebarProgress(localData.hideSidebarProgress !== null ? localData.hideSidebarProgress : true);
      setHideSidebarStations(localData.hideSidebarStations !== null ? localData.hideSidebarStations : true);
      setHideUpsells(localData.hideUpsells !== null ? localData.hideUpsells : true);
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
  if (msg.type === "setHideDetailsGrid") setHideDetailsGrid(msg.enabled);
  if (msg.type === "setHideSidebarLabs") setHideSidebarLabs(msg.enabled);
  if (msg.type === "setHideSidebarProgress") setHideSidebarProgress(msg.enabled);
  if (msg.type === "setHideSidebarStations") setHideSidebarStations(msg.enabled);
  if (msg.type === "setHideUpsells") setHideUpsells(msg.enabled);
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
  if (msg.type === "setUseCustomFont") setUseCustomFont(msg.enabled);
  if (msg.type === "setCompactMode") setCompactMode(msg.enabled);
  if (msg.type === "setCompactTags") setCompactTags(msg.enabled);
  if (msg.type === "setCompactButtons") setCompactButtons(msg.enabled);
  if (msg.type === "setHideDeletedShouts") setHideDeletedShouts(msg.enabled);
  if (msg.type === "setInvertShoutActions") setInvertShoutActions(msg.enabled);
  if (msg.type === "setMainColor") setMainColor(msg.value);
});

function observeShoutUserChanges() {
  const targetNode = document.body;
  const userCache = new Map(); // Cache para armazenar informações de "currently playing"
  const pendingRequests = new Set(); // Rastrear usuários com requisições pendentes
  let requestTimeout = null; // Controlar intervalo entre requisições

  // Função para criar ou reaplicar o span
  function ensureCurrentlyPlayingSpan(shoutUserH3, { artist, song, artistLink, songLink }) {
    if (shoutUserH3.querySelector(".currently-playing-box")) {
      return; // Se o span já existe, não faz nada
    }

    const span = document.createElement("span");
    span.className = "currently-playing-box";
    span.title = `${artist} - ${song}`;

    const innerSpan = document.createElement("span");
    innerSpan.className = "currently-playing-text";

    const artistAnchor = document.createElement("a");
    artistAnchor.href = artistLink;
    artistAnchor.textContent = artist;
    // artistAnchor.target = "_blank";
    artistAnchor.rel = "noopener noreferrer";

    const separator = document.createTextNode(" - ");

    const songAnchor = document.createElement("a");
    songAnchor.href = songLink;
    songAnchor.textContent = song;
    // songAnchor.target = "_blank";
    songAnchor.rel = "noopener noreferrer";

    innerSpan.appendChild(artistAnchor);
    innerSpan.appendChild(separator);
    innerSpan.appendChild(songAnchor);

    span.appendChild(innerSpan);
    shoutUserH3.appendChild(span);
  }

  // Função para carregar dados de "currently playing"
  async function fetchCurrentlyPlaying(username) {
    try {
      const profileResponse = await fetch(`https://www.last.fm/user/${username}`);
      if (!profileResponse.ok) {
        throw new Error(`Erro ao acessar o perfil do usuário: ${profileResponse.status}`);
      }

      const profileText = await profileResponse.text();
      const parser = new DOMParser();
      const profileDoc = parser.parseFromString(profileText, "text/html");
      const nowPlayingRow = profileDoc.querySelector("tr.chartlist-row--now-scrobbling");

      if (nowPlayingRow) {
        const artistElement = nowPlayingRow.querySelector("td.chartlist-artist a");
        const songElement = nowPlayingRow.querySelector("td.chartlist-name a[href*='/_/']");

        if (artistElement && songElement) {
          return {
            artist: artistElement.textContent.trim(),
            song: songElement.textContent.trim(),
            artistLink: artistElement.href,
            songLink: songElement.href,
          };
        }
      }
    } catch (error) {
      console.error(`Erro ao buscar faixa atual para o usuário ${username}:`, error);
    }
    return null;
  }

  // Carregar todos os usuários na shoutbox
  async function loadShoutboxUsers() {
    const shoutUsers = document.querySelectorAll("h3.shout-user");
    const newRequests = [];

    for (const shoutUserH3 of shoutUsers) {
      const usernameElement = shoutUserH3.querySelector("a.link-block-target");
      const username = usernameElement ? usernameElement.textContent.trim() : null;

      if (username && !pendingRequests.has(username)) {
        if (userCache.has(username)) {
          // Reaplicar span se já temos os dados no cache
          ensureCurrentlyPlayingSpan(shoutUserH3, userCache.get(username));
        } else {
          // Adicionar à lista de novas requisições
          newRequests.push({ shoutUserH3, username });
          pendingRequests.add(username);
        }
      }
    }

    if (newRequests.length > 0) {
      // Realizar requisições em paralelo
      await Promise.all(
        newRequests.map(async ({ shoutUserH3, username }) => {
          try {
            const currentlyPlaying = await fetchCurrentlyPlaying(username);
            if (currentlyPlaying) {
              userCache.set(username, currentlyPlaying);
              ensureCurrentlyPlayingSpan(shoutUserH3, currentlyPlaying);
            }
          } catch (error) {
            console.error(`Erro ao processar usuário ${username}:`, error);
          } finally {
            pendingRequests.delete(username); // Remover dos pendentes
          }
        })
      );
    }
  }

  // Observar mudanças na shoutbox
  const observer = new MutationObserver(() => {
    loadShoutboxUsers();
  });

  observer.observe(targetNode, { childList: true, subtree: true });

  // Carregar usuários iniciais
  loadShoutboxUsers();

  // Reaplicar o observador em mudanças de página
  function handlePageChange() {
    console.log("Verificando novamente após mudança de URL...");
    userCache.clear(); // Limpar cache para a nova página
    pendingRequests.clear(); // Limpar requisições pendentes

    // Adicionar um atraso antes de carregar os usuários
    setTimeout(() => {
      loadShoutboxUsers(); // Recarregar usuários na nova página
    }, 500); // Atraso de 500ms (ajustável conforme necessário)
  }

  window.addEventListener("popstate", handlePageChange);

  ["pushState", "replaceState"].forEach((type) => {
    const original = history[type];
    history[type] = function (...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event("pagechange")); // Disparar evento personalizado
      return result;
    };
  });

  // Adicionar listener para o evento personalizado
  window.addEventListener("pagechange", handlePageChange);
}

observeShoutUserChanges();

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
      hideDetailsGrid: null,
      hideSidebarLabs: null,
      hideSidebarProgress: null,
      hideSidebarStations: null,
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
      useCustomFont: null,
      compactMode: null,
      compactTags: null,
      compactButtons: null,
      hideDeletedShouts: null,
      invertShoutActions: null,
      mainColor: "default",
    },
    (localData) => {
      try {
        setRoundedBorders(localData.roundedBorders !== null ? localData.roundedBorders : true);
        setSquareAvatars(localData.squareAvatars !== null ? localData.squareAvatars : true);
        setHidePlayButtons(localData.hidePlayButtons !== null ? localData.hidePlayButtons : true);
        setHideBuyButtons(localData.hideBuyButtons !== null ? localData.hideBuyButtons : true);
        setHideDetailsGrid(localData.hideDetailsGrid !== null ? localData.hideDetailsGrid : false);
        setHideSidebarLabs(localData.hideSidebarLabs !== null ? localData.hideSidebarLabs : true);
        setHideSidebarProgress(localData.hideSidebarProgress !== null ? localData.hideSidebarProgress : true);
        setHideSidebarStations(localData.hideSidebarStations !== null ? localData.hideSidebarStations : true);
        setHideUpsells(localData.hideUpsells !== null ? localData.hideUpsells : true);
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
        setUseCustomFont(localData.useCustomFont !== null ? localData.useCustomFont : true);
        setCompactMode(localData.compactMode !== null ? localData.compactMode : true);
        setCompactTags(localData.compactTags !== null ? localData.compactTags : false);
        setCompactButtons(localData.compactButtons !== null ? localData.compactButtons : true);
        setMainColor(localData.mainColor || "default");

        // Apply shout settings and update current state
        const hideDeletedShouts = localData.hideDeletedShouts !== null ? localData.hideDeletedShouts : false;
        const invertShoutActions = localData.invertShoutActions !== null ? localData.invertShoutActions : true;

        setHideDeletedShouts(hideDeletedShouts);
        setInvertShoutActions(invertShoutActions);
      } catch (error) {
        console.warn("Error applying settings:", error);
      }
    }
  );
}

// document.querySelectorAll(".library-controls").forEach((el) => {
//   const parent = el.parentNode;
//   while (el.firstChild) {
//     parent.insertBefore(el.firstChild, el);
//   }
//   el.remove();
// });

// Function to handle .text-18 elements with only whitespace
function handleEmptyText18Elements() {
  document.querySelectorAll(".text-18").forEach((element) => {
    const hasRealContent = element.textContent.trim().length > 0 || element.children.length > 0;

    if (hasRealContent) {
      element.classList.add("has-content");
    } else {
      element.classList.remove("has-content");
    }
  });
}

// Function to handle character count coloring in comment forms
function handleCharacterCountColors() {
  try {
    const helpTexts = document.querySelectorAll(".form-row-help-text.js-field-help-text");

    helpTexts.forEach((helpText) => {
      const charCountSpan = helpText.querySelector(".js-char-count");

      if (charCountSpan) {
        const charCount = parseInt(charCountSpan.textContent) || 0;

        // Remove existing classes
        helpText.classList.remove("char-count-warning", "char-count-danger");

        // Apply color based on character count
        if (charCount >= 1000) {
          helpText.classList.add("char-count-danger");
          console.log(`LastFM Reworked: Character count at danger level: ${charCount}`);
        } else if (charCount >= 750) {
          helpText.classList.add("char-count-warning");
          console.log(`LastFM Reworked: Character count at warning level: ${charCount}`);
        }
        // Default gray-light color applies when no classes are added
      }
    });
  } catch (error) {
    console.warn("LastFM Reworked: Error in handleCharacterCountColors:", error);
  }
}

// Observer for character count changes
let charCountObserver = null;

function observeCharacterCount() {
  // Stop existing observer if any
  if (charCountObserver) {
    charCountObserver.disconnect();
    charCountObserver = null;
  }

  // Look for comment form containers and character count elements specifically
  const targets = [
    ...document.querySelectorAll('.shout-form, .js-shout-form, [class*="shout-form"]'),
    ...document.querySelectorAll(".form-row-help-text, .js-field-help-text"),
    ...document.querySelectorAll(".js-char-count"),
    document.body, // Fallback to body if specific elements not found
  ].filter(Boolean);

  if (targets.length > 0) {
    charCountObserver = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        // Check if character count elements were modified
        if (mutation.type === "childList" || mutation.type === "characterData") {
          const target = mutation.target;

          // Check if the mutation affects character count elements
          if (
            target.classList?.contains("js-char-count") ||
            target.closest?.(".js-char-count") ||
            target.closest?.(".form-row-help-text") ||
            target.querySelector?.(".js-char-count") ||
            (mutation.addedNodes &&
              Array.from(mutation.addedNodes).some(
                (node) => node.nodeType === 1 && (node.classList?.contains("js-char-count") || node.querySelector?.(".js-char-count"))
              ))
          ) {
            shouldUpdate = true;
          }
        }

        // Also check for attribute changes on relevant elements
        if (mutation.type === "attributes" && (mutation.target.classList?.contains("js-char-count") || mutation.target.closest?.(".form-row-help-text"))) {
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        // Small delay to ensure DOM is updated
        setTimeout(handleCharacterCountColors, 25);
      }
    });

    // Observe each target
    targets.forEach((target) => {
      if (target && target.nodeType === 1) {
        charCountObserver.observe(target, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ["class", "data-count", "value"],
        });
      }
    });

    // Initial color application
    setTimeout(handleCharacterCountColors, 100);

    console.log("LastFM Reworked: Character count observer started");
  }
}

// Scroll fade header
let lastScroll = 0;
const topBar = document.querySelector(".top-bar");
const masthead = document.querySelector(".masthead");
const mastheadHeight = masthead.offsetHeight;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll > mastheadHeight) {
    if (currentScroll > lastScroll) {
      // scroll pra baixo → esconde
      topBar.style.top = `-${topBar.offsetHeight}px`;
      masthead.style.top = `-${masthead.offsetHeight}px`;
    } else {
      // scroll pra cima → mostra
      topBar.style.top = "0";
      masthead.style.top = "0";
    }
  } else {
    // se estiver antes da altura da masthead, sempre mostra
    topBar.style.top = "0";
    masthead.style.top = "0";
  }

  lastScroll = currentScroll;
});

//
//
//
//
//
//
//
//

// Function to monitor DOM changes
function observeDOMChanges() {
  const observer = new MutationObserver(() => {
    applyAllSettings(); // Reapply settings whenever the DOM changes
    handleEmptyText18Elements(); // Handle .text-18 elements
    handleCharacterCountColors(); // Handle character count colors
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Periodic check to ensure settings remain applied
function startPeriodicCheck() {
  setInterval(() => {
    try {
      // Check if critical classes are still applied
      const bodyClasses = document.body.classList;
      let needsReapplication = false;

      if (currentSettings.hideDeletedShouts && !bodyClasses.contains("hide-deleted-shouts")) {
        needsReapplication = true;
      }

      if (currentSettings.invertShoutActions && !bodyClasses.contains("invert-shout-actions")) {
        needsReapplication = true;
      }

      if (needsReapplication) {
        console.log("LastFM Reworked: Reapplying shout settings due to periodic check");
        reapplyShoutSettings();
      }

      // Additional check: verify if shout containers exist and apply settings
      const shoutContainers = document.querySelectorAll('.shout-list, .shoutbox, .shout-container, [class*="shout"]');
      if (shoutContainers.length > 0 && (currentSettings.hideDeletedShouts || currentSettings.invertShoutActions)) {
        // Force reapplication on containers
        setTimeout(() => {
          reapplyShoutSettings();
        }, 100);
      }
    } catch (error) {
      console.warn("LastFM Reworked: Error in periodic check:", error);
    }
  }, 1500); // Check every 1.5 seconds for more responsiveness
}

// Enhanced initialization function
function initializeExtension() {
  try {
    // Apply all settings first
    applyAllSettings();

    // Handle text elements
    handleEmptyText18Elements();

    // Handle character count colors
    handleCharacterCountColors();

    // Start DOM monitoring
    observeDOMChanges();

    // Start page change monitoring
    onPageChange();

    // Start periodic verification
    startPeriodicCheck();

    // Add window focus event listeners to reapply settings
    window.addEventListener("focus", () => {
      setTimeout(() => {
        if (currentSettings.hideDeletedShouts || currentSettings.invertShoutActions) {
          reapplyShoutSettings();
        }
        handleCharacterCountColors();
      }, 100);
    });

    // Add visibility change listener
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        setTimeout(() => {
          if (currentSettings.hideDeletedShouts || currentSettings.invertShoutActions) {
            reapplyShoutSettings();
          }
          handleCharacterCountColors();
        }, 100);
      }
    });

    // Add input event listeners for character count monitoring
    document.addEventListener("input", (event) => {
      if (event.target.matches('textarea, input[type="text"]')) {
        // Check if this input is related to a form with character counting
        const form = event.target.closest("form, .shout-form, .js-shout-form");
        if (form && form.querySelector(".js-char-count")) {
          setTimeout(handleCharacterCountColors, 10);
        }
      }
    });

    // Add keyup event listener as backup
    document.addEventListener("keyup", (event) => {
      if (event.target.matches('textarea, input[type="text"]')) {
        const form = event.target.closest("form, .shout-form, .js-shout-form");
        if (form && form.querySelector(".js-char-count")) {
          setTimeout(handleCharacterCountColors, 10);
        }
      }
    });

    // Additional initialization after DOM is ready
    setTimeout(() => {
      applyAllSettings();
      reapplyShoutSettings();
    }, 500);

    // Final safety check after longer delay
    setTimeout(() => {
      if (currentSettings.hideDeletedShouts || currentSettings.invertShoutActions) {
        reapplyShoutSettings();
      }
    }, 2000);

    console.log("LastFM Reworked: Extension initialized successfully");
  } catch (error) {
    console.warn("LastFM Reworked: Error during extension initialization:", error);
  }
}

// Initialization
initializeExtension();
