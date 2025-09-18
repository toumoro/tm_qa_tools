<?php

namespace Toumoro\TmQaTools\Tests\Functional;

use PHPUnit\Framework\Attributes\Test;
use Toumoro\TmQaTools\Helper\CsvHelper;
use Toumoro\TmQaTools\Utility\ConfigurationUtility;
use Toumoro\TmQaTools\Utility\DatabaseUtility;

class PageActionsTest extends BaseFunctionalTestCase
{
    private const DEFAULT_FIXTURES_PATH =  __DIR__ . '/Fixtures/Pages/pages.csv';
    private const TABLE = 'pages';
    
    protected string $fixtures;
    
    /**
     * @return void
     */
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
        return [
            'default' => $fields[0],
            'shortcut' => $fields[1],
            'folder' => $fields[2],
            'link' => $fields[3]
        ];
    }

    #[Test]
    public function canCreateADefaultPageRecord(): void
    {
        $fields = $this->getFieldsData()['default'];

        $this->assertEquals(123, $this->mockInsertAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canEditADefaultPageRecord(): void
    {
        $fields = $this->getFieldsData()['default'];

        $this->assertTrue($this->mockUpdateAndFetchUid(self::TABLE, $fields, 124));
    }

    #[Test]
    public function canDeleteADefaultPageRecord(): void
    {
        $fields = $this->getFieldsData()['default'];
        
        $this->assertTrue($this->mockDeleteAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canCreateAShortcutPageRecord(): void
    {
        $fields = $this->getFieldsData()['shortcut'];

        $this->assertEquals(125, $this->mockInsertAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canEditAShortcutPageRecord(): void
    {
        $fields = $this->getFieldsData()['shortcut'];

        $this->assertTrue($this->mockUpdateAndFetchUid(self::TABLE, $fields, 126));
    }

    #[Test]
    public function canDeleteAShortcutPageRecord(): void
    {
        $fields = $this->getFieldsData()['shortcut'];
        
        $this->assertTrue($this->mockDeleteAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canCreateAFolderPageRecord(): void
    {
        $fields = $this->getFieldsData()['folder'];

        $this->assertEquals(127, $this->mockInsertAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canEditAFolderPageRecord(): void
    {
        $fields = $this->getFieldsData()['folder'];

        $this->assertTrue($this->mockUpdateAndFetchUid(self::TABLE, $fields, 128));
    }

    #[Test]
    public function canDeleteAFolderPageRecord(): void
    {
        $fields = $this->getFieldsData()['folder'];
        
        $this->assertTrue($this->mockDeleteAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canCreateALinkPageRecord(): void
    {
        $fields = $this->getFieldsData()['link'];

        $this->assertEquals(129, $this->mockInsertAndFetchUid(self::TABLE, $fields));
    }

    #[Test]
    public function canEditALinkPageRecord(): void
    {
        $fields = $this->getFieldsData()['link'];

        $this->assertTrue($this->mockUpdateAndFetchUid(self::TABLE, $fields, 130));
    }

    #[Test]
    public function canDeleteALinkPageRecord(): void
    {
        $fields = $this->getFieldsData()['link'];
        
        $this->assertTrue($this->mockDeleteAndFetchUid(self::TABLE, $fields));
    }
}
