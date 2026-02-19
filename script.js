// Initialize Lucide icons
lucide.createIcons();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add background to navbar when scrolling
    if (currentScroll > 50) {
        navbar.classList.add('bg-[#0a0a0f]/80', 'backdrop-blur-lg', 'border-b', 'border-white/10');
    } else {
        navbar.classList.remove('bg-[#0a0a0f]/80', 'backdrop-blur-lg', 'border-b', 'border-white/10');
    }
    
    lastScroll = currentScroll;
});

// Smooth reveal animation for cards
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.glass-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Add hover effect to theory cards for extra interactivity
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = 'rgba(247, 147, 26, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});

// Live Bitcoin Tracker functionality
const SATOSHI_HOLDINGS = 1100000; // Estimated 1.1 million BTC
const KES_RATE = 157; // Approximate USD to KES rate (this fluctuates)

async function fetchBitcoinData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,kes&include_24hr_change=true');
        const data = await response.json();
        
        const btcPrice = data.bitcoin.usd;
        const btcPriceKes = data.bitcoin.kes || (btcPrice * KES_RATE); // Fallback if KES not available
        const change24h = data.bitcoin.usd_24h_change;
        
        // Update DOM elements
        updateTrackerDisplay(btcPrice, btcPriceKes, change24h);
        
    } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
        // Fallback display
        document.getElementById('btc-price').textContent = 'Error';
        document.getElementById('net-worth-usd').textContent = 'Error';
        document.getElementById('net-worth-kes').textContent = 'Error';
    }
}

function updateTrackerDisplay(price, priceKes, change24h) {
    // Format price
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
    
    // Calculate net worths
    const netWorthUsd = price * SATOSHI_HOLDINGS;
    const netWorthKes = (priceKes || price * KES_RATE) * SATOSHI_HOLDINGS;
    
    // Format net worth USD (in billions)
    const formattedNetWorthUsd = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(netWorthUsd);
    
    // Format net worth KES (in trillions or billions)
    const formattedNetWorthKes = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0
    }).format(netWorthKes);
    
    // Format 24h change
    const changeElement = document.getElementById('change-24h');
    const changeSymbol = change24h >= 0 ? '↑' : '↓';
    const changeColor = change24h >= 0 ? 'text-green-400' : 'text-red-400';
    changeElement.textContent = `${changeSymbol} ${Math.abs(change24h).toFixed(2)}%`;
    changeElement.className = `text-xl md:text-2xl font-bold font-mono ${changeColor}`;
    
    // Update price change indicator
    const priceChangeElement = document.getElementById('price-change');
    priceChangeElement.textContent = change24h >= 0 ? '+Live' : '-Live';
    priceChangeElement.className = `text-xs mt-1 ${changeColor}`;
    
    // Update DOM
    document.getElementById('btc-price').textContent = formattedPrice;
    document.getElementById('net-worth-usd').textContent = formattedNetWorthUsd;
    document.getElementById('net-worth-kes').textContent = formattedNetWorthKes;
    
    // Update timestamp
    const now = new Date();
    document.getElementById('last-updated').textContent = now.toLocaleTimeString();
}

// Fetch data initially and then every 30 seconds
fetchBitcoinData();
setInterval(fetchBitcoinData, 30000);

// Matrix-like effect for the hero section (subtle)
function initMatrix() {
    // Only on desktop
    if (window.innerWidth < 768) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.03';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    const hero = document.querySelector('section');
    if (hero) {
        hero.style.position = 'relative';
        hero.insertBefore(canvas, hero.firstChild);
    }
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#F7931A';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize matrix effect when page loads
window.addEventListener('load', initMatrix);

// Add click interaction to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.textContent.includes('Whitepaper')) {
            window.open('https://bitcoin.org/bitcoin.pdf', '_blank');
        }
    });
});