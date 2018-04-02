![Takeaway Homework Assignment Logo](./docs/logo.png)

# Takeaway Homework Assignment

> _"Be more ambitious. Do your homework. There's no easy way around this."_
> ~ Anthony McCarten

## Introduction

This document outlines the process I went through whilst implementing the
"homework" assignment I received from Takeaway.

## Implementation Steps taken

1. Dowload, unzip and read the assignment (see [my critique](./docs/critique.md)).
2. Research Takeaway corporate identity (see [style](./docs/style.md)).
3. Build the main UI.
4. Build a UI component to represent a restaurant.
5. Add some color and branding to the UI.
6. Create logic to generate static JSON files for the available sort scenarios.
   (see [`generate.php`](./src/generate.php))
7. Adds concern about the "Top Restaurants" formula (see the "Bonus
   assignment" section of my critique.)
8. Add logic to populate the Restaurant List in the UI from the `sample.json`
   (see [`list.js`](./web/js/list.js)).
9. Add logic to populate the sort options in the UI
   (see [`sortOptions.js`](./web/js/sortOptions.js)).
10. Moves HTML into templates for JS re-use.
11. Connects JS logic to HTML (see [`application.js`](./web/js/application.js))
12. Adds search functionality (see [`jquery.filterFor.js`](https://gist.github.com/Potherca/c765ec8e09270f25e44e525979c08a8a)).
13. Adds logic to filter by Restaurant State (see [`filterTabs.js`](web/js/filterTabs.js))

## Implementation Choices

- I have chosen to use the [<img src="https://bulma.io/images/bulma-logo.png" alt="Bulma" width="80" height="20" />](https://bulma.io)
  CSS framework to quickly have something decent-looking setup.
- I have chosen to use CSS custom properties (also know as "CSS variables").
  In a production environment a pre-compiler would be used to make sure that
  older broswer are also able to use the created CSS.
- The HTML `class` attribute contains both framework classes and custom ones.
  A pipe character `|` is added to more easily distinguish between both. Please
  note that the `|` can _not_ be accessed as a class as, in the context of a CSS
  selector, the pipe charater is used as a namespace separator.
- I have chosen to us BEM as the naming scheme for CSS classes.
- As part of the sample application branding I have added a logo.
- Thuisbezorgd.nl uses jQuery `1.12.4`. I have choosen to use jQuery too, instead
  of vanilla JS. I did choose to use a newer version.
- I have chosen to have the restaurants sorted by "Top Restaurant" by default as
  this makes the most sense from a business perspective.
- Instead of also implementing a server-side application, I have choosen to
  generate the JSON responses such an application would return.
- I have chosen to use a jQuery search plugin I had lying around from an earlier
  project rather than write something new or go looking for the most appropriate
  plugin.
