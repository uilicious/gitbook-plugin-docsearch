var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');

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
            urls.push({
                url: outputUrl + (outputUrl.substr(-5, 5) !== '.html' ? 'index.html' : '')
            });

            return page;
        },

        "finish": function () {
            var $, $el, html;
            var pathFile = this.options.pluginsConfig.docSearch.apiKey && this.options.pluginsConfig.docSearch.index;
            if(pathFile){

                var searchBox = '<div id="book-search-input">\n' +
                    '    <input type="text" id="book-doc-search-input" placeholder="Type to search">\n' +
                    '</div>';

                if (this.options.pluginsConfig.docSearch.logo && this.options.pluginsConfig.docSearch.brandTitle) {
                    var logo = '<img class="logo" src="/'+this.options.pluginsConfig.docSearch.logo+'"/>' +
                        '<span>'+this.options.pluginsConfig.docSearch.brandTitle+'</span>';
                }

                urls.forEach(item => {
                    html = fs.readFileSync(item.url, {encoding: 'utf-8'});
                $ = cheerio.load(html);

                $el = $('.book-summary');
                $el.prepend(searchBox);

                $el = $('.book-summary');
                $el.prepend(logo);


                $el = $('.summary li:first-child');
                $el.remove();


                fs.writeFileSync(item.url, $.root().html(), {encoding: 'utf-8'});
            });
            }

        }
    }
}