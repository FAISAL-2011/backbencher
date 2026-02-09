// 🔴 REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let userName = "";

const messagesRef = database.ref("messages");
const onlineRef = database.ref("onlineUsers");

// ENTER CHAT
function enterChat() {
  const input = document.getElementById("username");
  if (input.value.trim() === "") return;

  userName = input.value;

  document.getElementById("nameScreen").classList.add("hidden");
  document.getElementById("chatScreen").classList.remove("hidden");

  // USER ONLINE
  const userStatusRef = onlineRef.child(userName);
  userStatusRef.set(true);
  userStatusRef.onDisconnect().remove();
}

// SEND MESSAGE
function sendMessage() {
  const input = document.getElementById("messageInput");
  if (input.value.trim() === "") return;

  messagesRef.push({
    name: userName,
    text: input.value
  });

  input.value = "";
}

// RECEIVE MESSAGES
messagesRef.on("child_added", snapshot => {
  const msg = snapshot.val();
  const div = document.createElement("div");
  div.classList.add("msg");
  div.innerHTML = `<span>${msg.name}:</span> ${msg.text}`;

  const messages = document.getElementById("messages");
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

// ONLINE USER COUNT
onlineRef.on("value", snapshot => {
  document.getElementById("onlineCount").innerText =
    `Online: ${snapshot.numChildren()}`;
});
