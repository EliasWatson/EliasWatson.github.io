---
title: "University Graphics Project"
date: 2021-05-01T19:00:00-05:00
summary: "3D renderer written in C++ & OpenGL"
draft: false
---

[_View this project on GitHub_](https://github.com/EliasWatson/Graphics-Project)

For my computer science independent study at Bob Jones University, I wrote a realistic realtime 3D renderer in C++ and OpenGL.
I spent 148 hours on this project over the course of four months.

The program supports loading 3D scenes from GLTF files.
It can render shadows and skybox-based reflections.
The surface shader supports basic PBR materials with albedo, metallic, roughness, and normal maps.
The user can navigate the scene in a free-cam with the WASD keys and the mouse.
The scene can be inspected and edited through the included GUI.

Prior to this project, I had experience with writing OpenGL shaders on ShaderToy.
However, this project taught me a lot about the OpenGL pipeline and gave me a more complete picture of how 3D graphics are rendered to the screen.
I also learned how to use CMake to build C++ projects across multiple platforms.

---

![Dragon Scene Screenshot](/university_graphics_project/dragon_scene.jpg)

![Cash Register Scene Screenshot](/university_graphics_project/cash_register.jpg)
