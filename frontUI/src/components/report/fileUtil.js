/* eslint-disable */
const FileUtil = (function(win){
    var FileUtil, UNDEFINED = 'undefined', DOT = '.', node_for_save = document.createElement('a'), node_for_read, COLON = ':',
        TXT = 'text/plain', JPEG = 'image/jpeg', XML = 'xml', STREAM = 'application/octet-stream', BINARY = 'binary', JSONTYPE = "application/json",
        //+++++++++++++++++++++++++++ Extended area ++++++++++++++++++++++++++++++++++++++++++++++
        _minetypeTable = {
            txt : TXT,
            json: JSONTYPE,
            jpg : JPEG,
            xml : XML,
            xls : STREAM,
            xlsx : STREAM,
        },
        _makeContentsFns = {
            txt : function(v){return v},
            json: function(v){return v},
            jpg : function(){},
            xls : function(VO){
                if(!XLSX) throw ["UtilException", COLON, " ", "need to 'XLSX' module"].join('');
                return FileUtil.string2buffer(XLSX.write(VO, {bookType:"biff2",type:BINARY,compression:FileUtil.usecompression}));
            },
            xlsx : function(VO){
                if(!XLSX) throw ["UtilException", COLON, " ", "need to 'XLSX' module"].join('');
                return FileUtil.string2buffer(XLSX.write(VO, {bookType:"xlsx",type:BINARY,compression:FileUtil.usecompression}));
            }
        },
        _readContentsFns = {
            txt : function(){},
            json: function(f){
                var reader = new FileReader();
                reader.onload = function(e) {
                    if(_userCallBackFns && _userCallBackFns.readfile && e.target && e.target.result){
                        _userCallBackFns.readfile(e.target.result, {type: JSONTYPE});
                        delete _userCallBackFns.readfile;
                    }
                }
                reader.readAsText(f);
            },
            jpg : function(){},
            xls : function(){},
            xlsx : function(f){
                var reader = new FileReader();
                reader.onload = function(e) {
                    if(_userCallBackFns && _userCallBackFns.readfile && e.target && e.target.result){
                        _userCallBackFns.readfile(XLSX.read(e.target.result, {type: BINARY}));
                        delete _userCallBackFns.readfile;
                    }
                }
                reader.readAsBinaryString(f);
            },
        },
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        _changeFile = function(evt){
            if(_userCallBackFns.selectfile && evt.target && evt.target.files){
                _userCallBackFns.selectfile(evt.target.files[0]);
                delete _userCallBackFns.selectfile;
            }
        },
        _userCallBackFns = {},

        FileUtil = {
            usecompression: true,
            string2buffer : function(str) {
                var u8a, buf, i;
                if(typeof ArrayBuffer !== UNDEFINED) {
                    buf = new ArrayBuffer(str.length), u8a = new Uint8Array(buf);
                    for (i=0; i!=str.length; ++i) u8a[i] = str.charCodeAt(i) & 0xFF;
                } else {
                    buf = new Array(str.length);
                    for (i=0; i!=str.length; ++i) buf[i] = str.charCodeAt(i) & 0xFF;
                }
                return buf;
            },
            createBlob : function(content, type){
                return new Blob([content], {type:type});
            },
            read : function(file, userCallbackFn){
                var type, tmp = file.name.split(DOT), type = tmp[tmp.length-1];
                if(!_readContentsFns[type]){
                    throw ["UtilException", COLON, " need to make function for reading '",o,"' type file"].join('');
                }
                _userCallBackFns.readfile = userCallbackFn, _readContentsFns[type](file);
            },
            selectfile : function(userCallbackFn){
                if(!node_for_read){
                    node_for_read = document.createElement('input'), node_for_read.type = 'file',
                        node_for_read.style.position = 'absolute', node_for_read.style.top = '-500px';
                    node_for_read.addEventListener('change', _changeFile, false);
                    document.body.appendChild(node_for_read);
                }
                _userCallBackFns.selectfile = userCallbackFn, node_for_read.click();
            },
            save : function(data, filetype, filename){
                FileUtil.fileDownload.call(win.navigator, FileUtil.createBlob(_makeContentsFns[filetype](data), _minetypeTable[filetype]), filename ? filename + DOT + filetype : UNDEFINED + DOT + filetype);
            },
            fileDownload : (function(){
                if(typeof navigator.msSaveOrOpenBlob == UNDEFINED){
                    return function(blob, filename){
                        var object_url = win.URL.createObjectURL(blob);
                        node_for_save.href = object_url, node_for_save.download = filename;
                        node_for_save.click(), win.URL.revokeObjectURL(object_url);
                    }
                }else{
                    return navigator.msSaveOrOpenBlob;
                }
            })()
        };
    return FileUtil;
})(window);

export default FileUtil;
