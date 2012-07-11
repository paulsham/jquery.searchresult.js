;(function($){
  "use strict";
  
  var searchFocus = false;
  var settings = [];

  var methods = {
    init: function(options){
      settings = $.extend($.fn.searchResult.defaults, options);
      
      return this.each(function(){
        var $searchField = $(this);
        var $searchResults;
        initResults();
        
        function initResults(){
          $searchField
          .addClass('searchResult')
          .after('<ul class="searchResult-results"></ul>')
          .on({
            keyup: function(e){
              if(e.keyCode == 40 || e.keyCode == 38){
                navigateSearchResults(e);
                $(window)
                .on('keyup', navigateSearchResults)
                .on('click', hideSearchResults);
              }
              else{
                searchTyping(e.keyCode);
              }
              e.stopPropagation();
            },
            focus: function(){
              $(window)
              .on('click', hideSearchResults);
            },
            blur: function(){
              if(searchFocus === false){
                $(this).searchResult('hide');
                $searchResults.children('li').children('a:focus').blur();
              }
            }
          });
          
          $searchResults = $searchField.next('ul');
        }
        
        function searchTyping(e){
          var value = $searchField.val();
          $searchField.searchResult('get', {
            val: value
          });
        }
        
        function navigateSearchResults(e){
          var key = e.keyCode;
          var $searchResultsFocus = $searchResults.children('li').children('a:focus');
          
          switch(key){
            case 40:
              searchFocus = true;

              if($searchResultsFocus.length > 0){
                if($searchResultsFocus.parent('li').index() == $searchResults.children('li').length - 1){
                  $searchResults.children('li').first().children('a').focus();
                }
                else{
                  $searchResultsFocus.parent('li').next('li').children('a').focus();
                }
              }
              else{
                $searchResults.children('li').first().children('a').focus();
              }
              
              break;
            case 38:
              searchFocus = true;
              
              if($searchResultsFocus.length > 0){
                if($searchResultsFocus.parent('li').index() == 0){
                  $searchResults.children('li').last().children('a').focus();
                }
                else{
                  $searchResultsFocus.parent('li').prev('li').children('a').focus();
                }
              }
              else{
                $searchResults.children('li').last().children('a').focus();
              }
              
              break;
          }
          e.stopPropagation();

        }
        
        function hideSearchResults(e){
          $(window)
          .off('keyup', navigateSearchResults)
          .off('click', hideSearchResults);
          $searchField.searchResult('hide');
        }
      });
    },
    get: function(options){
      return this.each(function(){
      
        var $searchField = $(this);
        var $searchResults = $searchField.next('ul');
        var strArray = options.val.split(' ');
        
        $.ajax({
          url: settings.AJAXpath,
          context: $searchResults,
          dataType: 'json',
          success: function(data){
            var searchResultsArray = [];
            var searchResultsHTMLArray = [];
            
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
                searchResultsHTMLArray.push('<li><a href="'+searchResultsArray[key]['link']+'">'+searchResultsArray[key]['text'].replace(new RegExp(strArray.join('|'), 'ig'), '<strong>$&</strong>')+'</a></li>')
              });
              
            }
            else{
              searchResultsHTMLArray = [];
              searchResultsHTMLArray.push('<li>'+settings.noResultsText+'</li>');
            }
                        
            $searchResults.html(searchResultsHTMLArray.join('')).addClass('searchResult-show');
          }
        });
        
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
        var $searchField = $(this);
        var $searchResults = $searchField.next('ul');
        
        $searchResults.removeClass('searchResult-show');
      });
    }
  };
  
  $.fn.searchResult = function(method, options){
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.searchResult' );
    }
  };
  
  $.fn.searchResult.defaults = {
    initDelay: 0,
    initDelayType: 'character', // 'character/word'
    delay: 0,
    resultLimit: 0,
    AJAXpath: 'demo.json',
    jsonPathLink: '_source.shortUrl',
    jsonPathText: '_source.body',
    noResultsText: 'No search results found.'
  };
})(jQuery);