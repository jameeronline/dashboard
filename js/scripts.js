//Reset Storage Environmet
localStorage.removeItem('plates');

//Global Variables
var listGroup;
var palateCategories = ["diamond", "gold", "silver", "bronze"];

// Label Properties
if ($('body').hasClass('rtl')) {
    var label_numberofbids = "عدد المزايدات";
    var label_plateNumber = "رقم اللوحة";
    var label_highestBidAmount = "مبلغ أعلى مزايدة";
    var label_categories = ["الماسي", "ذهبي", "فضي", "برونزي "];
    var label_priceLabel = "ريال ";
    var label_auctionStart = "الوقت المتبقي حتى بداية المزاد ";
    var label_auctionEnd = "الوقت المتبقي حتى نهاية المزاد";
    var label_url_mazad = "https://www.absher.sa/wps/myportal/individuals/Home/myservices/eservices/traffic/mazadservice/";
    var label_socialshare_description = "أعجبتني هذي اللوحة المميزة في مزاد اللوحات على منصة أبشر وحبيت أشاركها معك";
} else {
    var label_numberofbids = "Number of Bids";
    var label_plateNumber = "Plate Number";
    var label_highestBidAmount = "Highest Bid Price";
    var label_categories = ["Diamond", "Gold", "Silver", "Bronze"];
    var label_priceLabel = "SAR";
    var label_auctionStart = "Auction Start time";
    var label_auctionEnd = "Auction End time";
    var label_url_mazad = "https://www.absher.sa/wps/myportal/individuals/Home/myservices/eservices/traffic/mazadservice/";
    var label_socialshare_description = "I liked this plate on Absher E-Auction and would like to share it with you";
}

//Convert Digits to Arabic numbers
String.prototype.toIndiaDigits = function() {
    var id = ['۰', '١', '٢', '۳', '٤', '٥', '٦', '۷', '۸', '۹'];
    return this.replace(/[0-9]/g, function(w) {
        return id[+w]
    });
}

//Change number to currency format
const formatToCurrency = amount => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

//Reversing Plate Number English
function reversePlateLetter(val) {
    var initString = val;
    var finalString = '';
    for (var i = initString.length - 1; i >= 0; i--) {
        finalString += initString[i];
    }
    return finalString;
}

//Init Countdown
function InitializeCountdown() {
    var days = $('body').hasClass('ltr') ? 'Days' : 'أيام';
    var hours = $('body').hasClass('ltr') ? 'Hours' : 'ساعات';
    var minutes = $('body').hasClass('ltr') ? 'Minutes' : 'دقائق';
    var seconds = $('body').hasClass('ltr') ? 'Seconds' : 'ثواني';

    $('.auction-countdown').each(function(index) {
        //Add dynamic id values
        $(this).attr('id', 'auction-countdown_' + index);
        var el = $('#auction-countdown_' + index);
        var acutionStatus = $(this).data('status');

        if (acutionStatus == 3) {
            var startDateCounter = new Date($(this).data('now').slice(0, 19).replace(/-/g, '/'));
            var endDateCounter = new Date($(this).data('start').slice(0, 19).replace(/-/g, '/'));
        } else {
            var startDateCounter = new Date($(this).data('now').slice(0, 19).replace(/-/g, '/'));
            var endDateCounter = new Date($(this).data('countdown').slice(0, 19).replace(/-/g, '/'));
        }

        $(el).countdowntimer({
            startDate: startDateCounter,
            dateAndTime: endDateCounter,
            size: "lg",
            regexpReplaceWith: "<div class='simply-countdown'>" +
                "<div class='simply-section simply-days-section'><div><span class='simply-amount'>$1</span><span class='simply-word'>" + days + "</span></span></div></div>" +
                "<div class='simply-section simply-hours-section'><div><span class='simply-amount'>$2</span><span class='simply-word'>" + hours + "</span></span></div></div>" +
                "<div class='simply-section simply-minutes-section'><div><span class='simply-amount'>$3</span><span class='simply-word'>" + minutes + "</span></span></div></div>" +
                "<div class='simply-section simply-seconds-section'><div><span class='simply-amount'>$4</span><span class='simply-word'>" + seconds + "</span></span></div></div>" +
                "</div>",
            regexpMatchFormat: "([0-9]{1,4}):([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})"
        });
    });
}

