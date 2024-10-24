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
var columns = c.width/font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for(var x = 0; x < columns; x++)
    drops[x] = 1; 

//drawing the characters
function draw()
{
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#00FF41";//green text
    ctx.font = font_size + "px arial";
    //looping over drops
    for(var i = 0; i < drops.length; i++)
    {
        //a random chinese character to print
        var text = matrix[Math.floor(Math.random()*matrix.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i*font_size, drops[i]*font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if(drops[i]*font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
    }
}

setInterval(draw, 55);

// ** COUNTDOWN **

let countdownElement = document.getElementById('countdown');
let countdownValue = 15;
let gifURL = "https://media1.tenor.com/m/CuV5KsB9-fMAAAAC/dancing-penis.gif"

let countdownInterval = setInterval(() => {
    countdownValue--;
    countdownElement.textContent = countdownValue;

    if (countdownValue <= 0) {
        clearInterval(countdownInterval);
        document.querySelector('.countdown-timer').innerHTML = `<img src="${gifURL}" alt="Countdown Finished">`;
    }
}, 1000);


// ** TERMINAL **

// Simulated terminal messages
const messages = [
    "Wake up, Miguel...",
    "You have a mission...",
    "Follow the white pidgeon."
];

// Set typing speed (in milliseconds)
const typingSpeed = 100;

let outputElement = document.getElementById('output');
let userInputElement = document.getElementById('user-input');
const hiddenInput = document.getElementById('hidden-input');
let messageIndex = 0;

function focusInput() {
    hiddenInput.focus();
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
        }
    }, typingSpeed);
}

// Function to start typing all messages in sequence
function typeMessages() {
    if (messageIndex < messages.length) {
        typeMessage(messages[messageIndex], () => {
            messageIndex++;
            typeMessages();
        });
    }
}

// User input handling (simulated typing effect)
document.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        outputElement.textContent += `> ${userInputElement.textContent}\n`;  // Show user input in output
        userInputElement.textContent = '';  // Clear input field after Enter
    } else if (event.key === "Backspace") {
        userInputElement.textContent = userInputElement.textContent.slice(0, -1);  // Remove last char
    } else if (event.key.length === 1) {
        userInputElement.textContent += event.key;  // Add typed char to input
    }
});

// Handle user input and display it
hiddenInput.addEventListener('input', () => {
    userInputElement.textContent = hiddenInput.value;
});

// Handle Enter key press
hiddenInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior
        outputElement.textContent += `> ${hiddenInput.value}\n`; // Add user input to terminal
        hiddenInput.value = '';  // Clear hidden input
        userInputElement.textContent = '';  // Clear visible input
    }
});

// Start typing the messages when page loads
typeMessages();
focusInput(); // Ensure the input is focused on page load
