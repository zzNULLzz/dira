document.addEventListener("DOMContentLoaded", async () => {
  // DROPDOWN
  let btn = document.getElementById("drop");
  const dropdown = document.querySelector(".nav2");

  if (btn && dropdown) {
    btn.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });
  }

  // FAQ TOGGLE
  document.querySelectorAll(".down").forEach((downBtn) => {
    downBtn.addEventListener("click", () => {
      const faq = downBtn.closest(".faq");
      const answer = faq.querySelector(".answer");
      answer.classList.toggle("show");
    });
  });

  // CAROUSEL
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  const track = document.querySelector(".carousel-items");
  const items = document.querySelectorAll("#carousel section");
  let currentIndex = 0;

  function showItem(index) {
    const width = items[0].offsetWidth;
    track.style.transform = `translateX(-${index * width}px)`;
  }

  if (nextBtn && prevBtn && items.length > 0) {
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % items.length;
      showItem(currentIndex);
    });

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      showItem(currentIndex);
    });
  }

  // CHATBOT (Puter.js)
  await puter.init();

  const messages = [
    {
      role: "system",
      content:
        "You are Dira Assistant, an AI that helps users navigate the Dira platform. Dira connects companies with verified, skilled workers in all professions — blue-collar and white-collar — using AI matching, portfolios, peer reviews, and trusted local networks.",
    },
  ];

  const container = document.createElement("div");
  container.id = "dira-chat-container";
  container.innerHTML = `
    <style>
      #dira-chat-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 320px;
        max-height: 500px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        display: none;
        flex-direction: column;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        z-index: 9999;
        font-family: sans-serif;
      }
      #dira-chat-header {
        background:rgba(227, 227, 227, 0.8);
        color: white;
        padding: 10px;
        border-radius: 8px 8px 0 0;
        font-weight: bold;
      }
      #dira-chat-messages {
        padding: 10px;
        overflow-y: auto;
        flex-grow: 1;
      }
      .dira-msg {
        margin: 5px 0;
        padding: 8px;
        border-radius: 6px;
        max-width: 90%;
        line-height: 1.4;
      }
      .user-msg {
        background: #e1f5fe;
        align-self: flex-end;
      }
      .ai-msg {
        background: #f1f1f1;
        align-self: flex-start;
      }
      #dira-chat-input {
        display: flex;
        border-top: 1px solid #ccc;
      }
      #dira-chat-input input {
        flex-grow: 1;
        padding: 10px;
        border: none;
        outline: none;
      }
      #dira-chat-input button {
        padding: 10px;
        background:rgba(227, 227, 227, 0.8);
        color: white;
        border: none;
        cursor: pointer;
      }
    </style>
    <div id="dira-chat-header">Dira Assistant</div>
    <div id="dira-chat-messages"></div>
    <div id="dira-chat-input">
      <input type="text" id="dira-chat-user-input" placeholder="Type a message..." />
      <button id="dira-chat-send">Send</button>
    </div>
  `;
  container.style.display = "flex";
  document.body.appendChild(container);

  const messagesDiv = document.getElementById("dira-chat-messages");

  function addMessage(msg, isUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("dira-msg", isUser ? "user-msg" : "ai-msg");
    msgDiv.textContent = msg;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  async function sendMessage() {
    const input = document.getElementById("dira-chat-user-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    messages.push({ role: "user", content: text });
    input.value = "";

    try {
      const response = await puter.ai.chat(messages);
      addMessage(response.message.content, false);
      messages.push(response.message);
    } catch (err) {
      console.error("Chat error:", err);
      addMessage("Sorry, something went wrong.", false);
    }
  }

  document.getElementById("dira-chat-send").addEventListener("click", sendMessage);
  document.getElementById("dira-chat-user-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  const toggleBtn = document.getElementById("chatbot");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      container.style.display = container.style.display === "none" ? "flex" : "none";
    });
  } else {
    container.style.display = "flex";
  }
});
