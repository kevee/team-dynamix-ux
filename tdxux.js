

var uxFixes = {
  removePopups: function() {
    var cleanedUrl = '';
    $('a').each(function() {
      if($(this).attr('href').search('javascript:openWin') > -1) {
        cleanedUrl = $(this).attr('href')
          .replace('javascript:openWin(\'', '')
          .replace(/\',(.*)$/, "")
          .replace(/\\x2f/g, '/')
          .replace(/\\x3a/g, ':')
          .replace(/\\x3f/g, '?')
          .replace(/\\x3d/g, '=');
        $(this).attr('target', '_blank');
        $(this).attr('href', cleanedUrl);
      }
    });
  }
};

$(document).ready(function() {

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        $.each(uxFixes, function() {
          this();
        });
      }
    });
  });

  var config = {
      subtree: true,
      childList: true
  };

  observer.observe(document.body, config);

  $.each(uxFixes, function() {
    this();
  });
});
