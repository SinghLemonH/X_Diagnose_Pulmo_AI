// The link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/-nkdbiMMn/";
  
let model, labelContainer, maxPredictions;

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// Show the image upload input and hide the "Start" button
function startPredictions() {
    document.getElementById("start-button").style.display = "none";
    document.getElementById("image-upload-container").style.display = "block";
}

// Handle image upload and prediction
async function handleImageUpload(event) {
    const imageFile = event.target.files[0];
    if (imageFile) {
        const image = await loadImage(imageFile);
        document.getElementById("label-container").style.display = "block";  // แสดง label-container
        await predict(image);
    }
}

// Load image file and return a promise with the loaded image
function loadImage(imageFile) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = () => resolve(image);
        };
        reader.readAsDataURL(imageFile);
    });
}

// Run the image through the image model and display predictions
async function predict(image) {
    const prediction = await model.predict(image);

    // Initialize variables to track the highest probability and its index
    let highestProbability = 0;
    let highestIndex = 0;

    for (let i = 0; i < maxPredictions; i++) { 
        const probability = prediction[i].probability * 100;
        const classPrediction =
            prediction[i].className + ": " + probability.toFixed(2) + "%"; // Convert to percentage
        const predictionBar = document.getElementById(`prediction-${i}`);
        predictionBar.style.width = probability + '%';
        predictionBar.innerHTML = classPrediction;

        // Check if the current probability is higher than the previous highest
        if (probability > highestProbability) {
            highestProbability = probability;
            highestIndex = i;
        }
    }

    // Apply the .prediction-bar-highest class to the highest percentage bar
    const highestPredictionBar = document.getElementById(`prediction-${highestIndex}`);
    highestPredictionBar.classList.add("prediction-bar-highest");

    // Remove the .prediction-bar-highest class from other bars
    for (let i = 0; i < maxPredictions; i++) {
        if (i !== highestIndex) {
            const otherPredictionBar = document.getElementById(`prediction-${i}`);
            otherPredictionBar.classList.remove("prediction-bar-highest");
        }
    }
}

// Call init() to load the model and initialize the interface
init();