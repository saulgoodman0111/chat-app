const socket = io();
const form = document.getElementById("sendcont");
const messageInput = document.getElementById("sent_msg");
const messageContainer = document.getElementById("messagebox");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.appendChild(messageElement);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;

  append(`You : ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

// let username = prompt("Enter your username");
// username = prompt("Enter your username");
// while (username == null || username == "") {
//   alert("Username can't be empty");
// }

let username = prompt("Enter your username");
while (username == "" || username == null) {
  alert("Username can't be empty");
  username = prompt("Enter your username");
}

socket.emit("new_user_joined", username);

socket.on("user-joined", (username) => {
  append(`${username} joined the chat`, "center");
});

socket.on("recieve", (data) => {
  append(`${data.username}: ${data.message}`, "left");
});

socket.on("user-online", (objectlength) => {
  document.getElementById("activeusers").innerText = `${objectlength} Active`;
});

socket.on("user-left", (username) => {
  append(`${username} left the chat`, "center");
});
