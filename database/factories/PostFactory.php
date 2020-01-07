<?php

use Faker\Generator as Faker;

$factory->define(App\Post::class, function (Faker $faker) {
    return [
        'fk_category_id' => 1,
        'title' => $faker->sentence,
        'description' => $faker->paragraph($nbSentences = 3, $variableNbSentences = true),
        'image' => 'sample.jpg',
        'active' => 1
    ];
});
