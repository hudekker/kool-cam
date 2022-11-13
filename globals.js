// let formMsg = document.getElementById("form-msg");
// let inputMsg = document.getElementById("input-msg");
// let formPartnerId = document.getElementById("form-partner-id");
// let inputPartnerId = document.getElementById("input-partner-id");
let numUser = 0;
let boolRefresh;
let calls = [];
let conns = [];

let myPeer;
let hostId;
let boolHost;
let partnerId;
let myStream;
let body = document.querySelector("body");
let btnAddParticipant = document.querySelector("#btn-add-participant");
let btnHelp = document.querySelector("#btn-help");
let btnVideo = document.querySelector("#btn-video");
let btnMic = document.querySelector("#btn-mic");
let modalHelp = document.querySelector("#modal-help");
let modalVideo = document.querySelector("#modal-video");
let btnModalHelp = document.querySelector("#btn-modal-help");
let btnModalVideoOk = document.querySelector("#btn-modal-video-ok");
let btnChooseChat = document.querySelector("#btn-choose-chat");
let btnChoosePhone = document.querySelector("#btn-choose-phone");
let btnChooseVideo = document.querySelector("#btn-choose-video");
let formHelp = document.querySelector("#form-help");
let formVideo = document.querySelector("#form-video");
let btnHangup = document.querySelector("#btn-hangup");
let myNickname;
let clickPeerId;

let myMessage = document.querySelector("#my-message");
let btnSendMsg = document.querySelector("#btn-send-msg");
let messages = document.querySelector("#messages");
const btnShowChat = document.querySelector("#btn-show-chat");
const btnBack = document.querySelector(".btn-back");

const videoGrid = document.getElementById("video-grid");
// let peers = new Map();
let peers = [];

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
