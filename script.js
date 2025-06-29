// Debug initialization
console.log("Script loaded - Firebase available:", typeof firebase !== 'undefined');

// Initialize Firebase Authentication
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("Authenticated anonymously with UID:", firebase.auth().currentUser.uid);
  })
  .catch(error => {
    console.error("Authentication error:", error);
    alert("Authentication failed. Please refresh the page.");
  });

// Form Submission Handler
document.getElementById("caseSubmissionForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  console.log("Form submission initiated");

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    // Validate required fields
    const title = document.getElementById("caseTitle").value.trim();
    const description = document.getElementById("caseDescription").value.trim();

    if (!title || !description) {
      throw new Error("Please fill all required fields");
    }

    // Prepare case data
    const caseData = {
      title: title,
      description: description,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: firebase.auth().currentUser?.uid || "unknown"
    };
    console.log("Prepared case data:", caseData);

    // Push to Firebase
    const newCaseRef = firebase.database().ref("cases").push();
    await newCaseRef.set(caseData);
    
    console.log("Successfully saved with ID:", newCaseRef.key);
    alert(`Case #${newCaseRef.key.substring(0, 8)} submitted successfully!`);
    
    // Reset form
    this.reset();
  } catch (error) {
    console.error("Submission error:", error);
    alert(`Submission failed: ${error.message}`);
  } finally {
    // Restore button state
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});

// Debug: Monitor auth state changes
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("User auth state: Signed in (Anonymous)");
  } else {
    console.log("User auth state: Signed out");
  }
});