//Initialize list.js
function initListJS() {
    listGroup = new List('list-wrapper', {
        valueNames: ['sortAmount', 'sortIndex', 'filterPlateType']
    });

    // No Result
    listGroup.on('updated', function(list) {
        if (list.matchingItems.length > 0) {
            $('.no-result').hide();
            $('#grid-dashboard').removeClass('hide').addClass('show-grid');
        } else {
            $('.no-result').show();
            $('#grid-dashboard').removeClass('show-grid').addClass('hide');
        }
    });

    //Sorting Options "ASC" or "DESC"
    $("#sorting-byamount").change(function() {
        var selectedItem = $(this).val();
        $('.services-grid-item').removeClass('animate__bg');

        switch (selectedItem) {
            case 'ASC_AMOUNT':
                listGroup.sort('sortAmount', { order: "desc" });
                break;
            case 'DESC_AMOUNT':
                listGroup.sort('sortAmount', { order: "asc" });
                break;
            case '0':
                listGroup.sort('sortIndex', { order: "asc" });
                break;
        }
    });

    //Filtering based on plate types
    $('#filter-types').change(function() {
        var selectedItem = $(this).val();
        $('.services-grid-item').removeClass('animate__bg');

        switch ($(this).val()) {
            case 'FILTER_PRIVATE':
                listGroup.filter(function(item) {
                    return item.values().filterPlateType == "private" ? true : false;
                });
                break;
            case 'FILTER_COMMERCIAL':
                listGroup.filter(function(item) {
                    return item.values().filterPlateType == "transport" ? true : false;
                });
                break;
            case 'FILTER_MOTOR':
                listGroup.filter(function(item) {
                    return item.values().filterPlateType == "motorcycle" ? true : false;
                });
                break;
            case '0':
                listGroup.filter(function(item) {
                    return true;
                });
                break;
        }
    });
}

function checkUpdates(plateNum, plateLetter, bidValue, bids, plateID, domBid, domBidAmount) {
    var updated = false;

    if (localStorage.getItem('plates') != undefined || localStorage.getItem('plates') != null) {
        var lastRecords = JSON.parse(localStorage.getItem('plates'));
    } else {
        return false;
    }

    for (var j = 0; j < lastRecords.length; j++) {
        var plate = lastRecords[j];
        if (plate.plateNumber.search(plateNum) == 0 && plate.plateLetterEn.search(plateLetter) == 0 && plateID == plate.plateTypeID) {
            if (plate.topBiddingAmount != bidValue || plate.numberOfBids != bids || plate.topBiddingAmount != domBidAmount || plate.numberOfBids != domBid) {
                return true;
            }
        }
    }
    return false;
}

// Dashboard Updates
function dashboardUpdate() {
    $.getJSON("/dashboard/js/auctionData.json?v=" + Math.random(), function(result) {
        //$.getJSON("../auctionData.json?v="+Math.random(), function(result) {
        //Get Plates and Reset Output
        var plates = result;
        var output = '';

        if (localStorage.getItem('plates') != undefined || localStorage.getItem('plates') != null) {
            if (JSON.parse(localStorage.getItem('plates')).length != plates.length) {
                renderPlates();
            } else {
                if (plates.length != 0) {
                    $('.form-filters').attr('style', '');
                    $('.show-noresult').addClass('hide');
                    //$('.show-json-error').addClass('hide');
                    $('.services-grid-item').removeClass('animate__bg');

                    //Loop each plates to verify the updates
                    $.each(plates, function(i, field) {
                        let bids = field.numberOfBids;
                        let bidAmount = field.topBiddingAmount;
                        let initalPlateNumber = field.plateNumber;
                        let plateLetterEn = field.plateLetterEn;
                        let plateTypeID = field.plateTypeID;

                        //Element to update
                        var $el_target = $('.services-grid-item[data-index="' + i + '"]');
                        var domBidValue = parseInt($el_target.find('.numberofbids').text());
                        var domBidAmount = parseInt($el_target.find('.sortAmount').text());
                        let isUpdates = checkUpdates(initalPlateNumber, plateLetterEn, bidAmount, bids, plateTypeID, domBidValue, domBidAmount);

                        if (isUpdates && $el_target.length != 0) {
                            $el_target.addClass('animate__bg');
                            $el_target.find('.numberofbids').text(bids);
                            $el_target.find('.highestBidAmount').text(formatToCurrency(bidAmount));
                        }
                    });

                    //Store Value
                    localStorage.setItem('plates', JSON.stringify(plates));
                } else {
                    $('.form-filters').hide();
                    $('.show-noresult').removeClass('hide');
                }

            }
        }
    }).fail(function() {
        //$('.show-json-error').removeClass('hide');
        console.log('JSON error');
    });
}

