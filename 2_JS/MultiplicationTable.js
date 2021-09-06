var out = 0;
var row = '';

for (var x = 1; x < 11; x++) {
    for (var y = 1; y < 11; y++) {
        out = y * x;
        row += out + "   ";
    }
    console.log(row);
    row = '';
}