/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    //config.extraPlugins = 'syntaxhighlight';

    config.syntaxhighlight_lang = 'csharp';
    config.syntaxhighlight_hideControls = true;
    config.language = 'vi';
    config.enterMode = CKEDITOR.ENTER_BR;
    config.toolbar = 'Full';
    config.filebrowserBrowseUrl = '/Assets/Admin/dist/js/plugins/ckfinder/ckfinder.html';
    config.filebrowserImageBrowseUrl = '/Assets/Admin/dist/js/plugins/ckfinder/ckfinder.html?type=Images';
    config.filebrowserFlashBrowseUrl = '/Assets/Admin/dist/js/plugins/ckfinder/ckfinder.html?type=Flash';
    config.filebrowserUploadUrl = '/Assets/Admin/dist/js/plugins/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Files';
    config.filebrowserImageUploadUrl = '/Assets/Admin/dist/js/plugins/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images'
    config.filebrowserImageUploadUrl = '/Assets/Clients/Images/';

    config.filebrowserFlashUploadUrl = '/Assets/Admin/dist/js/plugins/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Flash';
    CKFinder.setupCKEditor(null, '/Assets/Admin/dist/js/plugins/ckfinder/');

    config.height = 400;
    config.autoGrow_maxHeight = 600;

};
