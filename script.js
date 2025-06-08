// Form Submission for Cases
document.getElementById("caseSubmissionForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Case submitted! (This is a demo. For real functionality, use Firebase or GitHub API.)");
    this.reset();
});
