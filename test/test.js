var mibtojson = (function(){
        var json = {};
        function removeComments(mib){
                var reComment = /[-]{2}.*$/gm;
                mib = mib.replace(reComment,'');
                return mib;
        }
        function toJson(mib){
                //TODO Parse stuff
                var regexp = /[\}\;]$/mg, i,name;
                
                if(typeof mib === 'undefined'){
                        return {};
                }

                mib = removeComments(mib);
                mib = mib.split(regexp);
                for (i=1;i<mib.length;i++){
                        mib[i] = mib[i].split(" ")[0].replace(/[\r\s]/gm,'');
                        //mib[i]                
                }
                console.log(mib);
                return mib;
        }
        /*
        oid object definition
        {
                name:"",
                type:"",
                oid:"",
                attrArray:[],
                children:[]
        }
        */
        return {

                parse: function(mib){
                        json = toJson(mib);
                        return json; }
        };
}());

var fs = require('fs');
var file = fs.readFileSync("mib2.txt", "utf8");
console.log(mibtojson.parse(file));
