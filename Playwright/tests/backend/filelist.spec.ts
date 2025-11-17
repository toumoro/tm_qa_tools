import { test } from '@playwright/test';
import {
  runFileDeleteTest,
  runFileDownloadTest,
  runFileEditMetadataTest,
  runFileUploadTest,
} from './helpers/filelist';

test.describe('manage filelist module', {
  annotation: {
    type: 'category',
    description: 'Backend',
  },
}, () => {
  runFileUploadTest();
  runFileDownloadTest();
  runFileEditMetadataTest();
  runFileDeleteTest();
});
