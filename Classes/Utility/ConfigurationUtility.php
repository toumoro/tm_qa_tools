<?php

declare(strict_types=1);

namespace Toumoro\TmQaTools\Utility;

use TYPO3\CMS\Core\Configuration\ExtensionConfiguration;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * Class ConfigurationUtility
 */
abstract class ConfigurationUtility
{
    /**
     * Get extension configuration from LocalConfiguration.php
     *
     * @return array
     * @throws ExtensionConfigurationExtensionNotConfiguredException
     * @throws ExtensionConfigurationPathDoesNotExistException
     */
    protected static function getExtensionConfiguration(): array
    {
        return (array)GeneralUtility::makeInstance(ExtensionConfiguration::class)->get('tm_qa_tools');
    }

    /**
     * Provide custom fixtures path.
     *
     * @return string
     */
    public static function getCustomFixturesPath(): string
    {
        $configuration = self::getExtensionConfiguration();

        return $configuration['fixturesPath'] ?? '';
    }
}
