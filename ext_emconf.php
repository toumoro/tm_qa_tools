<?php

$EM_CONF['tm_qa_tools'] = [
    'title' => 'TM QA Tools',
    'description' => 'Ships a list of tools that runs and manages automated functional and acceptance tests from the backend or CLI.',
    'category' => 'misc',
    'author' => 'Haythem Daoud',
    'author_email' => 'haythemdaoud.x@gmail.com',
    'state' => 'beta',
    'uploadFolder' => false,
    'version' => '13.0.0',
    'constraints' => [
        'depends' => [
            'typo3' => '12.4.0-13.4.99',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];