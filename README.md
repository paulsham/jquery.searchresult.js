jquery.searchresult.js
======================

A jQuery plugin that passes an input value to a service and formats the JSON object as a search result.


Usage
---------------------

    $('input[type="text"], textarea').searchresult();

Options
---------------------

    $('input[type="text"], textarea').searchresult('init',{
      AJAXpath: 'demo.json',
      jsonPathLink: '_source.shortUrl',
      jsonPathText: '_source.body'
    });

### AJAXpath (string)*
Required. Path to AJAX service.

### jsonPathLink (string)*
Required. Path to traverse JSON object to search result link.

### jsonPathText (string)*
Required. Path to traverse JSON object to search result text.

### inputClass (string)
_Default: 'searchResult'_

### resultClass (string)
_Default: 'searchResult-results'_

### resultLimit (variable)
_Default: 0_

### noResultsText (string)
_Default: 'No search results found.'_



Changelog
---------------------
v0.0
  + Initial upload.