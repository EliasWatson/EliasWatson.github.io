---
title: "Advent of Code 2022 - Day 3"
date: 2022-12-04T16:00:00-05:00
draft: false
summary: Get Organized
---

# Part 1

```racket
(require racket/set)


;; IO
(define (get-input-lines)
  (let ([line (read-line)])
    (if (string? line)
        (cons line (get-input-lines))
        '())))


;; DUPLICATE FINDING
(define (split-string-in-half s)
  (let ([half-index (/ (string-length s) 2)])
    (list
     (substring s 0 half-index)
     (substring s half-index))))

(define (chars-in-both-strings a b)
  (set-intersect
   (string->list a)
   (string->list b)))

(define (find-duplicate-in-rucksack s)
  (apply chars-in-both-strings (split-string-in-half s)))


;; PRIORITY
(define (item-priority c)
  (let ([i (char->integer c)])
    (if (< i (char->integer #\a))
        (+ (- i (char->integer #\A)) 27)
        (+ (- i (char->integer #\a)) 1))))

(define (rucksack-priority s)
  (item-priority (car (find-duplicate-in-rucksack s))))


;; MAIN
(apply + (map rucksack-priority (get-input-lines)))
```

# Part 2

```racket
(require racket/set)


;; IO
(define (get-input-lines)
  (let ([line (read-line)])
    (if (string? line)
      (cons line (get-input-lines))
      '())))


;; GROUPING
(define (into-groups elves)
  (if (not (empty? elves))
      (cons (take elves 3) (into-groups (drop elves 3)))
      '()))

(define (duplicate-char-in-strings strs)
  (car (apply set-intersect (map string->list strs))))


;; PRIORITY
(define (item-priority c)
  (let ([i (char->integer c)])
    (if (< i (char->integer #\a))
        (+ (- i (char->integer #\A)) 27)
        (+ (- i (char->integer #\a)) 1))))

(define (group-priority g)
  (item-priority (duplicate-char-in-strings g)))


;; MAIN
(apply + (map group-priority (into-groups (get-input-lines))))
```
