document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('query');
    const searchBtn = document.getElementById('searchBtn');
    const btnLoader = document.getElementById('btnLoader');
    const btnText = document.querySelector('.btn-text');
    const resultsContainer = document.getElementById('results-container');
    const filterChips = document.querySelectorAll('.filter-chip');
    const modal = document.getElementById('dl-modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalBody = document.getElementById('modal-body');

    let currentSite = 'all';

    // Filter selection
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentSite = chip.dataset.site;
        });
    });

    // Search Logic
    async function performSearch() {
        const query = queryInput.value.trim();
        if (!query) {
            alert("කරුණාකර නමක් ඇතුලත් කරන්න!");
            return;
        }

        setLoading(true);
        resultsContainer.innerHTML = '';

        try {
            // Using the user's expected API URL
            // If running via PHP -S localhost:5000 in the api folder
            const API_BASE = 'http://localhost:5000'; 
            const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}&site=${currentSite}`);
            
            if (!response.ok) throw new Error("API Offline");
            
            const data = await response.json();
            displayResults(data.results);
        } catch (error) {
            console.error(error);
            resultsContainer.innerHTML = `
                <div class="initial-msg">
                    <div class="icon-box">❌</div>
                    <h3>API එක සම්බන්ධ කරගත නොහැක!</h3>
                    <p>කරුණාකර Backend එක (PHP Server) port 5000 හී ක්‍රියාත්මක වන බවට සහතික වන්න.</p>
                </div>
            `;
        } finally {
            setLoading(false);
        }
    }

    function displayResults(sitesData) {
        let allResults = [];
        
        // The API returns results grouped by site
        Object.keys(sitesData).forEach(siteName => {
            const results = sitesData[siteName];
            results.forEach(item => {
                allResults.push({ ...item, site: siteName });
            });
        });

        if (allResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="initial-msg">
                    <div class="icon-box">🔍</div>
                    <h3>ප්‍රතිඵල කිසිවක් හමු නොවීය!</h3>
                    <p>වෙනත් නමකින් සර්ච් කර බලන්න.</p>
                </div>
            `;
            return;
        }

        allResults.forEach(res => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <div class="res-info">
                    <h3>${res.title}</h3>
                    <span>${res.site.toUpperCase()}</span>
                </div>
                <button class="dl-btn" data-url="${res.url}">Download Subtitle</button>
            `;
            resultsContainer.appendChild(card);
        });

        // Add event listeners to download buttons
        document.querySelectorAll('.dl-btn').forEach(btn => {
            btn.addEventListener('click', () => prepareDownload(btn.dataset.url));
        });
    }

    async function prepareDownload(pageUrl) {
        modal.style.display = 'block';
        modalBody.innerHTML = `
            <div class="dl-loader"></div>
            <p>Download link එක සූදානම් වෙමින් පවතී...</p>
            <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 10px;">මෙයට තත්පර කිහිපයක් ගත විය හැක.</p>
        `;

        try {
            const API_BASE = 'http://localhost:5000';
            const response = await fetch(`${API_BASE}/download?url=${encodeURIComponent(pageUrl)}`);
            const data = await response.json();

            if (data.success && data.download_url) {
                modalBody.innerHTML = `
                    <div class="icon-box" style="font-size: 3rem; margin-bottom: 20px;">✅</div>
                    <h3 style="margin-bottom: 20px;">Download එක සූදානම්!</h3>
                    <a href="${data.download_url}" class="dl-btn" style="display: inline-block; padding: 15px 40px; font-size: 1.1rem;" target="_blank">Direct Download</a>
                    <p style="margin-top: 20px; font-size: 0.9rem; color: #94a3b8;">සමහරවිට Browser එකෙන් download එකක් විදියට පෙන්වයි.</p>
                `;
            } else {
                throw new Error("Download URL not found");
            }
        } catch (error) {
            modalBody.innerHTML = `
                <div class="icon-box" style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
                <h3 style="margin-bottom: 10px;">අසාර්ථකයි!</h3>
                <p>Direct download link එක ලබාගත නොහැක.</p>
                <a href="${pageUrl}" class="dl-btn" style="display: inline-block; margin-top: 20px;" target="_blank">Visit Site & Download</a>
            `;
        }
    }

    function setLoading(isLoading) {
        if (isLoading) {
            btnLoader.style.display = 'block';
            btnText.style.display = 'none';
            searchBtn.disabled = true;
        } else {
            btnLoader.style.display = 'none';
            btnText.style.display = 'block';
            searchBtn.disabled = false;
        }
    }

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);
    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
});
