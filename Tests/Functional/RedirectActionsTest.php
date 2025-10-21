<?php

namespace Toumoro\TmQaTools\Tests\Functional;

use PHPUnit\Framework\Attributes\Test;
use Toumoro\TmQaTools\Helper\CsvHelper;
use Toumoro\TmQaTools\Utility\ConfigurationUtility;
use Toumoro\TmQaTools\Utility\DatabaseUtility;

class RedirectActionsTest extends BaseFunctionalTestCase
{
    private const DEFAULT_FIXTURES_PATH =  __DIR__ . '/Fixtures/Redirects/redirects.csv';
    private const TABLE = 'sys_redirect';

    protected string $fixtures;

    protected array $coreExtensionsToLoad = [
        'redirects',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->databaseUtility = $this->getMockBuilder(DatabaseUtility::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['insertRecord', 'getRecord', 'updateRecord', 'deleteRecord'])
            ->getMock();

        try {
            /** @var ConfigurationUtility $configurationUtility */
            $fixtures = ConfigurationUtility::getCustomFixturesPath();
        } catch (\Exception $e) {
            $fixtures = self::DEFAULT_FIXTURES_PATH;
        }

        $this->fixtures = $fixtures;
    }

    /**
     * Returns fields values
     *
     * @return array
     */
    protected function getFieldsData(): array
    {
        $fields = [];
        $fields = CsvHelper::loadCsvContent($this->fixtures);
        return $fields[0];
    }

    #[Test]
    public function canCreateARedirectRecord(): void
    {
        $fields = $this->getFieldsData();

        self::assertEquals(123, $this->mockInsertAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canEditARedirectRecord(): void
    {
        $fields = $this->getFieldsData();

        self::assertTrue($this->mockUpdateAndFetchUid(self::TABLE, $fields, 124));
    }

    #[Test]
    public function canDeleteARedirectRecord(): void
    {
        $fields = $this->getFieldsData();

        self::assertTrue($this->mockDeleteAndFetchUid(self::TABLE, $fields));
    }
}
