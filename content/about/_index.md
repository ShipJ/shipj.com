---
title: "Hi, I'm Jack 👋"
meta_title: "About"
description: "A lighthearted peep into Jack Shipsmith's past, present, and predicted future."
image: "/images/favicon.png"
draft: false
---

I'd never have predicted that I'd become a trend forecaster. After eight years at the world's leading trend authority, I'm still figuring it all out. here I am squinting at patterns and trying to make sense of what’s next (with varying degrees of success).

This site is a place for things I care about — personal projects, half-formed ideas, essays I might regret later, and other stuff that doesn’t quite fit into a corporate deck.

I offer light-touch consulting and tutoring services for businesses, teams, and individuals who want a fresh perspective on complex challenges — especially where culture, technology, and logic collide. If that sounds interesting, let's set up some time.

Outside of that, I like slow books, odd maps, and trying to learn things the hard way.

-- Uni Experience
I knew w I stepped into object-oriented programming, I didn't get it. How could anyone. I think I (vaguely) do now, but it wasn't for me. That taught me a lot about humility. I cared about relationships, ways of doing things quickly, cleverly. I listened in awe explaining bitwise operators a. After hours of thenewboston (whatever happened to Bucky Roberts?), KhanAcademy and using Wolfram Alpha to *help* with maths coursework.

-- Uni experience
UCL - research, what did I learn?

-- Jury service
Jury Service.. wow. Unqualified etc.



```python
print("Hello, World!")
```

<a href="/cv.pdf" download class="btn btn-primary">
  📄 Download my CV
</a>
<span id="cv-modified-date"></span>

<script>
  // Fetch the headers for /cv.pdf
  fetch('/cv.pdf', { method: 'HEAD' })
    .then(response => {
      const lastModified = response.headers.get('last-modified');
      if (lastModified) {
        const date = new Date(lastModified);
        // Format the date, e.g., "May 16, 2025"
        const formatted = date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        // Insert formatted date into the span
        document.getElementById('cv-modified-date').textContent = `(Last updated: ${formatted})`;
      }
    })
    .catch(error => {
      console.error('Error fetching last-modified header:', error);
    });
</script>
