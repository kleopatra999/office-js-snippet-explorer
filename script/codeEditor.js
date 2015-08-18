var CodeEditorIntegration;
(function (CodeEditorIntegration) {
    var localStorageKey = 'excel-api-samples';
    var jsCodeEditor;

    function initializeJsEditor(textAreaId, intellisensePaths) {
        var defaultJsText = '';
        if (window.localStorage && (localStorageKey in window.localStorage)) {
            defaultJsText = window.localStorage[localStorageKey];
        }

        var editorMode = 'text/typescript';
        jsCodeEditor = Monaco.Editor.create(document.getElementById(textAreaId), {
            value: defaultJsText,
            mode: editorMode,
            wrappingColumn: 0,
            tabSize: 4,
            insertSpaces: false
        });
        document.getElementById(textAreaId).addEventListener('keyup', function () {
            storeCurrentJSBuffer();
        });

        if (window.parent.document.location.protocol == "file:") {
            intellisensePaths = [];
        } else {
            intellisensePaths = intellisensePaths.map(function (path) {
                if (path.indexOf("?") < 0) {
                    path += '?';
                } else {
                    path += '&';
                }
                return path += 'refresh=' + Math.floor(Math.random() * 1000000000);
            });
        }

        require([
            'vs/platform/platform',
            'vs/editor/modes/modesExtensions'
        ], function (Platform, ModesExt) {
            Platform.Registry.as(ModesExt.Extensions.EditorModes).configureMode(editorMode, {
                "validate": {
                    "extraLibs": intellisensePaths
                }
            });
        });

        $(window).resize(function () {
            resizeEditor();
        });
    }
    CodeEditorIntegration.initializeJsEditor = initializeJsEditor;

    function getJavaScriptToRun() {
        return jsCodeEditor.getValue();
    }
    CodeEditorIntegration.getJavaScriptToRun = getJavaScriptToRun;

    function setJavaScriptText(text) {
        require(["vs/editor/contrib/snippet/snippet"], function (snippet) {
            //jsCodeEditor.setSelection(jsCodeEditor.getModel().getFullModelRange(), false);
            //snippet.InsertSnippetHelper.run(jsCodeEditor, jsCodeEditor.getHandlerService(), new snippet.CodeSnippet(text));
            //jsCodeEditor.setSelection({ startColumn: 0, endColumn: 0, startLineNumber: 0, endLineNumber: 0 }, true);
            //jsCodeEditor.focus();
            
            jsCodeEditor.setSelection(jsCodeEditor.getModel().getFullModelRange());
            snippet.get(jsCodeEditor).run(new snippet.CodeSnippet(text), 0, 0);
            jsCodeEditor.setPosition({ lineNumber: 0, column: 0 });
            jsCodeEditor.focus();
        });
    }
    CodeEditorIntegration.setJavaScriptText = setJavaScriptText;

    function resizeEditor(scrollUp) {
        if (typeof scrollUp === "undefined") { scrollUp = false; }
        jsCodeEditor.layout();
        if (scrollUp) {
            jsCodeEditor.setScrollTop(0);
            jsCodeEditor.setScrollLeft(0);
        }
        jsCodeEditor.focus();
    }
    CodeEditorIntegration.resizeEditor = resizeEditor;

    function storeCurrentJSBuffer() {
        console.log("storeCurrentJSBuffer");
        if (CodeEditorIntegration.setDirty) {
            CodeEditorIntegration.setDirty();
        }
        if (window.localStorage) {
            window.localStorage[localStorageKey] = jsCodeEditor.getValue();
        }
    }
})(CodeEditorIntegration || (CodeEditorIntegration = {}));