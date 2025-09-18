<?php

namespace Toumoro\TmQaTools\Tests\Functional;

use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

class BaseFunctionalTestCase extends FunctionalTestCase
{
    protected $databaseUtility;

    /**
     * Inserts a record into the database (mocked) and fetches it back.
     *
     * This helper is used in tests to simulate inserting a record and then
     * retrieving it by UID, returning the UID of the fetched record.
     *
     * @param array $fields The record data to insert. Must contain a 'uid' field.
     *
     * @return int The UID of the fetched record.
     */
    protected function mockInsertAndFetchUid(string $table, array $fields): int
    {
        $this->databaseUtility->expects($this->once())
            ->method('insertRecord')
            ->with($table, $fields)
            ->willReturn((int)$fields['uid']);

        $this->databaseUtility->expects($this->once())
            ->method('getRecord')
            ->with($table, $fields['uid'])
            ->willReturn(['uid' => $fields['uid']]);

        $uid = $this->databaseUtility->insertRecord($table, $fields);
        $record = $this->databaseUtility->getRecord($table, $uid);

        return $record['uid'];
    }

    /**
     * Mocks updating a record in the database and fetching it back.
     *
     * This helper is used in tests to simulate retrieving a record by UID,
     * updating it with new data, and returning the result of the update call.
     *
     * @param array $fields The original record data. Must contain a 'uid' field.
     *
     * @return bool True if the update was successful, false otherwise.
     */
    protected function mockUpdateAndFetchUid(string $table, array $fields, int $newUid): bool
    {
        $this->databaseUtility->expects($this->once())
            ->method('getRecord')
            ->with($table, $fields['uid'])
            ->willReturn(['uid' => $fields['uid']]);

        $this->databaseUtility->expects($this->once())
            ->method('updateRecord')
            ->with($table, $fields['uid'], ['uid' => $newUid])
            ->willReturn(true);

        $record = $this->databaseUtility->getRecord($table, $fields['uid']);
        $result = $this->databaseUtility->updateRecord($table, $record['uid'], ['uid' => $newUid]);

        return $result;
    }

    /**
     * Mocks deleting a record in the database after fetching it.
     *
     * This helper is used in tests to simulate retrieving a record by UID,
     * deleting it from the database, and returning the result of the delete call.
     *
     * @param array $fields The original record data. Must contain a 'uid' field.
     *
     * @return bool True if the deletion was successful, false otherwise.
     */
    protected function mockDeleteAndFetchUid(string $table, array $fields): bool
    {
        $this->databaseUtility->expects($this->once())
            ->method('getRecord')
            ->with($table, $fields['uid'])
            ->willReturn(['uid' => $fields['uid']]);

        $this->databaseUtility->expects($this->once())
            ->method('deleteRecord')
            ->with($table, $fields['uid'])
            ->willReturn(true);

        $record = $this->databaseUtility->getRecord($table, $fields['uid']);
        $result = $this->databaseUtility->deleteRecord($table, $record['uid']);

        return $result;
    }
}