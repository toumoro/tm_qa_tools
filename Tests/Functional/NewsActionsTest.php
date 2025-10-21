<?php

namespace Toumoro\TmQaTools\Tests\Functional;

use PHPUnit\Framework\Attributes\Test;
use Toumoro\TmQaTools\Helper\CsvHelper;
use Toumoro\TmQaTools\Utility\ConfigurationUtility;
use Toumoro\TmQaTools\Utility\DatabaseUtility;

class NewsActionsTest extends BaseFunctionalTestCase
{
    private const DEFAULT_FIXTURES_PATH =  __DIR__ . '/Fixtures/News/news.csv';
    private const TABLE = 'tx_news_domain_model_news';

    protected string $fixtures;
    protected $databaseUtility;

    protected array $testExtensionsToLoad = [
        'georgringer/news',
    ];

    protected array $coreExtensionsToLoad = [
        'extbase',
        'fluid',
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
    public function canCreateANewsRecord(): void
    {
        $fields = $this->getFieldsData();

        self::assertEquals(123, $this->mockInsertAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canEditANewsRecord(): void
    {
        $fields = $this->getFieldsData();

        self::assertTrue($this->mockUpdateAndFetchUid(self::TABLE, $fields, 124));
    }

    #[Test]
    public function canDeleteANewsRecord(): void
    {
        $fields = $this->getFieldsData();

        self::assertTrue($this->mockDeleteAndFetchUid(self::TABLE, $fields));
    }
}
