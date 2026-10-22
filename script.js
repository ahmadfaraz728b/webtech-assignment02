var slides = [];
var currentSlide = 0;

var textBox = document.getElementById("text-box");
var slideBox = document.getElementById("slide-box");
var slideNumber = document.getElementById("slide-number");

var presentPage = document.getElementById("present-page");
var presentBox = document.getElementById("present-box");
var presentNumber = document.getElementById("present-number");

function updateSlides() {
    slides = textBox.value.split("---");

    if (currentSlide >= slides.length) {
        currentSlide = slides.length - 1;
    }

    if (currentSlide < 0) {
        currentSlide = 0;
    }

    showSlide();
}

function makeHtml(text) {
    var lines = text.split("\n");
    var html = "";

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("### ")) {
            html += "<h3>" + lines[i].substring(4) + "</h3>";
        } else if (lines[i].startsWith("## ")) {
            html += "<h2>" + lines[i].substring(3) + "</h2>";
        } else if (lines[i].startsWith("# ")) {
            html += "<h1>" + lines[i].substring(2) + "</h1>";
        } else if (lines[i] != "") {
            html += "<p>" + lines[i] + "</p>";
        }
    }

    return html;
}

function showSlide() {
    var html = makeHtml(slides[currentSlide]);

    slideBox.innerHTML = html;
    presentBox.innerHTML = html;

    slideNumber.innerText = (currentSlide + 1) + " / " + slides.length;
    presentNumber.innerText = (currentSlide + 1) + " / " + slides.length;

    document.getElementById("left-button").disabled = currentSlide == 0;
    document.getElementById("present-left-button").disabled = currentSlide == 0;

    document.getElementById("right-button").disabled =
        currentSlide == slides.length - 1;

    document.getElementById("present-right-button").disabled =
        currentSlide == slides.length - 1;
}

function goLeft() {
    if (currentSlide > 0) {
        currentSlide--;
        showSlide();
    }
}

function goRight() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide();
    }
}

function saveSlides() {
    localStorage.setItem("mySlides", textBox.value);
    alert("Slides saved!");
}

function startPresenting() {
    presentPage.style.display = "flex";
    document.documentElement.requestFullscreen();
}

function stopPresenting() {
    presentPage.style.display = "none";

    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

function fullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        slideBox.requestFullscreen();
    }
}

document.getElementById("save-button").onclick = saveSlides;
document.getElementById("present-button").onclick = startPresenting;

document.getElementById("left-button").onclick = goLeft;
document.getElementById("right-button").onclick = goRight;
document.getElementById("full-button").onclick = fullScreen;

document.getElementById("present-left-button").onclick = goLeft;
document.getElementById("present-right-button").onclick = goRight;
document.getElementById("present-full-button").onclick = stopPresenting;

textBox.oninput = updateSlides;

document.onkeydown = function(event) {
    if (event.ctrlKey && event.key == "s") {
        event.preventDefault();
        saveSlides();
    }

    if (event.key == "ArrowLeft" && document.activeElement != textBox) {
        goLeft();
    }

    if (event.key == "ArrowRight" && document.activeElement != textBox) {
        goRight();
    }

    if (event.key == "F11") {
        event.preventDefault();

        if (presentPage.style.display == "flex") {
            stopPresenting();
        } else {
            startPresenting();
        }
    }
};

document.onfullscreenchange = function() {
    if (!document.fullscreenElement) {
        presentPage.style.display = "none";
    }
};

var savedSlides = localStorage.getItem("mySlides");

if (savedSlides) {
    textBox.value = savedSlides;
} else {
    textBox.value = "# Slide 1\n## Welcome\nMy presentation\n---\n# Slide 2\n## Thank You";
}

updateSlides();
