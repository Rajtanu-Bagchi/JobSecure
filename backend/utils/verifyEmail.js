const dns = require('dns');
const { promisify } = require('util');

const resolveMx = promisify(dns.resolveMx);

/**
 * Performs comprehensive validation of an email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
const isValidEmail = (email) => {
  // Basic format validation
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicRegex.test(email)) {
    return false;
  }

  // More comprehensive validation
  const strictRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(gmail\.com|protonmail\.com)$/;
  if (!strictRegex.test(email)) {
    return false;
  }

  // Check for common invalid patterns
  const invalidPatterns = [
    /^(admin|info|support|contact|test|fake|noreply)@/i,
    /^[a-z]{1,2}@/i,  // Very short local parts are often fake
    /^[0-9]+@/,       // Only numbers in local part
    /^[a-z]+[0-9]{4,}@/i  // Simple name followed by many numbers
  ];

  if (invalidPatterns.some(pattern => pattern.test(email))) {
    return false;
  }

  // Check username part length (Gmail requires at least 6 characters)
  const username = email.split('@')[0];
  if (email.includes('@gmail.com') && username.length < 6) {
    return false;
  }

  // Check for repeating characters (likely fake)
  const repeatingChars = /(.)\1{4,}/;  // Same character repeated 5+ times
  if (repeatingChars.test(username)) {
    return false;
  }

  return true;
};

/**
 * Verifies if an email domain exists by checking MX records
 * @param {string} email - Email to verify
 * @returns {Promise<boolean>} - True if domain exists, false otherwise
 */
const verifyEmailDomain = async (email) => {
  try {
    // First check if email format is valid
    if (!isValidEmail(email)) {
      return false;
    }
    
    const domain = email.split('@')[1];
    
    // Only allow Gmail and ProtonMail domains
    if (!['gmail.com', 'protonmail.com'].includes(domain)) {
      return false;
    }
    
    // Check if domain has valid MX records
    const mxRecords = await resolveMx(domain);
    return Array.isArray(mxRecords) && mxRecords.length > 0;
  } catch (error) {
    // If DNS lookup fails, domain likely doesn't exist
    return false;
  }
};

/**
 * Checks if email appears to be from a temporary email service
 * @param {string} email - Email to check
 * @returns {boolean} - True if email appears to be temporary
 */
const isTemporaryEmail = (email) => {
  const domain = email.split('@')[1];
  
  // List of common temporary email domains
  const temporaryDomains = [
    'tempmail.com', 'temp-mail.org', 'guerrillamail.com', 
    'mailinator.com', '10minutemail.com', 'yopmail.com',
    'throwawaymail.com', 'getairmail.com', 'dispostable.com'
  ];
  
  return temporaryDomains.includes(domain);
};

module.exports = {
  isValidEmail,
  verifyEmailDomain,
  isTemporaryEmail
};
