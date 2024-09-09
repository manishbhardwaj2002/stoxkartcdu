export const isValidNominee = (nomineeData) => {
  console.log(nomineeData);
  const validationField = {
    FirstName: "First Name",
    Relation: "Relation",
    DOB: "DOB",
    Email: "Email",
    Mobile: "Mobile",
    Address1: "Address1",
    Country: "Country",
    PinCode: "Pin Code",
    City: "City",
    State: "State",
    ProofType: "Proof Type",
    ProofNumber: "Proof Number",
  };

  const nomineeValidationField = {
    ...validationField,
    SharePercentage: "Share Percentage",
  };

  for (const key in nomineeValidationField) {
    if (nomineeData[key].length === 0) {
      console.log(`key ${nomineeValidationField[key]} got failed`);
      return [false, `${nomineeValidationField[key]} cannot be empty!`];
    }
  }
  const isValidMobileNo = (num) => /^[0-9]{10}$/.test(num);
  const isValidPinCode = (pcode) => /^[0-9]{6}$/.test(pcode);
  const isValidEmail = (email) =>
    /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,3})$/.test(
      email
    );
  const isLettersOnly = (val) => /^[a-zA-Z]*$/.test(val);
  const notAllowOnlySpace = (val) => /^[^\s]+(\s+[^\s]+)*$/.test(val);
  const checkPan = (val) => /(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/.test(val);
  const checkAadhar = (val) => /^[0-9]{4}$/.test(val);

  if (!isLettersOnly(nomineeData.FirstName)) {
    return [false, "Please Enter a valid First Name"];
  }
  // if(nomineeData.Relation === ''){
  //   return [false, "Relation cannot be empty"];
  // }
  if (nomineeData.Relation === "Select option") {
    return [false, "Please choose a relation"];
  }
  if (!isLettersOnly(nomineeData.MiddleName)) {
    return [false, "Please Enter a valid Middle Name"];
  }
  if (!isLettersOnly(nomineeData.LastName)) {
    return [false, "Please Enter a valid Last Name"];
  }
  if (!isValidEmail(nomineeData.Email)) {
    return [false, "Please Enter a valid email address"];
  }
  if (!isValidMobileNo(nomineeData.Mobile)) {
    return [false, "Please Enter a valid Mobile Number"];
  }
  if (!notAllowOnlySpace(nomineeData.Address1)) {
    return [false, "Please Enter a valid Address Line 1"];
  }
  if (nomineeData.Address2) {
    if (!notAllowOnlySpace(nomineeData.Address2)) {
      return [false, "Please Enter a valid Address Line 2"];
    }
  }
  if (nomineeData.Address3) {
    if (!notAllowOnlySpace(nomineeData.Address3)) {
      return [false, "Please Enter a valid Address Line 3"];
    }
  }
  if (!notAllowOnlySpace(nomineeData.Country)) {
    return [false, "Please Enter a valid Country"];
  }
  if (!notAllowOnlySpace(nomineeData.City)) {
    return [false, "Please Enter a valid City"];
  }
  if (!notAllowOnlySpace(nomineeData.State)) {
    return [false, "Please Enter a valid State"];
  }
  if (!isValidPinCode(nomineeData.PinCode)) {
    return [false, "Enter a valid pincode"];
  }
  if (!/^[A-Za-z0-9]+$/.test(nomineeData.ProofNumber)) {
    return [false, "Please Enter a valid Proof Number"];
  }
  if (!nomineeData.ProofDocument && !nomineeData.ProofPath) {
    return [false, "Please upload proof document"];
  }
  if (nomineeData.ProofType === "Pan") {
    if (nomineeData.ProofNumber.length !== 10) {
      return [false, "Please Enter a valid Pan Number"];
    }
    if (!checkPan(nomineeData.ProofNumber)) {
      return [false, "Please Enter a valid Pan Number"];
    }
  }
  if (nomineeData.ProofType === "Aadhaar") {
    if (!checkAadhar(nomineeData.ProofNumber)) {
      return [false, "Please Enter last 4 digits of Aadhaar Number"];
    }
  }

  if (nomineeData.IsNomineeMinor) {
    for (const key in validationField) {
      if (nomineeData.GuardianDetails[key].length === 0) {
        return [false, `Guardian ${validationField[key]} cannot be empty!`];
      }
    }
    if (
      !nomineeData.GuardianDetails.ProofDocument &&
      !nomineeData.GuardianDetails.ProofPath
    ) {
      return [false, "Please upload Guardian Proof document"];
    }

    if (!isLettersOnly(nomineeData.GuardianDetails.FirstName)) {
      return [false, "Please Enter a valid Guardian First Name"];
    }
    if (!isLettersOnly(nomineeData.GuardianDetails.MiddleName)) {
      return [false, "Please Enter a valid Guardian Middle Name"];
    }
    if (!isLettersOnly(nomineeData.GuardianDetails.LastName)) {
      return [false, "Please Enter a valid Guardian Last Name"];
    }
    if (!isValidEmail(nomineeData.GuardianDetails.Email)) {
      return [false, "Please Enter a valid Guardian Email Address"];
    }

    if (!isValidMobileNo(nomineeData.GuardianDetails.Mobile)) {
      return [false, "Please Enter a valid Guardian Mobile Number"];
    }
    if (!notAllowOnlySpace(nomineeData.GuardianDetails.Address1)) {
      return [false, "Please Enter a valid Guardian Address Line 1"];
    }
    if (nomineeData.GuardianDetails.Address2) {
      if (!notAllowOnlySpace(nomineeData.GuardianDetails.Address2)) {
        return [false, "Please Enter a valid Guardian Address Line 2"];
      }
    }
    if (nomineeData.GuardianDetails.Address3) {
      if (!notAllowOnlySpace(nomineeData.GuardianDetails.Address3)) {
        return [false, "Please Enter a valid Guardian Address Line 3"];
      }
    }
    if (!notAllowOnlySpace(nomineeData.GuardianDetails.Country)) {
      return [false, "Please Enter a valid Guardian Country"];
    }
    if (!notAllowOnlySpace(nomineeData.GuardianDetails.City)) {
      return [false, "Please Enter a valid Guardian City"];
    }
    if (!notAllowOnlySpace(nomineeData.GuardianDetails.State)) {
      return [false, "Please Enter a valid Guardian State"];
    }
    if (!/^[A-Za-z0-9]+$/.test(nomineeData.GuardianDetails.ProofNumber)) {
      return [false, "Please Enter a valid Guardian Proof Number"];
    }
    if (nomineeData.GuardianDetails.ProofType === "Pan") {
      if (nomineeData.GuardianDetails.ProofNumber.length !== 10) {
        return [false, "Please Enter a valid Pan Number"];
      }
      if (!checkPan(nomineeData.GuardianDetails.ProofNumber)) {
        return [false, "Please Enter a valid Pan Number"];
      }
    }
    if (nomineeData.GuardianDetails.ProofType === "Aadhaar") {
      if (!checkAadhar(nomineeData.GuardianDetails.ProofNumber)) {
        return [false, "Please Enter last 4 digits of Gaurdian Aadhaar Number"];
      }
    }
    if (!isValidPinCode(nomineeData.GuardianDetails.PinCode)) {
      return [false, "Enter a valid Guardian Pincode"];
    }
    if (nomineeData.GuardianDetails.ProofNumber === nomineeData.ProofNumber) {
      return [false, "Nominee and Gauradian ID Proof Number cannot be same"];
    }
  }

  return [true, "validation success"];
};
