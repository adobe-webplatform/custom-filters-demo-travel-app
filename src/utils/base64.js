define(function() {

    function generateBase64Alphabet() {
        var a = {},
            charCodeUpperA = "A".charCodeAt(0),
            charCodeLowerA = "a".charCodeAt(0) - 26,
            charCode0 = "0".charCodeAt(0) - 52,
            i;
        for (i = 0; i < 26; ++i)
            a[i] = String.fromCharCode(charCodeUpperA + i);
        for (i = 26; i < 52; ++i)
            a[i] = String.fromCharCode(charCodeLowerA + i);
        for (i = 52; i < 62; ++i)
            a[i] = String.fromCharCode(charCode0 + i);
        a[62] = "+";
        a[63] = "/";
        return a;
    }

    var base64Alphabet;
    var base64 = {
        encode: function(val) {
            if (!base64Alphabet)
                base64Alphabet = generateBase64Alphabet();
            var result = "",
                alphabet = base64Alphabet;
            for (var i = 0; i < val.length; i += 3) {
                // 1111 11 | 11 2222 | 22 22 33 | 33 3333
                // 1111 11 | 22 2222 | 33 33 33 | 44 4444
                var remaining = val.length - i,
                    a = val.charCodeAt(i),
                    b = (remaining > 1) ? val.charCodeAt(i + 1) : 0,
                    c = (remaining > 2) ? val.charCodeAt(i + 2) : 0,
                    x1 = (a & 0xFC) >> 2,
                    x2 = ((a & 0x3) << 4) | ((b & 0xF0) >> 4),
                    x3 = ((b & 0xF) << 2) | ((c & 0xC0) >> 6),
                    x4 = c & 0x3F;

                switch (remaining) {
                    case 1:
                        result += alphabet[x1] + alphabet[x2] + "==";
                        break;
                    case 2:
                        result += alphabet[x1] + alphabet[x2] + alphabet[x3] + "=";
                        break;
                    default:
                        result += alphabet[x1] + alphabet[x2] + alphabet[x3] + alphabet[x4];
                }
            }
            return result;
        },

        url: function(data) {
            return "data:text/plain;base64," + base64.encode(data);
        }
    };

    return base64;

});