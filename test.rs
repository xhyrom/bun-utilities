fn main() {
    println!("{}", fibo(50));
}

fn fibo(n: isize) -> isize {
    if n <= 1 {
        return n;
    }
    return fibo(n - 1) + fibo(n - 2);
}