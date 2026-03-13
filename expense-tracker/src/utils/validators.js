// src/utils/validators.js
export function validateExpense(form) {
  const errors = {};
  if (!form.title?.trim()) errors.title = 'Title is required';
  if (!form.amount || parseFloat(form.amount) <= 0) errors.amount = 'Amount must be greater than 0';
  if (!form.date) errors.date = 'Date is required';
  if (!form.category) errors.category = 'Category is required';
  if (!form.paymentMode) errors.paymentMode = 'Payment mode is required';
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateUser(form) {
  const errors = {};
  if (!form.name?.trim()) errors.name = 'Name is required';
  if (!form.email?.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
  if (!form.password || form.password.length < 4) errors.password = 'Password must be at least 4 characters';
  if (form.confirmPassword !== undefined && form.password !== form.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  return { isValid: Object.keys(errors).length === 0, errors };
}
