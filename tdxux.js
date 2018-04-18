
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
          var $pane = $('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><a></a></h3></div><div class="panel-body"></div></div>');
          $pane.find('.panel-body').append($asset.find('#divSerialNumber'));
          $pane.find('.panel-body').append($asset.find('#divProductModel'));
          $pane.find('.pane-title a').attr('href', asset);
          $pane.find('.panel-title a').text('Asset ' + $asset.find('h1').text());

          $('#pcRequestor_divPersonInfo').parents('.panel').after($pane);
        });
      });

    });
  }

};

$(document).ready(function() {
  if(window.location.href.search('TDAdmin') > -1) {
    return;
  }
  $('body').addClass('tdxux');
  $('head').append('<script>console.log("loaded");function tdxUxOpenWin(url,width,height,name,scrollbars) {window.location.href = url;};</script>');

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
