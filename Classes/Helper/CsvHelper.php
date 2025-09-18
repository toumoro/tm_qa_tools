<?php

declare(strict_types=1);

namespace Toumoro\TmQaTools\Helper;

/**
 * Class CsvHelper
 */
class CsvHelper
{
    /**
     * Load CSV Content.
     *
     * @param string $file
     * @return array|false
     */
    public static function loadCsvContent(string $file): array|false
    {
        return CsvHelper::csvStringToAssocArray(file_get_contents($file));
    }

    /**
     * @param string $csv
     * @param string $delimiter
     *
     * @return array
     */
    public static function csvStringToAssocArray(string $csv, string $delimiter = ','): array
    {
        $result = [];
        $rows = static::getRows($csv, $delimiter);

        $fields = array_shift($rows);
        $fieldsNum = count($fields);

        foreach ($rows as $row) {
            $num = count($row);

            if ($num < $fieldsNum) {
                $row = array_merge($row, array_fill($num, $fieldsNum - $num, ''));
            }

            if ($num > $fieldsNum) {
                $fields = array_merge($fields, array_fill($fieldsNum, $num - $fieldsNum, ''));
                $fieldsNum = count($fields);
            }

            $result[] = array_combine($fields, $row);
        }

        return $result;
    }

    /**
     * @param string $content
     *
     * @param string $delimiter
     *
     * @return array
     */
    public static function getRows(string $content, string $delimiter = ','): array
    {
        $rows = [];

        $fp = fopen('php://memory', 'r+');
        fwrite($fp, trim($content));
        rewind($fp);

        while (($row = fgetcsv($fp, 0, $delimiter)) !== false) {
            foreach ($row as $n => $v) {
                $row[$n] = trim($v);
            }

            $rows[] = $row;
        }

        return $rows;
    }
}
