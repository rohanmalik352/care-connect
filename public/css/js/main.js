// Auto-dismiss flash messages after 4 seconds
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.alert').forEach(el => {
      const bsAlert = new bootstrap.Alert(el);
      bsAlert.close();
    });
  }, 4000);
});