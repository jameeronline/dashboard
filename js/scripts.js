//Reset Storage Environmet
localStorage.removeItem('plates');

//Global Variables
var listGroup;

// Properties
if ($('body').hasClass('rtl')) {
    var label_numberofbids = "عدد المزايدات";
    var label_highestBidAmount = "مبلغ أعلى مزايدة";
    var label_categories = ["الماسي", "ذهبي", "فضي", "برونزي "];
    var label_priceLabel = "ريال ";
    var label_auctionStart = "الوقت المتبقي حتى بداية المزاد ";
    var label_auctionEnd = "الوقت المتبقي حتى نهاية المزاد";
} else {
    var label_numberofbids = "Number of Bids";
    var label_highestBidAmount = "Highest Bid Price";
    var label_categories = ["Diamond", "Gold", "Silver", "Bronze"];
    var label_priceLabel = "SAR";
    var label_auctionStart = "Auction Start time";
    var label_auctionEnd = "Auction End time";
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
                    return item.values().filterPlateType == 21 ? true : false;
                });
                break;
            case 'FILTER_COMMERCIAL':
                listGroup.filter(function(item) {
                    return item.values().filterPlateType == 22 ? true : false;
                });
                break;
            case 'FILTER_MOTOR':
                listGroup.filter(function(item) {
                    return item.values().filterPlateType == 23 ? true : false;
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

function initSocialShare() {
    $('.share-button').share({
        url: 'https://mazad.absher.sa/', //  the url you want to share.default: window.location.href
        title: 'Online Plate Auction Service', //
        text: 'Online Plate Auction Service - Description.', // text to be tweeted alongside your link, default: your page's meta description
        image: 'https://mazad.absher.sa/', // image to be shared (facebook-specific)
        app_id: 'YOUR FACEBOOK API KEY', // facebook app id for tracking shares. if provided, will use the facebook API
        background: 'rgba(255,255,255,.5)', // background color of the button, default: #e1e1e1
        color: '#3B2B45', // text color of the button
        button_text: 'share' // change the text of the button, default: Share
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


// Read JSON
function dashboardUpdate() {
    $.getJSON("../auction-dashboard/js/auctionData.json?v=" + Math.random(), function(result) {
        //$.getJSON("../auctionData.json?v="+Math.random(), function(result) {
        //Get Plates and Reset Output
        var plates = result;
        var output = '';
        var palateCategories = ["diamond", "gold", "silver", "bronze"];
        var palateTypes = ["private", "transport", "motorcycle"];

        if (localStorage.getItem('plates') != undefined || localStorage.getItem('plates') != null) {
            if (JSON.parse(localStorage.getItem('plates')).length != plates.length) {
                renderPlates();
            } else {
                if (plates.length != 0) {
                    $('.form-filters').attr('style', '');
                    $('.show-noresult').addClass('hide');
                    $('.show-json-error').addClass('hide');
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
        $('.show-json-error').removeClass('hide');
    });
}

function renderPlates() {
    //$.getJSON("../auction-dashboard/js/auctionData.json?v=" + Math.random(), function(result) {
    $.getJSON("/dashboard/js/auctionData.json?v=" + Math.random(), function(result) {
        //$.getJSON("../auctionData.json?v="+Math.random(), function(result) {
        //Get Plates and Reset Output
        var plates = result;
        var output = '';
        var palateCategories = ["diamond", "gold", "silver", "bronze"];
        var palateTypes = ["private", "transport", "motorcycle"];

        if (plates.length != 0) {
            $('.form-filters').attr('style', '');
            $('.show-noresult').addClass('hide');
            $('.show-json-error').addClass('hide');
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
                let prodPlateType = plateTypeID - 20;

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
                    `<li class="col-md-4">
                        <div class="services-grid-item plate_${palateCategories[auctionCategory-1]} platetype_${palateTypes[prodPlateType-1]}" data-platetype="${plateTypeID}" data-index="${i}">                                      
                            <div class="ribbon ${palateCategories[auctionCategory-1]}"><span>${label_categories[auctionCategory-1]}</span></div>
                            <div class="card__platenumber">
                                <div class="card__platenumber--info">                                    
                                    <a class="social-share" href="javascript:void(0)" tabindex="0" role="button" data-trigger="focus" data-toggle="popover" data-popover-content="#social-share-icons-${i}">
                                        <i class="fa fa-share-alt" aria-hidden="true"></i>
                                    </a>
                                    <div class="social-share-icons-wrapper hide" id="social-share-icons-${i}">
                                        <div class="popover-heading">Social Share Options</div>
                                        <div class="popover-body">
                                            <p>An online auction is an auction that takes place via the internet, allowing users to sell or bid for products and services online.</p> 
                                            <div class="social-share-icons">
                                                <a href="javascript:void(0)" class="button" data-sharer="twitter" data-title="Please find the latest online auction information for plate ${plateNumber + ' ' + plateLetterEn} with the highest bid amount ${formatToCurrency(bidAmount)}" data-hashtags="absher,auction" data-url="https://mazad.absher.sa"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                                                <a href="javascript:void(0)" class="button" data-sharer="facebook" data-title="Please find the latest online auction information for plate ${plateNumber + ' ' + plateLetterEn}" data-hashtags="absher,auction" data-url="https://mazad.absher.sa"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                                                <a href="javascript:void(0)" class="button" data-sharer="whatsapp" data-title="Please find the latest online auction information for plate ${plateNumber + ' ' + plateLetterEn} with the highest bid amount ${formatToCurrency(bidAmount)}" data-url="https://mazad.absher.sa"><i class="fa fa-whatsapp" aria-hidden="true"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="share-button"></div>
                                    <span>${label_numberofbids}</span>
                                    <strong class="numberofbids">${bids}</strong>
                                </div>
                                ${ plateTypeID == 23 ? htmlMotorCyclePlate : htmlVehiclePlate }
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
                                    <span class="filterPlateType">${plateTypeID}</span>
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

            // $("#social-share").jsSocials({
            //     showLabel: false,
            //     showCount: false,
            //     shares: ["email", "twitter", "facebook", "whatsapp"]
            // });

            //Init social share
            $("[data-toggle=popover]").popover({
                html: true,
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


            //initSocialShare();
            //window.Sharer.init();

            //Store Value
            localStorage.setItem('plates', JSON.stringify(plates));
        } else {
            $('.form-filters').hide();
            $('.show-noresult').removeClass('hide');
        }
    }).fail(function() {
        $('.show-json-error').removeClass('hide');
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
