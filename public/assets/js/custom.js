// // //console.log('%c Stop! ', 'font-size: 3rem; color: red');
// // //console.log('%c You Just Destroy Our privacy policy ! ', 'font-size: 1.5rem; color: yellow');
console.log("%c Stop! ", "font-size: 3rem; color: red");
console.log(
	"%c You Just Destroy Our privacy policy ! ",
	"font-size: 1.5rem; color: yellow"
);

const list = document.querySelectorAll(".list");
const items = document.querySelectorAll(".list_child");

function accordion(e) {
	e.stopPropagation();
	if (this.classList.contains("active")) {
		this.classList.remove("active");
		//console.log(1);
	} else if (this.parentElement.parentElement.classList.contains("active")) {
		if (this.classList[0] == "list") {
			for (i = 0; i < list.length; i++) {
				list[i].classList.remove("active");
			}
		}
		if (this.classList[0] == "list_child") {
			for (i = 0; i < items.length; i++) {
				items[i].classList.remove("active");
			}
		}
		this.classList.add("active");
		//console.log(2);
	} else {
		//console.log(3);
		for (i = 0; i < list.length; i++) {
			list[i].classList.remove("active");
		}
		this.classList.add("active");
	}
}

for (i = 0; i < list.length; i++) {
	list[i].addEventListener("click", accordion);
}
$(".navigation-mobile-container").click(function () {
	//console.log('clicked');
	const list = document.querySelectorAll(".list");
	const items = document.querySelectorAll(".list_child");
	for (i = 0; i < list.length; i++) {
		list[i].classList.remove("active");
	}
	for (i = 0; i < items.length; i++) {
		items[i].classList.remove("active");
	}
	$(".navigation-mobile-container").toggleClass("active");
});

// Solasta fixed menu js area start here ***
// $(document).ready(function () {
// 	$(window).scroll(function () {
// 		if ($(this).scrollTop() > 100) {
// 			$(".solasta-header").addClass("fixed__header");
// 		} else {
// 			$(".solasta-header").removeClass("fixed__header");
// 		}
// 	});
// });
// Solasta fixed menu js area end here ***
