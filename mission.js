// script.js

// ** BACKGROUND **

// geting canvas by Boujjou Achraf
var c = document.getElementById("c");
var ctx = c.getContext("2d");

//making the canvas full screen
c.height = window.innerHeight;
c.width = window.innerWidth;

//chars
var matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";


matrix = matrix.split("");

var font_size = 10;
var columns = c.width / font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for (var x = 0; x < columns; x++)
    drops[x] = 1;

//drawing the characters
function draw() {
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#00FF41";//green text
    ctx.font = font_size + "px arial";
    //looping over drops
    for (var i = 0; i < drops.length; i++) {
        //a random chinese character to print
        var text = matrix[Math.floor(Math.random() * matrix.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if (drops[i] * font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
    }
}

setInterval(draw, 55);


// ** AUDIO **

document.addEventListener("DOMContentLoaded", () => {
    const audioElement = document.getElementById('bg-audio');
    const playButton = document.getElementById('play-pause');
    playButton.addEventListener('click', () => {
        if (audioElement.paused) {
            audioElement.play();
            playButton.innerHTML = "&#9208;";
        } else {
            audioElement.pause();
            playButton.innerHTML = "&#9205;";
        }
    });
});


// ** COUNTDOWN **

let countdownElement = document.getElementById('countdown');
let countdownValue = 15;

let countdownInterval = setInterval(() => {
    countdownValue--;
    countdownElement.textContent = countdownValue;

    if (countdownValue <= 0) {
        clearInterval(countdownInterval);
        document.querySelector('.countdown-timer').innerHTML = `<img src="${gifURL}" alt="Countdown Finished">`;
    }
}, 1000);


// ** HASHING **

async function hashCode(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
}

const correctPassword1 = "8076f3b53b0a4d740aa899de581c1ef33197c74ee5cd1c5ee260c2e73dda1045";
const correctPassword2 = "26fe87db93485b62c47a0d6945beb34992239719e40c15f90a3a7862df295556";


// ** TERMINAL **

// Simulated terminal messages
const init_messages = [
    "Wake up, Miguel...",
    "You have a mission...",
    "Turn up the volume..."
];

const correct_password_messages = [
    "Password is correct.",
    "Welcome abroad, Miguel.",
    "Your mission starts at 14:00, November 1, 2024.",
    "37°22'51.5\"N 5°57'38.3\"W",
    "Do not be late.",
    "This message will self-destruct in"
];

// Set typing speed (in milliseconds)
const typingSpeed = 80;
const timeout = 5; // Countdown timeout in seconds

const outputElement = document.getElementById('output');
const userInputElement = document.getElementById('user-input');
const hiddenInput = document.getElementById('hidden-input');
let messageIndex = 0;

function focusInput() {
    hiddenInput.focus();
}

function scrollToBottom() {
    outputElement.scrollTop = outputElement.scrollHeight;
}

async function countdown() {
    for (let i = timeout; i >= 0; i--) {
        outputElement.textContent += `${i}\n`;
        scrollToBottom();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    outputElement.textContent = "";

    outputElement.innerHTML = "<div>I'm kidding.</div><div>14:00, November 1, 2024.</div><div>37°22'51.5\"N 5°57'38.3\"W</div>";
    const gifElement = document.createElement('img');
    //gifElement.src = gifURL;
    gifElement.src = "mission.gif";
    gifElement.style.width = "300px";
    gifElement.style.height = "auto";
    outputElement.appendChild(gifElement);
    scrollToBottom();
}

// Function to simulate typing messages character by character
function typeMessage(message, callback) {
    let i = 0;
    let typingInterval = setInterval(() => {
        outputElement.textContent += message.charAt(i);
        i++;
        if (i >= message.length) {
            clearInterval(typingInterval);
            outputElement.textContent += '\n'; // Go to the next line after typing
            if (callback) callback();
            scrollToBottom();
        }
    }, typingSpeed);
}

// Function to start typing all messages in sequence
function typeMessages(messages, callback) {
    const typeNextMessage = (index) => {
        if (index < messages.length) {
            typeMessage(messages[index], () => {
                typeNextMessage(index + 1);
            });
        } else if (callback) {
            callback();
        }
    }
    typeNextMessage(0);
}

// Commands processing
async function processCommand(command) {
    if (command === 'CLEAR') {
        outputElement.textContent = init_messages.join('\n') + '\n';
    } else if (command === 'LS') {
        outputElement.textContent += 'dont.txt\nlook.txt\nhere.txt\n';
    } else if (command === 'CD') {
        outputElement.textContent += 'You can not move from here.\n';
    } else {
        // Check if the command is a hash command
        let hashResult = await hashCode(command);
        if (hashResult === correctPassword1 || hashResult === correctPassword2) {
            outputElement.textContent = ''; // Clear the terminal
            hiddenInput.style.display = 'none'; // Hide the input
            userInputElement.style.display = 'none'; // Hide the input
            userInputElement.textContent = ''; // Clear the input
            document.querySelector(".blinking-cursor").style.display = 'none'; // Hide the cursor
            document.querySelector(".prompt-symbol").style.display = 'none'; // Hide the prompt symbol
            typeMessages(correct_password_messages, countdown);
        }
        scrollToBottom();
    }
}

// Handle user input and display it
hiddenInput.addEventListener('input', () => {
    userInputElement.textContent = hiddenInput.value;
});

// Handle Enter key press
hiddenInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior
        const command = hiddenInput.value.trim().toUpperCase(); // Get the command
        outputElement.textContent += `> ${command}\n`; // Add user input to terminal
        processCommand(command); // Process the command
        hiddenInput.value = '';  // Clear hidden input
        userInputElement.textContent = '';  // Clear visible input
    }
});

// Start typing the messages when page loads
typeMessages(init_messages);
focusInput(); // Ensure the input is focused on page load

