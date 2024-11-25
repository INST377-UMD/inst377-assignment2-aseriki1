const DOG_IMAGES_API = 'https://dog.ceo/api/breeds/image/random/10';
const DOG_BREEDS_API = 'https://dogapi.dog/api/v2/breeds';

// Load 10 random dog images
async function loadRandomDogImages() {
    try {
        const response = await fetch(DOG_IMAGES_API);
        const data = await response.json();

        const imagesContainer = document.getElementById('random-images');
        imagesContainer.innerHTML = ''; // Clear existing images

        data.message.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Random Dog';
            img.classList.add('dog-image');
            imagesContainer.appendChild(img);
        });
    } catch (error) {
        console.error('Error loading random dog images:', error);
    }
}

// Load all dog breeds and create buttons dynamically
async function loadDogBreeds() {
    try {
        const response = await fetch(DOG_BREEDS_API);
        const data = await response.json();
        const breeds = data.data;

        const buttonsContainer = document.getElementById('breed-buttons');
        buttonsContainer.innerHTML = ''; // Clear existing buttons

        breeds.forEach(breed => {
            const button = document.createElement('button');
            button.textContent = breed.attributes.name;
            button.classList.add('breed-button');
            button.onclick = () => displayBreedInfo(breed);
            buttonsContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error loading dog breeds:', error);
    }
}

// Display breed information when a button is clicked
function displayBreedInfo(breed) {
    const breedInfo = document.getElementById('breed-info');
    document.getElementById('breed-name').textContent = breed.attributes.name;
    document.getElementById('breed-description').textContent = breed.attributes.description || 'No description available.';
    document.getElementById('breed-lifespan').textContent = breed.attributes.life || 'Unknown lifespan';
    breedInfo.classList.remove('hidden');
}

// Initialize the page
window.onload = () => {
    loadRandomDogImages();
    loadDogBreeds();
};
