document.addEventListener("DOMContentLoaded", () => {
  const roundedCheckbox = document.getElementById("roundedBorders");
  const squareCheckbox = document.getElementById("squareAvatars");
  const hidePlayButtons = document.getElementById("hidePlayButtons");
  const hideBuyButtons = document.getElementById("hideBuyButtons");
  const hideSidebarContent = document.getElementById("hideSidebarContent");
  const hideAds = document.getElementById("hideAds");
  const hideNavReports = document.getElementById("hideNavReports");
  const hideNavPlaylists = document.getElementById("hideNavPlaylists");
  const hideNavLoved = document.getElementById("hideNavLoved");
  const hideNavObsessions = document.getElementById("hideNavObsessions");
  const hideNavEvents = document.getElementById("hideNavEvents");
  const hideNavNeighbours = document.getElementById("hideNavNeighbours");
  const hideNavTags = document.getElementById("hideNavTags");
  const hideNavShouts = document.getElementById("hideNavShouts");

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
    },
    (localData) => {
      roundedCheckbox.checked = localData.roundedBorders !== null ? localData.roundedBorders : true;
      squareCheckbox.checked = localData.squareAvatars !== null ? localData.squareAvatars : false;
      hidePlayButtons.checked = localData.hidePlayButtons !== null ? localData.hidePlayButtons : true;
      hideBuyButtons.checked = localData.hideBuyButtons !== null ? localData.hideBuyButtons : true;
      hideSidebarContent.checked = localData.hideSidebarContent !== null ? localData.hideSidebarContent : true;
      hideAds.checked = localData.hideAds !== null ? localData.hideAds : true;
      hideNavReports.checked = localData.hideNavReports !== null ? localData.hideNavReports : false;
      hideNavPlaylists.checked = localData.hideNavPlaylists !== null ? localData.hideNavPlaylists : false;
      hideNavLoved.checked = localData.hideNavLoved !== null ? localData.hideNavLoved : false;
      hideNavObsessions.checked = localData.hideNavObsessions !== null ? localData.hideNavObsessions : false;
      hideNavEvents.checked = localData.hideNavEvents !== null ? localData.hideNavEvents : false;
      hideNavNeighbours.checked = localData.hideNavNeighbours !== null ? localData.hideNavNeighbours : false;
      hideNavTags.checked = localData.hideNavTags !== null ? localData.hideNavTags : false;
      hideNavShouts.checked = localData.hideNavShouts !== null ? localData.hideNavShouts : false;
    }
  );

  function saveOptions() {
    console.log("Saving options...");
    const data = {
      roundedBorders: roundedCheckbox.checked,
      squareAvatars: squareCheckbox.checked,
      hidePlayButtons: hidePlayButtons.checked,
      hideBuyButtons: hideBuyButtons.checked,
      hideSidebarContent: hideSidebarContent.checked,
      hideAds: hideAds.checked,
      hideNavReports: hideNavReports.checked,
      hideNavPlaylists: hideNavPlaylists.checked,
      hideNavLoved: hideNavLoved.checked,
      hideNavObsessions: hideNavObsessions.checked,
      hideNavEvents: hideNavEvents.checked,
      hideNavNeighbours: hideNavNeighbours.checked,
      hideNavTags: hideNavTags.checked,
      hideNavShouts: hideNavShouts.checked,
    };
    console.log("Options data:", data);
    chrome.storage.local.set(data);
    chrome.storage.sync.set(data);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log("Sending messages to content script...");
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setRoundedBorders",
          enabled: roundedCheckbox.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setSquareAvatars",
          enabled: squareCheckbox.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHidePlayButtons",
          enabled: hidePlayButtons.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideBuyButtons",
          enabled: hideBuyButtons.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideSidebarContent",
          enabled: hideSidebarContent.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideAds",
          enabled: hideAds.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavReports",
          enabled: hideNavReports.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavPlaylists",
          enabled: hideNavPlaylists.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavLoved",
          enabled: hideNavLoved.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavObsessions",
          enabled: hideNavObsessions.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavEvents",
          enabled: hideNavEvents.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavNeighbours",
          enabled: hideNavNeighbours.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavTags",
          enabled: hideNavTags.checked,
        });
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "setHideNavShouts",
          enabled: hideNavShouts.checked,
        });
      }
    });
  }

  roundedCheckbox.addEventListener("change", saveOptions);
  squareCheckbox.addEventListener("change", saveOptions);
  hidePlayButtons.addEventListener("change", saveOptions);
  hideBuyButtons.addEventListener("change", saveOptions);
  hideSidebarContent.addEventListener("change", saveOptions);
  hideAds.addEventListener("change", saveOptions);
  hideNavReports.addEventListener("change", saveOptions);
  hideNavPlaylists.addEventListener("change", saveOptions);
  hideNavLoved.addEventListener("change", saveOptions);
  hideNavObsessions.addEventListener("change", saveOptions);
  hideNavEvents.addEventListener("change", saveOptions);
  hideNavNeighbours.addEventListener("change", saveOptions);
  hideNavTags.addEventListener("change", saveOptions);
  hideNavShouts.addEventListener("change", saveOptions);
});
