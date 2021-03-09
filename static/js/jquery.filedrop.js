// Custom file drop extension
$.fn.extend({
    filedrop: function (options) {
       $.event.fix = (function(originalFix) {
          return function(event) {
            event = originalFix.apply(this, arguments);
            if (event.type.indexOf('copy') === 0 || event.type.indexOf('paste') === 0) {
              event.clipboardData = event.originalEvent.clipboardData;
            }
            return event;
          };
        })($.event.fix);
        var defaults = {
            callback: null,
            matchType: /image.*/,
            dragOver: null,
            dragLeave: null,
            file: {}
        }
        options = $.extend(defaults, options)
        return this.each(function () {
            var files = []
            var $this = $(this)

            // Stop default browser actions
            $this.bind('dragover dragleave', function (event) {
                event.stopPropagation()
                event.preventDefault()
                if(event.type == 'dragover'){
                  var items = event.originalEvent.dataTransfer.items;
                  var allowedTypes = ["image/jpg", "image/png", "image/gif", "image/jpeg"];
                  if(items.length > 1 || items["0"].kind != "file" || items["0"].type == "" || allowedTypes.indexOf(items["0"].type) == -1){
                    options.dragOver(false);
                  } else {
                    options.dragOver(true);
                  }
                } else if(event.type == 'dragleave') {
                  options.dragLeave();
                }
            });

            // Catch drop event
            $this.bind('drop', function (event) {
                // Stop default browser actions
                event.stopPropagation()
                event.preventDefault()

                if(event.originalEvent.dataTransfer.types[0] !== 'Files'){
                  var fileUrl = event.originalEvent.dataTransfer.getData('text');
                  var fileName = fileUrl.split('/').pop();
                  var fileType = fileName.split('.').pop();
                  options.file = {url: fileUrl, name: fileName, extension: fileType};
                  options.callback('https://cors-anywhere.herokuapp.com/'+options.file.url, event.target, 'dragurl')
                }

                // Get all files that are dropped
                files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files

                // Convert uploaded file to data URL and pass trought callback
                if (options.callback) {
                    for (i = 0; i < files.length; i++) {
                        var reader = new FileReader()
                        reader.onload = function (event) {
                          options.callback(event.target.result, event.target, 'file')
                        }
                        reader.readAsDataURL(files[0])
                    }
                }
                return false
            });

            $this.bind('paste', function(event) {
                var clipboardData, found;
                found = false;
                clipboardData = event.clipboardData;
                return Array.prototype.forEach.call(clipboardData.types, function(type, i) {
                  var file, reader;
                  if (found) {
                    return;
                  }
                  if (type.match(options.matchType) || clipboardData.items[i].type.match(options.matchType)) {
                    file = clipboardData.items[i].getAsFile();
                    reader = new FileReader();
                    reader.onload = function(evt) {
                      return options.callback(evt.target.result, event.target, 'paste');
                    };
                    reader.readAsDataURL(file);
                    return found = true;
                  }
                });
            });

        })
    }
})
