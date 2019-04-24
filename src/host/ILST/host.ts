console.log('Host script is online')

// thanks @parziphal
// https://forums.adobe.com/message/8665657#8665657
function mkdir(path) {
  var folder = new Folder(path);
  if (!folder.exists) {
    var parts = path.split('/');
    parts.pop();
    mkdir(parts.join('/'));
    folder.create();
  }
}