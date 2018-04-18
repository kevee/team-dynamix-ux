

var uxFixes = {
  removePopups: function() {
    var cleanedUrl = '';
    $('a[href]').each(function() {
      if(!$(this).attr('href')) {
        return;
      }
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
  },
  fixUpdateTicket: function() {
    if(!$('#btnUpdateTicket').length) {
      return;
    }
    var onClick = $('#btnUpdateTicket').attr('onClick')
      .replace('javascript:openWin(\'', '')
      .replace(/\',(.*)$/, "");
    var $link = $('<a id="btnUpdateTicket" class="btn btn-primary btn-sm">');
    $link.html($('#btnUpdateTicket').html());
    $link.attr('href', onClick);
    var $li = $('<li>');
    $li.append($link);
    $('#btnUpdateTicket').remove();
    $('#divTabHeader ul').prepend($li);
  },

  moveDescription: function() {
    if(!$('#upDescription').length) {
      return;
    }
    $('#upDetails').before($('#upDescription'));
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
