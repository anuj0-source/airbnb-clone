const fs = require("fs");

// Some realistic city names
const cities = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Lucknow",
  "Chandigarh", "Indore", "Bhopal", "Patna", "Surat"
];

// Helper functions
function getRandomCity() {
  return cities[Math.floor(Math.random() * cities.length)];
}

function getRandomSize() {
  return `${Math.floor(Math.random() * 5) + 1} BHK`;
}

function getRandomPrice() {
  return (5000 + Math.floor(Math.random() * 50000)).toString();
}

// Generate homes
const homes = [];

for (let i = 1; i <= 100000; i++) {
  homes.push({
    houseName: `House ${i}`,
    size: getRandomSize(),
    location: getRandomCity(),
    price: getRandomPrice(),
    image: `https://picsum.photos/300/200?random=${i}`,
    description: `Beautiful house located in ${getRandomCity()} with modern facilities`
  });
}

// Save to file
fs.writeFileSync("home.json", JSON.stringify(homes, null, 2));

console.log("✅ 1000 homes generated successfully");
