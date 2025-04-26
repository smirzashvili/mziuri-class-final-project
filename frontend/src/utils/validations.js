export const validateFullName = (value) => {
    if (!value) {
        return 'Full name is required';
    } else if (!value.includes(' ')) {
        return 'Full name must contain at least one space';
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
  
export const validateConfirmPassword = (value) => {
    if (!value) {
        return 'Password is required';
    } else if (value.length < 8) {
        return 'Password must be at least 8 characters';
    }
};

export const validateSelect = (value) => {
    if (!value || value === '') {
        return 'This field is required';
    }
};

export const validateCheckbox = (value) => {
    if (!value) {
        return 'You must accept terms and conditions';
    }
};

export const validateMedias = (arr) => {
    //check each file format
    if(arr) {
        for (let i = 0; i < arr.length; i++) {
            const file = arr[i];
            if (file && !(file.type.startsWith('image/') || file.type.startsWith('video/'))) {
                return `Unsupported file format at slot ${i + 1}`;
            }
        }
    }

    //for length
    let filteredArr = arr?.filter(item => item !== null)
    
    if (!arr || filteredArr?.length < 2) {
        return 'You must upload 2 or more videos/photos';
    }
};

export const validateSingleMedia = (file, index) => {
    if(!file) {
        return 'Unexpected error occured';
    }

    if(!(file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        return `Unsupported file format at slot ${index + 1}`;
    }
};