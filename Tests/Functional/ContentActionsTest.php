<?php

namespace Toumoro\TmQaTools\Tests\Functional;

use PHPUnit\Framework\Attributes\Test;
use Toumoro\TmQaTools\Helper\CsvHelper;
use Toumoro\TmQaTools\Utility\ConfigurationUtility;
use Toumoro\TmQaTools\Utility\DatabaseUtility;

class ContentActionsTest extends BaseFunctionalTestCase
{
    private const DEFAULT_FIXTURES_PATH =  __DIR__ . '/Fixtures/Content/content.csv';
    private const TABLE = 'tt_content';

    protected string $fixtures;

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
    public function canCreateAContentElement(): void
    {
        $fields = $this->getFieldsData();

        self::assertEquals(123, $this->mockInsertAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canEditAContentElement(): void
    {
        $fields = $this->getFieldsData();

        self::assertTrue($this->mockUpdateAndFetchUid(self::TABLE, $fields, 124));
    }

    #[Test]
    public function canDeleteAContentElement(): void
    {
        $fields = $this->getFieldsData();

        self::assertTrue($this->mockDeleteAndFetchUid(self::TABLE, $fields));
    }
}
