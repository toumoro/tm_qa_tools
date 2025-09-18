import { FrameLocator, Locator, Page } from '@playwright/test';
import { config } from '../../../project.config';

const {
  typo3: { errors }
} = config;

/**
 * Represents a TYPO3 backend notification message.
 *
 * @property {number} severity
 * @property {string} severityLabel
 * @property {string} message
 * @property {() => number} getSeverity
 * @property {() => string} toString
 */
type Notification = {
  severity: number;
  severityLabel: string;
  message: string;
  getSeverity: () => number;
  toString: () => string;
};

/**
 * Retrieves a TYPO3 backend notification from the page.
 *
 * @param {Page} page
 * @param {FrameLocator} frameLocator
 * @returns {Promise<Notification>}
 */
export async function getNotification(
  page: Page,
  notificationType: 'popup' | 'alert' | 'modal',
  frameLocator?: FrameLocator
): Promise<Notification> {

  let notification: Locator;
  let message: string | null = null;
  let severityAttr: string | null = null;

  const notificationConfig = errors.types[notificationType];

  if (!notificationConfig) {
    throw new Error(`Unknown notification type: ${notificationType}`);
  }

  switch (notificationType) {
    case 'popup':
      notification = page.locator(notificationConfig.selector).first();

      if (!await notification.isVisible()) {
        break;
      }

      severityAttr = await notification.getAttribute(notificationConfig.severity);
      message = await notification.getAttribute(notificationConfig.message);
      break;
    case 'modal': {
      notification = page.locator(notificationConfig.selector).first();

      if (!await notification.isVisible()) {
        break;
      }

      const modal = notification.locator('..').locator('..');
      severityAttr = await modal.getAttribute(notificationConfig.severity);
      message = await modal.getAttribute(notificationConfig.message);
      break;
    }
    case 'alert':

      if (!frameLocator) {
        throw new Error('frameLocator is required for alert notifications');
      }

      notification = frameLocator.locator(notificationConfig.selector).first();

      if (!await notification.isVisible()) {
        break;
      }
        
      message = await notification.innerText();
      break;
  }

  const severity = severityAttr ? parseInt(severityAttr, 10) : 0;
  const severityLabel = getSeverityLabel(severity);

  if(!message) {
    if(severity > 0) message = '[ERROR] An unexpected error occurred.';
    else message = '[SUCCESS] Test completed successfully.';
  }

  return {
    severity,
    severityLabel,
    message,
    getSeverity: () => severity,
    toString: () => `${severityLabel} ${message}`,
  };
}

/**
 * Converts a numeric TYPO3 severity level into a human-readable label.
 *
 * @param {number} severity
 * @returns {string}
 */
const getSeverityLabel = (severity: number): string => {
  switch (severity) {
    case 1:
      return '[WARNING]';
    case 2:
      return '[ERROR]';
    case 3:
      return '[INFO]';
    default:
      return '[SUCCESS]';
  }
};

/**
 * Checks for a notification and throws an error if severity > 0.
 * Logs the notification message otherwise.
 * 
 * @param page Playwright Page instance
 */
export async function notify(
  page: Page,
  type: 'popup' | 'alert' | 'modal',
  frameLocator?: FrameLocator
) {
  const notification = await getNotification(page, type, frameLocator);

  // Throw if severity is greater than 0
  if (notification.getSeverity() > 0) {
    throw new Error(notification.message);
  }

  console.log(notification.message);
}