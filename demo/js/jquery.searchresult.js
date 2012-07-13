/*
* jQuery searchresult v0.1
* by Paul Sham (@paul_sham)
*/

;(function($){
  "use strict";
  
  var settings = [];

  var methods = {
    init: function(options){
      settings = $.extend($.fn.searchresult.defaults, options); // defaults + set options
      
      return this.each(function(){
        var $searchField = $(this),
            $searchResults = settings.results;
        initResults();
        
        // initResults() - add classes and bind events
        function initResults(){
          $.data($searchField, 'value', '');
          $.data($searchField, 'resultsFocus', false);
          
          if(settings.results === null){
            $searchResults = $searchField
            .after('<ul class="'+settings.resultClass+'"></ul>')
            .next('ul');
          }
          
          $searchField
          .addClass(settings.inputClass)
          .after('<ul class="'+settings.resultClass+'"></ul>')
          .on({
            keyup: function(e){
              if(e.keyCode == 40 || e.keyCode == 38){
                navigateSearchResults(e);
                
                if($.data($searchField, 'resultsFocus') == false){
                  $(window).on('keyup', navigateSearchResults)
                }
              }
              else{
                if($.data($searchField, 'value') !== $(this).val()){
                  $.data($searchField, 'value', $(this).val());
                  searchTyping(e.keyCode);
                  
                  $(window).on('click', hideSearchResults);
                }
              }
              
              e.stopPropagation();
            },
            focus: function(){
              $(window)
              .off('keyup', navigateSearchResults);
              $.data($searchField, 'resultsFocus', false);
            }
          });
        }
        
        function searchTyping(e){
          var value = $searchField.val();
          $searchField.searchresult('get', {
            val: value
          });
        }
        
        function navigateSearchResults(e){
          var key = e.keyCode;
          var $searchResultsFocus = $searchResults.children('li').children('a:focus');
          
          switch(key){
            case 40: //down key
              if($searchResultsFocus.parent('li').index() == $searchResults.children('li').length - 1){
                $searchField.focus();
              }
              else if($searchResultsFocus.length > 0){
                $searchResultsFocus.parent('li').next('li').children('a').focus();
              }
              else{
                $searchResults.children('li').first().children('a').focus();
              }
              break;
            case 38: // up key
              if($searchResultsFocus.parent('li').index() == 0){
                $searchField.focus();
              }
              else if($searchResultsFocus.length > 0){
                $searchResultsFocus.parent('li').prev('li').children('a').focus();
              }
              else{
                $searchResults.children('li').last().children('a').focus();
              }
              
              break;
          }
          e.stopPropagation();
        }
        
        function hideSearchResults(e){
          $searchField.searchresult('hide');
          $(window)
          .off('keyup', navigateSearchResults)
          .off('click', hideSearchResults);
        }
      });
    },
    get: function(searchStr){
      return this.each(function(){
      
        var $searchField = $(this),
            $searchResults = (settings.results !== null) ? settings.results : $searchField.next('ul'),
            searchStrArray = searchStr.val.split(' ');
        
        $.ajax({
          url: settings.AJAXpath,
          context: $searchResults,
          dataType: 'json',
          success: function(data){
            var searchResultsArray = [],
                searchResultsHTMLArray = [];
            
            if(data.length > 0){
            
              if(settings.resultLimit > 0){
                data = data.splice(0,settings.resultLimit);
              }
            
              for(var x in data){
                searchResultsArray[x] = [];
                searchResultsArray[x]['link'] = traverseObj(data[x], settings.jsonPathLink);
                searchResultsArray[x]['text'] = traverseObj(data[x], settings.jsonPathText);
              }
              
              $.each(searchResultsArray, function(key, value){
                searchResultsHTMLArray.push('<li><a href="'+searchResultsArray[key]['link']+'">'+searchResultsArray[key]['text'].replace(new RegExp(searchStrArray.join('|'), 'ig'), '<strong>$&</strong>')+'</a></li>')
              });
              
            }
            else{
              searchResultsHTMLArray = [];
              searchResultsHTMLArray.push('<li>'+settings.noResultsText+'</li>');
            }
                        
            $searchResults.html(searchResultsHTMLArray.join('')).addClass('searchResult-show');
          }
        });
        
        // function to allow JSON traversal
        function traverseObj(obj, path) {
          var arr = path.split('.'),
              len = arr.length,
              i = 0,
              ret;
      
          for ( ; i<len; i+=1 ) {
            ret = !i
            ? obj[arr[i]]
            : ret[arr[i]];
          }
          
          ret = ret || '';
          
          return ret;
        }
      });
    },
    hide: function(options){
      return this.each(function(){
        var $searchField = $(this),
            $searchResults = $searchField.next('ul');
        
        $.data($searchField, 'resultsFocus', false);
        $searchResults.removeClass('searchResult-show');
      });
    }
  };
  
  $.fn.searchresult = function(method, options){
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.searchResult' );
    }
  };
  
  $.fn.searchresult.defaults = {
    initDelay: 0,
    initDelayType: 'character', // 'character/word'
    delay: 0,
    resultLimit: 0,
    AJAXpath: 'demo.json',
    jsonPathLink: '_source.shortUrl',
    jsonPathText: '_source.body',
    noResultsText: 'No search results found.',
    inputClass: 'searchResult',
    results: null,
    resultClass: 'searchResult-results'
  };
})(jQuery);