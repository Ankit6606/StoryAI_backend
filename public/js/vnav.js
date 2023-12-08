document.addEventListener('DOMContentLoaded', function () {
    let burger = document.getElementById('navTrigger'),
        nav = document.getElementById('navMenu');

    // Add the 'active' class to hide the menu initially
   

    burger.addEventListener('click', function (e) {
        this.classList.toggle('active');
        nav.classList.toggle('active');
    });
});
