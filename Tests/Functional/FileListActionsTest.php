<?php

namespace Toumoro\TmQaTools\Tests\Functional;

use PHPUnit\Framework\Attributes\Test;
use Toumoro\TmQaTools\Utility\ConfigurationUtility;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Resource\File;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Resource\StorageRepository;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class FileListActionsTest extends BaseFunctionalTestCase
{
    private const DEFAULT_FIXTURES_PATH =  __DIR__ . '/Fixtures/Files/dummy.txt';

    protected ResourceFactory $resourceFactory;

    protected string $fixtures;

    protected array $coreExtensionsToLoad = [
        'filelist',
        'filemetadata',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->resourceFactory = GeneralUtility::makeInstance(ResourceFactory::class);

        try {
            /** @var ConfigurationUtility $configurationUtility */
            $fixtures = ConfigurationUtility::getCustomFixturesPath();
        } catch (\Exception $e) {
            $fixtures = self::DEFAULT_FIXTURES_PATH;
        }

        $this->fixtures = $fixtures;
    }

    #[Test]
    public function canAddFile(): void
    {
        /** @var File $file */
        $file = $this->makeTmpFile();

        self::assertInstanceOf(File::class, $file);
        self::assertEquals('dummy.txt', $file->getName());
    }

    #[Test]
    public function canEditFileContents(): void
    {
        /** @var File $file */
        $file = $this->makeTmpFile();

        $absolutePath = $file->getForLocalProcessing();
        file_put_contents($absolutePath, 'Contenu édité');
        $file->setContents(file_get_contents($absolutePath));

        self::assertStringContainsString('Contenu édité', $file->getContents());
    }

    #[Test]
    public function canDeleteFile(): void
    {
        $storage = GeneralUtility::makeInstance(StorageRepository::class)->findByUid(1);

        /** @var File $file */
        $file = $this->makeTmpFile();

        $identifier = $file->getIdentifier();
        $storage->deleteFile($file);

        self::assertFalse($storage->hasFile($identifier));
    }

    #[Test]
    public function canEditFileMetadata(): void
    {
        /** @var File $origFile */
        $origFile = $this->makeTmpFile();
        $meta = $origFile->getMetaData();

        $meta['title'] = 'Titre du fichier';

        $connection = GeneralUtility::makeInstance(ConnectionPool::class)
          ->getConnectionForTable('sys_file_metadata');

        $connection->update(
            'sys_file_metadata',
            ['title' => $meta['title']],
            ['file' => (int)$origFile->getUid()]
        );

        $storage = GeneralUtility::makeInstance(StorageRepository::class)->findByUid(1);
        $storageUid = $storage->getUid();
        $fileIdentifier = $origFile->getIdentifier();

        $file = $this->resourceFactory->getFileObjectByStorageAndIdentifier($storageUid, $fileIdentifier);
        $meta = $file->getMetaData();

        self::assertEquals('Titre du fichier', $meta['title']);
    }

    /**
     * Create a temporary file.
     *
     * @return File
     */
    protected function makeTmpFile(): File
    {
        $storage = GeneralUtility::makeInstance(StorageRepository::class)->findByUid(1);

        $fileName = basename($this->fixtures);
        $tmpDir = __DIR__ . '/Fixtures/Files/tmp';
        $tempFilePath = $tmpDir . '/' . $fileName;

        if (!is_dir($tmpDir)) {
            mkdir($tmpDir, 0777, true);
        }

        copy($this->fixtures, $tempFilePath);

        $file = $storage->addFile(
            $tempFilePath,
            $storage->getRootLevelFolder(),
            $fileName
        );

        return $file;
    }
}
