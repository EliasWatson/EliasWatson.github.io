---
title: "Advent of Code 2022 - Day 2"
date: 2022-12-03T17:00:00-05:00
draft: false
summary: Rock Paper Scissors
---

# Part 1

```racket
(require racket/string)


;; PARSING

(define (parse-choice c)
  (cond
   [(or (equal? c "A") (equal? c "X")) 0] ; Rock -> 0
   [(or (equal? c "B") (equal? c "Y")) 1] ; Paper -> 1
   [(or (equal? c "C") (equal? c "Z")) 2] ; Scissors -> 2
   [else -1]))

; Example: "B X" -> '(1 0)
(define (parse-strategy-line line)
  (map parse-choice (string-split line)))



;; IO

(define (read-all-lines)
  (let ([line (read-line)])
    (if (string? line)
        (cons line (read-all-lines))
        '())))

(define (read-strategies)
  (map parse-strategy-line (read-all-lines)))



;; SCORING

; The winning choice can be calculated by just adding 1 and modulo'ing by 3
; 0 (Rock) is beat by 1 (Paper)
; 1 (Paper) is beat by 2 (Scissors)
; 2 (Scissors) is beat by 0 (Rock)
(define (winning-choice n) (modulo (+ n 1) 3))

; Since rock gets 1 point, paper gets 2, and scissors gets 3, we can just
; add one to our numeric representation of the choices
(define (score-choice n) (+ n 1))

(define (score-outcome other you)
  (cond
   ((= you (winning-choice other)) 6) ; 6 points for winning
   ((= you other) 3) ; 3 points for drawing
   (else 0))) ; No points for losing

(define (score-round other you)
  (+ (score-choice you)
     (score-outcome other you)))

(define (score-rounds rounds)
  (map (lambda (r) (apply score-round r)) rounds))



;; MAIN

(define (sum nums) (apply + nums))

(sum (score-rounds (read-strategies)))
```

# Part 2

```racket
(require racket/string)


;; LOGIC

; The winning choice can be calculated by just adding 1 and modulo'ing by 3
; 0 (Rock) is beat by 1 (Paper)
; 1 (Paper) is beat by 2 (Scissors)
; 2 (Scissors) is beat by 0 (Rock)
(define (winning-choice n)
  (modulo (+ n 1) 3))

; Likewise, the losing choice can be calculated by adding 2 and modulo'ing by 3
; 0 (Rock) beats 2 (Scissors)
; 1 (Paper) beats 0 (Rock)
; 2 (Scissors) beats 1 (Paper)
(define (losing-choice n)
  (modulo (+ n 2) 3))



;; PARSING

(define (parse-choice c)
  (cond
   [(equal? c "A") 0] ; Rock -> 0
   [(equal? c "B") 1] ; Paper -> 1
   [(equal? c "C") 2] ; Scissors -> 2
   [else -1]))

(define (parse-outcome other outcome)
  (list other
        (cond
         [(equal? outcome "X") (losing-choice other)] ; Lose
         [(equal? outcome "Y") other] ; Draw
         [(equal? outcome "Z") (winning-choice other)] ; Win
         [else -1])))

(define (parse-strategy-line line)
  (let ([fields (string-split line)])
    (parse-outcome
     (parse-choice (list-ref fields 0))
     (list-ref fields 1))))



;; IO

(define (read-all-lines)
  (let ([line (read-line)])
    (if (string? line)
        (cons line (read-all-lines))
        '())))

(define (read-strategies)
  (map parse-strategy-line (read-all-lines)))

; Since rock gets 1 point, paper gets 2, and scissors gets 3, we can just
; add one to our numeric representation of the choices
(define (score-choice n) (+ n 1))

(define (score-outcome other you)
  (cond
   ((= you (winning-choice other)) 6) ; 6 points for winning
   ((= you other) 3) ; 3 points for drawing
   (else 0))) ; No points for losing

(define (score-round other you)
  (+ (score-choice you)
     (score-outcome other you)))

(define (score-rounds rounds)
  (map (lambda (r) (apply score-round r)) rounds))



;; MAIN

(define (sum nums) (apply + nums))

(sum (score-rounds (read-strategies)))
```
