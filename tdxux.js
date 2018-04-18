
window.tdxUxOpenWin = function(url,width,height,name,scrollbars) {
  window.location.href = url;
};

var uxFixes = {
  removePopups: function() {
    $('a[href*=openWin]').each(function() {
      $(this).attr('href', $(this).attr('href').replace('openWin(', 'tdxUxOpenWin('));
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
    $('#divTabHeader > ul').prepend($li);
  },

  moveDescription: function() {
    if(!$('#upDescription').length) {
      return;
    }
    $('#upDetails').before($('#upDescription'));
  }
};

$(document).ready(function() {
  if(window.location.href.search('TDAdmin') > -1) {
    return;
  }
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
