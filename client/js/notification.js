document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768 || localStorage.getItem('notificationShown')) return;
    
    const notification = document.getElementById('top-notification');
    
    setTimeout(() => {
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
        localStorage.setItem('notificationShown', 'true');
      }, 5000);
    }, 1000);
  });