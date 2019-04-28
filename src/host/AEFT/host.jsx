console.log('Host is online');
var activeItem = getActiveComp();
function getComp() {
    return app.project.file;
}
function importFile(path) {
    app.project.importFile(new ImportOptions(new File(path)));
}
function importComp(path) {
    var file = new ImportOptions(new File(path));
    if (file.canImportAs(ImportAsType.PROJECT)) {
        file.importAs = ImportAsType.PROJECT;
        app.project.importFile(file);
    }
    else {
        console.log('Cannot import as project');
    }
}
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
// Thanks @UQg
// https://forums.adobe.com/message/9829278#9829278
function activateCompViewer() {
    // setActive is supposed (guide) to return a Boolean, but in practice it returns nothing, therefore this doesnt work:  
    // return app.activeViewer && app.activeViewer.type===ViewerType.VIEWER_COMPOSITION && app.activeViewer.setActive();  
    var A = (app.activeViewer && app.activeViewer.type === ViewerType.VIEWER_COMPOSITION);
    if (A)
        app.activeViewer.setActive();
    return A;
}
;
function getActiveComp() {
    var comp; // the returned quantity  
    var X = app.project.activeItem; // the initial activeItem  
    var selComp = app.project.selection.length === 1 && app.project.selection[0].typeName === "Composition" ? app.project.selection[0] : null; // the unique selected comp, or null  
    var temp;
    if (X instanceof CompItem) {
        if (selComp === null) {
            comp = X;
        }
        else if (selComp !== X) {
            comp = null; // ambiguity : the timeline panel is active, X is the front comp, but another comp is selected  
        }
        else {
            // X and selComp coincide  
            X.selected = false;
            temp = app.project.activeItem;
            X.selected = true;
            if (temp === null) {
                // the project panel is active and the active item was initially a selected comp  
                // if that comp is already opened in a viewer and is the front comp, return the comp, else : ambiguity  
                comp = (activateCompViewer() && app.project.activeItem === X) ? X : null;
            }
            else {
                // deselecting the comp didnt change the activeItem : the timeline panel is active, and the active item was the front comp, that happened to be also selected.  
                comp = X;
            }
            ;
        }
        ;
    }
    else {
        comp = activateCompViewer() ? app.project.activeItem : null;
    }
    ;
    return comp;
}
;
