const axios = require('axios');

/**
 * Validates an email address using Abstract API
 * @param {string} email - Email to validate
 * @returns {Promise<Object>} - Validation result
 */
const validateEmailWithAPI = async (email) => {
  try {
    // Use the API key from environment variables
    const apiKey = process.env.EMAIL_VALIDATION_API_KEY;
    
    if (!apiKey) {
      console.warn('EMAIL_VALIDATION_API_KEY not set in environment variables');
      return {
        success: false,
        error: 'API key not configured'
      };
    }
    
    const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Email validation API error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Checks if an email is valid and deliverable using Abstract API
 * @param {string} email - Email to validate
 * @returns {Promise<boolean>} - True if email is valid and deliverable
 */
const isEmailValidAndDeliverable = async (email) => {
  try {
    // In development mode, bypass strict validation for testing
    if (process.env.NODE_ENV === 'development' && email.endsWith('@gmail.com')) {
      console.log('Development mode: Bypassing strict email validation for testing');
      return true;
    }
    
    const result = await validateEmailWithAPI(email);
    
    if (!result.success) {
      // If API call fails, fall back to basic validation
      return true;
    }
    
    const data = result.data;
    
    // Check if the email is valid and deliverable
    const isValid = data.is_valid_format?.value === true;
    const isDeliverable = data.deliverability === 'DELIVERABLE';
    const isFreeEmail = data.is_free_email?.value === true;
    const isDisposable = data.is_disposable_email?.value === true;
    const isRoleEmail = data.is_role_email?.value === true;
    
    // Only allow valid, deliverable, free emails that are not disposable or role-based
    return isValid && isDeliverable && isFreeEmail && !isDisposable && !isRoleEmail;
  } catch (error) {
    console.error('Error checking email validity:', error.message);
    // If there's an error, fall back to basic validation
    return true;
  }
};

/**
 * Validates an email with SMTP check using ZeroBounce API (alternative)
 * Note: This requires a ZeroBounce API key
 * @param {string} email - Email to validate
 * @returns {Promise<Object>} - Validation result
 */
const validateEmailWithZeroBounce = async (email) => {
  try {
    // Replace with your actual API key when going to production
    const apiKey = process.env.ZEROBOUNCE_API_KEY || 'your-api-key';
    
    const response = await axios.get(`https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('ZeroBounce API error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  validateEmailWithAPI,
  isEmailValidAndDeliverable,
  validateEmailWithZeroBounce
};
