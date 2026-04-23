---
layout: post
title: "Experiments with regular distributions of irregular triangles"
---

**Triangles**

Before doing anything with distributions, I had to have something to actually distribute. Thinking that I could learn twice as much if I combined two different concepts I was interested in, I chose to start with arbitrary n-gons due to their reputation as the basis for 3d graphics. After doing some research into polygon generating algorithms, I settled on the graham scan algorithm because of its low time complexity and because I wanted to avoid recursive algorithms while learning cuda. 

I soon learned the benefits of keeping it simple. The polygons, though interesting in their own right, were not the objects I was looking for in this project. For one thing, though I could control the number of points, the radius, and the center of the point cloud the polygon was constructed from, I could not control the number of vertices of the final polygon, nor its size or shape. This made it a bad choice for visualizing noise, as there were too many features of the polygon that were completely random. To make matters worse, new to cuda as I was, I encountered a bug when generating many polygons at once that was not present in my initial c++ tests, and because of the irregular nature of the polygons, debugging was slow and tedious. Instead of getting sidetracked, I resigned myself to using a simpler shape that was more suited to my goal.

My next idea was to use isosceles triangles. This avoided many of the issues I had with arbitrary n-gons: the triangles were extremely straightforward to generate and were regular while still having potential for variance in their rotations and their side-lengths. However, I again realized that these were not the shapes for the job- the shapes were actually too orderly!

I decided I wanted something in the middle- something that wasn’t so random that I couldn’t make anything out in the chaos, but wasn’t so orderly that the shapes melded together. What did I settle on? Circles of fixed radius inscribed with triangles. This was a nice middle ground between the 2 earlier approaches, where I could guarantee that the triangles would have some measure of regularity in their size and distribution while still letting them have variance in their shape.

Now onto drawing the triangles. Since the triangle generation was so light on computation and was only done once at the start of the program, I opted only to parallelize only the rasterization of the triangles, where I needed to check every single pixel for collision with all of the triangles. Rasterization itself was simple: each thread is one pixel. For each triangle, the thread colors itself in if it is within the bounds of the triangle. Simple right? Well, yes and no. on the technical side of things, this was one of the simplest parts of the whole thing. On the artistic side, however, it was one of the most complicated matters. 

I wanted a lot from my triangles. I wanted them to look orderly, but not so much that they looked boring. I wanted to show how they overlap clearly, but while letting each triangle stand out from the rest. I wanted my triangles to be colorful and yet still mesh well together, all while making sure the color didn’t get muddy or indistinct. I needed some way of compositing the triangles in line with all these constraints, all while making sure not to get too distracted from my goal.

After some deliberation, I eventually decided on what I have now. Triangles are generated with an rgb value that is a pure hue between red and blue. When triangles overlap, the pixel’s hue becomes the average of the hues of the triangles on the pixel, and its darkness increases exponentially with regards to the number of triangles.
	
While seemingly simple, this approach achieves a lot. The color control allows for random hue generation without making the image seem too messy or confused. The averaging allows the image to reach an equilibrium in color as more triangles are added, making for a nice visual indicator and showing how the approach brings about order even in randomness. The darkness conveys something similar, but in a different way and on a different scale, adding complexity to the image.


**Distribution**

Now that I had my triangles, I could move on to their distribution. I decided on using blue noise, distributing the circumcenter of each triangle such that it is roughly equidistant from each other triangle’s. I tried several approaches to blue noise generation: Mitchell's best candidate algorithm, Poisson’s disk algorithm, and a simple particle simulation.
    
Though Mitchell's algorithm is the simplest conceptually, I decided to start by implementing Poisson’s disk algorithm. Poisson’s algorithm is easily the most efficient algorithm, doing away with costly k-d trees and computation-heavy simulations, and is used for most applications, especially real-time computations used in videogames or interactive shaders. It is not without its drawbacks, however. For one thing, I found Poisson’s algorithm to be finicky and heavily dependent on the parameters, meaning that I had to spend a long time simply experimenting until I found the right parameters.    Since I am only generating the noise distribution once and I am not doing real-time graphics, I found the benefit to using Poisson’s algorithm negligible.
    
On to Mitchell’s algorithm. Interestingly, this algorithm was both the simplest to understand, the simplest to implement, and produced the highest quality noise. Of course, this is partially due to my decision to use a library for the nearest-neighbor, going against my strong inclinations to implement everything from scratch. As mentioned before, the slowness of this algorithm was forgivable because I was only generating the noise once.

Finally, I wanted to see if I could generate blue noise through plain-old simulation, too. Using cuda, I set up a simple physics simulation where particles in a toroidal space are repelled from one-another. This is the first time I have tried this sort of simulation, so there was lots to get right (or wrong). Like Poisson, this method was heavily dependent on parameters, and the behavior of the particles was subject to wild variation with different particles, making debugging difficult. Eventually, however, I got the system to stabilize and produce a satisfactory result. Interestingly, though, the result was actually slightly more orderly looking than I expected! Unlike mitchell blue noise with its character, somewhat circular, irregular looking distribution, the simulation stabilized to something remarkably grid-like. Regardless, I got the results I was looking for- a system where particles stabilized to be equidistant from one-another.

