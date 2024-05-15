
                

                function collectSignUpInput() {
                    // This function will collect input from sign-up fields and store it in a JSON file.
                    var fullName = document.getElementById("signUpFullName").value;
                    var email = document.getElementById("signUpEmail").value;
                    var phoneNumber = document.getElementById("signUpPhoneNumber").value;
                    var countryCode = document.getElementById("signUpCountryCode").value;
                    var password = document.getElementById("signUpPasswordInput").value;

                    var signUpData = {
                        fullName: fullName,
                        email: email,
                        phoneNumber: phoneNumber,
                        countryCode: countryCode,
                        password: password
                    };

                   
                    var jsonData = JSON.stringify(signUpData);

                   
                    console.log(jsonData);
                }

                function collectSignInInput() {
                   
                    var signInEmail = document.getElementById("signInEmail").value;
                    var signInPassword = document.getElementById("signInPasswordInput").value;

                    var signInData = {
                        email: signInEmail,
                        password: signInPassword
                    };

                   
                    var jsonData = JSON.stringify(signInData);

                    
                    console.log(jsonData);
                }
                function togglePasswordVisibility() {
                    var passwordInput = document.getElementById("signInPasswordInput");
                    var eyeIcon = document.getElementById("eye-icon");

                    if (passwordInput.type === "password") {
                        passwordInput.type = "text";
                        eyeIcon.textContent = "\u{1F441}"; // Show the crossed eye icon
                    } else {
                        passwordInput.type = "password";
                        eyeIcon.textContent = "\u{1F440}"; // Show the open eye icon
                    }
                }
                function togglePasswordVisibility() {
                    var passwordInput = document.getElementById("signUpPasswordInput");
                    var eyeIcon = document.getElementById("eye-icon");

                    if (passwordInput.type === "password") {
                        passwordInput.type = "text";
                        eyeIcon.textContent = "\u{1F441}"; // Show the crossed eye icon
                    } else {
                        passwordInput.type = "password";
                        eyeIcon.textContent = "\u{1F440}"; // Show the open eye icon
                    }
                }


                function toggleFlexbox() {
                    var flexbox = document.getElementById("flexbox");
                    var flexbox2 = document.getElementById("flexbox-2");

                    if (flexbox.style.display === "block") {
                        flexbox.classList.remove("fade-in-up");
                        flexbox.classList.add("fade-out-down");
                        flexbox.style.display = "none";
                        flexbox2.style.display = "block";
                        flexbox2.classList.remove("fade-out-down");
                        flexbox2.classList.add("fade-in-up");
                    } else {
                        flexbox2.classList.remove("fade-in-up");
                        flexbox2.classList.add("fade-out-down");
                        flexbox2.style.display = "none";
                        flexbox.style.display = "block";
                        flexbox.classList.remove("fade-out-down");
                        flexbox.classList.add("fade-in-up");
                    }
                }
                // function showNextPage() {
                
                
                //     // Wait for the animation to complete, then redirect to the next page
                //     setTimeout(function () {
                //         window.location.href = "/register2"; // Replace with the actual URL of the next page
                //     }, 1000); // Adjust the timeout based on your fadeOut animation duration
                // }