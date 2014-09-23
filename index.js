var base = module.exports = require('fis-postprocessor-amd');
var labelParser = require('fis-velocity-label-parser');
var label;

base.parseHtml = (function(older) {

    return function(content, file, conf) {
        var ret = labelParser(content, conf);
        var content_new = fis.util.clone(content);
        fis.util.map(ret, function(k, v){
            if(v.start_label == '#script'){
                var js_before = content.substring(v.content_start_index, v.content_end_index);
                var m = /^\(.*?\)\n/.exec(js_before);

                if (m) {
                    js_before = js_before.substring(m[0].length);
                }

                var js_after = base.parseJs(js_before, file, conf);
                content_new = content_new.replace(js_before, js_after);
            }
        });

        return older(content_new, file, conf);
    };
})(base.parseHtml);
