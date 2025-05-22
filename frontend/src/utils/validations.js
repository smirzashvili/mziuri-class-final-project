export const validateFullName = (value) => {
  if (!value) {
    return 'Full name is required';
  }
};

export const validateEmail = (value) => {
  if (!value) {
    return 'Email is required';
  } else if (!value.includes('@') || !value.includes('.')) {
    return 'Email is invalid';
  }
};

export const validatePassword = (value) => {
  if (!value) {
    return 'Password is required';
  } else if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
};

export const validateConfirmPassword = (passwordValue, confirmPasswordValue) => {
  if (!passwordValue || !confirmPasswordValue) {
    return 'Confirm Password is required';
  } else if (passwordValue !== confirmPasswordValue) {
    return 'Password and Confirm Password are different';
  }
};

export const validateSelect = (value, inputFieldName) => {
  if (!value || value === '') {
    return `${inputFieldName} is required`;
  }
};

export const validateDate = (value) => {
  if (!value || value === '') {
    return 'Date is required';
  } else if(typeof(parseInt(value)) === "string" || parseInt(value).toString() === "NaN") {
    return 'Enter Valid Age';
  } else if(Number(value) < 18) {
    return "You must be 18 years old or older"
  }
};

export const validateCheckbox = (value) => {
  if (!value) {
    return 'You must accept terms and conditions';
  }
};

export const validateMedias = (arr) => {
  //check each file format
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      if (file && !(file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        return `Unsupported file format at slot ${i + 1}`;
      }
    }
  }

  //for length
  const filteredArr = arr?.filter((item) => item !== null);

  if (!arr || filteredArr?.length < 2) {
    return 'You must upload 2 or more videos/photos';
  }
};

export const validateSubject = (value) => {
  if (!value || value === '') {
    return 'Subject is required';
  }
};

export const validateMessage = (value) => {
  if (!value || value === '') {
    return 'Message is required';
  } else if (value.length < 4) {
    return 'Message must contain at least 4 characters';
  }
};
