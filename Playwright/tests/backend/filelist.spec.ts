import { test } from '@playwright/test';
import { 
  runFileDeleteTest,
  runFileDownloadTest,
  runFileEditMetadataTest,
  runFileUploadTest, 
} from './helpers/filelist';

test.describe('manage filelist module', () => {

  runFileUploadTest();
  runFileDownloadTest();
  runFileEditMetadataTest();
  runFileDeleteTest();
  
});
