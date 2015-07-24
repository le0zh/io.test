(function() {
    var method = 'GET';

    function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    function doRequest() {
        var api = $('#api-addr').val();
        var params = $('#in-params').val();

        if (method == 'GET') {
            $('#loading-div').show();
            $.get(api, JSON.parse(params)).then(function(res) {
                $('#loading-div').hide();
                $('#out-result').val(JSON.stringify(res, null, 2));
                //syntaxHighlight
                $('#result').html(syntaxHighlight(res));
            });
        }
    }

    //dom ready:
    $(document).ready(function() {
        $('#method').text(method);
        $('#loading-div').hide();

        $('.dropdown-menu li').bind('click', function() {
            method = $(this).text();
            $('#method').text(method);
        });

        $('#btn-check').bind('click', function () {
            var params = $('#in-params').val();
            try {
                var model = JSON.parse(params);
                $('#param-preview').html(syntaxHighlight(model));
            } catch (e) {
                $('#param-preview').html('无效的JSON格式');
            } finally {

            }
        });

        $('#btn-go').bind('click', function() {
            doRequest();
        });
    });
})();
