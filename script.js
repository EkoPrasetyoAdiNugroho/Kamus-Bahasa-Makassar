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
            // Backend returns: { metadata: {...}, results: [...], suggestions: [...], hasExactMatch: boolean }

            if (!data.results || data.results.length === 0) {
                // No exact matches found
                if (data.suggestions && data.suggestions.length > 0) {
                    showNoResultWithSuggestions(keyword);
                    renderSuggestions(data.suggestions);
                } else {
                    showNoResult();
                }
            } else {
                // Show metadata
                const metadata = {
                    algorithm: data.metadata.algorithm.toUpperCase(),
                    keyword: data.metadata.keyword || keyword,
                    comparisons: data.metadata.performance.total_comparisons,
                    executionTime: `${data.metadata.performance.execution_time_ms} ms`,
                    totalResults: data.results.length
                };

                renderResults(data.results, metadata);

                // Also show suggestions if available
                if (data.suggestions && data.suggestions.length > 0) {
                    renderSuggestions(data.suggestions);
                }
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
        document.getElementById('suggestionsSection').classList.add('hidden');
    }

    function showLoading(isLoading) {
        if (isLoading) {
            loadingState.classList.remove('hidden');
        } else {
            loadingState.classList.add('hidden');
        }
    }

    function showNoResult() {
        document.getElementById('noResultMessage').textContent = 'Kata tidak ditemukan dalam kamus.';
        noResult.classList.remove('hidden');
    }

    function showNoResultWithSuggestions(keyword) {
        document.getElementById('noResultMessage').textContent =
            `Kata "${keyword}" tidak ditemukan. Mungkin yang Anda maksud:`;
        noResult.classList.remove('hidden');
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorSection.classList.remove('hidden');
    }

    function renderResults(results, metadata) {
        // Update metadata section
        document.getElementById('resAlgorithm').textContent = metadata.algorithm || '-';
        document.getElementById('resKeyword').textContent = metadata.keyword || '-';
        document.getElementById('resComparisons').textContent = metadata.comparisons !== undefined ? metadata.comparisons : '-';
        document.getElementById('resTime').textContent = metadata.executionTime || 'N/A';

        // Update result count
        const resultCountText = `Ditemukan ${metadata.totalResults} kata yang cocok`;
        document.getElementById('resultCount').textContent = resultCountText;

        // Clear previous results
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';

        // Render each result
        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-list-item';

            // Determine which field matched
            const indoMatches = result.matches.indonesia.length > 0;
            const daerahMatches = result.matches.daerah.length > 0;

            let matchInfo = '';
            if (indoMatches && daerahMatches) {
                matchInfo = `<span class="match-badge">Cocok di kedua bahasa</span>`;
            } else if (indoMatches) {
                matchInfo = `<span class="match-badge">Cocok di Indonesia</span>`;
            } else if (daerahMatches) {
                matchInfo = `<span class="match-badge">Cocok di Daerah</span>`;
            }

            // Show index positions
            const indexInfo = [];
            if (indoMatches) {
                indexInfo.push(`Indo: posisi ${result.matches.indonesia.join(', ')}`);
            }
            if (daerahMatches) {
                indexInfo.push(`Daerah: posisi ${result.matches.daerah.join(', ')}`);
            }

            resultItem.innerHTML = `
                <div class="word-pair">
                    <div>
                        <div class="word">${result.entry.indonesia}</div>
                        <div class="translation">${result.entry.daerah}</div>
                    </div>
                    <div style="text-align: right; font-size: 0.85rem; color: #999;">
                        #${index + 1}
                    </div>
                </div>
                <div class="match-info">
                    ${matchInfo}
                    <span>${indexInfo.join(' • ')}</span>
                </div>
            `;

            resultsList.appendChild(resultItem);
        });

        resultSection.classList.remove('hidden');
    }

    function renderSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) return;

        const suggestionsSection = document.getElementById('suggestionsSection');
        const suggestionsList = document.getElementById('suggestionsList');
        const suggestionCount = document.getElementById('suggestionCount');

        // Clear previous suggestions
        suggestionsList.innerHTML = '';

        // Update count
        suggestionCount.textContent = `${suggestions.length} kata serupa ditemukan`;

        // Render each suggestion
        suggestions.forEach((suggestion, index) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';

            suggestionItem.innerHTML = `
                <div class="word-pair">
                    <div>
                        <div class="word">${suggestion.entry.indonesia}</div>
                        <div class="translation">${suggestion.entry.daerah}</div>
                    </div>
                    <div class="similarity-badge">
                        ${suggestion.similarity.toFixed(0)}% cocok
                    </div>
                </div>
            `;

            suggestionsList.appendChild(suggestionItem);
        });

        // Show suggestions section
        suggestionsSection.classList.remove('hidden');
    }
});