//Initial Render - dashboard
function renderPlates() {
    $.getJSON("/dashboard/js/auctionData.json?v=" + Math.random(), function(result) {
        //$.getJSON("../auctionData.json?v="+Math.random(), function(result) {
        //Get Plates and Reset Output
        var plates = result;
        var output = '';

        // Enable for Development
        // var palateTypes = [{
        //         "name" : "private",
        //         "id" : 1
        //     },{
        //         "name" : "transport",
        //         "id" : 2
        //     },{
        //         "name" : "motorcycle",
        //         "id" : 21
        //     }];

        // Enable for Production
        var palateTypes = [{
                "name" : "private",
                "id" : 21
            },{
                "name" : "transport",
                "id" : 22
            },{
                "name" : "motorcycle",
                "id" : 23
            }];

        if (plates.length != 0) {
            $('.form-filters').attr('style', '');
            $('.show-noresult').addClass('hide');
            //$('.show-json-error').addClass('hide');
            $('.services-grid-item').removeClass('animate__bg');

            //Loop to read each plates
            $.each(plates, function(i, field) {
                let bids = field.numberOfBids;
                let bidAmount = field.topBiddingAmount;
                let plateNumber = "" + parseInt(field.plateNumber);
                let plateLetterAr = field.plateLetterAr;
                let plateLetterEn = field.plateLetterEn;
                let plateTypeID = field.plateTypeID;
                let auctionCategory = field.auctionCategory;
                let auctionEndDate = field.auctionEndDate;
                let publishedDate = field.publishedDate;
                let auctionStatus = field.auctionStatusId;
                let auctionStartDate = field.auctionStartDate;
                let auctionDataReloadedTime = field.auctionDataReloadedTime;
                let counterLabel = auctionStatus == 3 ? label_auctionStart : label_auctionEnd;
                let plateType = palateTypes[palateTypes.map(function (item) { return item.id; }).indexOf(plateTypeID)];
                let socialMediaProps = {
                    description: '',
                    hashTags: "absher,auction",
                    url: "https://jameeronline.github.io/dashboard/",
                    plateID: reversePlateLetter(plateLetterEn).replaceAll(' ', '') + plateNumber
                };

                if ($('body').hasClass('rtl')) {
                    socialMediaProps.description = "أعجبتني هذي اللوحة المميزة في مزاد اللوحات على منصة أبشر وحبيت أشاركها معك " + "\r\n" + label_plateNumber + ": " + plateLetterAr + " " + plateNumber.toIndiaDigits() + "\r\n" + label_highestBidAmount + ": " + formatToCurrency(bidAmount) + " " + label_priceLabel + "\r\n";
                }else{
                    socialMediaProps.description = "I liked this plate on Absher E-Auction and would like to share it with you." + "\r\n" + label_plateNumber + ": " + reversePlateLetter(plateLetterEn).replaceAll(' ', '') + " " + plateNumber + "\r\n" + label_highestBidAmount + ": " + formatToCurrency(bidAmount) + " " + label_priceLabel + "\r\n";
                }

                var htmlMotorCyclePlate =
                    `<table class="table table-bordered">
                        <tr>
                            <td class="plateNumberAr plateNumberCaption" colspan="2">
                                <span>السعودية</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="plateNumber plateNumberValAr"><span>${plateNumber.toIndiaDigits()}</span></td>
                            <td class="plateNumberAr plateNumberCharAr"><span>${plateLetterAr}</span></td>
                        </tr>
                    </table>`;

                var htmlVehiclePlate =
                    `<table class="table table-bordered">
                        <tr>
                            <td class="plateNumber plateNumberValAr"><span>${plateNumber.toIndiaDigits()}</span></td>
                            <td class="plateNumberAr"><span>${plateLetterAr}</span></td>
                            <td class="plateImg" rowspan="2"></td>
                        </tr>
                        <tr>
                            <td class="plateNumber plateNumberValEn">${plateNumber}</td>
                            <td class="plateNumberEn">${reversePlateLetter(plateLetterEn)}</td>
                        </tr>
                    </table>`;

                var html =
                    `<li class="col-md-4" id="${socialMediaProps.plateID}">
                        <div class="fab-wrapper social-share-desktop">
                            <input id="fabCheckbox-${i}" type="checkbox" class="fab-checkbox" />
                            <label class="fab" for="fabCheckbox-${i}">
                                <img src="images/share-icon.png" alt="share" aria-hidden="true" width="18" class="share-closed" />
                                <img src="images/close-icon.png" alt="close" aria-hidden="true" width="18" class="share-opened" />
                            </label>
                            <div class="fab-wheel social-share-icons">
                                <a class="fab-action fab-action-1" href="javascript:void(0)" data-sharer="twitter" data-title="${socialMediaProps.description}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}">
                                    <img src="images/twitter.png" alt="twitter" aria-hidden="true" />
                                </a>
                                <a class="fab-action fab-action-2" href="javascript:void(0)" data-sharer="whatsapp" data-title="${socialMediaProps.description}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}">
                                    <img src="images/whatsapp.png" alt="whatsapp" aria-hidden="true" />
                                </a>
                                <a class="fab-action fab-action-3" href="javascript:void(0)" data-clipboard-text="${socialMediaProps.description + '' + socialMediaProps.url + '#' + socialMediaProps.plateID}" data-sharer="clipboard" data-title="${socialMediaProps.description}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}">
                                    <img src="images/clipboard-alt.png" alt="clipboard" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                        <a class="social-share social-share-desktop hide" href="javascript:void(0)" tabindex="0" role="button" data-trigger="manual" data-toggle="popover" data-trigger="focus" data-popover-content="#social-share-icons-${i}">
                            <img src="images/share-icon.png" alt="share" aria-hidden="true" width="20" class="share-closed" />
                            <img src="images/close-icon.png" alt="share" aria-hidden="true" width="20" class="share-opened" />
                        </a>
                        <a class="social-share social-share-mobile hide" href="javascript:void(0)" tabindex="0" role="button" data-title="${socialMediaProps.description}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}">
                            <img src="images/share-icon.png" alt="share" aria-hidden="true" width="20" class="share-closed" />
                            <img src="images/close-icon.png" alt="share" aria-hidden="true" width="20" class="share-opened" />
                        </a>
                        <div class="social-share-icons-wrapper hide" id="social-share-icons-${i}">
                            <div class="popover-heading">Social Share Options</div>
                            <div class="popover-body">
                                <div class="social-share-icons">
                                    <a href="javascript:void(0)" class="button" data-sharer="twitter" data-title="${socialMediaProps.description}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}"><img src="images/twitter.png" alt="twitter" aria-hidden="true" width="20" /></a>
                                    <a href="javascript:void(0)" class="button" data-sharer="whatsapp" data-title="${socialMediaProps.description}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}"><img src="images/whatsapp.png" alt="twitter" aria-hidden="true" width="20" /></a>
                                </div>
                            </div>
                        </div>
                        <div class="services-grid-item plate_${palateCategories[auctionCategory-1]} platetype_${plateType.name}" data-platetype="${plateTypeID}" data-index="${i}">
                            <a href="${label_url_mazad}" class="link-to-mazad hide">Link to Mazad</a>
                            <div class="ribbon ${palateCategories[auctionCategory-1]}"><span>${label_categories[auctionCategory-1]}</span></div>
                            <div class="card__platenumber">
                                <div class="card__platenumber--info">
                                    <span>${label_numberofbids}</span>
                                    <strong class="numberofbids">${bids}</strong>
                                </div>
                                ${ plateType.name == "motorcycle" ? htmlMotorCyclePlate : htmlVehiclePlate }
                                <div class="card__timer">
                                    <span class="card__auction--caption">${counterLabel}</span>
                                    <div class="auction-countdown" data-countdown="${auctionEndDate}" data-now="${auctionDataReloadedTime}" data-publish="${publishedDate}" data-start="${auctionStartDate}" data-status="${auctionStatus}"></div>
                                </div>
                                <div class="card__platenumber--bid">
                                    <span>${label_highestBidAmount}</span>
                                    <span><strong class="highestBidAmount">${formatToCurrency(bidAmount)}</strong><em>${label_priceLabel}</em></span>
                                </div>
                                <div class="hide">
                                    <span class="sortAmount">${bidAmount}</span>
                                    <span class="sortIndex">${i}</span>
                                    <span class="filterPlateType">${plateType.name}</span>
                                </div>
                            </div>
                        </div>
                    </li>`;

                // Add Each element to ouput
                output += html;
            });

            // Update DOM
            $('#grid-dashboard').html(output);

            //Initialzie Coundown
            InitializeCountdown();

            //Init List.JS
            initListJS();

            //init clipboard - copy text
            new ClipboardJS('.fab-action-3');

            //init click to mazad
            $('.services-grid-item').click(function(){
                $(this).find('.link-to-mazad')[0].click();
            });

            //Enable Social Share based on compatability
            if (navigator.share && window.innerWidth < 768) {
                $('.social-share-mobile').removeClass('hide');
                $('.social-share-desktop').addClass('hide');
            }

            //Social share popup position based on device width
            if(window.innerWidth < 768){
                var placement = "bottom";
            }else{
                var placement = $('body').hasClass('rtl') ? 'left' : 'right';
            }

            //Init social share
            $("[data-toggle=popover]").popover({
                html: true,
                placement: placement,
                content: function() {
                    var content = $(this).attr("data-popover-content");
                    return $(content).children(".popover-body").html();
                },
                title: function() {
                    var title = $(this).attr("data-popover-content");
                    return $(title).children(".popover-heading").html();
                }
            });

            //init share for desktop
            $("[data-toggle=popover]").on('shown.bs.popover', function () {
                window.Sharer.init();
            });

            window.Sharer.init();

            //Popover manual event
            $("[data-toggle=popover]").click(function(){
                $("[data-toggle=popover]").not($(this)).popover('hide');
                $(this).popover('toggle');
            });

            //Fab event
            $(".fab-checkbox").click(function(){
                $('.fab-checkbox').not($(this)).prop("checked",false);
            });

            //Popover hide
            $(document).on('click', '.social-share-icons a', function(){
                $("[data-toggle=popover]").popover('hide');
            });

            //Init social share - native
            $('.social-share-mobile').click(function(){
                var title = $(this).data("title");
                var description = $(this).data("title");
                var url = $(this).data("url");

                navigator.share({
                    title: "Online Plate Auction Service - Absher",
                    text: description,
                    url: url
                }).then(() => {
                    console.log('Thanks for sharing!');
                })
                .catch(console.error);
            });

            //Move to specific carplate if we have hash tag in url
            if(window.location.hash != ''){
                setTimeout(function(){
                    $('html, body').animate({
                        scrollTop: $(window.location.hash).offset().top
                    }, 500);
                }, 100);
            }

            //Store Value
            localStorage.setItem('plates', JSON.stringify(plates));
        } else {
            $('.form-filters').hide();
            $('.show-noresult').removeClass('hide');
        }
    }).fail(function() {
        //$('.show-json-error').removeClass('hide');
        console.log('JSON error');
    });
}

function init() {
    renderPlates();
}

// Interval Updates
// setInterval(function() {
//     dashboardUpdate();
// }, 3000);


//Init
init();