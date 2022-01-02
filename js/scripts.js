//Reset Storage Environmet
localStorage.removeItem('plates');

//Global Variables
var listGroup;
var palateCategories = ["diamond", "gold", "silver", "bronze"];

// Label Properties
if ($('body').hasClass('rtl')) {
    var label_numberofbids = "عدد المزايدات";
    var label_highestBidAmount = "مبلغ أعلى مزايدة";
    var label_categories = ["الماسي", "ذهبي", "فضي", "برونزي "];
    var label_priceLabel = "ريال ";
    var label_auctionStart = "الوقت المتبقي حتى بداية المزاد ";
    var label_auctionEnd = "الوقت المتبقي حتى نهاية المزاد";
    var label_url_mazad = "https://www.absher.sa/wps/myportal/individuals/Home/myservices/eservices/traffic/mazadservice/";
    var label_socialshare_description = "أعجبتني هذي اللوحة المميزة في مزاد اللوحات على منصة أبشر وحبيت أشاركها معك";
} else {
    var label_numberofbids = "Number of Bids";
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
                let auctionStartDate = field.auctionStartDate;
                let auctionEndDate = field.auctionEndDate;
                let auctionDataReloadedTime = field.auctionDataReloadedTime;
                let publishedDate = field.publishedDate;
                let auctionStatus = field.auctionStatusId;
                let counterLabel = auctionStatus == 3 ? label_auctionStart : label_auctionEnd;
                let plateType = palateTypes[palateTypes.map(function (item) { return item.id; }).indexOf(plateTypeID)];

                // Social Share Labels
                if ($('body').hasClass('rtl')) {
                    let socialMediaProps = {
                        url: "https://jameeronline.github.io/dashboard/",
                        hashTags: "absher,auction",
                        description: "أعجبتني هذي اللوحة المميزة في مزاد اللوحات على منصة أبشر وحبيت أشاركها معك " + plateNumber.toIndiaDigits() + " " + plateLetterAr +", Highest price: " + formatToCurrency(bidAmount) + " " + label_priceLabel + "\r\n",
                        plateID: plateNumber.toIndiaDigits() + reversePlateLetter(plateLetterAr).replaceAll(' ', '')
                    }
                }else{
                    let socialMediaProps = {
                        url: "https://jameeronline.github.io/dashboard/",
                        hashTags: "absher,auction",
                        description: "I liked this plate on Absher E-Auction and would like to share it with you " + plateNumber + " " + plateLetterEn +", Highest price: " + formatToCurrency(bidAmount) + " " + label_priceLabel + "\r\n",
                        plateID: plateNumber + reversePlateLetter(plateLetterEn).replaceAll(' ', '')
                    }
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
                        <div class="services-grid-item plate_${palateCategories[auctionCategory-1]} platetype_${plateType.name}" data-platetype="${plateTypeID}" data-index="${i}">
                            <div class="ribbon ${palateCategories[auctionCategory-1]}"><span>${label_categories[auctionCategory-1]}</span></div>
                            <div class="card__platenumber">
                                <div class="card__platenumber--info">
                                    <a class="social-share social-share-desktop" href="javascript:void(0)" tabindex="0" role="button" data-trigger="focus" data-toggle="popover" data-popover-content="#social-share-icons-${i}">
                                        <img src="images/share-icon.svg" alt="share" aria-hidden="true" width="20" />
                                    </a>
                                    <a class="social-share social-share-mobile hide" href="javascript:void(0)" tabindex="0" role="button" data-title="${socialMediaProps.description}" data-hashtags="${socialMediaProps.hashTags}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}">
                                        <img src="images/share-icon.svg" alt="share" aria-hidden="true" width="20" />
                                    </a>
                                    <div class="social-share-icons-wrapper hide" id="social-share-icons-${i}">
                                        <div class="popover-heading">Social Share Options</div>
                                        <div class="popover-body">
                                            <div class="social-share-icons">
                                                <a href="javascript:void(0)" class="button" data-sharer="twitter" data-title="${socialMediaProps.description}" data-hashtags="${socialMediaProps.hashTags}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                                                <a href="javascript:void(0)" class="button" data-sharer="whatsapp" data-title="${socialMediaProps.description}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}"><i class="fa fa-whatsapp" aria-hidden="true"></i></a>
                                                <a href="javascript:void(0)" class="button" data-sharer="snapchat" data-title="${socialMediaProps.description}" data-url="${socialMediaProps.url+'#'+socialMediaProps.plateID}"><i class="fa fa-snapchat-ghost" aria-hidden="true"></i></a>
                                            </div>
                                        </div>
                                    </div>
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

            //init card onclick
            // $('.services-grid-item').click(function(){
            //     $('.link-to-mazad')[0].click();
            // });

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

            $("[data-toggle=popover]").on('shown.bs.popover', function () {
                window.Sharer.init();
            });

            //Init social share - desktop
            // $('.social-share-desktop').click(function(event){
            //     event.stopPropagation();
            // });

            //Init social share - native
            $('.social-share-mobile').click(function(){
                var title = $(this).data("title");
                var description = $(this).data("title");
                var url = $(this).data("url");

                navigator.share({
                    title: "Absher - Online Plate Auction Service",
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