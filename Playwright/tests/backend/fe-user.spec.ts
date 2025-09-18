import test from '@playwright/test';
import { runFEUserTests } from './helpers/fe-user-test';

test.describe('creation and management of group users and frontend users', () => {
  runFEUserTests();
});
