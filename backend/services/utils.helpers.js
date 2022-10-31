const _ = require('lodash');
const blobUtil = require('blob-util');

var self = module.exports = {
    strpos : (haystack, needle, offset) => {
        var i = (haystack + '')
        .indexOf(needle, (offset || 0))
        return i === -1 ? false : i
    },
    mergeObjects : (cible, ...rest) => {
         return Object.assign(cible, ...rest);
    },
    intersectKeys : (first, ...rest) => {
        // extract the keys of the other objects first so that won't be done again for each check
        const restKeys = rest.map(o => Object.keys(o));
        // In my version I am returning the first objects values under the intersect keys
        return Object.fromEntries(
            // extract [key, value] sets for each key and filter them, Object.fromEntries() reverses this back into an object of the remaining fields after the filter
            Object.entries(first).filter(
                // make sure each of the other object key sets includes the current key, or filter it out
                entry => restKeys.every(
                    rk => rk.includes(entry[0])
                )
            )
        );
        // to get JUST the keys as OP requested the second line would simplify down to this
        return Object.keys(first).filter(key => restKeys.every(rk => rk.includes(key)));
    },
    intersectArray : (o1, o2) => {
        return Object.keys(o1).concat(Object.keys(o2)).sort().reduce(function (r, a, i, aa) {
            if (i && aa[i - 1] === a) {
                r.push(a);
            }
            return r;
        }, []);
    },
    replaceArray : (string, find, replace) => {
		var regex; 
		var replacement;
		//console.log(find);
		for (var i = 0; i < find.length; i++) {
			regex = new RegExp(find[i], "g");
			if(!_.isArray(replace)  ) {
				replacement = replace;
			}else if(replace[i] == undefined && replace[0]!==undefined) {
				replacement = replace[0];
			} else {
				replacement = "";
			}
			string   = _.replace(string, regex, replacement);
		}
		return string;
	},
   groupArrayBy : (arr, key) => {
        var grouped = _.mapValues(_.groupBy(arr, key),
                                  oList => oList.map(o => _.omit(o, key)));
        return grouped;
   },
   toArrayBuffer : (myBuf) => {
        var myBuffer = new ArrayBuffer(myBuf.length);
        var res = new Uint8Array(myBuffer);
        for(var i = 0; i < myBuf.length; ++i) {
            res[i] = myBuf[i];
        }
        return myBuffer;
   },
   toBuffer : (ab) => {
        var buffer = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        return buffer;
    },
    arrayBufferToBlob : (arrayBuff, mimeString) => {
        return blobUtil.arrayBufferToBlob(arrayBuff,mimeString);
    },
    bufferToBlob : (buff, mimeString) => {
        arrayBuff  = self.toArrayBuffer(buff);
        return blobUtil.arrayBufferToBlob(arrayBuff,mimeString);
    },
	checkDbConnection : async (db) => {
		return db.raw('select 1+1 as result')
			.catch((err) => {
				console.log('[Fatal] Impossible de se connecter à la base de données! Exiting...');
				console.log(err);
				process.exit(1);
			});
	}
};