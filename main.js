boolRefresh =
  (window.performance.navigation && window.performance.navigation.type === 1) ||
  window.performance
    .getEntriesByType("navigation")
    .map((nav) => nav.type)
    .includes("reload");

if (boolRefresh) {
  // window.location.href = document.URL.split("#")[0];
}

const mainThread = async (commType) => {
  introChoose.classList.add("display-none");
  let boolStream = false;

  switch (commType) {
    case "chat":
      // btnBack.classList.add("display-none");
      container.classList.remove("display-none");
      chatHeading.classList.remove("display-none");

      document.querySelector("#chat-only-btn-group").classList.remove("display-none");
      document.querySelector("#main-left").classList.add("display-none");
      document.querySelector("#main-right").classList.remove("display-none", "sm-none");
      document.querySelector("#main-right").classList.add("chat-only");
      boolStream = false;
      break;
    case "phone":
      chatHeading.classList.remove("display-none");
      container.classList.remove("display-none");

      boolStream = true;
      myStream = await navigator.mediaDevices.getUserMedia({
        // video: { width: 1280, height: 720 },
        video: false,
        audio: true,
        controls: true,
      });
      break;
    case "video":
      chatHeading.classList.remove("display-none");
      container.classList.remove("display-none");

      boolStream = true;
      myStream = await navigator.mediaDevices.getUserMedia({
        // video: { width: 1280, height: 720 },
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
        audio: true,
        controls: true,
      });
      break;

    default:
      break;
  }

  // Open up your video stream and add it to the screen

  boolStream ? addVideoElement(myPeer.id, myStream) : null;

  updateHelpModalText();

  // Handle video request events
  boolStream ? myPeer.on("call", receiveVideoRequest) : null;

  // Partners initiate request to host
  // think about a timeout loop every 3 seconds if ptnr arrives before host?
  if (!boolHost) {
    sendDataRequest(myPeer, hostId);
    boolStream ? sendVideoRequest(myPeer, hostId) : null;
  }
};

// Use async wrapper because there are awaits
(async () => {
  myNickname = prompt("Enter your name");

  // Initialize your own peer object and get the host id
  await getHostIdMyPeerObj();

  // console.log(`Host Id = ${hostId}`);
  // console.log(`My peer Id = ${myPeer.id}`);
  // console.log(`boolHost = ${boolHost}`);

  // Handle data request events
  myPeer.on("connection", handleDataEvents);

  if (boolHost) {
    peers.push({ id: myPeer.id, nickname: myNickname, order: 0, host: true });
  }

  // Send text message
  btnSendMsg.addEventListener("click", (e) => {
    // Update messages
    if (myMessage.value.length !== 0) {
      sendMessage();
    }
  });

  // Set enter as the default submit
  myMessage.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && myMessage.value.length !== 0) {
      sendMessage();
    }
  });

  // Chat only
  btnChooseChat.addEventListener("click", async (e) => {
    commType = "chat";
    await mainThread(commType);
  });

  // Phone Call
  btnChoosePhone.addEventListener("click", async (e) => {
    commType = "phone";
    await mainThread(commType);
  });

  // Video Call
  btnChooseVideo.addEventListener("click", async (e) => {
    commType = "video";
    await mainThread(commType);
  });

  btnVideo.addEventListener("click", (e) => {
    let bool = document.querySelector("#btn-video").classList.contains("btn-off");
    let videoTracks = myStream.getVideoTracks();

    // If it's off, then turn it on, otherwise turn it off
    if (bool) {
      videoTracks.forEach((track) => (track.enabled = true));
    } else {
      videoTracks.forEach((track) => (track.enabled = false));
    }

    document.querySelector("#btn-video").classList.toggle("btn-off");
  });

  btnMic.addEventListener("click", (e) => {
    let bool = document.querySelector("#btn-mic").classList.contains("btn-off");
    let audioTracks = myStream.getAudioTracks();

    // If it's off, then turn it on, otherwise turn it off
    if (bool) {
      audioTracks.forEach((track) => (track.enabled = true));
    } else {
      audioTracks.forEach((track) => (track.enabled = false));
    }

    document.querySelector("#btn-mic").classList.toggle("btn-off");
  });

  // Hangup
  btnAddParticipant.addEventListener("click", (e) => {
    let link = `https://kool.cam/#${hostId}`;
    if (window.origin == "http://localhost:8000") {
      link = `http://localhost:8000/kool-cam/index.html#${hostId}`;
    }
    prompt(`Copy this link and send it to friends you want to meet with`, link);
  });

  // Hangup
  btnHangup.addEventListener("click", (event) => {
    conns
      .filter((el) => el.peer !== myPeer.id)
      .forEach((conn) => {
        // If you are host ALSO do a host-close
        if (boolHost) {
          conn.send({ key: "host-close", val: myPeer.id });
        }
        conn.send({ key: "close", val: myPeer.id });
      });
  });

  // Go to video main-left
  btnBack.addEventListener("click", () => {
    btnShowChat.classList.remove("btn-flash");
    document.querySelector(".main-right").classList.toggle("sm-none");
    document.querySelector(".main-left").classList.toggle("sm-none");
    document.querySelector(".btn-back").classList.toggle("display-none");
  });

  // Go to chat main-left
  btnShowChat.addEventListener("click", () => {
    btnShowChat.classList.remove("btn-flash");
    document.querySelector(".main-right").classList.toggle("sm-none");
    document.querySelector(".main-left").classList.toggle("sm-none");
    document.querySelector(".btn-back").classList.toggle("display-none");
  });

  // Modals
  formVideo.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  // Open the help modal
  btnHelp.addEventListener("click", () => {
    modalHelp.classList.remove("modal-hide");
  });

  btnAddParticipant2.addEventListener("click", () => {
    btnAddParticipant.click();
  });
  btnHelp2.addEventListener("click", () => {
    btnHelp.click();
  });
  btnHangup2.addEventListener("click", () => {
    btnHangup.click();
  });

  // Catch the exit event and send it all your ptnrs
  window.addEventListener(
    "beforeunload",
    (event) => {
      event.preventDefault();
      document.URL = document.URL.split("#")[0];
      conns.forEach((el) => el.send({ key: "close", val: myPeer.id }));

      if (boolHost) {
        conns.forEach((el) => el.send({ key: "host-close", val: myPeer.id }));
      }
    },
    { capture: true }
  );
})();
