# Takeaway Homework Assignment

## Introduction

This document outlines the process I went through whilst implementing the
"homework" assignment I received from Takeaway.

## Implementation Steps taken

1. Dowload, unzip and read the assignment (see [my critique](./docs/critique.md))
2. Research Takeaway corporate identity (see [style](./docs/style.md))
3. Build the main UI
4. Build a UI component to represent a restaurant.

## Notes

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
