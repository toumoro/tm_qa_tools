FR
---

# Guide CI & Qualité du Code

## Vue d’ensemble des commandes

Ci-dessous se trouve une collection de scripts Composer utiles pour exécuter des vérifications d’Intégration Continue (CI) et appliquer des corrections automatiques pour les fichiers PHP, TypoScript et YAML.

---

### Exécuter toutes les vérifications CI PHP

Exécute les vérifications de style de code, le linting, l’analyse statique et les tests unitaires.

```bash
"ci:php": [
  "@ci:php:cs",
  "@ci:php:lint",
  "@ci:php:stan",
  "@ci:php:unit"
]
```

**Utilisation :**

```bash
composer ci:php
```

---

### Vérification du style de code PHP (simulation)

Vérifie les problèmes de style de code sans modifier les fichiers.

```bash
"ci:php:cs": "php-cs-fixer fix --config=build/php-cs-fixer/php-cs-fixer.php -v --dry-run --using-cache no --diff"
```

**Utilisation :**

```bash
composer ci:php:cs
```

---

### Linting PHP

Détecte les erreurs de syntaxe dans les fichiers PHP.

```bash
"ci:php:lint": "parallel-lint --show-deprecated --exclude vendor ./packages"
```

**Utilisation :**

```bash
composer ci:php:lint
```

---

### Analyse statique avec PHPStan

Exécute une analyse statique pour détecter d’éventuels problèmes.

```bash
"ci:php:stan": "phpstan analyse --ansi --no-progress --configuration=build/phpstan/phpstan.neon"
```

**Utilisation :**

```bash
composer ci:php:stan
```

---

### Linting TypoScript

Vérifie les fichiers TypoScript pour détecter les erreurs de syntaxe.

```bash
"ci:lint:typoscript": "typoscript-lint ./packages --ansi -n --fail-on-warnings"
```

**Avec un fichier de configuration personnalisé :**

```bash
"ci:lint:typoscript": "typoscript-lint -c build/linting/typoscript-lint.yml --ansi -n --fail-on-warnings"
```

**Utilisation :**

```bash
composer ci:lint:typoscript
```

---

### Linting YAML

Vérifie les fichiers YAML pour détecter les erreurs de syntaxe.

```bash
"ci:lint:yaml": "yaml-lint packages/**/Configuration/*.yaml",
```

**Utilisation :**

```bash
composer ci:lint:yaml
```

---

### Linting XML

Vérifie les fichiers XML pour détecter les erreurs de syntaxe.

```bash
"ci:lint:xml": "xmllint packages --pattern '*.xlf,*.svg' --ansi",
```

**Utilisation :**

```bash
composer ci:lint:xml
```

---

### Tests PHPUnit

Exécute les tests unitaires.

```bash
"ci:php:unit": "phpunit -c ./build/phpunit/UnitTests.xml"
```

**Utilisation :**

```bash
composer ci:php:unit
```

---

## Commandes de correction automatique

---

### Exécuter toutes les corrections PHP

Corrige automatiquement le style de code et refactorise le code PHP.

```bash
"fix:php": [
  "@fix:php:rector",
  "@fix:php:cs"
]
```

**Utilisation :**

```bash
composer fix:php
```

---

### Corriger le style de code PHP

Applique automatiquement les standards de codage.

```bash
"fix:php:cs": "php-cs-fixer fix --config=build/php-cs-fixer/php-cs-fixer.php"
```

**Utilisation :**

```bash
composer fix:php:cs
```

---

### Exécuter Rector pour le refactoring automatique

```bash
"fix:php:rector": [
  "composer require --dev rector/rector",
  "rector process --clear-cache",
  "composer remove --dev rector/rector"
]
```

**Utilisation :**

```bash
composer fix:php:rector
```


EN
---

# CI & Code Quality Guide

## Commands Overview

Below is a collection of useful Composer scripts for running Continuous Integration (CI) checks and automatic fixes for PHP, TypoScript, and YAML files.

### Run All PHP CI Checks

Runs code style checks, linting, static analysis, and unit tests.

```bash
"ci:php": [
  "@ci:php:cs",
  "@ci:php:lint",
  "@ci:php:stan",
  "@ci:php:unit"
]
```

**Usage:**

```bash
composer ci:php
```

--------------------------------------------------------------------------------

### PHP Code Style Check (Dry-Run)

Checks for code style issues without modifying files.

```bash
"ci:php:cs": "php-cs-fixer fix --config=build/php-cs-fixer/php-cs-fixer.php -v --dry-run --using-cache no --diff"
```

**Usage:**

```bash
composer ci:php:cs
```

--------------------------------------------------------------------------------

### PHP Linting

Finds syntax errors in PHP files.

```bash
"ci:php:lint": "parallel-lint --show-deprecated --exclude vendor ./packages"
```

**Usage:**

```bash
composer ci:php:lint
```

--------------------------------------------------------------------------------

### PHPStan Static Analysis

Runs static analysis to detect potential issues.

```bash
"ci:php:stan": "phpstan analyse --ansi --no-progress --configuration=build/phpstan/phpstan.neon"
```

**Usage:**

```bash
composer ci:php:stan
```

--------------------------------------------------------------------------------

### TypoScript Linting

Checks TypoScript files for syntax issues.

```bash
"ci:lint:typoscript": "typoscript-lint ./packages --ansi -n --fail-on-warnings"
```

**With a custom config file:**

```bash
"ci:lint:typoscript": "typoscript-lint -c build/linting/typoscript-lint.yml --ansi -n --fail-on-warnings"
```

**Usage:**

```bash
composer ci:lint:typoscript
```

--------------------------------------------------------------------------------

### YAML Linting

Checks YAML files for syntax issues.

```bash
"ci:lint:yaml": "yaml-lint packages/**/Configuration/*.yaml",
```

**Usage:**

```bash
composer ci:lint:yaml
```

--------------------------------------------------------------------------------

### XML Linting

Checks XML files for syntax issues.

```bash
"ci:lint:xml": "xmllint packages --pattern '*.xlf,*.svg' --ansi",
```

**Usage:**

```bash
composer ci:lint:xml
```

--------------------------------------------------------------------------------

### PHPUnit Tests

Runs unit tests.

```bash
"ci:php:unit": "phpunit -c ./build/phpunit/UnitTests.xml"
```

**Usage:**

```bash
composer ci:php:unit
```

--------------------------------------------------------------------------------

## Automatic Fix Commands

### Run All PHP Fixes

Automatically fixes code style and refactors PHP code.

```bash
"fix:php": [
  "@fix:php:rector",
  "@fix:php:cs"
]
```

**Usage:**

```bash
composer fix:php
```

--------------------------------------------------------------------------------

### Fix PHP Code Style

Applies coding standards automatically.

```bash
"fix:php:cs": "php-cs-fixer fix --config=build/php-cs-fixer/php-cs-fixer.php"
```

**Usage:**

```bash
composer fix:php:cs
```

--------------------------------------------------------------------------------

### Run Rector for Automated Refactoring

```bash
"fix:php:rector": [
  "composer require --dev rector/rector",
  "rector process --clear-cache",
  "composer remove --dev rector/rector"
]
```

**Usage:**

```bash
composer fix:php:rector
```
