document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        currentPage: 'dashboard',
        history: [], // [{ term, algo, result, time }]
        stats: { totalSearchesSession: 0 }
    };

    // --- DOM Elements ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('pageTitle');

    // Components
    const searchForm = document.getElementById('searchForm');
    const loadingState = document.getElementById('loadingState');
    const resultSection = document.getElementById('resultSection');
    const noResult = document.getElementById('noResult');
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');

    // Stats Elements
    const statTotalWords = document.getElementById('statTotalWords');
    const statTotalSearches = document.getElementById('statTotalSearches');

    // History Elements
    const historyTableBody = document.getElementById('historyTableBody');
    const btnClearHistory = document.getElementById('btnClearHistory');
    const dashboardHistoryPreview = document.getElementById('dashboardHistoryPreview');

    // Settings Elements


    // --- Initialization ---
    init();

    function init() {
        setupNavigation();
        setupSearch();

        fetchStats();
        updateDashboardHistory();
        setupExplorer();
    }

    // --- Navigation Logic ---
    function setupNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                navigateTo(targetId);
            });
        });
    }

    function navigateTo(targetId) {
        // Update State
        state.currentPage = targetId;

        // Update Nav UI
        navItems.forEach(nav => {
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });

        // Update View UI
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update Header Title
        pageTitle.textContent = targetId.charAt(0).toUpperCase() + targetId.slice(1);

        // Specific View Actions
        if (targetId === 'history') {
            renderHistoryTable();
        }
        if (targetId === 'dashboard') {
            updateDashboardHistory();
        }
    }

    // --- Dashboard & Stats Logic ---
    async function fetchStats() {
        try {
            const response = await fetch('http://localhost:3000/api/stats');
            if (response.ok) {
                const data = await response.json();

                // Update Stats Page
                if (statTotalWords) statTotalWords.textContent = data.total_words;

                // Update Dashboard Card (New ID)
                const statDash = document.getElementById('statTotalWordsDash');
                if (statDash) statDash.textContent = data.total_words;
            }
        } catch (error) {
            console.error("Failed to fetch stats");
            if (statTotalWords) statTotalWords.textContent = "-";
            const statDash = document.getElementById('statTotalWordsDash');
            if (statDash) statDash.textContent = "-";
        }
    }

    function updateSessionStats() {
        state.stats.totalSearchesSession++;
        // Dashboard uses different ID or text
        if (statTotalSearches) statTotalSearches.textContent = state.stats.totalSearchesSession;

        // Stats View
        const statSession = document.getElementById('statSessionSearches');
        if (statSession) statSession.textContent = state.stats.totalSearchesSession;
    }

    function addToHistory(term, algo, found, meaning) {
        const record = {
            time: new Date().toLocaleTimeString(),
            term: term,
            algo: algo,
            found: found,
            meaning: meaning
        };
        state.history.unshift(record); // Add to top
        if (state.history.length > 20) state.history.pop(); // Limit to 20
    }

    function updateDashboardHistory() {
        if (state.history.length === 0) {
            dashboardHistoryPreview.innerHTML = '<p class="text-muted">Belum ada riwayat pencarian.</p>';
            return;
        }

        const recent = state.history.slice(0, 5);
        let html = '<ul style="list-style: none; padding: 0;">';
        recent.forEach(item => {
            html += `<li style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                        <span style="font-weight: 500;">${item.term}</span> 
                        <span class="text-muted" style="font-size: 0.85rem;">(${item.algo})</span>
                        ${item.found ? '<span style="color: green; float: right;">Ditemukan</span>' : '<span style="color: red; float: right;">Tidak</span>'}
                     </li>`;
        });
        html += '</ul>';
        dashboardHistoryPreview.innerHTML = html;
    }

    // --- History View Logic ---
    function renderHistoryTable() {
        historyTableBody.innerHTML = '';
        if (state.history.length === 0) {
            historyTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada data.</td></tr>';
            return;
        }

        state.history.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.time}</td>
                <td>${item.term}</td>
                <td>${item.algo}</td>
                <td>${item.found ? item.meaning : '<span style="color:red">Tidak Ditemukan</span>'}</td>
            `;
            historyTableBody.appendChild(row);
        });
    }

    btnClearHistory.addEventListener('click', () => {
        if (confirm("Hapus semua riwayat sesi ini?")) {
            state.history = [];
            renderHistoryTable();
            state.stats.totalSearchesSession = 0;
            statTotalSearches.textContent = 0;
        }
    });

    // --- Settings Logic ---


    // --- Search Logic (Migrated) ---
    function setupSearch() {
        const API_URL = 'http://localhost:3000/api/search';

        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Get input values
            const keyword = document.getElementById('keyword').value.trim();
            const algorithm = document.getElementById('algorithm').value;
            const language = document.getElementById('language').value;

            if (!keyword) return;

            // 2. Reset UI State
            resetUI();
            showLoading(true);

            try {
                // 3. Prepare payload for GET request
                const params = new URLSearchParams({
                    q: keyword,
                    algo: algorithm,
                    dir: language
                });

                const response = await fetch(`${API_URL}?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Server returned ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                // 4. Handle Result
                if (!data.results || data.results.length === 0) {
                    showNoResult();
                    addToHistory(keyword, algorithm, false, "-");
                } else {
                    const firstResult = data.results[0];
                    const perf = data.metadata.performance;

                    const displayData = {
                        word: firstResult.entry.indonesia,
                        meaning: firstResult.entry.daerah,
                        algorithm: data.metadata.algorithm.toUpperCase(),
                        comparisons: perf.total_comparisons,
                        index: (firstResult.matches.indonesia.length > 0 ? firstResult.matches.indonesia[0] : (firstResult.matches.daerah.length > 0 ? firstResult.matches.daerah[0] : '-')),
                        executionTime: `${perf.execution_time_ms} ms`
                    };

                    renderResult(displayData);
                    addToHistory(keyword, algorithm, true, displayData.meaning);
                }

                updateSessionStats();

            } catch (error) {
                console.error('Search Error:', error);
                showError(`Gagal menghubungi server: ${error.message}. Pastikan backend berjalan.`);
            } finally {
                showLoading(false);
            }
        });
    }

    function resetUI() {
        resultSection.classList.add('hidden');
        noResult.classList.add('hidden');
        errorSection.classList.add('hidden');
    }

    function showLoading(isLoading) {
        if (isLoading) {
            loadingState.classList.remove('hidden');
        } else {
            loadingState.classList.add('hidden');
        }
    }

    function showNoResult() {
        noResult.classList.remove('hidden');
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorSection.classList.remove('hidden');
    }

    function renderResult(data) {
        document.getElementById('resWord').textContent = data.word || '-';
        document.getElementById('resMeaning').textContent = data.meaning || '-';
        document.getElementById('resAlgorithm').textContent = data.algorithm || '-';
        document.getElementById('resComparisons').textContent = data.comparisons !== undefined ? data.comparisons : '-';
        document.getElementById('resIndex').textContent = data.index !== undefined ? data.index : 'Not found';
        document.getElementById('resTime').textContent = data.executionTime || 'N/A';

        resultSection.classList.remove('hidden');
    }
    // --- Explorer Logic ---
    function setupExplorer() {
        const tabs = document.querySelectorAll('.explorer-tab');
        const filterContainer = document.getElementById('explorerFilters');
        const searchInput = document.getElementById('explorerSearchInput');

        // Tab Switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update State
                const tabName = tab.getAttribute('data-tab');
                state.explorerTab = tabName;
                state.explorerFilter = null; // Reset filter

                // Re-render filters & list
                renderExplorerFilters(tabName);
                renderExplorerList();
            });
        });

        // Search Input
        searchInput.addEventListener('input', (e) => {
            state.explorerSearch = e.target.value.toLowerCase();
            renderExplorerList();
        });

        // Initial Render
        state.explorerTab = 'alphabet';
        renderExplorerFilters('alphabet');
        // Fetch full dictionary for explorer
        fetchDictionary().then(() => {
            renderExplorerList();
        });
    }

    let dictionaryData = [];
    async function fetchDictionary() {
        try {
            const response = await fetch('http://localhost:3000/api/data'); // Hypothethical
            if (response.ok) {
                dictionaryData = await response.json();
                console.log(`Loaded ${dictionaryData.length} words from API`);
            } else {
                console.error('Failed to fetch dictionary data:', response.status);
                dictionaryData = [];
            }

            // Update Explorer Count
            const explorerTotal = document.getElementById('explorerTotalWords');
            if (explorerTotal) explorerTotal.textContent = dictionaryData.length;

        } catch (e) {
            console.error("Error fetching dictionary:", e);
            dictionaryData = [];
            const explorerTotal = document.getElementById('explorerTotalWords');
            if (explorerTotal) explorerTotal.textContent = "0";
        }
    }

    function renderExplorerFilters(tab) {
        const container = document.getElementById('explorerFilters');
        container.innerHTML = '';

        let filters = [];
        if (tab === 'alphabet') {
            filters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        } else if (tab === 'lontara') {
            // Main Lontara characters
            filters = ['ᨀ', 'ᨁ', 'ᨂ', 'ᨄ', 'ᨅ', 'ᨆ', 'ᨈ', 'ᨉ', 'ᨊ', 'ᨋ', 'ᨌ', 'ᨍ', 'ᨎ', 'ᨏ', 'ᨐ', 'ᨑ', 'ᨒ', 'ᨓ', 'ᨔ', 'ᨕ', 'ᨖ'];
        } else if (tab === 'kelas') {
            filters = ['Umum', 'Kata Benda', 'Kata Kerja', 'Kata Sifat', 'Partikel'];
        }

        filters.forEach(f => {
            const pill = document.createElement('div');
            pill.className = `filter-pill ${state.explorerFilter === f ? 'active' : ''}`;
            pill.textContent = f;
            pill.onclick = () => {
                // Toggle
                if (state.explorerFilter === f) {
                    state.explorerFilter = null;
                    pill.classList.remove('active');
                } else {
                    // clear others
                    const all = container.querySelectorAll('.filter-pill');
                    all.forEach(p => p.classList.remove('active'));

                    state.explorerFilter = f;
                    pill.classList.add('active');
                }
                renderExplorerList();
            };
            container.appendChild(pill);
        });
    }

    function renderExplorerList() {
        const container = document.getElementById('explorerList');
        container.innerHTML = '';

        // Filter Data
        let filtered = dictionaryData.filter(item => {
            // 1. Search Logic
            if (state.explorerSearch) {
                const term = state.explorerSearch;
                const matchWord = item.indonesia.toLowerCase().includes(term);
                const matchMeaning = item.daerah.toLowerCase().includes(term);
                if (!matchWord && !matchMeaning) return false;
            }

            // 2. Tab/Filter Logic
            if (state.explorerTab === 'alphabet') {
                if (state.explorerFilter) {
                    return item.indonesia.toUpperCase().startsWith(state.explorerFilter);
                }
                return true; // Show all when no alphabet filter selected
            } else if (state.explorerTab === 'lontara') {
                if (state.explorerFilter && item.lontara) {
                    return item.lontara.startsWith(state.explorerFilter);
                }
                return true; // Show all when no lontara filter selected
            } else if (state.explorerTab === 'kelas') {
                if (state.explorerFilter && item.kelas) {
                    return item.kelas === state.explorerFilter;
                }
                return true; // Show all when no kelas filter selected
            }
            return true;
        });

        // Sort
        filtered.sort((a, b) => a.indonesia.localeCompare(b.indonesia));

        // Check if data is loaded at all
        if (dictionaryData.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 2rem; color: var(--text-muted);">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 10px; color: #ef4444;"></i>
                    <p>Gagal memuat data kamus dari server.</p>
                    <button class="btn-primary" onclick="window.location.reload()" style="margin-top:10px;">Coba Refresh</button>
                </div>`;
            return;
        }

        // Check if filter result is empty
        if (filtered.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--text-muted);">Tidak ada kata ditemukan untuk filter ini.</div>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'entry-card';

            // Determine badge color
            const type = item.kelas || 'Umum';

            card.innerHTML = `
                <div class="entry-icon">${item.indonesia.charAt(0).toUpperCase()}</div>
                <div class="entry-details">
                    <div class="entry-header">
                        <span class="entry-word">${item.indonesia}</span>
                        ${item.phonetic ? `<span class="entry-phonetic">${item.phonetic}</span>` : ''}
                        <span class="entry-badge">${type}</span>
                    </div>
                    <div class="entry-meaning">${item.daerah}</div>
                </div>
                <!-- Display Lontara if available -->
                ${item.lontara ? `<div class="entry-lontara">${item.lontara}</div>` : ''}
            `;
            container.appendChild(card);
        });
    }
});
