document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const loadingState = document.getElementById('loadingState');
    const resultSection = document.getElementById('resultSection');
    const noResult = document.getElementById('noResult');
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');

    // API Config - Change this if backend port differs
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
                algo: algorithm
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
            // Backend returns: { metadata: {...}, results: [...] }

            if (!data.results || data.results.length === 0) {
                showNoResult();
            } else {
                // For simplicity, take the first match
                const firstResult = data.results[0];
                const perf = data.metadata.performance;

                // Construct display object
                const displayData = {
                    word: firstResult.entry.indonesia, // Show Indonesian word
                    meaning: firstResult.entry.daerah, // Show Regional word as meaning
                    algorithm: data.metadata.algorithm.toUpperCase(),
                    comparisons: perf.total_comparisons,
                    // If we found a match, show the index (taking first index from whichever side matched)
                    index: (firstResult.matches.indonesia.length > 0 ? firstResult.matches.indonesia[0] : (firstResult.matches.daerah.length > 0 ? firstResult.matches.daerah[0] : '-')),
                    executionTime: `${perf.execution_time_ms} ms`
                };

                renderResult(displayData);
            }

        } catch (error) {
            console.error('Search Error:', error);
            showError(`Gagal menghubungi server: ${error.message}. Pastikan backend berjalan.`);
        } finally {
            showLoading(false);
        }
    });

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
});
