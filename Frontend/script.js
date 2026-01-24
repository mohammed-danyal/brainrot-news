document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api/news'; 
    const trendingSlider = document.getElementById('trending-slider');
    const updatesSlider = document.getElementById('updates-slider');
    const navItems = document.querySelectorAll('.nav-item');
    const dateDisplay = document.getElementById('dateDisplay');
    const homeBtn = document.getElementById('homeBtn');
    
    // --- GLOBAL MEMORY ---
    // We store the fetched news here so we can read it when you click a card
    let allNewsData = [];

    // 1. DATE DISPLAY
    const updateDate = () => {
        const now = new Date();
        dateDisplay.textContent = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`;
    };
    updateDate();

    // 2. CARD TEMPLATES (Note the onclick event!)
    const createLargeCard = (item) => `
        <div class="card-large" data-category="${item.category}" onclick="openArticle('${item._id}')">
            <img src="${item.image_url}" alt="News" class="card-image">
            <div class="card-overlay">
                <span class="tag ${item.category}">${item.category}</span>
                <h3 class="card-title">${item.title}</h3>
            </div>
        </div>`;

    const createSmallCard = (item) => `
        <div class="card-small" data-category="${item.category}" onclick="openArticle('${item._id}')">
            <div class="small-image-wrapper">
                <img src="${item.image_url}" alt="News" class="card-image">
                <div style="position:absolute; top:10px; left:10px;">
                    <span class="tag ${item.category}">${item.category}</span>
                </div>
            </div>
            <div class="small-content">
                <h4 class="small-title">${item.title}</h4>
            </div>
        </div>`;

    // 3. FETCH DATA
    async function loadNews() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            // SAVE DATA TO MEMORY
            allNewsData = data;

            trendingSlider.innerHTML = '';
            updatesSlider.innerHTML = '';

            data.forEach(news => {
                if (news.section === 'trending') {
                    trendingSlider.insertAdjacentHTML('beforeend', createLargeCard(news));
                } else {
                    updatesSlider.insertAdjacentHTML('beforeend', createSmallCard(news));
                }
            });

            setupFilters();
        } catch (err) {
            console.error("Fetch failed:", err);
            trendingSlider.innerHTML = `<p style="padding:20px; color: #ff0055;">Server is sleeping... wake it up!</p>`;
        }
    }

    // 4. *** THE EXPAND LOGIC ***
    window.openArticle = (id) => {
        // Find the article data from our memory
        const article = allNewsData.find(a => a._id === id);
        
        if (article) {
            // Fill Title & Tag
            document.getElementById('modalTitle').innerText = article.title;
            
            const tag = document.getElementById('modalTag');
            tag.innerText = article.category;
            tag.className = `tag ${article.category}`; // Updates color (pink/green/blue)
            
            // Fill Image
            document.getElementById('modalImage').src = article.image_url || 'https://placehold.co/600x400';
            
            // Fill The "Brainrot" Summary (The Paragraph)
            // If the summary is missing, it shows a default message
            document.getElementById('modalBody').innerText = article.summary || "No tea available for this one yet. 😴";
            
            // Make it Visible (Pop Up)
            document.getElementById('articleModal').style.display = "flex";
            document.body.style.overflow = "hidden"; // Stop background from scrolling
        }
    };

    // Close Logic
    window.closeModal = () => {
        document.getElementById('articleModal').style.display = "none";
        document.body.style.overflow = "auto"; 
    };

    window.onclick = (event) => {
        const modal = document.getElementById('articleModal');
        if (event.target === modal) closeModal();
    };

    // 5. FILTERS & NAVIGATION
    function setupFilters() {
        const allCards = document.querySelectorAll('.card-large, .card-small');
        navItems.forEach(item => {
            item.onclick = (e) => {
                e.preventDefault();
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                const cat = item.getAttribute('data-category');
                allCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (cat === 'all' || cardCat === cat) card.style.display = 'flex'; 
                    else card.style.display = 'none';
                });
            };
        });
    }

    document.querySelectorAll('.scroll-btn').forEach(btn => {
        btn.onclick = () => {
            const slider = document.getElementById(btn.getAttribute('data-target'));
            const move = btn.classList.contains('next-btn') ? 340 : -340;
            slider.scrollBy({ left: move, behavior: 'smooth' });
        };
    });

    homeBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navItems.forEach(n => n.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
        document.querySelectorAll('.card-large, .card-small').forEach(c => c.style.display = 'flex');
    };

    loadNews();
});