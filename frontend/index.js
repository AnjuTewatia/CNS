const socket = io("https://ccns.onrender.com/", {
  transports: ["websocket"],
});

const form = document.querySelector("form");
const date_section = document.getElementById("date_section");
const message_input = document.getElementById("message_input");
const container = document.getElementById("container");
const message_submit_button = document.getElementById("message_submit_button");

message_submit_button.disabled = true;
message_input.addEventListener("input", () => {
  if (message_input.value) {
    message_submit_button.disabled = false;
  } else {
    message_submit_button.disabled = true;
  }
});

// when the user join or left the chat

function appendData(name, message, position) {
  if (message !== "joined the chat." && message !== "left the chat.") {
    container.innerHTML += `
            <div class="message ${position}"><span class="user_name">${name} </span>${message}
            
            </div>
        `;
  } else {
    container.innerHTML += `
            <div class="message ${position}"><span class="user_name">${name} </span>${message}</div>
        `;
  }
  // scroling to bottom on new messages
  container.scrollTo(0, container.scrollHeight);
}

// when you enter the chat app
let name =
  prompt("Enter your name to join the chat.") ||
  `Guest-${Math.floor(Math.random() * 100000 + 1)}`;

socket.emit("new-user-joined", name);

// when user joined a chat
socket.on("user-joined", (name) => {
  appendData(name, "joined the chat.", "center");
});
// when one user receiver the chat

socket.on("receive_message", (data) => {
  appendData(data.name, `<br>${data.message}`, "left");
});

// when the user left the chat
socket.on("left_message", (name) => {
  console.log(name);
  appendData(name, "left the chat.", "center");
});

// submit the messagefor chat to somebody
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = message_input.value;
  appendData("You", `<br>${message}`, "right");

  socket.emit("send_message", message);
  message_input.value = "";
  message_input.placeholder = "Type a message";
  message_submit_button.disabled = true;
});
