/* =======================================================================================================
	Functions
======================================================================================================= */
(function($){

    $chartPeakHiringContainer = "chart-peak-hiring",
    $chartBenefitsComparisonContainer = "chart-benefits-comparison",
    $chartCostOfLivingContainer = "chart-cost-of-living",
    $chartCommonPermitsContainer = "chart-common-permits",
    $chartNearbyCrimesContainer = "chart-nearby-crimes";

/* =======================================================================================================
    Functions
======================================================================================================= */
var gsa = {

    toggle: {
        init: function() {
            var $toggleSelector = $('.toggle-content');

            if ( $toggleSelector.length > 0 ) {
                $($toggleSelector).click(function(event) {
                    $(this).toggleClass('active');
                    event.preventDefault();
                    var $toggleTarget = $(this).data('target');
                    $('#' + $toggleTarget).toggleClass('active').slideToggle('fast');
                });
            }
        },
        showAllTableRows: function() {
            var $tableToggleSelector = $('.show-all-rows'),
                $toggleButtonOpened = '<span class="gsa-icon-minus gsa-icon--left gsa-icon--sm"></span>Collapse List',
                $toggleButtonClosed = '<span class="gsa-icon-plus gsa-icon--left gsa-icon--sm"></span>Expand List';

            if ( $tableToggleSelector.length > 0 ) {

                $($tableToggleSelector).click(function() {
                    $(this).toggleClass('open-table');
                    var $toggleTarget = $(this).data('target');
                    if( $(this).hasClass('open-table') ) {
                        $(this).html($toggleButtonOpened);
                        $('#' + $toggleTarget).find('tbody tr:hidden').addClass('row-open');
                    } else {
                        $('#' + $toggleTarget).find('tbody .row-open').removeClass('row-open');
                        $(this).html($toggleButtonClosed);
                    }
                });
                
            }
        }
    },

    customSelect: {
        init: function() {
            $customSelectEl = $('.select-boxit'),
            $customSelectFilter = $('.filter .select-boxit'),
            $customSelectWide = $('.select--wide .select-boxit');

            if ( $customSelectFilter.length > 0 ) {
                $customSelectFilter.selectBoxIt({
                    autoWidth: true
                });
            }

            if ( $customSelectWide.length > 0 ) {
                $customSelectWide.selectBoxIt({
                    autoWidth: false
                });
            }

            if ( $customSelectEl.length > 0 ) {
                // fix aria-labelledby issue for 508 AA
                $('.selectboxit-container').each(function() {
                    var $selectOrigId = $(this).prev('select').attr('id');
                    $(this).attr('aria-labelledby', $selectOrigId);
                });
            }
        }
    },

    googleCharts: {

        init: function() {
            // load corechart package
            if ( $('#' + $chartPeakHiringContainer).length > 0 ||
                $('#' + $chartBenefitsComparisonContainer).length > 0 ) {
                
                //google.charts.load('current', {'packages':['corechart']});
            }

            // load bar package
            if ( $('#' + $chartCostOfLivingContainer).length > 0 ) {
                //google.charts.load('current', {packages: ['bar']});
                google.charts.setOnLoadCallback(gsa.googleCharts.drawCostOfLiving);
            }

            if ( $('#' + $chartPeakHiringContainer).length > 0 ) {
                google.charts.setOnLoadCallback(gsa.googleCharts.drawPeakHiring);
            }

            if ( $('#' + $chartBenefitsComparisonContainer).length > 0 ) {
                google.charts.setOnLoadCallback(gsa.googleCharts.drawBenefitsComparison);
            }

            if ( $('#' + $chartCommonPermitsContainer).length > 0 ) {
                google.charts.setOnLoadCallback(gsa.googleCharts.drawCommonPermits);
            }

            if ( $('#' + $chartNearbyCrimesContainer).length > 0 ) {
                google.charts.setOnLoadCallback(gsa.googleCharts.drawNearbyCrimes);
            }
        },

        // charts for info on dynamically loading data go to https://developers.google.com/chart/interactive/docs/queries
        drawPeakHiring: function() {

            // if ( $('#' + $chartPeakHiringContainer).length > 0 ) {
            //     var dataPeakHiring = google.visualization.arrayToDataTable([
            //       ['Month', 'Hires'],
            //       ['J',  90],
            //       ['F',  150],
            //       ['M',  60],
            //       ['A',  70],
            //       ['M',  60],
            //       ['J',  120],
            //       ['J',  130],
            //       ['A',  120],
            //       ['S',  40],
            //       ['O',  47],
            //       ['N',  35],
            //       ['D',  250]
            //     ]);

            //     var options = {
            //         hAxis: {title: 'Month',  titleTextStyle: {color: '#333'}},
            //         vAxis: {minValue: 0},
            //         backgroundColor: { fill:'transparent' },
            //         legend: {position: 'none'},
            //         chartArea: {
            //             backgroundColor: 'f5f5f5',
            //             left: 40,
            //             right: 1,
            //             top: 20
            //         }
            //     };

            //     var chartPeakHiring = new google.visualization.AreaChart(document.getElementById($chartPeakHiringContainer));

            //     chartPeakHiring.draw(dataPeakHiring, options);
            // }
        },

        drawBenefitsComparison: function() {
            if ( $('#' + $chartBenefitsComparisonContainer).length > 0 ) {

                var dataBenefitsComparison = google.visualization.arrayToDataTable([
                    ['Genre', 'Salary', 'Benefits', {type: 'number', role: 'annotation'} ],
                    ['Private Sector', 60000, 9000, 69000],
                    ['Public Sector', 67000, 40000, 107000]
                ]);

                var formatterBenefitsComparison = new google.visualization.NumberFormat(
                {prefix: '$', negativeColor: 'red', negativeParens: true});

                var optionsBenefitsComparison = {
                    legend: { position: 'bottom', maxLines: 2 },
                    bar: { groupWidth: '75%' },
                    backgroundColor: { fill:'transparent' },
                    isStacked: true,
                    colors: ['477dca','d7d7d7'], // blue, gray
                    vAxis: {format: 'currency'},
                    annotations: {
                         textStyle: {
                             color: 'black',
                             fontSize: 11,
                         },
                         alwaysOutside: true
                    },
                    chartArea: {
                        backgroundColor: 'f5f5f5',
                        left: 80,
                        right: 1,
                        top: 20
                    }
                };

                var chartBenefitsComparison = new google.visualization.ColumnChart(document.getElementById($chartBenefitsComparisonContainer));

                chartBenefitsComparison.draw(dataBenefitsComparison, optionsBenefitsComparison);
            }
        },

        drawCostOfLiving: function() {
            if ( $('#' + $chartCostOfLivingContainer).length > 0 ) {

                var dataCostOfLiving = google.visualization.arrayToDataTable([
                  ['Cost of Living', 'Washington DC', 'Charlotte', 'Raleigh'],
                  ['Housing', 195000, 90000, 85000], // sector, dc , charlotte, raleigh
                  ['Groceries', 175000, 75000, 65000],
                  ['Utilities',160000, 140000, 90000],
                  ['Transportation', 145000, 120000, 90000],
                  ['Healthcare', 75000, 65000, 55000]
                ]);

                var formatterCostOfLiving = new google.visualization.NumberFormat(
                {prefix: '$', negativeColor: 'red', negativeParens: true});

                var optionsCostOfLiving = {
                    backgroundColor: { fill:'transparent' },
                    annotations: {
                         textStyle: {
                             color: 'black',
                             fontSize: 11,
                         },
                         alwaysOutside: true
                    },
                    chartArea: {
                        backgroundColor: 'f5f5f5',
                        left: 80,
                        right: 1,
                        top: 10,
                        bottom: 60
                    },
                    legend: { position: 'none' },                  
                    colors: ['gray', 'd7d7d7', '477dca'], // blue, gray, gray
                    vAxis: {format: 'currency'},
                    hAxis: {title: ''}
                    
                };

                var chartCostOfLiving = new google.charts.Bar(document.getElementById($chartCostOfLivingContainer));

                chartCostOfLiving.draw(dataCostOfLiving, google.charts.Bar.convertOptions(optionsCostOfLiving));
            }
        },

        drawCommonPermits: function () {

            if ( $('#' + $chartCommonPermitsContainer).length > 0 ) {
                    
                var dataCommonPermits = new google.visualization.DataTable();
                dataCommonPermits.addColumn('string', 'Item');
                dataCommonPermits.addColumn('number', 'Amount');
                dataCommonPermits.addRows([
                    ['Home Additions', 500],
                    ['Sidewalks', 125],
                    ['Pools', 250]
                ]);

                
                var optionsCommonPermits = {
                    colors: ['#477dca', '#efb505', '#ffffff'], // blue | gold | white
                    fontSize: 13,
                    chartArea:{
                        left: '5%',
                        top: 20,
                        width: '90%',
                        height: '165',
                    },
                    legend: {
                        'position':'right',
                        textStyle: {
                            color: "fff"
                        }
                    },
                    backgroundColor: { fill:'3c61a5' }
                };

                
                var chartCommonPermits = new google.visualization.PieChart(document.getElementById('chart-common-permits'));
                    chartCommonPermits.draw(dataCommonPermits, optionsCommonPermits);
            }
        },

        drawNearbyCrimes: function () {

            if ( $('#' + $chartNearbyCrimesContainer).length > 0 ) {
                    
                var dataNearbyCrimes = new google.visualization.DataTable();
                dataNearbyCrimes.addColumn('string', 'Item');
                dataNearbyCrimes.addColumn('number', 'Amount');
                dataNearbyCrimes.addRows([
                    ['Non Violent', 150],
                    ['Burglary', 50],
                    ['Gun-related', 50],
                    ['Vehicular', 50]
                ]);

                
                var optionsNearbyCrimes = {
                    colors: ['#477dca', '#efb505', '#dd6739', '#ffffff'], // blue | gold | orange | white
                    fontSize: 13,
                    chartArea:{
                        left: '5%',
                        top: 20,
                        width: '90%',
                        height: '165',
                    },
                    legend: {
                        'position':'right',
                        textStyle: {
                            color: "fff"
                        }
                    },
                    backgroundColor: { fill:'3c61a5' },
                    pieSliceText: "none"
                };

                
                var chartNearbyCrimes = new google.visualization.PieChart(document.getElementById('chart-nearby-crimes'));
                    chartNearbyCrimes.draw(dataNearbyCrimes, optionsNearbyCrimes);
            }
        }
    },

    googleMaps: {
        addAlt: function() {
            if ( $('.google-map-container').length > 0 ) {
                $('.google-map-container').find('img:not([alt])').attr('alt', '');
            }
        }
    }
}

// Initializations
var init = {
    ready: function() {
        gsa.toggle.init();
        gsa.customSelect.init();
        gsa.toggle.showAllTableRows();

        // init google chart(s)
        gsa.googleCharts.init();

        

    },
    load: function(){
        gsa.googleMaps.addAlt();
    },
    scroll: function() {},
    resize: function() {
        // redraw chart(s) on resize for responsive
        gsa.googleCharts.drawPeakHiring();
        gsa.googleCharts.drawBenefitsComparison();
        gsa.googleCharts.drawCostOfLiving();
        gsa.googleCharts.drawCommonPermits();
        gsa.googleCharts.drawNearbyCrimes();
    }
};
$(document).ready(init.ready);
$(window).load(init.load);
$(window).scroll(init.scroll);
$(window).resize(init.resize);
	
})(jQuery);