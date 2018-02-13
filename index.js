var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var urls = [];

module.exports = {
    book: {
        assets: './assets',
        js: [
            'doc-search-lib.js',
            'doc-search.js'
        ],
        css: [
            'doc-search.css'
        ]
    },
    hooks: {
        "page": function (page) {

            if (this.output.name != 'website') return page;

            var lang = this.isLanguageBook() ? this.config.values.language : '';
            if (lang) lang = lang + '/';

            var outputUrl = this.output.toURL('_book/' + lang + page.path);
            var normalizedUrl = outputUrl + (path.extname(outputUrl) !== '.html' ? 'index.html' : '');
            if (!urls.some(item => item.url === normalizedUrl)) {
                urls.push({
                    url: normalizedUrl
                });
            }

            return page;
        },

        "finish": function () {
            var $, $el, html;
            var logo;
            var pathFile = this.options.pluginsConfig.docSearch.apiKey && this.options.pluginsConfig.docSearch.index;
            if(pathFile){

                var searchBox = '<div id="book-search-input">\n' +
                    '    <input type="text" id="book-doc-search-input" placeholder="Type to search">\n' +
                    '</div>';

                if (this.options.pluginsConfig.docSearch.logo) {

                    if (this.options.pluginsConfig.docSearch.brandUrl) {
                        logo = '<a href="'+this.options.pluginsConfig.docSearch.brandUrl+'">' +
                            ' <img class="logo" src="/'+this.options.pluginsConfig.docSearch.logo+'"/>'+
                            '</a>';
                    }
                    else {
                        logo = '<img class="logo" src="/'+this.options.pluginsConfig.docSearch.logo+'"/>';
                    }
                }

                urls.forEach(item => {
                    html = fs.readFileSync(item.url, {encoding: 'utf-8'});
                    $ = cheerio.load(html);

                    if ($('#book-search-input').length === 0) {
                        $el = $('.book-summary');
                        $el.prepend(searchBox);
                        if (logo) {
                            $el.prepend(logo);
                        }
                    }

                fs.writeFileSync(item.url, $.root().html(), {encoding: 'utf-8'});
            });
            }

        }
    }
}
