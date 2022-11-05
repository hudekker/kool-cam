boolRefresh =
  (window.performance.navigation && window.performance.navigation.type === 1) ||
  window.performance
    .getEntriesByType("navigation")
    .map((nav) => nav.type)
    .includes("reload");

if (boolRefresh) {
  // window.location.href = document.URL.split("#")[0];
}
// Use async wrapper because there are awaits
(async () => {
  // Initialize your own peer object and get the host id
  await getHostIdMyPeerObj();

  console.log(`Host Id = ${hostId}`);
  console.log(`My peer Id = ${myPeer.id}`);
  console.log(`boolHost = ${boolHost}`);

  // Open up your video stream and add it to the screen
  myStream = await navigator.mediaDevices.getUserMedia({
    // video: { width: 1280, height: 720 },
    video: {
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 720, max: 1080 },
    },
    audio: true,
    controls: true,
  });

  if (boolHost) {
    myNickname = "Host";
    peers.push({ id: myPeer.id, nickname: myNickname, order: 0, host: true });
  }

  addVideoElement(myPeer.id, myStream);

  updateHelpModalText();

  // Partners initiate request to host
  // think about a timeout loop every 3 seconds if ptnr arrives before host?
  if (!boolHost) {
    sendDataRequest(myPeer, hostId);
    sendVideoRequest(myPeer, hostId);
  }

  // Handle data request events
  myPeer.on("connection", handleDataEvents);

  // Handle video request events
  myPeer.on("call", receiveVideoRequest);

  // Send text message
  btnSendMsg.addEventListener("click", (e) => {
    // Update messages
    if (myMessage.value.length !== 0) {
      sendMessage();
    }
  });

  myMessage.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && myMessage.value.length !== 0) {
      sendMessage();
    }
  });

  backBtn.addEventListener("click", () => {
    document.querySelector(".main-right").classList.toggle("sm-none");
    document.querySelector(".main-left").classList.toggle("sm-none");

    // document.querySelector(".main-left").style.display = "flex";
    // document.querySelector(".main-left").style.flex = "1";
    // document.querySelector(".main-right").style.display = "none";
    document.querySelector(".header-back").style.display = "none";
  });

  showChat.addEventListener("click", () => {
    document.querySelector(".main-right").classList.toggle("sm-none");
    document.querySelector(".main-left").classList.toggle("sm-none");
    // document.querySelector(".main-right").style.display = "flex";
    // document.querySelector(".main-right").style.flex = "1";
    // document.querySelector(".main-left").style.display = "none";
    document.querySelector(".header-back").style.display = "block";
  });

  // Modals
  // formHelp.addEventListener("submit", function (e) {
  //   e.preventDefault();
  // });
  formVideo.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  // Open the help modal
  btnHelp.addEventListener("click", () => {
    modalHelp.classList.remove("modal-hide");
  });

  // Catch the exit event and send it all your ptnrs
  const beforeUnloadHandler = (event) => {
    event.preventDefault();
    document.URL = document.URL.split("#")[0];
    conns.forEach((el) => el.send({ key: "close", val: myPeer.id }));

    if (boolHost) {
      conns.forEach((el) => el.send({ key: "host-close", val: myPeer.id }));
    }
  };

  window.addEventListener("beforeunload", beforeUnloadHandler, { capture: true });
})();
