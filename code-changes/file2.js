function fibonacci(n) {
    let series = [0, 1];
    
    if (n <= 2) return series.slice(0, n);
    
    for (let i = 2; i < n; i++) {
        series[i] = series[i - 1] + series[i - 2];
    }
    
    return series;
}

const length = 10;
const fibSeries = fibonacci(length);
console.log(`Fibonacci series of length ${length}:`, fibSeries);