(function($){
    $.nestedSelect = function(options){
        var settings = $.extend({
            'first'  : 'first',
            'second' : 'second',
            'data'   : {}
        }, options);

        var first  = $('#' + settings['first']);
        var second = $('#' + settings['second']);

        // var selectedFirst  = first.val()  || settings['firstValue'];
        var selectedSecond = second.val() || settings['secondValue'];

        var firstArray = [];
        $.each(settings['data'], function(key, value){
            firstArray.push(key);
        });
        var selectedFirst = first.val() || firstArray[0];

        var firstOptionsHTML = "";
        $.each(firstArray, function(){
            firstOptionsHTML += "<option value='" + this + "'>" + this + "</option>";
        });

        first.html(firstOptionsHTML);
        first.val(selectedFirst);

        var secondOptionsHTML = "";
        var secondArray = settings['data'][first.val()];
        $.each(secondArray, function(){
            secondOptionsHTML += "<option value='" + this + "'>" + this + "</option>";
        });
        second.val(secondArray[0]);

        first.on('change', function(){
            second.val('');
            var secondOptionsHTML = "";
            var secondArray = settings['data'][first.val()];
            $.each(secondArray, function(){
                secondOptionsHTML += "<option value='" + this + "'>" + this + "</option>";
            });
            second.html(secondOptionsHTML);
        });

    }
})( jQuery );