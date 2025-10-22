<?php

declare(strict_types=1);

namespace Toumoro\TmQaTools\Utility;

use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * Class DatabaseUtility
 */
class DatabaseUtility
{
    /**
     * Insert Record in the database.
     *
     * @param array $data
     * @return int
     */
    public function insertRecord(string $tableName, array $data): int
    {
        $connexion = self::getConnection($tableName);
        $connexion->insert($tableName, $data);

        return (int)$connexion->lastInsertId();
    }

    /**
     * Update Record in the database.
     *
     * @param int $uid
     * @param array $data
     * @return bool
     */
    public function updateRecord(string $tableName, int $uid, array $data): bool
    {
        $connexion = self::getConnection($tableName);
        $affectedRows = $connexion->update($tableName, $data, ['uid' => $uid]);
        return $affectedRows > 0;
    }

    /**
     * Delete Record from the database.
     *
     * @param int $uid
     * @return bool
     */
    public function deleteRecord(string $tableName, int $uid): bool
    {
        $connexion = self::getConnection($tableName);
        $affectedRows = $connexion->delete($tableName, ['uid' => $uid]);
        return $affectedRows > 0;
    }

    /**
     * Get Record from the database.
     *
     * @param int $uid
     * @param array $fields
     * @return array|false
     */
    public function getRecord(string $tableName, int $uid, array $fields = ['uid']): array|false
    {
        $connexion = self::getConnection($tableName);
        return $connexion->select($fields, $tableName, ['uid' => $uid])->fetchAssociative();
    }

    /**
     * Get conntection for table.
     *
     * @param string $tableName
     * @return Connection
     */
    public static function getConnection(string $tableName): Connection
    {
        return GeneralUtility::makeInstance(ConnectionPool::class)
            ->getConnectionForTable($tableName);
    }
}
