(function() {
  setInterval(() => {
    commandFetch(SwimTeam.move)
  }, 100)
  const serverURL = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  //
  const commandFetch = (callback) => {
    $.ajax({
      type: 'GET',
      url: serverURL,
      cache: false,
      success: function(data, status, jqxhr) {
        debugger;
        callback(data)
      }
    });
  }
  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: serverURL,
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });

})();
