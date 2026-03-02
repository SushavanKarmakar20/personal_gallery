async function renderGallery() {
    const grid = document.getElementById('media-grid');
    const filterBar = document.getElementById('filter-bar');
    
    try {
        const res = await fetch('data.csv');
        const text = await res.text();
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1);

        const categories = new Set();

        rows.forEach((row, index) => {
            const cols = row.split(',').map(c => c.trim());
            if (cols.length < headers.length) return;

            const item = {};
            headers.forEach((h, i) => item[h] = cols[i]);
            if (item.category) categories.add(item.category);

            const card = document.createElement('div');
            // Adding Animate.css classes + stagger delay
            card.className = `card animate__animated animate__zoomIn`;
            card.style.animationDelay = `${index * 0.1}s`; 
            card.setAttribute('data-category', item.category);

            let mediaHtml = item.type === 'jpg' 
                ? `<div class="media-box lightbox-trigger" data-type="jpg" data-id="${item.id}"><img src="https://drive.google.com/thumbnail?id=${item.id}&sz=w1000" loading="lazy"></div>`
                : `<div class="media-box lightbox-trigger" data-type="mp4" data-id="${item.id}"><div class="click-catcher"></div><div class="video-wrapper"><iframe src="https://drive.google.com/file/d/${item.id}/preview"></iframe></div></div>`;

            card.innerHTML = `${mediaHtml}<div class="content"><span class="category-tag">${item.category}</span></div>`;
            grid.appendChild(card);
        });

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = cat;
            btn.setAttribute('data-filter', cat);
            filterBar.appendChild(btn);
        });

        setupFilters();
        setupLightbox();

    } catch (err) { console.error(err); }
}

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const filter = btn.getAttribute('data-filter');
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'block';
                    card.classList.add('animate__zoomIn');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const content = document.getElementById('lightbox-content');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const type = trigger.getAttribute('data-type');
            const id = trigger.getAttribute('data-id');
            content.innerHTML = type === 'jpg' 
                ? `<img src="https://drive.google.com/thumbnail?id=${id}&sz=w4000" class="animate__animated animate__backInUp">` 
                : `<iframe src="https://drive.google.com/file/d/${id}/preview" allow="autoplay" class="animate__animated animate__backInUp"></iframe>`;
            lightbox.classList.add('active');
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        content.innerHTML = '';
    });
}

document.addEventListener('DOMContentLoaded', renderGallery);