<?php

namespace Potherca\Takeaway\HomeworkAssignment;

set_error_handler(function($severity, $message, $file, $line) {
    throw new \ErrorException($message, 0, $severity, $file, $line);
});

function getRestaurantsFromFile($filePath)
{
    $fileContents = file_get_contents($filePath);

    $data = json_decode($fileContents, true);

    $restaurants = array_shift($data);

    return $restaurants;
}

function calculateTopRestaurants($distance, $popularity, $ratingAverage)
{
    $topScore = ($distance * $popularity) + $ratingAverage;

    $topScore = round($topScore);

    return $topScore;
}

function addTopRestaurants($restaurants)
{
    return array_map(function ($restaurant) {

        $values = $restaurant['sortingValues'];

        $topScore = calculateTopRestaurants(
            $values['distance'],
            $values['popularity'],
            $values['ratingAverage']
        );

        $restaurant['sortingValues']['topRestaurants'] = $topScore;

        return $restaurant;
    }, $restaurants);
}

function sortByKey($restaurants, $sortKey)
{
    $sortOrder = [
        'open' => 0,
        'order ahead' => 1,
        'closed' => 2,
    ];

    usort($restaurants, function ($left, $right) use ($sortKey, $sortOrder) {

        if ($left['status'] === $right['status']) {
            $sortValue = $right['sortingValues'][$sortKey] - $left['sortingValues'][$sortKey];
        } else {
            $sortValue = $sortOrder[$left['status']] - $sortOrder[$right['status']];
        }

        return $sortValue;
    });

    return $restaurants;
}

function createRestaurantCollection($restaurants, $sortKeys)
{
    $sortedRestaurants = [];

    array_walk($sortKeys, function ($sortKey) use (&$sortedRestaurants, $restaurants) {
        $sortedRestaurants[$sortKey] = sortByKey($restaurants, $sortKey);
    });

    return $sortedRestaurants;
}

function putRestaurantsToFile($restaurants, $apiDirectory)
{
    array_walk($restaurants, function ($restaurants, $sortKeys) use ($apiDirectory) {
        $filePath = sprintf("%s/%s.json", $apiDirectory, $sortKeys);

        $data = json_encode(['restaurants' => $restaurants], JSON_PRETTY_PRINT);

        file_put_contents($filePath, $data);
    });
}

function getSortKeys($restaurants)
{
    $restaurant = array_shift($restaurants);

    $sortKeys = array_keys($restaurant['sortingValues']);

    return $sortKeys;
}

function run($filePath, $apiDirectory)
{
    $restaurants = getRestaurantsFromFile($filePath);

    $restaurants = addTopRestaurants($restaurants);

    $sortKeys = getSortKeys($restaurants);

    $restaurantsCollection = createRestaurantCollection($restaurants, $sortKeys);

    putRestaurantsToFile($restaurantsCollection, $apiDirectory);
}

$exitCode = 0;
if (in_array('--help', $argv)) {
    $script = basename($argv[0]);
    echo <<<TXT
== Takeaway Homework Assignment JSON files generator ==

Generates a JSON files containing  restaurants for each sort-option.
Each file contains the sort order for a different sort option.
The restaurants and sort options are based on the data from the given sample JSON.

Usage: ${script} <path-to-sample-json> <api-directory>

Where:

- <path-to-sample-json> is the path to the sample.json file containing the sample of restaurants.
- <api-directory> is the path to the directory the JSON files are to written.

The <api-directory> MUST already exist.


TXT;
}elseif (isset($argv[1], $argv[2]) === false) {
    echo 'ERROR ! Two parameter required: <path-to-sample-json> <api-directory>'.PHP_EOL;
    $exitCode = 65;
} else {
    run($argv[1], $argv[2]);
}
exit($exitCode);

#EOF


