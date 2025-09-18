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
"ci:php:cs": "php-cs-fixer fix --config=Build/php-cs-fixer/php-cs-fixer.php -v --dry-run --using-cache no --diff"
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
"ci:php:stan": "phpstan analyse --ansi --no-progress --configuration=Build/phpstan/phpstan.neon"
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
"ci:lint:typoscript": "typoscript-lint -c Build/linting/typoscript-lint.yml --ansi -n --fail-on-warnings"
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
"ci:php:unit": "phpunit -c ./Build/phpunit/UnitTests.xml"
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
"fix:php:cs": "php-cs-fixer fix --config=Build/php-cs-fixer/php-cs-fixer.php"
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
