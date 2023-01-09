export const isEmpty = (value: any) => {
    if (!value) return true;
    return false;
  }
  
  export const isEmail = (email: any) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email);
  }
  
  export const isValidPassword = (password: any) => {
    if (password.length >= 4) return true;
    return false;
  }
  
  export const isMatch = (password: any, cfPassword: any) => {
    return password == cfPassword;
  }