const browserAPI = typeof chrome !== "undefined" ? chrome : browser;

document.addEventListener("DOMContentLoaded", () => {
  const roundedCheckbox = document.getElementById("roundedBorders");
  const compactButtons = document.getElementById("compactButtons");
  const squareCheckbox = document.getElementById("squareAvatars");
  const hidePlayButtons = document.getElementById("hidePlayButtons");
  const hideBuyButtons = document.getElementById("hideBuyButtons");
  const hideSidebarLabs = document.getElementById("hideSidebarLabs");
  const hideSidebarProgress = document.getElementById("hideSidebarProgress");
  const hideSidebarStations = document.getElementById("hideSidebarStations");
  const hideUpsells = document.getElementById("hideUpsells");
  const hideNavReports = document.getElementById("hideNavReports");
  const hideNavPlaylists = document.getElementById("hideNavPlaylists");
  const hideNavLoved = document.getElementById("hideNavLoved");
  const hideNavObsessions = document.getElementById("hideNavObsessions");
  const hideNavEvents = document.getElementById("hideNavEvents");
  const hideNavNeighbours = document.getElementById("hideNavNeighbours");
  const hideNavTags = document.getElementById("hideNavTags");
  const hideNavShouts = document.getElementById("hideNavShouts");
  const hideActions = document.getElementById("hideActions");
  const largerStats = document.getElementById("largerStats");
  const useHelvetica = document.getElementById("useHelvetica");
  const compactMode = document.getElementById("compactMode");
  const compactTags = document.getElementById("compactTags");
  const hideDeletedShouts = document.getElementById("hideDeletedShouts");
  const invertShoutActions = document.getElementById("invertShoutActions");
  const mainColor = document.getElementById("mainColor");

  browserAPI.storage.local.get(
    {
      roundedBorders: null,
      squareAvatars: null,
      hidePlayButtons: null,
      hideBuyButtons: null,
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
      useHelvetica: null,
      compactMode: null,
      compactTags: null,
      hideDeletedShouts: null,
      invertShoutActions: null,
      mainColor: "default",
      compactButtons: null,
    },
    (localData) => {
      roundedCheckbox.checked = localData.roundedBorders !== null ? localData.roundedBorders : true;
      squareCheckbox.checked = localData.squareAvatars !== null ? localData.squareAvatars : true;
      hidePlayButtons.checked = localData.hidePlayButtons !== null ? localData.hidePlayButtons : true;
      hideBuyButtons.checked = localData.hideBuyButtons !== null ? localData.hideBuyButtons : true;
      hideSidebarLabs.checked = localData.hideSidebarLabs !== null ? localData.hideSidebarLabs : true;
      hideSidebarProgress.checked = localData.hideSidebarProgress !== null ? localData.hideSidebarProgress : true;
      hideSidebarStations.checked = localData.hideSidebarStations !== null ? localData.hideSidebarStations : true;
      hideUpsells.checked = localData.hideUpsells !== null ? localData.hideUpsells : true;
      hideNavReports.checked = localData.hideNavReports !== null ? localData.hideNavReports : false;
      hideNavPlaylists.checked = localData.hideNavPlaylists !== null ? localData.hideNavPlaylists : false;
      hideNavLoved.checked = localData.hideNavLoved !== null ? localData.hideNavLoved : false;
      hideNavObsessions.checked = localData.hideNavObsessions !== null ? localData.hideNavObsessions : false;
      hideNavEvents.checked = localData.hideNavEvents !== null ? localData.hideNavEvents : false;
      hideNavNeighbours.checked = localData.hideNavNeighbours !== null ? localData.hideNavNeighbours : false;
      hideNavTags.checked = localData.hideNavTags !== null ? localData.hideNavTags : false;
      hideNavShouts.checked = localData.hideNavShouts !== null ? localData.hideNavShouts : false;
      hideActions.checked = localData.hideActions !== null ? localData.hideActions : false;
      largerStats.checked = localData.largerStats !== null ? localData.largerStats : false;
      useHelvetica.checked = localData.useHelvetica !== null ? localData.useHelvetica : true;
      compactMode.checked = localData.compactMode !== null ? localData.compactMode : true;
      compactTags.checked = localData.compactTags !== null ? localData.compactTags : false;
      compactButtons.checked = localData.compactButtons !== null ? localData.compactButtons : true;
      hideDeletedShouts.checked = localData.hideDeletedShouts !== null ? localData.hideDeletedShouts : false;
      invertShoutActions.checked = localData.invertShoutActions !== null ? localData.invertShoutActions : true;
      mainColor.value = localData.mainColor || "default";
    }
  );

  function saveOptions() {
    console.log("Saving options...");
    const data = {
      roundedBorders: roundedCheckbox.checked,
      squareAvatars: squareCheckbox.checked,
      hidePlayButtons: hidePlayButtons.checked,
      hideBuyButtons: hideBuyButtons.checked,
      hideSidebarLabs: hideSidebarLabs.checked,
      hideSidebarProgress: hideSidebarProgress.checked,
      hideSidebarStations: hideSidebarStations.checked,
      hideUpsells: hideUpsells.checked,
      hideNavReports: hideNavReports.checked,
      hideNavPlaylists: hideNavPlaylists.checked,
      hideNavLoved: hideNavLoved.checked,
      hideNavObsessions: hideNavObsessions.checked,
      hideNavEvents: hideNavEvents.checked,
      hideNavNeighbours: hideNavNeighbours.checked,
      hideNavTags: hideNavTags.checked,
      hideNavShouts: hideNavShouts.checked,
      hideActions: hideActions.checked,
      largerStats: largerStats.checked,
      useHelvetica: useHelvetica.checked,
      compactMode: compactMode.checked,
      compactTags: compactTags.checked,
      hideDeletedShouts: hideDeletedShouts.checked,
      invertShoutActions: invertShoutActions.checked,
      mainColor: mainColor.value,
      compactButtons: compactButtons.checked,
    };
    console.log("Options data:", data);
    browserAPI.storage.local.set(data);
    browserAPI.storage.sync.set(data);
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log("Sending messages to content script...");
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setRoundedBorders",
          enabled: roundedCheckbox.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setSquareAvatars",
          enabled: squareCheckbox.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHidePlayButtons",
          enabled: hidePlayButtons.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideBuyButtons",
          enabled: hideBuyButtons.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideSidebarLabs",
          enabled: hideSidebarLabs.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideSidebarProgress",
          enabled: hideSidebarProgress.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideSidebarStations",
          enabled: hideSidebarStations.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "sethideUpsells",
          enabled: hideUpsells.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavReports",
          enabled: hideNavReports.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavPlaylists",
          enabled: hideNavPlaylists.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavLoved",
          enabled: hideNavLoved.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavObsessions",
          enabled: hideNavObsessions.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavEvents",
          enabled: hideNavEvents.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavNeighbours",
          enabled: hideNavNeighbours.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavTags",
          enabled: hideNavTags.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavShouts",
          enabled: hideNavShouts.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideActions",
          enabled: hideActions.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setLargerStats",
          enabled: largerStats.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setUseHelvetica",
          enabled: useHelvetica.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setCompactMode",
          enabled: compactMode.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setCompactTags",
          enabled: compactTags.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setHideDeletedShouts",
          enabled: hideDeletedShouts.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setInvertShoutActions",
          enabled: invertShoutActions.checked,
        });
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setMainColor",
          value: mainColor.value,
        });
      }
      browserAPI.tabs.sendMessage(tabs[0].id, {
        type: "setCompactButtons",
        enabled: compactButtons.checked,
      });
    });
  }

  roundedCheckbox.addEventListener("change", saveOptions);
  compactButtons.addEventListener("change", saveOptions);
  squareCheckbox.addEventListener("change", saveOptions);
  hidePlayButtons.addEventListener("change", saveOptions);
  hideBuyButtons.addEventListener("change", saveOptions);
  hideSidebarLabs.addEventListener("change", saveOptions);
  hideSidebarProgress.addEventListener("change", saveOptions);
  hideSidebarStations.addEventListener("change", saveOptions);
  hideUpsells.addEventListener("change", saveOptions);
  hideNavReports.addEventListener("change", saveOptions);
  hideNavPlaylists.addEventListener("change", saveOptions);
  hideNavLoved.addEventListener("change", saveOptions);
  hideNavObsessions.addEventListener("change", saveOptions);
  hideNavEvents.addEventListener("change", saveOptions);
  hideNavNeighbours.addEventListener("change", saveOptions);
  hideNavTags.addEventListener("change", saveOptions);
  hideNavShouts.addEventListener("change", saveOptions);
  hideActions.addEventListener("change", saveOptions);
  largerStats.addEventListener("change", saveOptions);
  useHelvetica.addEventListener("change", saveOptions);
  compactMode.addEventListener("change", saveOptions);
  compactTags.addEventListener("change", saveOptions);
  hideDeletedShouts.addEventListener("change", saveOptions);
  invertShoutActions.addEventListener("change", saveOptions);
  mainColor.addEventListener("change", () => {
    const data = {
      mainColor: mainColor.value,
    };
    browserAPI.storage.local.set(data);
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        browserAPI.tabs.sendMessage(tabs[0].id, {
          type: "setMainColor",
          value: mainColor.value,
        });
      }
    });
  });
});
