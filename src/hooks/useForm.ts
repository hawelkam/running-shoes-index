"use client";

import { useState, useCallback } from "react";

import {
  FieldValidationResult,
  ValidationResult,
  validateFields,
} from "@/utils/validation";

export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface FormState<T extends Record<string, unknown>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
  submitAttempted: boolean;
}

export interface FieldValidator<T = string> {
  (value: T): FieldValidationResult;
}

export type FormValidators<T extends Record<string, unknown>> = {
  [K in keyof T]?: FieldValidator<T[K]>;
};

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validators?: FormValidators<T>;
  onSubmit: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validators = {},
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>(() => ({
    fields: Object.keys(initialValues).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          value: initialValues[key as keyof T],
          touched: false,
        },
      }),
      {} as FormState<T>["fields"]
    ),
    isValid: false,
    isSubmitting: false,
    submitAttempted: false,
  }));

  const validateField = useCallback(
    <K extends keyof T>(fieldName: K, value: T[K]): FieldValidationResult => {
      const validator = validators[fieldName];
      if (!validator) {
        return { isValid: true };
      }
      return validator(value);
    },
    [validators]
  );

  const validateForm = useCallback((): ValidationResult => {
    const fieldValidations = Object.entries(formState.fields).map(
      ([fieldName, field]) => {
        const typedFieldName = fieldName as keyof T;
        const typedField = field as FormField<T[keyof T]>;
        return validateField(typedFieldName, typedField.value);
      }
    );

    return validateFields(fieldValidations);
  }, [formState.fields, validateField]);

  const updateField = useCallback(
    <K extends keyof T>(fieldName: K, value: T[K], touched = true) => {
      setFormState((prev) => {
        const validation = validateOnChange
          ? validateField(fieldName, value)
          : { isValid: true };

        const newFields = {
          ...prev.fields,
          [fieldName]: {
            value,
            error: validation.error,
            touched,
          },
        };

        // Update form validity
        const formValidation = validateFields(
          Object.entries(newFields).map(([key, field]) => {
            if (field.error) {
              return { isValid: false, error: field.error };
            }
            return validateField(key as keyof T, field.value);
          })
        );

        return {
          ...prev,
          fields: newFields,
          isValid: formValidation.isValid,
        };
      });
    },
    [validateField, validateOnChange]
  );

  const touchField = useCallback(
    <K extends keyof T>(fieldName: K) => {
      setFormState((prev) => {
        const field = prev.fields[fieldName];
        if (field.touched) return prev;

        const validation = validateOnBlur
          ? validateField(fieldName, field.value)
          : { isValid: true };

        return {
          ...prev,
          fields: {
            ...prev.fields,
            [fieldName]: {
              ...field,
              touched: true,
              error: validation.error,
            },
          },
        };
      });
    },
    [validateField, validateOnBlur]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      setFormState((prev) => ({
        ...prev,
        submitAttempted: true,
        isSubmitting: true,
      }));

      // Validate entire form
      const formValidation = validateForm();

      if (!formValidation.isValid) {
        // Mark all fields as touched to show errors
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          fields: Object.keys(prev.fields).reduce(
            (acc, key) => ({
              ...acc,
              [key]: {
                ...prev.fields[key as keyof T],
                touched: true,
                error: validateField(
                  key as keyof T,
                  prev.fields[key as keyof T].value
                ).error,
              },
            }),
            {} as FormState<T>["fields"]
          ),
        }));
        return;
      }

      try {
        const values = Object.keys(formState.fields).reduce(
          (acc, key) => ({
            ...acc,
            [key]: formState.fields[key as keyof T].value,
          }),
          {} as T
        );

        await onSubmit(values);

        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      } catch (error) {
        console.error("Form submission error:", error);
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
        throw error;
      }
    },
    [formState.fields, validateForm, validateField, onSubmit]
  );

  const resetForm = useCallback(() => {
    setFormState({
      fields: Object.keys(initialValues).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            value: initialValues[key as keyof T],
            touched: false,
          },
        }),
        {} as FormState<T>["fields"]
      ),
      isValid: false,
      isSubmitting: false,
      submitAttempted: false,
    });
  }, [initialValues]);

  const getFieldProps = useCallback(
    <K extends keyof T>(fieldName: K) => {
      const field = formState.fields[fieldName];
      return {
        value: field.value,
        onChange: (value: T[K]) => updateField(fieldName, value),
        onBlur: () => touchField(fieldName),
        error: field.touched ? field.error : undefined,
        hasError: field.touched && !!field.error,
      };
    },
    [formState.fields, updateField, touchField]
  );

  return {
    values: Object.keys(formState.fields).reduce(
      (acc, key) => ({
        ...acc,
        [key]: formState.fields[key as keyof T].value,
      }),
      {} as T
    ),
    errors: Object.keys(formState.fields).reduce(
      (acc, key) => ({
        ...acc,
        [key]: formState.fields[key as keyof T].error,
      }),
      {} as { [K in keyof T]?: string }
    ),
    touched: Object.keys(formState.fields).reduce(
      (acc, key) => ({
        ...acc,
        [key]: formState.fields[key as keyof T].touched,
      }),
      {} as { [K in keyof T]: boolean }
    ),
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
    submitAttempted: formState.submitAttempted,
    updateField,
    touchField,
    handleSubmit,
    resetForm,
    getFieldProps,
    validateForm,
  };
}
