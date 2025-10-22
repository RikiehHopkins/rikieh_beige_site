
// main.js - navigation, mobile toggle, contact form, and small utilities
document.addEventListener('DOMContentLoaded', function(){
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile toggle
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  toggle?.addEventListener('click', ()=>{
    if(nav.style.display === 'flex') nav.style.display = '';
    else nav.style.display = 'flex';
  });

  // highlight active nav link
  const links = document.querySelectorAll('.nav a');
  links.forEach(a => {
    try{
      const href = a.getAttribute('href');
      if(location.pathname.endsWith(href)) a.classList.add('active');
    }catch(e){}
  });

  // contact form submit (mailto fallback)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if(!name || !email || !message){ status.textContent = 'Please fill in all fields.'; return; }
    const subject = encodeURIComponent('Website message from '+name);
    const body = encodeURIComponent(message + '\n\n— '+name+' ('+email+')');
    // open user's email client
    window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;
    status.textContent = 'Opening your email client...';
  });

  // simple fade-in on scroll for card elements
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('fade-in');
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.card, .project-card').forEach(el => observer.observe(el));

  // chat toggle handlers
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  chatToggle?.addEventListener('click', ()=>{ chatPanel.hidden = false; chatToggle.style.display = 'none'; });
  chatClose?.addEventListener('click', ()=>{ chatPanel.hidden = true; chatToggle.style.display = ''; });
});
