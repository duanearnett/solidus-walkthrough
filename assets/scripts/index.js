/* All your JS starts here!
   Use requirejs (http://requirejs.org/) to include more JS files.
   You don't need to include requirejs yourself!
   The Grunt scripts will automatically merge all these files into /compiled/scripts.js */

jQuery(document).ready(function($){

    // Get the Graph object ID for each photo and retrieve their normal sized image
    // not the tiny facebook thumbnail
    $('img.loading[data-graph-id]').each(function(){
        var _img = $(this)
        $.ajax({
            url: 'https://graph.facebook.com/' + _img.data('graph-id'),
            success: function(data){
                _img.attr('src', data.source).load(function(){
                    $(this).removeClass('loading');
                })
            }
        })
    })

    $('a[data-toggle="modal-photo"]').bind('click', function(e){
        e.preventDefault();

        current = $(this);
        modal = $('#modal-photo');
        src = current.attr('href');

        $('img', modal).attr('src', src);
        modal.modal('show');
        location.hash = current.data('graph-id')
    })

});

jQuery(window).load(function(){
    if(solidus.context.page.name == 'album' && location.hash.length > 0)
    {
        var graph_id = location.hash.replace('#', '');

        if($('.thumbnail a[data-graph-id="'+graph_id+'"]').length > 0)
        {
            $('.thumbnail a[data-graph-id="'+graph_id+'"]').trigger('click');
        }
    }

});