(function($) {
    'use strict';
    
    var searchTimeout;
    var isSearchOpen = false;
    var searchData = {};
    var lastHeaderState = false;
    
    // Initialize search data when available
    if (typeof hroneSearch !== 'undefined' && hroneSearch.data) {
        searchData = hroneSearch.data;
    }
    
    // Search icon click handler
    $(document).on('click', '.header-search-icon', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isSearchOpen) {
            openSearch();
        }
    });
    
    // Close button click handler
    $(document).on('click', '#searchCloseBtn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeSearch();
    }); 
    
    // Close search when clicking outside
    $(document).on('click', function(e) {
        if (isSearchOpen && !$(e.target).closest('.search-expansion-bar, .header-search-icon').length) {
            closeSearch();
        }
    });
    
    // Close search on ESC key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && isSearchOpen) {
            closeSearch();
        }
    });
    
    // Search input handler with debounce
    $(document).on('input', '#globalSearchInput', function() {
        var searchTerm = $(this).val().trim();
        
        clearTimeout(searchTimeout);
        
        if (searchTerm.length < 2) {
            $('#searchResultsDropdown').hide().empty();
            return;
        }
        
        searchTimeout = setTimeout(function() {
            performSearch(searchTerm);
        }, 300);
    });
    
    // Function to calculate and update search bar position
    function updateSearchBarPosition() {
        if (!isSearchOpen) return;
        
        var $searchBar = $('#searchExpansionBar');
        var headerHeight = 0;
        var $topBar = $('.top-bar');
        var $mainHeader = $('.main-header');
        var $navbar = $('.main-header .navbar.fixed-top');
        
        // Check if header is hidden
        var isHeaderHidden = $('body').hasClass('hideHeader');
        
        // If header is hidden, position at top
        if (isHeaderHidden) {
            $searchBar.css('top', '0px');
            return;
        }
        
        // Calculate header height when visible
        if ($topBar.length && $topBar.is(':visible')) {
            headerHeight += $topBar.outerHeight(true);
        }
        
        if ($navbar.length) {
            headerHeight += $navbar.outerHeight(true);
        } else if ($mainHeader.length) {
            headerHeight += $mainHeader.outerHeight(true);
        }
        
        // Set top position to appear right below the header
        $searchBar.css('top', headerHeight + 'px');
    }
    
    // Function to open search
    function openSearch() {
        isSearchOpen = true;
        var $searchBar = $('#searchExpansionBar');
        
        // Initialize header state
        lastHeaderState = $('body').hasClass('hideHeader');
        
        // Update position
        updateSearchBarPosition();
        
        $searchBar.slideDown(300);
        $('#globalSearchInput').focus();
        
        // Add class to body to prevent scroll
        $('body').addClass('search-open');
    }
    
    // Function to check and update header state
    function checkHeaderState() {
        if (!isSearchOpen) return;
        
        var isHeaderHidden = $('body').hasClass('hideHeader');
        
        // Only update if state changed or on scroll
        if (isHeaderHidden !== lastHeaderState) {
            lastHeaderState = isHeaderHidden;
            updateSearchBarPosition();
        }
    }
    
    // Monitor scroll events
    $(window).on('scroll', function() {
        if (isSearchOpen) {
            checkHeaderState();
        }
    });
    
    // Also monitor body class changes (in case hideHeader is added/removed via other scripts)
    if (window.MutationObserver) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (isSearchOpen) {
                        checkHeaderState();
                    }
                }
            });
        });
        
        // Observe body for class changes
        var bodyElement = document.querySelector('body');
        if (bodyElement) {
            observer.observe(bodyElement, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }
    
    // Function to close search
    function closeSearch() {
        isSearchOpen = false;
        $('#searchExpansionBar').slideUp(300);
        $('#globalSearchInput').val('');
        $('#searchResultsDropdown').hide().empty();
        
        // Remove class from body
        $('body').removeClass('search-open');
    }
    // Helper to match search term (title only)
    function matchesSearch(item, searchLower) {
        return item.title && item.title.toLowerCase().indexOf(searchLower) !== -1;
    }

    // Function to perform client-side search
    function performSearch(searchTerm) {
        var dropdown = $('#searchResultsDropdown');
        var searchLower = searchTerm.toLowerCase();
        var results = {
            products: [],
            blogs: [],
            tools: [],
            glossary: [],
            others: []
        };

        // Products: match sub-pages by keyword; if no matches, always show main hr-software first
        if (searchData.products && searchData.products.length > 0) {
            var mainProduct = searchData.products.find(function(p) { return p.is_main; });
            var subProducts = searchData.products.filter(function(p) { return !p.is_main; });
            var matchedSubs = subProducts.filter(function(item) { return matchesSearch(item, searchLower); }).slice(0, 5);

            if (matchedSubs.length > 0) {
                results.products = matchedSubs;
            } else {
                if (mainProduct) {
                    results.products = [mainProduct];
                }
            }
        }

        // Filter blogs
        if (searchData.blogs && searchData.blogs.length > 0) {
            results.blogs = searchData.blogs.filter(function(item) { return matchesSearch(item, searchLower); }).slice(0, 5);
        }

        // Filter tools
        if (searchData.tools && searchData.tools.length > 0) {
            results.tools = searchData.tools.filter(function(item) { return matchesSearch(item, searchLower); }).slice(0, 5);
        }

        // Filter glossary
        if (searchData.glossary && searchData.glossary.length > 0) {
            results.glossary = searchData.glossary.filter(function(item) { return matchesSearch(item, searchLower); }).slice(0, 5);
        }

        // Filter others (pages)
        if (searchData.others && searchData.others.length > 0) {
            results.others = searchData.others.filter(function(item) { return matchesSearch(item, searchLower); }).slice(0, 5);
        }

        displaySearchResults(results);
    }
    
    // Function to render a result section
    function renderSection(heading, items) {
        if (!items || items.length === 0) return '';
        var html = '<div class="search-results-section">';
        html += '<h3 class="search-results-heading">' + escapeHtml(heading) + '</h3>';
        html += '<ul class="search-results-list">';
        $.each(items, function(index, item) {
            html += '<li class="search-result-item">';
            html += '<a href="' + item.url + '" class="search-result-link">';
            html += '<h4 class="search-result-title">' + escapeHtml(item.title) + '</h4>';
            html += '</a></li>';
        });
        html += '</ul></div>';
        return html;
    }

    // Function to display search results - Order: Product, Blog, Glossary, Tools, Others
    function displaySearchResults(results) {
        var dropdown = $('#searchResultsDropdown');
        var html = '';
        var hasResults = false;

        if (results.products && results.products.length > 0) {
            hasResults = true;
            html += renderSection('Product', results.products);
        }
        if (results.blogs && results.blogs.length > 0) {
            hasResults = true;
            html += renderSection('Blog', results.blogs);
        }
        if (results.glossary && results.glossary.length > 0) {
            hasResults = true;
            html += renderSection('Glossary', results.glossary);
        }
        if (results.others && results.others.length > 0) {
            hasResults = true;
            html += renderSection('Others', results.others);
        }
        if (results.tools && results.tools.length > 0) {
            hasResults = true;
            html += renderSection('Tools', results.tools);
        }

        if (!hasResults) {
            html = '<div class="search-no-results">No results found for your search.</div>';
        }

        dropdown.html(html).show();
    }
    
    // Helper function to escape HTML
    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
    
})(jQuery);

