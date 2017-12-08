require(["gitbook"], function(gitbook) {
    gitbook.events.bind("start", function(e, config) {
        var cfg = config.docSearch;
        docsearch({
            apiKey: cfg.apiKey,
            indexName: cfg.index,
            inputSelector: '#book-doc-search-input',
            debug: false
        });
    });
});