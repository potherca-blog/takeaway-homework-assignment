# Homework Assignment

## Introduction

This assignment is set up to help us gain insight into how _you_ function as a web-developer.

- What techniques used?
- What decisions are made and what are them based on?
- Which tools are prefered?

**The assignment is this:**

_Build a sample application (using PHP and/or Javascript) which presents a list
of restaurants. It should be possible for a user to sort the list, search
through the list and favorite items from the list (so they can more easily be
found during later sort/search actions)._

## Scoring

The assignment is judge on the following criteria:

1. The quality of the code
2. The clarity of the documentation
3. How closely the specifications and requirements have been met

Although a pretty UI is nice to look at, don't feel discouraged if you are less
gifted in making nice-looking web-interfaces. This assignment is mostly geared
towards assessing technical prowess.

## Specifications

### Requirements

1. The sample application should work well across desktop and mobile devices.

2. Each item of the list should contain:
   - the name of the restaurant
   - the current opening state (open, order ahead, closed)
   - the selected sort
   - the sort value for a restaurant
   - if the restaurant has been favourited or not

3. When multiple restaurants have been favourited, they are _also_ sorted based
   on their current openings state and current selected sort option(s).

4. The code should be accompanied by test cases. Obviously, the tests should all
   pass.

5. Documentation should be included describing how to get the sample application
   to working, how to run the test, which tools were used and which choices were
   made.

### Sorting

The list of restaurant shoulkd be sorted based on it's current openings state.
Restaurants can be favourited and a sort option can be selected to further sort
the list.

The priority of the sorting is as follows (from the highest to the lowest priority):

1. **Favorites** Favourite restaurants are at the top of the list.
2. **Openings state**​Restaurants are either open (top), can handle orders ahead
   (middle) or is currently closed (bottom).
3. **Sorting** One sort option is _always_ chosen. Available options are:
    - average product price
    - best match
    - delivery costs
    - distance
    - minimum costs
    - newest
    - popularity
    - rating average

### Searching

It should be possible for a user to filter restaurants by searching for a restaurant's name.

### Favorites

A user should be able to mark restaurants as "favorite". Restaurants that have
been favorited should appear at the top of the list.

## Sample data

All necessary data to complete this assignment is included in `sample.json`.

The data looks like this:

    {
        "restaurants": [
            {
                "name": "Restaurant Name",
                "status": "open | order ahead | closed",
                "sortingValues": {
                    "averageProductPrice": 1234,
                    "bestMatch": 0.0,
                    "deliveryCosts": 200,
                    "distance": 1234,
                    "minCost": 1000
                    "newest": 96.0,
                    "popularity": 17.0,
                    "ratingAverage": 4.5,
            }
        ]
    }


## Bonus points

Customers are more willing to order at restaurants near them.

As a bussines, we would like to promote restaurants with high scores.

In order to combine these two facts, a new sort method needs to be calculated.

This will be called "Top restaurants".

The following formula should be used to calculate top restaurants:

    top restaurants = ((distance * popularity) + rating average)​.

For extra points, implement top restaurants as an another sorting option.
