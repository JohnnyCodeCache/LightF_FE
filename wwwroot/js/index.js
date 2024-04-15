'use strict';

// Specify the URL of the JSON endpoint to get supervisors
const urlToGetSupervisors = 'https://localhost:32774/api/supervisors';

const urlToSubmitData = 'https://localhost:32774/api/submit';


// free test api to make sure client works
//const urlToGetSupervisors = 'https://catfact.ninja/fact';

const errMessages = {
    "errFirstName": "First Name cannot be blank.",
    "errLastName": "Last Name cannot be blank.",
    "errEmail": "When box is checked, email cannot be blank.",
    "errEmailNotValid": "Email is not valid.",
    "errPhoneNumber": "When box is checked, phone must be 212-555-4444 format",
    "errPhoneNumberNotValid": "Phone Number must be 212-555-4444 format.",
    "errSupervisor": "You must select a supervisor.",
    "errSupervisorFetch": "Error loading supervisors.",
    "errSubmittingData": "Error submitting data."
}


//////////////////////////////////////////////////////////////
//
// Run on Document Load

document.addEventListener('DOMContentLoaded', function () {

    ClearErrMsg();

    // get data from API
    fetchData()
        .then(data => {
            // Process the JSON data
            console.log('JSON data:', data);
            PopulateSupervisorPulldown(data);
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error(error);
        });

    AttachEventListener_SubmitButton();

    AttachEventListeners_Checkboxes();

    AttachEventListeners_RestrictInput();

});  // DOMContentLoaded


//////////////////////////////////////////////////////////////
//
// Event Listeners
function AttachEventListener_SubmitButton() {
    const submitButton = document.getElementById('FormSubmitButton');
    submitButton.addEventListener('click', function () {
        let formData = GetFormData();

        // get validation errors
        let validateFormData = ValidateFormData(formData);

        if (validateFormData == "") {

            console.log("formData:" + JSON.stringify(formData, null, 2));

            //create payload
            const keysToRemove = ["checkEmail", "checkPhoneNumber"];
            const payloadObj = Object.fromEntries(Object.entries(formData).filter(([key, value]) => !keysToRemove.includes(key)));

            console.log("payloadObj:" + JSON.stringify(payloadObj, null, 2));

            submitData(payloadObj);

        } else {
            alert(validateFormData);
        }
    });
}

function AttachEventListeners_Checkboxes() {
    const checkEmail = document.getElementById('CheckEmail');
    const regEmail = document.getElementById('RequiredEmail');

    const checkPhoneNumber = document.getElementById('CheckPhoneNumber');
    const regPhoneNumber = document.getElementById('RequiredPhoneNumber');

    checkEmail.addEventListener('click', function () {
        // This function will be called when the checkbox is clicked
        if (checkEmail.checked) {
            regEmail.style.display = 'inline-block';
        } else {
            regEmail.style.display = 'none';
        }
    });
    checkPhoneNumber.addEventListener('click', function () {
        // This function will be called when the checkbox is clicked
        if (checkPhoneNumber.checked) {
            regPhoneNumber.style.display = 'inline-block';
        } else {
            regPhoneNumber.style.display = 'none';
        }
    });
}

function AttachEventListeners_RestrictInput() {
    const firstName = document.getElementById('FirstName');
    const lastName = document.getElementById('LastName');
    const phoneNumber = document.getElementById('PhoneNumber');
    firstName.addEventListener('input', function () {
        // Get the current value of the input
        let currentValue = firstName.value;

        // Remove any non-alphabet characters from the input value using a regular expression
        currentValue = currentValue.replace(/[^a-zA-Z]/g, '');

        // Update the input value with the filtered value
        firstName.value = currentValue;
    });
    lastName.addEventListener('input', function () {
        // Get the current value of the input
        let currentValue = lastName.value;

        // Remove any non-alphabet characters from the input value using a regular expression
        currentValue = currentValue.replace(/[^a-zA-Z]/g, '');

        // Update the input value with the filtered value
        lastName.value = currentValue;
    });

    phoneNumber.addEventListener('input', function () {
        // Get the current value of the input
        let currentValue = phoneNumber.value;

        // Remove any non-alphabet characters from the input value using a regular expression
        currentValue = currentValue.replace(/[^\d-]/g, '');

        // Update the input value with the filtered value
        phoneNumber.value = currentValue;
    });

}

