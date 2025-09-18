<?php

$moduleConfiguration['qa_tools'] = [
    'parent' => 'tools',
    'position' => ['after' => '*'],
    'access' => 'admin',
    'workspaces' => 'live',
    'path' => '/module/web/QaTools/',
    'icon' => 'EXT:tm_qa_tools/Resources/Public/Icons/module_administration.svg',
    'labels' => 'LLL:EXT:tm_qa_tools/Resources/Private/Language/locallang_mod.xlf',
    'extensionName' => 'tmQaTools',
    'controllerActions' => [
        \Toumoro\TmQaTools\Controller\AdministrationController::class => [
            'index',
            'execute',
        ],
    ],
];

return $moduleConfiguration;
