// Wait for Firebase to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded - Checking Firebase:", typeof firebase !== 'undefined');
  
  if (!firebase.apps.length) {
    console.error("Firebase not loaded!");
    return;
  }

  // Form submission handler
  document.getElementById("caseSubmissionForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    try {
      const userCred = await firebase.auth().signInAnonymously();
      console.log("Authenticated with UID:", userCred.user.uid);

      const caseData = {
        title: document.getElementById("caseTitle").value,
        description: document.getElementById("caseDescription").value,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      const ref = await firebase.database().ref("cases").push(caseData);
      console.log("Saved with ID:", ref.key);
      alert(`Case #${ref.key.substr(0, 5)} saved!`);
      e.target.reset();
      
    } catch (error) {
      console.error("Full error:", error);
      alert("Error: " + error.message);
    }
  });
});
