
var uxFixes = {
  removePopups: function() {
    $('a[href*=openWin]').each(function() {
      $(this).attr('href', $(this).attr('href').replace('openWin(', 'tdxUxOpenWin('));
    });
    $('[onClick*=openWin]').each(function() {
      var location = $(this).attr('onclick');
      location = location.replace('javascript:openWin(\'', '')
        .replace(/\',(.*)$/, "");
      $(this).removeAttr('onclick');
      var $clone = $(this).clone(false);
      $clone.data('location', location);
      $(this).replaceWith($clone);
      $clone.on('click', function(event) {
        window.location.href = $(this).data('location');
        return false;
      });
    });
  },

  fixUpdateTicket: function() {
    if(!$('#btnUpdateTicket').length ||
      $('#divTabHeader #btnUpdateTicket').length) {
      return;
    }
    $('#divTabHeader > ul').prepend($('#btnUpdateTicket'));
  },

  moveDescription: function() {
    if(!$('#upDescription').length ||
        $('#upDescription.done').length) {
      return;
    }
    $('#upDescription').addClass('done');
    $('#upDetails').before($('#upDescription'));
    $(window).trigger('resize');
  },

  addBack: function() {
    if(window.self === window.top) {
      return;
    }
    if(!$('#divHeader').length ||
       $('#backToWork, #ddlGroupBy').length) {
        return;
    }
    var selector = '#divHeader';
    if($('#divTabHeader').length) {
      selector = '#divTabHeader';
    }
    $(selector).prepend('<a id="backToWork" href="/TDNext/Apps/MyWork/Default.aspx" class="btn btn-danger">Return to My Work</a>');
  },

  addTicketLink: function() {
    if(!$('#thTicket_spnTitle').length ||
       $('#tdxUxTicketLink').length) {
       return;
     }
     $('#thTicket_spnTitle + div').removeClass('gutter-left-sm')
      .addClass('tdxUxServiceTicket');
     $('#thTicket_spnTitle + div').after('<div class="row"><div class="col-md-6"><label for="tdxUxTicketLink">Ticket URL</label><input id="tdxUxTicketLink" class="form-control" type="text" value="' + window.location.href +'"></div></div>');
     $('body').css('padding-top', $('#divHeader').height() + 'px');

  }

};

$(document).ready(function() {
  if(window.location.href.search('TDAdmin') > -1) {
    return;
  }
  $('body').addClass('tdxux');
  $('head').append('<script>console.log("loaded");function tdxUxOpenWin(url,width,height,name,scrollbars) {window.location.href = url;};</script>');


  var refresh = function() {
    $.each(uxFixes, function() {
      this();
    });
    setTimeout(refresh, 500);
  };

  refresh();

});
