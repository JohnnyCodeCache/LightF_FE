# This is the front end for the supervisor project.

### It is a simple form that collects the following:
	
	firstName: string
	lastName: string
	checkEmail: checkbox, bool
	email: string, email
	checkPhoneNumber: checkbox, bool
	phoneNumber: string, phone
	supervisor: string, dropdown

### Payload and Validation

	firstName - Alpha Char only
	lastName - Alpha Char only
	email - emails only if checkEmail checkbox is checked
	phone - phone only if checkPhoneNumber checkbox is checked
	supervisor - must select one

### TODO:
	
	DONE! - Fix css bootstrap resize issues

	DONE! - Validate proper phone numbers
	DONE! - Validate if email is correct

	DONE! - get rid of json alerts

	DONE! - display message from API, then clear the form