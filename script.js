document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const newChatBtn = document.getElementById("new-chat-btn");
    const resetChatBtn = document.getElementById("reset-chat-btn"); // Reset button
    const profileBtn = document.getElementById("profile-btn");
    const profileMenu = document.getElementById("profile-menu");
    const chatHistory = document.getElementById("chat-history");

    let chatSessions = [];
    let currentChatIndex = null;

    // Send message function
    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        appendMessage("You", userMessage, "bg-blue-500 text-white self-end");

        // Get bot response (math check included)
        const botResponse = getBotResponse(userMessage);
        setTimeout(() => {
            appendMessage("Chat Sphere", botResponse, "bg-gray-200 text-black self-start");
        }, 500);

        // Save chat session
        if (currentChatIndex !== null) {
            chatSessions[currentChatIndex].messages.push({ sender: "You", text: userMessage });
            chatSessions[currentChatIndex].messages.push({ sender: "Chat Sphere", text: botResponse });
        } else {
            startNewChat(userMessage, botResponse);
        }

        userInput.value = "";
    }

    // Append messages to chat
    function appendMessage(sender, message, bgClass) {
        const messageElement = document.createElement("div");
        messageElement.className = `p-3 rounded-lg w-max my-1 ${bgClass}`;
        messageElement.innerText = `${sender}: ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Start new chat session
    function startNewChat(firstUserMessage, firstBotResponse) {
        const noChats = document.querySelector("#chat-history li:first-child");
        if (noChats && noChats.innerText === "No previous chats") {
            chatHistory.innerHTML = "";
        }

        const chatSession = {
            title: firstUserMessage.substring(0, 20) + "...",
            messages: [{ sender: "You", text: firstUserMessage }, { sender: "Chat Sphere", text: firstBotResponse }],
        };
        chatSessions.push(chatSession);
        currentChatIndex = chatSessions.length - 1;

        const chatItem = document.createElement("li");
        chatItem.className = "p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300 transition";
        chatItem.innerText = chatSession.title;
        chatItem.dataset.chatIndex = currentChatIndex;

        chatItem.addEventListener("click", function () {
            loadChat(parseInt(this.dataset.chatIndex));
        });

        chatHistory.appendChild(chatItem);
    }

    // Load previous chat
    function loadChat(index) {
        currentChatIndex = index;
        chatBox.innerHTML = "";
        chatSessions[index].messages.forEach(msg => {
            appendMessage(msg.sender, msg.text, msg.sender === "You" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start");
        });
    }

    // Function to evaluate math expressions safely
    function evaluateMathExpression(expression) {
        try {
            return Function(`"use strict"; return (${expression})`)();
        } catch (error) {
            return "Invalid math expression.";
        }
    }

    // Enhanced bot responses
    function getBotResponse(message) {
        message = message.toLowerCase();

        const greetings = ["hi", "hello", "hey", "good morning", "good evening", "hlo"];
        if (greetings.includes(message)) {
            return "Hello! How can I assist you today? 😊";
        }
        if (message.includes("how are you")) {
            return "I'm doing great! How about you? 😊";
        }
        if (message.includes("what's your name") || message.includes("who are you")) {
            return "You can call me Chat Sphere.";
        }
        if (message.includes("tell me a joke")) {
            return "Why did the AI break up with its partner? Because it lost its connection! 😂";
        }
        if (message.includes("weather")) {
            return "I can't check live weather, but you can try a weather website like weather.com!";
        }
        if (message.includes("who made you")) {
            return "I was created by an awesome developer! 🚀";
        }
        if (message.includes("bye")) {
            return "Goodbye! Have a great day! 👋";
        }

        // Check if input is a math expression
        const mathRegex = /^[0-9+\-*/().\s]+$/;
        if (mathRegex.test(message)) {
            return `The answer is: ${evaluateMathExpression(message)}`;
        }

        return "I'm not sure how to respond to that. Can you rephrase?";
    }

    // Reset chat function
    function resetChat() {
        chatBox.innerHTML = "";
        chatSessions = [];
        chatHistory.innerHTML = '<li class="p-2 text-gray-500">No previous chats</li>';
        currentChatIndex = null;
    }

    // Event listener for button click
    sendButton.addEventListener("click", sendMessage);

    // Event listener for pressing Enter key
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    // New Chat Button Functionality
    newChatBtn.addEventListener("click", function () {
        currentChatIndex = null;
        chatBox.innerHTML = '<div class="p-3 bg-blue-100 rounded-lg w-max text-black">New Chat Started!</div>';
    });

    // Reset Chat Button
    resetChatBtn.addEventListener("click", resetChat);

    // Profile button dropdown toggle
    profileBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        profileMenu.classList.toggle("hidden");
    });

    // Hide profile menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!profileBtn.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.classList.add("hidden");
        }
    });
});
