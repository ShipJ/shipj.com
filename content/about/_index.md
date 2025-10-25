---
title: "Hi, I'm Jack 👋"
meta_title: "About"
description: "A lighthearted peep into Jack Shipsmith's past, present, and predicted future."
image: "/images/favicon.png"
draft: false
---

**Current Status**  
- 💍 Planning a wedding Aussie Style
- ⚽ Watching Arsenal religiously  
- 🏃 Chasing another sub-20min 5k (see my efforts)
- 🔧 Building side projects no one asked for  
- 📊 Available for consulting/tutoring

**TL;DR**  

I'd never have predicted that I'd become a *Trend Forecaster*. Yet after 8 years with WGSN, I'm still figuring out how to be cool.

I've led the Data Science and Engineering teams at the world's leading trend authority, transforming it from publishing house -> data-driven powerhouse. I solve messy problems in scrappy teams, delicately balancing leading from the front, with convincing those above me that what I'm doing is value-generating.

When I'm not knee-deep in dbt models or Looker dashboards, I'm playing football or watching my beloved Arsenal, beating my 5k PB, or planning a wedding.

<details>
<summary><b>Director's Cut</b></summary>

It began at Ascential (WGSN's parent company), where I joined as its first Data Scientist in May 2017. My boss had left by the end of the year and I was left to fend for myself. 10+ acquisitions later, Ascential had positioned itself as. This is where I got my first experience of Looker, building it with Edge/Flywheel Devs.

At our annual conference, I was asked to join WGSN to . What had I done... Here I was, squinting at prints and patterns, trying to make sense of what gingham was as opposed to . 

Outside of that, I like slow books, odd maps, and trying to learn things the hard way.

##### Redundancy
"My role" was made redundant in September 2025, and was the [greatest gift(s) I have ever received](../blog/post-2)

**TL;DR**

I don't take that likely, and know that others would baulk at me for saying it, but I was ready to pack it in. The thought of handing in my notice and reluctantly working for 3 months in a job I was not enjoying makes me quiver. 

As a keen follower of personal finance and FIRE 

It makes me ever more grateful for being *loyal* - my partner insists that job-hopping is more fruitful, and she is probably right so I won't argue it. We are getting married in Australia in November, and the thought of

The final gift is my time back. Weekends, evenings, holidays, sickness were spent prepping 1-1 notes, monitoring pipelines, adding one extra feature, learning a new tool - getting the nth crazy project over the line because Y will be on annual leave from Wednesday.

In 8.5 years across WGSN and its parent company Ascential, I had never taken a sick day. 

##### Skills
My skillset ranges from database management (cloud and on-prem) to data science workflows. 
- **Languages**: python, SQL, javascript
- **Tools**: jfrwf
- **Soft**: Jira, Miro, Google Sheets
  
##### Management
I am a **servant-leader** and always will be. I hate *telling* others how to do something. This probably didn't resonate with leaders around me, and would often be used against me "in your role, you should be ____". 

I think this stems from being a technical leader - one who prefers to understand a technology before professing to use it. *Every* manager I've ever had has told me I cannot be both - I must. Yet, my team of staff engineers and PhD-honed researchers compliment me for it. I've always found it to be a delicate balance. I am skeptical towards every shiny new tool, and really want to understand what problem it solves before implementing it.

I value appreciation culture and was often left frustrated at the lack of support despite (in my view) over-achieving. 

It is a delicate balance between knowing that you are learning, and simply being taken advantage of. If there is one lesson I've learned - this was not worth it. 

##### Transformation
At times I felt like a consultant, solving any data-related problem that came by my desk - from company acquisitions, to salesforce migrations, to churn models, to implementing new tools from scratch. The difference is not having an end-date. 

I am responsible for transforming WGSN into a company that used Microsoft Access for Finance Reporting, Powerpoint and Excel, to supporting *every* department.

##### Lessons from University
I knew as soon as , I didn't get it. How could anyone. I think I (vaguely) do now, but it wasn't for me. That taught me a lot about humility. I cared about relationships, ways of doing things quickly, cleverly. I listened in awe explaining bitwise operators a. After hours of thenewboston (whatever happened to Bucky Roberts?), KhanAcademy and using Wolfram Alpha to *help* with maths coursework. I am very much a throw myself at the hardest problem kind of person, knowing that everyone around me is 100000x more intelligent. 

##### Lessons from Jury service
Jury service taught me about imposter syndrome. I am not one to bullsh* my way through conversations, and will always say when I don't know (or don't know enough) to form an opinion, but this was something else. 

I have never felt so unqualified. My interpretation of 50+ pages of criminal law, and words by competing barristers, was the deciding factor of whether someone's life would change forever. But I did it and we had a beer afterwards.

</details>
<br><br>

<script>
  fetch('../cv.pdf', { method: 'HEAD' })
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

<div class="text-center">
  <a href="../cv.pdf" download="Jack_Shipsmith_CV.pdf" type="application/pdf" class="btn btn-primary">
    📄 Download my CV
  </a>
  <span id="cv-modified-date"></span>
</div>