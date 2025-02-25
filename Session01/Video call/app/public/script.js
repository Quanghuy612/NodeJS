const peer = new Peer();
const socket = io("http://localhost:5090");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideo.srcObject = stream;
    myVideo.play();
    videoGrid.append(myVideo);
    peer.on("open", (id) => {
      socket.emit("join-room", "room1", id);
    });
  });
const chatInput = document.getElementById("chat-input");
const sendChatButton = document.getElementById("send-chat");
const chatMessages = document.getElementById("chat-messages");

sendChatButton.addEventListener("click", () => {
  sendMessage();
});

chatInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    socket.emit("chat-message", message);
    displayMessage("You", message);
    chatInput.value = "";
  }
}

socket.on("chat-message", (data) => {
  displayMessage("User", data);
});

function displayMessage(sender, message) {
  const messageElement = document.createElement("p");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}
