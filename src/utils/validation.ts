/**
 * Validation utilities with strict TypeScript types
 */

import { VALIDATION_RULES } from "@/constants";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an email address
 */
export function validateEmail(email: string): FieldValidationResult {
  if (!email.trim()) {
    return { isValid: false, error: "Email is required" };
  }

  if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
    return { isValid: false, error: "Email is too long" };
  }

  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
}

/**
 * Validates a password
 */
export function validatePassword(password: string): FieldValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
    };
  }

  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return { isValid: false, error: "Password is too long" };
  }

  return { isValid: true };
}

/**
 * Validates a shoe name
 */
export function validateShoeName(name: string): FieldValidationResult {
  if (!name.trim()) {
    return { isValid: false, error: "Shoe name is required" };
  }

  if (name.length < VALIDATION_RULES.SHOE_NAME.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Shoe name must be at least ${VALIDATION_RULES.SHOE_NAME.MIN_LENGTH} characters`,
    };
  }

  if (name.length > VALIDATION_RULES.SHOE_NAME.MAX_LENGTH) {
    return { isValid: false, error: "Shoe name is too long" };
  }

  return { isValid: true };
}

/**
 * Validates review content
 */
export function validateReviewContent(content: string): FieldValidationResult {
  if (!content.trim()) {
    return { isValid: false, error: "Review content is required" };
  }

  if (content.length < VALIDATION_RULES.REVIEW_CONTENT.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Review must be at least ${VALIDATION_RULES.REVIEW_CONTENT.MIN_LENGTH} characters`,
    };
  }

  if (content.length > VALIDATION_RULES.REVIEW_CONTENT.MAX_LENGTH) {
    return { isValid: false, error: "Review content is too long" };
  }

  return { isValid: true };
}

/**
 * Validates required fields
 */
export function validateRequired(
  value: unknown,
  fieldName: string
): FieldValidationResult {
  if (value === null || value === undefined || value === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
}

/**
 * Validates string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): FieldValidationResult {
  if (value.length < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters`,
    };
  }

  if (value.length > max) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${max} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validates multiple fields and returns combined result
 */
export function validateFields(
  validations: FieldValidationResult[]
): ValidationResult {
  const errors = validations
    .filter((validation) => !validation.isValid)
    .map((validation) => validation.error!)
    .filter(Boolean);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes HTML input to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates and sanitizes form input
 */
export function validateAndSanitize(
  value: string,
  validator: (value: string) => FieldValidationResult
): { isValid: boolean; error?: string; sanitizedValue?: string } {
  const validation = validator(value);

  if (!validation.isValid) {
    return validation;
  }

  return {
    isValid: true,
    sanitizedValue: sanitizeHtml(value.trim()),
  };
}
