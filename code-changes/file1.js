// Function to generate a random number within a given range
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const randomNum = getRandomNumber(1, 100);
console.log('Random number between 1 and 100:', randomNum);

const randomColor = getRandomColor();
console.log('Random color:', randomColor);

const fruits = ['apple', 'banana', 'orange', 'grape', 'kiwi'];
const shuffledFruits = shuffleArray([...fruits]);
console.log('Original array:', fruits);
console.log('Shuffled array:', shuffledFruits);
