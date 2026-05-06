window.addEventListener("DOMContentLoaded", () => {
    // 1. Existing Navbar/Wrapper logic
    const nav = document.querySelector('.navbar');
    const wrapper = document.querySelector('.wrapper');

    if (nav) nav.classList.add("nav-entrance");
    if (wrapper) wrapper.classList.add("content-entrance");

    // 2. Flower Generation Logic
    const garden = document.getElementById('garden');
    if (!garden) return; // Safety check

    const flowerCount = 4;
    const colors = ['#7214b0','#fd77c8', '#d28efe', '#da20b2'];

    for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('div');
        flower.className = `flower flower-${i + 1}`;
        
        // Add the stem (leaf)
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        flower.appendChild(leaf);

        // Add 5 petals
        for (let j = 0; j < 5; j++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            // Math for 5-petal rotation
            petal.style.setProperty('--rotation', `${j * 72}deg`);
            petal.style.backgroundColor = colors[i % colors.length];
            flower.appendChild(petal);
        }

        garden.appendChild(flower);
    }
});