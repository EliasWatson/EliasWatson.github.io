---
title: "Advent of Code 2022 - Day 1"
date: 2022-12-03T17:44:23-5:00
draft: false
---

This year I decided to solve [Advent of Code](https://adventofcode.com/2022) in [Racket](https://racket-lang.org).
I've seen lots of people gush over how much they love Lisp, so I want to see what it's all about.
The functional paradigm isn't completely foreign to me as I've written a few web apps in Elm and I've messed around with Haskell, but I've never used a Lisp for anything complex.

# Part 1

```racket
; Sum integers from stdin until a blank line (or EOF) is encountered
(define (sum-input-integers-until-break line)
  (cond
   [(non-empty-string? line)
    (+ (string->number line)
       (sum-input-integers-until-break (read-line)))]
   [else 0]))

; Get a list of calories from stdin, stopping when EOF is encountered
(define (get-calorie-list)
  (let ([line (read-line)])
    (cond
     [(eof-object? line) '()]
     [else (cons (sum-input-integers-until-break line)
                 (get-calorie-list))])))

; Get the maximum calories
(apply max (get-calorie-list))
```

# Part 2

Part 2 is almost identical.
The only difference is that we sum the top three calorie counts instead of just taking the maximum.

```racket
; Sum integers from stdin until a blank line (or EOF) is encountered
(define (sum-input-integers-until-break line)
  (cond
   [(non-empty-string? line)
    (+ (string->number line)
       (sum-input-integers-until-break (read-line)))]
   [else 0]))

; Get a list of calories from stdin, stopping when EOF is encountered
(define (get-calorie-list)
  (let ([line (read-line)])
    (cond
     [(eof-object? line) '()]
     [else (cons (sum-input-integers-until-break line)
                 (get-calorie-list))])))

; Sum a list of numbers
(define (sum nums) (apply + nums))

; Get the top N largest numbers
(define (largest-nums nums n) (take (sort nums) n))

; Sum the top three largest calorie counts
(sum (largest-nums (get-calorie-list) 3))
```
