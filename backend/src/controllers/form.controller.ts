/**
 * Form Controller
 * Handles HTTP requests for form validation
 * POST /api/validate - Form validation
 */

import { Elysia, t } from 'elysia';
import { submitFormService } from '../services';
import { isValidEmail } from '../utils/helpers';
import { config } from '../config';

// Validation schema with detailed error messages
const FormSchema = t.Object({
  name: t.String(),
  email: t.String(),
  role: t.String(),
});

export const formController = new Elysia({ prefix: '/api' })
  /**
   * Form validation endpoint
   * POST /api/validate
   */
  .post(
    '/validate',
    ({ body, set }) => {
      const errors: Record<string, string> = {};

      // Validate name
      if (!body.name || body.name.trim().length < config.validation.minNameLength) {
        errors.name = `Name must be at least ${config.validation.minNameLength} characters`;
      }

      // Validate email
      if (!body.email || !isValidEmail(body.email)) {
        errors.email = 'Valid email is required';
      }

      // Validate role
      const validRoles = config.validation.validRoles;
      if (!body.role || !validRoles.includes(body.role as typeof validRoles[number])) {
        errors.role = `Role must be one of: ${validRoles.join(', ')}`;
      }

      // Return validation errors if any
      if (Object.keys(errors).length > 0) {
        set.status = 400;
        return {
          success: false,
          errors,
        };
      }

      // Process the validated form
      const result = submitFormService.execute({
        name: body.name,
        email: body.email,
        role: body.role as 'User' | 'Manager' | 'Admin',
      });

      return {
        success: true,
        message: 'Form validated and submitted successfully',
        data: result.data,
        submittedAt: result.submittedAt,
      };
    },
    {
      body: FormSchema,
    }
  );
