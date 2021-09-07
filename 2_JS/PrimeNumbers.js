var number = 6;
var isPrime = 0;

for (var i = 2; i < number / 2; i++) {
    if (number % i == 0) {
        isPrime = 1;
        break;
    }
}

if (number < 1) {
    console.log("Please enter a number greater than 0.");
} else if (number == 1) {
    console.log("1 is not a prime number.");
} else {
    if (isPrime == 1) {
        console.log(number + " is a not a prime number.");
    } else {
        console.log(number + " is a prime  number.");
    }
}