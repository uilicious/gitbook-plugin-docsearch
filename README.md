GitBook Plugin to add Algolia docSearch Plugin

## Installation

```
npm install gitbook-plugin-docsearch
```

## Usage
Gitbook comes with default search option. In order to use this plugin, need to disable the default search plugins and add `docSearch` as bellow :

```
"plugins": [
    "-search",
    "-lunr",
    "docSearch"
  ]
```
add to book.json

```
{
   "pluginsConfig": {
     "docSearch": {
       "apiKey" : "replace_with_algolia_doc_search_api_key",
       "index" : "replace_with_algolia_doc_search_index"
     }
   }
}
```
