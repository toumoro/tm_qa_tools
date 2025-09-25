FR
---

# tm_qa_tools -- Boîte à outils d’assurance qualité TYPO3

Un ensemble d'outils permettant d'automatiser la phase d'assurance qualité et d'appliquer les standards de codage dans les projets TYPO3.

## Prérequis

Assurez-vous que ces variables d’environnement sont définies :

- `typo3DatabaseUsername`
- `typo3DatabasePassword`
- `typo3DatabaseHost`
- `typo3DatabaseName`

## Installation

```bash
composer req toumoro/tm-qa-tools --dev
```

Ensuite, ajoutez ces scripts dans le fichier `composer.json` de votre projet :

```json
"scripts": {
    "post-autoload-dump": [
        "@qa-tools-scripts"
    ],
    "post-install-cmd": [
        "git init",
        "git config --local core.hooksPath .githooks/"
    ],
    "qa-tools-scripts": [
        "chmod +x vendor/toumoro/tm-qa-tools/services/configure.sh",
        "vendor/toumoro/tm-qa-tools/services/configure.sh"
    ],
    "ci:php": [
        "@ci:php:cs",
        "@ci:php:lint",
        "@ci:php:stan",
        "@ci:php:unit"
    ],
    "fix:php": [
        "@fix:php:rector",
        "@fix:php:cs"
    ],
    "ci:php:cs": "php-cs-fixer fix --config=build/php-cs-fixer/php-cs-fixer.php -v --dry-run --using-cache no --diff",
    "ci:php:lint": "parallel-lint --show-deprecated --exclude vendor ./packages",
    "ci:php:stan": "phpstan analyse --ansi --no-progress --configuration=build/phpstan/phpstan.neon",
    "ci:lint:typoscript": "typoscript-lint ./packages --ansi -n --fail-on-warnings",
    "ci:lint:xml": "xmllint packages --pattern '*.xlf,*.svg' --ansi",
    "ci:lint:yaml": "yaml-lint packages/**/Configuration/*.yaml",
    "ci:php:unit": "phpunit -c ./build/phpunit/UnitTests.xml",
    "fix:php:cs": "php-cs-fixer fix --config=build/php-cs-fixer/php-cs-fixer.php",
    "fix:php:rector": [
        "rector process --clear-cache"
    ]
}
```

Puis mettez à jour le fichier `.gitignore` :

```txt
.php-cs-fixer.cache
/build/phpunit/.phpunit.result.cache
```
---

## Exemple d’utilisation

### Analyser le code PHP pour détecter les problèmes de style et erreurs

```bash
composer ci:lint:typoscript
```

### Corriger le code PHP (appliquer les standards de codage)

```bash
composer fix:php
```

### Vérifier le code TypoScript

```bash
composer ci:lint:typoscript
```

### Lancer tous les tests avec le script dédié

```bash
chmod +x ./build/Scripts/runTests.sh

# Lancer tous les tests
./build/scripts/runTests.sh -p 8.2

# Lancer un test spécifique
./build/scripts/runTests.sh -p 8.2 -- --filter PageActionsTest
```

---

## Tests UI avec Playwright

Les tests Playwright sont disponibles sous le domaine :
`playwright-${YOUR_DOMAIN}`

---

## Extensibilité

Pour les tests fonctionnels, vous pouvez ajouter un chemin personnalisé vers un fichier de fixtures et le configurer via l’option d’extension `fixturesPath`.

Pour les tests Playwright, vous pouvez ajouter vos tests personnalisés dans une extension existante ou dans une nouvelle.
Il est essentiel d’ajouter le chemin du dossier de tests à votre fichier `docker-compose-cloud.yml` afin de garantir leur bonne exécution.

---

EN
---

# tm_qa_tools -- TYPO3 Quality Assurance Toolkit

A set of tools to automate quality checks and enforce coding standards for TYPO3 projects.

## Requirements

Make sure these environment variables are set:

- `typo3DatabaseUsername`
- `typo3DatabasePassword`
- `typo3DatabaseHost`
- `typo3DatabaseName`

## Installation

```bash
composer req toumoro/tm-qa-tools --dev
```

Then add these scripts to your project's `composer.json` file:

```json
"scripts": {
    "post-autoload-dump": [
        "@qa-tools-scripts"
    ],
    "post-install-cmd": [
        "git init",
        "git config --local core.hooksPath .githooks/"
    ],
    "qa-tools-scripts": [
        "chmod +x vendor/toumoro/tm-qa-tools/services/configure.sh",
        "vendor/toumoro/tm-qa-tools/services/configure.sh"
    ],
    "ci:php": [
        "@ci:php:cs",
        "@ci:php:lint",
        "@ci:php:stan",
        "@ci:php:unit"
    ],
    "fix:php": [
        "@fix:php:rector",
        "@fix:php:cs"
    ],
    "ci:php:cs": "php-cs-fixer fix --config=build/php-cs-fixer/php-cs-fixer.php -v --dry-run --using-cache no --diff",
    "ci:php:lint": "parallel-lint --show-deprecated --exclude vendor ./packages",
    "ci:php:stan": "phpstan analyse --ansi --no-progress --configuration=build/phpstan/phpstan.neon",
    "ci:lint:typoscript": "typoscript-lint ./packages --ansi -n --fail-on-warnings",
    "ci:lint:xml": "xmllint packages --pattern '*.xlf,*.svg' --ansi",
    "ci:lint:yaml": "yaml-lint packages/**/Configuration/*.yaml",
    "ci:php:unit": "phpunit -c ./build/phpunit/UnitTests.xml",
    "fix:php:cs": "php-cs-fixer fix --config=build/php-cs-fixer/php-cs-fixer.php",
    "fix:php:rector": [
        "rector process --clear-cache"
    ]
}
```

Then update `.gitignore` file:

```txt
# ....

.php-cs-fixer.cache
/build/phpunit/.phpunit.result.cache
```
---

## Example Usage

# Analyze PHP code for style issues and errors

```bash
composer ci:lint:typoscript
```

# Fix PHP code (Apply coding standards)

```bash
composer fix:php
```

# Check TypoScript code for errors

```bash
composer ci:lint:typoscript
```

Run all tests using the command:

```bash
chmod +x ./build/Scripts/runTests.sh

# Run all
./build/scripts/runTests.sh -p 8.2 -d mysql

# Run a specific test
./build/scripts/runTests.sh -p 8.2 -d mysql -- --filter PageActionsTest
```

--------------------------------------------------------------------------------

## Tests UI avec Playwright

Playwright tests are available under `playwright-${YOUR_DOMAIN}`.

--------------------------------------------------------------------------------

## Extensibility

For functional tests, you can add a custom fixtures file path and then configure it under the extension configuration setting `fixturesPath`.

For Playwright tests, you can add your custom tests in an existing extension or in a new one.
It's essential to add the tests folder path to your `docker-compose-cloud.yml` file to ensure they are properly executed.