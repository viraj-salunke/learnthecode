document.addEventListener('DOMContentLoaded', function() {
    // Create dynamic background nodes
    function createRandomNodes() {
        const container = document.body;
        const nodeCount = 12;
        
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'node';
            
            // Random position
            const left = Math.random() * 90 + 5;
            const top = Math.random() * 90 + 5;
            
            // Random size and animation
            const size = Math.random() * 6 + 4;
            const delay = Math.random() * 5;
            const duration = Math.random() * 5 + 3;
            
            node.style.cssText = `
                left: ${left}%;
                top: ${top}%;
                width: ${size}px;
                height: ${size}px;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;
            
            container.appendChild(node);
        }
    }

    // Add occasional twinkle effect
    function addTwinkleEffect() {
        const nodes = document.querySelectorAll('.node');
        if (nodes.length > 0) {
            const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
            randomNode.style.animation = 'none';
            void randomNode.offsetWidth; // Trigger reflow
            randomNode.style.animation = `blink ${Math.random() * 3 + 2}s infinite`;
        }
    }

    // Initialize background elements
    createRandomNodes();
    
    // Set up twinkle interval
    setInterval(addTwinkleEffect, 2000);

    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.style.transform = 'translateX(0)';
    });
    
    closeSidebar.addEventListener('click', function() {
        sidebar.style.transform = 'translateX(-100%)';
    });

    // Theme toggle functionality
    const themeBtn = document.querySelector('.btn-theme');
    themeBtn.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Card hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const x = e.clientX - card.getBoundingClientRect().left;
            const y = e.clientY - card.getBoundingClientRect().top;
            
            const centerX = card.offsetWidth / 2;
            const centerY = card.offsetHeight / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
});
