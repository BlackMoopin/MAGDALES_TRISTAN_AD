var number = 1;
var a = [1, 2, 3, 4, 5, 6];
var b = { one: 1, "two": "two", three: [3] };
var c;
var d = null;

console.log(typeof d);
console.log(`The variable ${b['one']} is of type ${typeof b.one}`);
console.log(b);
b.four = "HI ALL!";
console.log(b);
b["five"] = ["HAHAHAHAHAHA", "MEOW"];
console.log(b);
console.log(b.six);