//////////////////////////////////////////////////////////////
//
// Form Data and Validation
function GetFormData() {
    const firstName = document.getElementById('FirstName').value;
    const lastName = document.getElementById('LastName').value;

    const checkEmail = document.getElementById('CheckEmail').checked;
    const email = document.getElementById('Email').value;

    const checkPhoneNumber = document.getElementById('CheckPhoneNumber').checked;
    const phoneNumber = document.getElementById('PhoneNumber').value;

    const supervisor = document.getElementById('Supervisor').value;

    let jsonOut = {};
    jsonOut.firstName = firstName;
    jsonOut.lastName = lastName;
    jsonOut.checkEmail = checkEmail;
    jsonOut.email = email;
    jsonOut.checkPhoneNumber = checkPhoneNumber;
    jsonOut.phoneNumber = phoneNumber;
    jsonOut.supervisor = supervisor;

    return jsonOut;
}
function ValidateFormData(jsonIn) {
    ClearErrMsg();

    const errFirstName = document.getElementById('errFirstName');
    const errLastName = document.getElementById('errLastName');

    const errEmail = document.getElementById('errEmail');
    const errPhoneNumber = document.getElementById('errPhoneNumber');

    const errSupervisor = document.getElementById('errSupervisor');

    let errMsg = "";
    if (jsonIn.firstName === "" || jsonIn.firstName === null) {
        errMsg += errMessages.errFirstName + "\r\n";
        errFirstName.innerHTML = errMessages.errFirstName;
    }
    if (jsonIn.lastName === "" || jsonIn.lastName === null) {
        errMsg += errMessages.errLastName + "\r\n";
        errLastName.innerHTML = errMessages.errLastName;
    }

    // if email checkbox checked && email text field is blank, send error
    if (jsonIn.checkEmail && (jsonIn.email === "" || jsonIn.email === null)) {
        errMsg += errMessages.errEmail + "\r\n";
        errEmail.innerHTML = errMessages.errEmail;
    }
    //if email text is not empty, send error if email is not valid
    if ((jsonIn.email.length > 0) && (!IsValidEmail(jsonIn.email))) {
        errMsg += errMessages.errEmailNotValid + "\r\n";
        errEmail.innerHTML = errMessages.errEmailNotValid;
    }

    // if phonenumber checkbox checked && phonenumber text field is blank, send error
    if (jsonIn.checkPhoneNumber && (jsonIn.phoneNumber === "" || jsonIn.phoneNumber === null)) {
        errMsg += errMessages.errPhoneNumber + "\r\n";
        errPhoneNumber.innerHTML = errMessages.errPhoneNumber;
    }
    //if PhoneNumber text is not empty, send error if PhoneNumber is not valid
    if ((jsonIn.phoneNumber.length > 0) && (!IsValidPhoneNumber(jsonIn.phoneNumber))) {
        errMsg += errMessages.errPhoneNumberNotValid + "\r\n";
        errPhoneNumber.innerHTML = errMessages.errPhoneNumberNotValid;
    }

    if (jsonIn.supervisor === "0") {
        errMsg += errMessages.errSupervisor + "\r\n";
        errSupervisor.innerHTML = errMessages.errSupervisor;
    }

    return errMsg;
}

function ClearErrMsg() {
    const allErrMsg = document.querySelectorAll('.errMsg');

    allErrMsg.forEach(el => {
        el.innerHTML = '';
    });
}



//////////////////////////////////////////////////////////////
//
// Helper functions

function IsValidEmail(email) {
    // Regular expression pattern for validating email addresses
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email address against the pattern
    return pattern.test(email);
}
function IsValidPhoneNumber(phoneNumber) {
    // Regular expression pattern for validating phone numbers in the format 999-999-9999
    const pattern = /^\d{3}-\d{3}-\d{4}$/; // Example: 123-456-7890

    // Test the phone number against the pattern
    return pattern.test(phoneNumber);
}


//////////////////////////////////////////////////////////////
//
// Fetch Data functions for Supervisor pulldown

function PopulateSupervisorPulldown(jsonIn) {
    if (jsonIn == null) {
        return;
    }

    const dropdown = document.getElementById('Supervisor');
    const supervisorLoading = document.getElementById('supervisorLoading');

    for (const optionText of jsonIn) {
        const option = document.createElement('option');
        option.textContent = optionText;
        dropdown.appendChild(option);
    }

    supervisorLoading.style.display = 'none';
}

async function fetchData() {

    try {
        // Use the fetch() function to make a GET request to the endpoint
        const response = await fetch(urlToGetSupervisors);

        // Check if the response status is OK (200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON data from the response and return it
        return response.json();
    } catch (error) {
        document.getElementById('errSupervisorFetch').innerHTML = errMessages.errSupervisorFetch;

        // If an error occurs during the fetch, reject the Promise with the error
        throw new Error('Error fetching data:', error);
    }
}

function GetSupers() {
    fetchData()
        .then(data => {
            // Process the JSON data
            console.log('JSON data:', data);
            // You can manipulate the data or render it on the page here
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error(error);
            document.getElementById('errSupervisorFetch').innerHTML = errMessages.errSupervisorFetch;
        });
}

//////////////////////////////////////////////////////////////
//
// Fetch Data functions to submit form

async function submitData(payloadObj) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadObj)
    };

    try {
        // Await the fetch operation and parse the response JSON
        const response = await fetch(urlToSubmitData, options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Parse response JSON

        console.log('API response:', data);

        document.getElementById('errSubmitError').innerHTML = data.message;
        // Handle API response here
    } catch (error) {
        document.getElementById('errSubmitError').innerHTML = errMessages.errSubmittingData;
        console.error('Error sending data to API:', error);
    }

}
