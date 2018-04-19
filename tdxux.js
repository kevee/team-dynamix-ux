
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
     $('#thTicket_spnTitle + div').after('<div class="row"><div class="col-md-6 tdxHeaderLeft"></div><div class="col-md-6"><label for="tdxUxTicketLink">Ticket URL</label><input id="tdxUxTicketLink" class="form-control" type="text" value="' + window.location.href +'"></div></div>');

     $('.tdxHeaderLeft').append($('#thTicket_spnTitle + div')).prepend($('#thTicket_spnTitle'))
     $('body').css('padding-top', $('#divHeader').height() + 'px');

  },

  cleanupPerson: function() {
    if(!$('#pcRequestor_divPersonInfo').length) {
      return;
    }
    $('#pcRequestor_divPersonInfo div').each(function() {
      if($(this).text().trim() == 'CSUMB' || $(this).text().trim() == 'Find Referenced') {
        $(this).remove();
      }
    });
    $('#divAge, #divHours').remove();
    $('#pcRequestor_divPersonInfo .media-left').remove();
    $('#pcRequestor_divPersonInfo .gutter-top-xs').addClass('gutter-bottom-sm');
    $('#pcRequestor_divPersonInfo .media-body').append($('#divCustomAttributes'));
    $('#pcRequestor_divPersonInfo .media-body').append($('#divAcctDept'));
    $('#divDetails .gutter-top').prepend('<div class="row"></div>');
  },

  loadPersonData: function() {
    if(!$('#pcRequestor_divPersonInfo').length) {
      return;
    }
    var email = $('#pcRequestor_divPersonInfo a[href*=mailto]').first().text().trim();
    $.getJSON('https://csumb.edu/csumb/api/directory?email=' + email, function(directory) {
      if(!directory.user) {
        return;
      }
      var $wrapper = $('<div class="tdxux-directory"><h3>Directory information</h3></div>');
      if(directory.user.building) {
        $wrapper.append('<div><strong>Building: </strong><a href="' + directory.user.building.link + '" target="_blank">' + directory.user.building.title + '</a> - ' + directory.user.building.code + '</div>');
      }
      if(directory.user.floor) {
        $wrapper.append('<div><strong>Floor:</strong> ' + directory.user.floor + '</div>');
      }
      if(directory.user.suite) {
        $wrapper.append('<div><strong>Suite:</strong> ' + directory.user.suite + '</div>');
      }
      if(directory.user.room) {
        $wrapper.append('<div><strong>Room:</strong> ' + directory.user.room + '</div>');
      }
      if(directory.user.phone) {
        $wrapper.append('<div><strong>Phone:</strong> ' + directory.user.phone + '</div>');
      }
      $('#pcRequestor_divPersonInfo .media-body').append($wrapper);
    });
  },

// service tag, model, serial number
  addAssets: function() {
    if(!$('#tabAssetsCIs').length) {
      return;
    }
    var url = $('#tabAssetsCIs a').attr('href');
    $.get(url, function(tables) {
      $(tables).find('a[href*=CIDetail]').each(function() {
        var location = $(this).attr('href').replace('javascript:openWin(\'', '')
                              .replace(/\',(.*)$/, "");
        $.get(location, function(asset) {
          var $asset = $(asset);
          var $pane = $('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><a href=""></a></h3></div><div class="panel-body"></div></div>');
          $pane.find('.panel-body').append($asset.find('#divSerialNumber'));
          $pane.find('.panel-body').append($asset.find('#divProductModel'));
          $pane.find('.panel-body').append($asset.find('#divLocation'));
          $pane.find('.panel-title a').attr('href', location);
          $pane.find('.panel-title a').text('Asset ' + $asset.find('h1').text());

          $('#pcRequestor_divPersonInfo').parents('.panel').after($pane);
        });
      });

    });
  },

  fixUpdatePage: function() {
    if(!$('form[action*="Tickets/Update"]').length) {
      return;
    }
    $('.alert.alert-warning').remove();
    var id = $('h1 + div').text().trim().replace('Service Request ID: ', '');
    var ticketPage = window.location.href.replace('Tickets/Update', 'Tickets/TicketDet.aspx');
    $.get(ticketPage, function(ticket) {
      var $ticket = $(ticket);
      $('#divComments').before('<div class="alert alert-info">' + $ticket.find('#ttDescription').html() +'</div>');
    });
    $('#btnSubmit').after('<a href="'+ ticketPage +'" class="btn btn-default">Cancel</a>');
  },

  fixTicketReassign: function() {
    var ticket_id = $('h1 + div').text().replace('Service Request ID: ', '').replace(/\D/g,'').trim();
    $('#divReassignTicket').replaceWith('<li><a href="https://csumb.teamdynamix.com/TDNext/Apps/364/Tickets/TicketReassign?TicketID=' + ticket_id +'">Reassign</a></li>');
  }

};

$(document).ready(function() {
  if(window.location.href.search('TDAdmin') > -1) {
    return;
  }
  $('body').addClass('tdxux');
  $('head').append('<script>function tdxUxOpenWin(url,width,height,name,scrollbars) {window.location.href = url;};</script>');

  $('a:contains("My Work")').on('click', function() {
    window.location.href = window.location.href;
  });

  var refresh = function() {
    uxFixes.removePopups();
    setTimeout(refresh, 500);
  };
  $.each(uxFixes, function() {
    this();
  });
  refresh();

});
