---
title: "Image Dataset Curator"
date: 2021-09-16T12:00:00-05:00
summary: "Web app for creating an AI image training dataset"
tags: ["elm", "web_app", "ai"]
draft: false
---

[_View this project on GitHub_](https://github.com/EliasWatson/Image-Curator)

I wrote this tool in a single weekend while being brand new to the programming language I used.

---

Image Curator is a web app designed to quickly sort and edit image datasets.
I created it after being frustrated with curating a large dataset for training a GAN.
With my limited testing, I have been able to process 300+ images per hour, including setting custom crop regions for every image.

## Features

- Approve/reject images
- Set crop region
- Set mode to fill in empty space in non-square images
- Preview cropped region
- Skip to first unprocessed image
- Everything can be controlled with hotkeys, no mouse needed
- Script to output final dataset, including crops

## Screenshots

![](/image_curator/example_1.jpg)

![](/image_curator/example_2.jpg)

![](/image_curator/example_3.jpg)

![](/image_curator/example_4.png)
